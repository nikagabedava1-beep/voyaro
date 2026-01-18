import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ComfortLevel } from '@prisma/client';

interface DateOverlapResult {
  startDate: Date;
  endDate: Date;
  overlapScore: number;
  participantsAvailable: number;
  totalParticipants: number;
}

interface OfferScoreInput {
  pricePerPerson: number;
  companyRating: number;
  inclusions: string[];
  requirements: string[];
  avgBudget: number;
}

@Injectable()
export class AlgorithmsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find best consecutive dates where most participants are available
   * Returns the date range with highest overlap score
   */
  async calculateDateOverlap(tripId: string, minDays = 3, maxDays = 14): Promise<DateOverlapResult | null> {
    const participants = await this.prisma.tripParticipant.findMany({
      where: { tripId },
      include: {
        dateAvailabilities: {
          where: { isAvailable: true },
          orderBy: { date: 'asc' },
        },
      },
    });

    if (participants.length === 0) {
      return null;
    }

    // Create a map of date -> count of available participants
    const dateAvailabilityMap = new Map<string, Set<string>>();

    for (const participant of participants) {
      for (const availability of participant.dateAvailabilities) {
        const dateKey = availability.date.toISOString().split('T')[0];
        if (!dateAvailabilityMap.has(dateKey)) {
          dateAvailabilityMap.set(dateKey, new Set());
        }
        dateAvailabilityMap.get(dateKey)!.add(participant.id);
      }
    }

    // Sort dates
    const sortedDates = Array.from(dateAvailabilityMap.keys()).sort();

    if (sortedDates.length < minDays) {
      return null;
    }

    let bestResult: DateOverlapResult | null = null;
    let bestScore = 0;

    // Sliding window to find best consecutive date range
    for (let windowSize = minDays; windowSize <= Math.min(maxDays, sortedDates.length); windowSize++) {
      for (let i = 0; i <= sortedDates.length - windowSize; i++) {
        const windowDates = sortedDates.slice(i, i + windowSize);

        // Check if dates are consecutive
        let isConsecutive = true;
        for (let j = 1; j < windowDates.length; j++) {
          const prev = new Date(windowDates[j - 1]);
          const curr = new Date(windowDates[j]);
          const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays !== 1) {
            isConsecutive = false;
            break;
          }
        }

        if (!isConsecutive) continue;

        // Calculate overlap: find participants available for ALL dates in window
        const participantsAvailableForAll = new Set(participants.map(p => p.id));

        for (const date of windowDates) {
          const availableOnDate = dateAvailabilityMap.get(date) || new Set();
          for (const participantId of participantsAvailableForAll) {
            if (!availableOnDate.has(participantId)) {
              participantsAvailableForAll.delete(participantId);
            }
          }
        }

        const participantsAvailable = participantsAvailableForAll.size;
        const overlapScore = (participantsAvailable / participants.length) * windowSize;

        if (overlapScore > bestScore) {
          bestScore = overlapScore;
          bestResult = {
            startDate: new Date(windowDates[0]),
            endDate: new Date(windowDates[windowDates.length - 1]),
            overlapScore,
            participantsAvailable,
            totalParticipants: participants.length,
          };
        }
      }
    }

    return bestResult;
  }

  /**
   * Generate group profile from all participants' preferences and availability
   */
  async generateGroupProfile(tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        participants: {
          where: { isConfirmed: true },
        },
        preferences: true,
      },
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    const preferences = trip.preferences;
    const participantCount = trip.participants.length;

    // Calculate date overlap
    const dateOverlap = await this.calculateDateOverlap(tripId);

    // Aggregate budget
    const budgets = preferences.filter(p => p.minBudget && p.maxBudget);
    const avgMinBudget = budgets.length > 0
      ? budgets.reduce((sum, p) => sum + (p.minBudget || 0), 0) / budgets.length
      : null;
    const avgMaxBudget = budgets.length > 0
      ? budgets.reduce((sum, p) => sum + (p.maxBudget || 0), 0) / budgets.length
      : null;

    // Calculate primary comfort level (mode)
    const comfortLevelCounts = preferences.reduce((acc, p) => {
      acc[p.comfortLevel] = (acc[p.comfortLevel] || 0) + 1;
      return acc;
    }, {} as Record<ComfortLevel, number>);

    const primaryComfortLevel = Object.entries(comfortLevelCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] as ComfortLevel || ComfortLevel.STANDARD;

    // Aggregate must-haves, nice-to-haves, deal-breakers (items appearing in >50%)
    const threshold = preferences.length / 2;

    const mustHaveCounts = this.countItems(preferences.flatMap(p => p.mustHaves));
    const niceToHaveCounts = this.countItems(preferences.flatMap(p => p.niceToHaves));
    const dealBreakerCounts = this.countItems(preferences.flatMap(p => p.dealBreakers));

    const commonMustHaves = this.filterByThreshold(mustHaveCounts, threshold);
    const commonNiceToHaves = this.filterByThreshold(niceToHaveCounts, threshold);
    const commonDealBreakers = this.filterByThreshold(dealBreakerCounts, threshold);

    // Create or update group profile
    const groupProfile = await this.prisma.groupProfile.upsert({
      where: { tripId },
      create: {
        tripId,
        participantCount,
        avgMinBudget,
        avgMaxBudget,
        primaryComfortLevel,
        commonMustHaves,
        commonNiceToHaves,
        commonDealBreakers,
        bestStartDate: dateOverlap?.startDate,
        bestEndDate: dateOverlap?.endDate,
        dateOverlapScore: dateOverlap?.overlapScore,
      },
      update: {
        participantCount,
        avgMinBudget,
        avgMaxBudget,
        primaryComfortLevel,
        commonMustHaves,
        commonNiceToHaves,
        commonDealBreakers,
        bestStartDate: dateOverlap?.startDate,
        bestEndDate: dateOverlap?.endDate,
        dateOverlapScore: dateOverlap?.overlapScore,
        generatedAt: new Date(),
      },
    });

    return groupProfile;
  }

  /**
   * Calculate offer score based on price, rating, and preference match
   * Formula: (price * 0.4) + (rating * 0.3) + (preference_match * 0.3)
   */
  calculateOfferScore(input: OfferScoreInput): {
    score: number;
    priceScore: number;
    ratingScore: number;
    preferenceScore: number;
  } {
    // Price score: Lower is better, normalized to 0-100
    const priceScore = input.avgBudget > 0
      ? Math.max(0, 100 - ((input.pricePerPerson / input.avgBudget) * 50))
      : 50;

    // Rating score: Direct mapping (0-5 -> 0-100)
    const ratingScore = (input.companyRating / 5) * 100;

    // Preference score: Based on how many requirements are met
    const requirementsMet = input.inclusions.filter(inc =>
      input.requirements.some(req =>
        inc.toLowerCase().includes(req.toLowerCase())
      )
    ).length;
    const preferenceScore = input.requirements.length > 0
      ? (requirementsMet / input.requirements.length) * 100
      : 50;

    // Weighted score
    const score = (priceScore * 0.4) + (ratingScore * 0.3) + (preferenceScore * 0.3);

    return {
      score: Math.round(score * 100) / 100,
      priceScore: Math.round(priceScore * 100) / 100,
      ratingScore: Math.round(ratingScore * 100) / 100,
      preferenceScore: Math.round(preferenceScore * 100) / 100,
    };
  }

  /**
   * Find companies that match auction criteria
   */
  async findMatchingCompanies(auctionId: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        trip: {
          include: {
            groupProfile: true,
          },
        },
      },
    });

    if (!auction) {
      throw new Error('Auction not found');
    }

    // Find verified companies that:
    // 1. Serve the destination
    // 2. Can accommodate the group size
    const companies = await this.prisma.tourCompany.findMany({
      where: {
        verificationStatus: 'VERIFIED',
        destinations: {
          has: auction.destination,
        },
        minGroupSize: {
          lte: auction.participantCount,
        },
        maxGroupSize: {
          gte: auction.participantCount,
        },
      },
      include: {
        subscription: true,
      },
    });

    return companies;
  }

  private countItems(items: string[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const item of items) {
      const normalized = item.toLowerCase().trim();
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    }
    return counts;
  }

  private filterByThreshold(counts: Map<string, number>, threshold: number): string[] {
    return Array.from(counts.entries())
      .filter(([, count]) => count >= threshold)
      .map(([item]) => item);
  }
}
