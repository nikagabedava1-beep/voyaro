import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlgorithmsService } from '../algorithms/algorithms.service';
import { CreateOfferDto, UpdateOfferDto } from './dto';
import { AuctionStatus, OfferStatus, SubscriptionTier } from '@prisma/client';

@Injectable()
export class OffersService {
  private readonly FREE_TIER_BID_LIMIT = 2;

  constructor(
    private prisma: PrismaService,
    private algorithmsService: AlgorithmsService,
  ) {}

  async create(auctionId: string, userId: string, dto: CreateOfferDto) {
    // Get company
    const company = await this.prisma.tourCompany.findUnique({
      where: { adminId: userId },
      include: { subscription: true },
    });

    if (!company) {
      throw new ForbiddenException('You must have a company to submit offers');
    }

    if (company.verificationStatus !== 'VERIFIED') {
      throw new ForbiddenException('Your company must be verified to submit offers');
    }

    // Check bid limits for free tier
    if (company.subscription?.tier === SubscriptionTier.FREE) {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      if (
        company.subscription.bidsUsedThisMonth >= this.FREE_TIER_BID_LIMIT &&
        (!company.subscription.bidsResetAt ||
          company.subscription.bidsResetAt > currentMonth)
      ) {
        throw new BadRequestException(
          'Free tier limit reached. Upgrade to submit more offers.',
        );
      }
    }

    // Get auction
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        trip: { include: { groupProfile: true } },
      },
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new BadRequestException('Auction is not active');
    }

    // Check if company already submitted an offer
    const existingOffer = await this.prisma.offer.findUnique({
      where: {
        auctionId_companyId: {
          auctionId,
          companyId: company.id,
        },
      },
    });

    if (existingOffer) {
      throw new BadRequestException('You have already submitted an offer for this auction');
    }

    // Calculate total price
    const totalPrice = dto.pricePerPerson * auction.participantCount;

    // Calculate score
    const groupProfile = auction.trip.groupProfile;
    const scores = this.algorithmsService.calculateOfferScore({
      pricePerPerson: dto.pricePerPerson,
      companyRating: company.rating,
      inclusions: dto.inclusions,
      requirements: auction.requirements,
      avgBudget: groupProfile?.avgMaxBudget || dto.pricePerPerson,
    });

    // Create offer
    const offer = await this.prisma.offer.create({
      data: {
        auctionId,
        companyId: company.id,
        title: dto.title,
        description: dto.description,
        pricePerPerson: dto.pricePerPerson,
        totalPrice,
        inclusions: dto.inclusions,
        exclusions: dto.exclusions || [],
        itinerary: dto.itinerary,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
        status: OfferStatus.SUBMITTED,
        ...scores,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            rating: true,
          },
        },
      },
    });

    // Increment bid count for free tier
    if (company.subscription?.tier === SubscriptionTier.FREE) {
      await this.prisma.companySubscription.update({
        where: { companyId: company.id },
        data: {
          bidsUsedThisMonth: { increment: 1 },
        },
      });
    }

    return offer;
  }

  async update(offerId: string, userId: string, dto: UpdateOfferDto) {
    const offer = await this.findById(offerId);

    const company = await this.prisma.tourCompany.findUnique({
      where: { adminId: userId },
    });

    if (!company || offer.companyId !== company.id) {
      throw new ForbiddenException('You can only update your own offers');
    }

    if (offer.status !== OfferStatus.SUBMITTED) {
      throw new BadRequestException('Cannot update offer with current status');
    }

    const auction = await this.prisma.auction.findUnique({
      where: { id: offer.auctionId },
      include: { trip: { include: { groupProfile: true } } },
    });

    if (!auction || auction.status !== AuctionStatus.ACTIVE) {
      throw new BadRequestException('Auction is not active');
    }

    // Recalculate if price changed
    let scoreUpdates = {};
    if (dto.pricePerPerson !== undefined || dto.inclusions !== undefined) {
      const groupProfile = auction.trip.groupProfile;
      scoreUpdates = this.algorithmsService.calculateOfferScore({
        pricePerPerson: dto.pricePerPerson ?? offer.pricePerPerson,
        companyRating: company.rating,
        inclusions: dto.inclusions ?? offer.inclusions,
        requirements: auction.requirements,
        avgBudget: groupProfile?.avgMaxBudget || (dto.pricePerPerson ?? offer.pricePerPerson),
      });
    }

    const totalPrice = dto.pricePerPerson
      ? dto.pricePerPerson * auction.participantCount
      : offer.totalPrice;

    return this.prisma.offer.update({
      where: { id: offerId },
      data: {
        ...dto,
        totalPrice,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
        ...scoreUpdates,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            rating: true,
          },
        },
      },
    });
  }

  async withdraw(offerId: string, userId: string) {
    const offer = await this.findById(offerId);

    const company = await this.prisma.tourCompany.findUnique({
      where: { adminId: userId },
    });

    if (!company || offer.companyId !== company.id) {
      throw new ForbiddenException('You can only withdraw your own offers');
    }

    if (offer.status !== OfferStatus.SUBMITTED) {
      throw new BadRequestException('Cannot withdraw offer with current status');
    }

    return this.prisma.offer.update({
      where: { id: offerId },
      data: { status: OfferStatus.WITHDRAWN },
    });
  }

  async findById(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
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
        auction: {
          select: {
            id: true,
            status: true,
            tripId: true,
          },
        },
        votes: true,
      },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
  }

  async findByAuction(auctionId: string) {
    return this.prisma.offer.findMany({
      where: {
        auctionId,
        status: OfferStatus.SUBMITTED,
      },
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
    });
  }

  async findByCompany(companyId: string) {
    return this.prisma.offer.findMany({
      where: { companyId },
      include: {
        auction: {
          include: {
            trip: {
              select: {
                id: true,
                title: true,
                destination: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async vote(offerId: string, userId: string, rank = 1) {
    const offer = await this.findById(offerId);

    // Check if user is a participant of the trip
    const participant = await this.prisma.tripParticipant.findFirst({
      where: {
        trip: {
          auction: { id: offer.auctionId },
        },
        userId,
      },
    });

    if (!participant) {
      throw new ForbiddenException('Only trip participants can vote');
    }

    // Check if already voted
    const existingVote = await this.prisma.vote.findUnique({
      where: {
        offerId_userId: { offerId, userId },
      },
    });

    if (existingVote) {
      // Update vote
      await this.prisma.vote.update({
        where: { id: existingVote.id },
        data: { rank },
      });
    } else {
      // Create vote
      await this.prisma.vote.create({
        data: {
          offerId,
          userId,
          rank,
        },
      });

      // Increment vote count
      await this.prisma.offer.update({
        where: { id: offerId },
        data: { voteCount: { increment: 1 } },
      });
    }

    return { message: 'Vote recorded' };
  }

  async removeVote(offerId: string, userId: string) {
    const vote = await this.prisma.vote.findUnique({
      where: {
        offerId_userId: { offerId, userId },
      },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    await this.prisma.vote.delete({
      where: { id: vote.id },
    });

    await this.prisma.offer.update({
      where: { id: offerId },
      data: { voteCount: { decrement: 1 } },
    });

    return { message: 'Vote removed' };
  }
}
