import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlgorithmsService } from '../algorithms/algorithms.service';
import { TripStatus, AuctionStatus } from '@prisma/client';

@Injectable()
export class AuctionsService {
  private readonly AUCTION_DURATION_HOURS = 48;

  constructor(
    private prisma: PrismaService,
    private algorithmsService: AlgorithmsService,
  ) {}

  async startAuction(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        participants: { where: { isConfirmed: true } },
        groupProfile: true,
        auction: true,
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.creatorId !== userId) {
      throw new ForbiddenException('Only the trip creator can start an auction');
    }

    if (trip.auction) {
      throw new BadRequestException('Auction already exists for this trip');
    }

    if (trip.participants.length < trip.minParticipants) {
      throw new BadRequestException(
        `Need at least ${trip.minParticipants} confirmed participants to start auction`,
      );
    }

    // Generate group profile if not exists
    let groupProfile = trip.groupProfile;
    if (!groupProfile) {
      groupProfile = await this.algorithmsService.generateGroupProfile(tripId);
    }

    const endsAt = new Date();
    endsAt.setHours(endsAt.getHours() + this.AUCTION_DURATION_HOURS);

    // Create auction
    const auction = await this.prisma.auction.create({
      data: {
        tripId,
        destination: trip.destination,
        participantCount: trip.participants.length,
        startDate: groupProfile.bestStartDate,
        endDate: groupProfile.bestEndDate,
        minBudget: groupProfile.avgMinBudget,
        maxBudget: groupProfile.avgMaxBudget,
        comfortLevel: groupProfile.primaryComfortLevel,
        requirements: [
          ...groupProfile.commonMustHaves,
          ...groupProfile.commonNiceToHaves,
        ],
        endsAt,
      },
    });

    // Update trip status
    await this.prisma.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.AUCTION_ACTIVE },
    });

    return auction;
  }

  async findById(id: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
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
            groupProfile: true,
          },
        },
        offers: {
          where: { status: 'SUBMITTED' },
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
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    return auction;
  }

  async findActiveAuctions(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [auctions, total] = await Promise.all([
      this.prisma.auction.findMany({
        where: { status: AuctionStatus.ACTIVE },
        skip,
        take: limit,
        include: {
          trip: {
            select: {
              id: true,
              title: true,
              destination: true,
              theme: true,
            },
          },
        },
        orderBy: { endsAt: 'asc' },
      }),
      this.prisma.auction.count({
        where: { status: AuctionStatus.ACTIVE },
      }),
    ]);

    return {
      data: auctions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findMatchingAuctions(companyId: string) {
    const company = await this.prisma.tourCompany.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Find active auctions that match company's criteria
    const auctions = await this.prisma.auction.findMany({
      where: {
        status: AuctionStatus.ACTIVE,
        destination: {
          in: company.destinations,
        },
        participantCount: {
          gte: company.minGroupSize,
          lte: company.maxGroupSize,
        },
        // Exclude auctions where company already submitted an offer
        offers: {
          none: {
            companyId: company.id,
          },
        },
      },
      include: {
        trip: {
          select: {
            id: true,
            title: true,
            destination: true,
            theme: true,
          },
        },
      },
      orderBy: { endsAt: 'asc' },
    });

    return auctions;
  }

  async endAuction(auctionId: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      include: { offers: true },
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.status !== AuctionStatus.ACTIVE) {
      return auction;
    }

    // Update auction status
    const updatedAuction = await this.prisma.auction.update({
      where: { id: auctionId },
      data: { status: AuctionStatus.ENDED },
    });

    // Update trip status
    await this.prisma.trip.update({
      where: { id: auction.tripId },
      data: { status: TripStatus.AUCTION_ENDED },
    });

    return updatedAuction;
  }

  async selectWinner(auctionId: string, offerId: string, userId: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        trip: true,
        offers: true,
      },
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.trip.creatorId !== userId) {
      throw new ForbiddenException('Only the trip creator can select a winner');
    }

    const offer = auction.offers.find(o => o.id === offerId);
    if (!offer) {
      throw new NotFoundException('Offer not found in this auction');
    }

    // Update auction
    await this.prisma.auction.update({
      where: { id: auctionId },
      data: {
        status: AuctionStatus.WINNER_SELECTED,
        winningOfferId: offerId,
      },
    });

    // Update winning offer
    await this.prisma.offer.update({
      where: { id: offerId },
      data: { status: 'WINNER' },
    });

    // Update other offers
    await this.prisma.offer.updateMany({
      where: {
        auctionId,
        id: { not: offerId },
      },
      data: { status: 'REJECTED' },
    });

    // Update trip status
    await this.prisma.trip.update({
      where: { id: auction.tripId },
      data: { status: TripStatus.WINNER_SELECTED },
    });

    return this.findById(auctionId);
  }
}
