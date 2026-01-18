import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTripDto,
  UpdateTripDto,
  SubmitDatesDto,
  SubmitPreferencesDto,
} from './dto';
import { TripStatus } from '@prisma/client';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async create(creatorId: string, dto: CreateTripDto) {
    const trip = await this.prisma.trip.create({
      data: {
        ...dto,
        creatorId,
        participants: {
          create: {
            userId: creatorId,
            isConfirmed: true,
            confirmedAt: new Date(),
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return trip;
  }

  async findById(id: string, userId?: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            dateAvailabilities: true,
          },
        },
        preferences: true,
        groupProfile: true,
        auction: {
          include: {
            offers: {
              include: {
                company: {
                  select: {
                    id: true,
                    name: true,
                    logoUrl: true,
                    rating: true,
                    reviewCount: true,
                  },
                },
              },
              orderBy: { score: 'desc' },
              take: 5,
            },
          },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async findByInviteToken(token: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { inviteToken: token },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException('Invalid invite link');
    }

    return trip;
  }

  async findMyTrips(userId: string) {
    const participations = await this.prisma.tripParticipant.findMany({
      where: { userId },
      include: {
        trip: {
          include: {
            creator: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            participants: {
              select: { id: true },
            },
            auction: {
              select: {
                id: true,
                status: true,
                endsAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        trip: {
          createdAt: 'desc',
        },
      },
    });

    return participations.map((p) => ({
      ...p.trip,
      participantCount: p.trip.participants.length,
      isCreator: p.trip.creatorId === userId,
    }));
  }

  async update(id: string, userId: string, dto: UpdateTripDto) {
    const trip = await this.findById(id);

    if (trip.creatorId !== userId) {
      throw new ForbiddenException('Only the creator can update this trip');
    }

    if (trip.status !== TripStatus.COLLECTING_DATES) {
      throw new BadRequestException('Cannot update trip after dates are collected');
    }

    return this.prisma.trip.update({
      where: { id },
      data: dto,
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    const trip = await this.findById(id);

    if (trip.creatorId !== userId) {
      throw new ForbiddenException('Only the creator can delete this trip');
    }

    await this.prisma.trip.delete({ where: { id } });
    return { message: 'Trip deleted successfully' };
  }

  async joinByInvite(token: string, userId: string) {
    const trip = await this.findByInviteToken(token);

    const existingParticipant = await this.prisma.tripParticipant.findUnique({
      where: {
        tripId_userId: {
          tripId: trip.id,
          userId,
        },
      },
    });

    if (existingParticipant) {
      return { message: 'Already a participant', trip };
    }

    if (trip.participants.length >= trip.maxParticipants) {
      throw new BadRequestException('Trip is full');
    }

    await this.prisma.tripParticipant.create({
      data: {
        tripId: trip.id,
        userId,
      },
    });

    return { message: 'Joined successfully', trip };
  }

  async submitDates(tripId: string, userId: string, dto: SubmitDatesDto) {
    const participant = await this.prisma.tripParticipant.findUnique({
      where: {
        tripId_userId: { tripId, userId },
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this trip');
    }

    // Delete existing date availabilities
    await this.prisma.dateAvailability.deleteMany({
      where: { participantId: participant.id },
    });

    // Create new date availabilities
    const dateAvailabilities = await this.prisma.dateAvailability.createMany({
      data: dto.availableDates.map((date) => ({
        participantId: participant.id,
        userId,
        date: new Date(date),
        isAvailable: true,
      })),
    });

    return { message: 'Dates submitted successfully', count: dateAvailabilities.count };
  }

  async submitPreferences(tripId: string, userId: string, dto: SubmitPreferencesDto) {
    const participant = await this.prisma.tripParticipant.findUnique({
      where: {
        tripId_userId: { tripId, userId },
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this trip');
    }

    // Delete existing preferences from this user
    await this.prisma.preference.deleteMany({
      where: {
        tripId,
        submittedById: userId,
      },
    });

    // Create new preferences
    const preference = await this.prisma.preference.create({
      data: {
        tripId,
        submittedById: userId,
        ...dto,
      },
    });

    return preference;
  }

  async confirmParticipation(tripId: string, userId: string) {
    const participant = await this.prisma.tripParticipant.findUnique({
      where: {
        tripId_userId: { tripId, userId },
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this trip');
    }

    const updated = await this.prisma.tripParticipant.update({
      where: { id: participant.id },
      data: {
        isConfirmed: true,
        confirmedAt: new Date(),
      },
    });

    return { message: 'Participation confirmed', participant: updated };
  }

  async getParticipants(tripId: string) {
    return this.prisma.tripParticipant.findMany({
      where: { tripId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        dateAvailabilities: true,
      },
    });
  }

  async removeParticipant(tripId: string, participantUserId: string, requesterId: string) {
    const trip = await this.findById(tripId);

    if (trip.creatorId !== requesterId && participantUserId !== requesterId) {
      throw new ForbiddenException('Only the creator can remove participants');
    }

    if (participantUserId === trip.creatorId) {
      throw new BadRequestException('Cannot remove the trip creator');
    }

    await this.prisma.tripParticipant.delete({
      where: {
        tripId_userId: {
          tripId,
          userId: participantUserId,
        },
      },
    });

    return { message: 'Participant removed' };
  }
}
