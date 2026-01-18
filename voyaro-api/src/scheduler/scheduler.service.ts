import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { AuctionStatus, TripStatus, SubscriptionTier } from '@prisma/client';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredAuctions() {
    this.logger.debug('Checking for expired auctions...');

    const expiredAuctions = await this.prisma.auction.findMany({
      where: {
        status: AuctionStatus.ACTIVE,
        endsAt: {
          lte: new Date(),
        },
      },
    });

    if (expiredAuctions.length === 0) {
      return;
    }

    this.logger.log(`Found ${expiredAuctions.length} expired auctions`);

    for (const auction of expiredAuctions) {
      try {
        await this.prisma.$transaction([
          this.prisma.auction.update({
            where: { id: auction.id },
            data: { status: AuctionStatus.ENDED },
          }),
          this.prisma.trip.update({
            where: { id: auction.tripId },
            data: { status: TripStatus.AUCTION_ENDED },
          }),
        ]);

        this.logger.log(`Ended auction ${auction.id}`);
      } catch (error) {
        this.logger.error(`Failed to end auction ${auction.id}:`, error);
      }
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async resetMonthlyBidCounts() {
    this.logger.log('Resetting monthly bid counts for free tier companies...');

    try {
      const result = await this.prisma.companySubscription.updateMany({
        where: {
          tier: SubscriptionTier.FREE,
        },
        data: {
          bidsUsedThisMonth: 0,
          bidsResetAt: new Date(),
        },
      });

      this.logger.log(`Reset bid counts for ${result.count} free tier subscriptions`);
    } catch (error) {
      this.logger.error('Failed to reset monthly bid counts:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldData() {
    this.logger.debug('Running daily cleanup...');

    // Clean up cancelled trips older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const deletedTrips = await this.prisma.trip.deleteMany({
        where: {
          status: TripStatus.CANCELLED,
          updatedAt: {
            lt: thirtyDaysAgo,
          },
        },
      });

      if (deletedTrips.count > 0) {
        this.logger.log(`Cleaned up ${deletedTrips.count} cancelled trips`);
      }
    } catch (error) {
      this.logger.error('Failed to cleanup old data:', error);
    }
  }
}
