import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalCompanies,
      pendingVerifications,
      activeAuctions,
      completedTrips,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.tourCompany.count(),
      this.prisma.tourCompany.count({
        where: { verificationStatus: VerificationStatus.PENDING },
      }),
      this.prisma.auction.count({ where: { status: 'ACTIVE' } }),
      this.prisma.trip.count({ where: { status: 'COMPLETED' } }),
    ]);

    return {
      totalUsers,
      totalCompanies,
      pendingVerifications,
      activeAuctions,
      completedTrips,
    };
  }

  async getPendingVerifications() {
    return this.prisma.tourCompany.findMany({
      where: { verificationStatus: VerificationStatus.PENDING },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async verifyCompany(companyId: string) {
    const company = await this.prisma.tourCompany.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.prisma.tourCompany.update({
      where: { id: companyId },
      data: {
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
      },
    });
  }

  async rejectCompany(companyId: string, reason: string) {
    const company = await this.prisma.tourCompany.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.prisma.tourCompany.update({
      where: { id: companyId },
      data: {
        verificationStatus: VerificationStatus.REJECTED,
        rejectionReason: reason,
      },
    });
  }

  async getAllCompanies(page = 1, limit = 100, verified?: boolean) {
    const skip = (page - 1) * limit;

    const where = verified !== undefined
      ? { verificationStatus: verified ? VerificationStatus.VERIFIED : VerificationStatus.PENDING }
      : {};

    const [companies, total] = await Promise.all([
      this.prisma.tourCompany.findMany({
        where,
        skip,
        take: limit,
        include: {
          subscription: true,
          admin: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tourCompany.count({ where }),
    ]);

    return {
      data: companies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllAuctions(page = 1, limit = 10, status?: string) {
    const skip = (page - 1) * limit;

    const where = status ? { status: status as any } : {};

    const [auctions, total] = await Promise.all([
      this.prisma.auction.findMany({
        where,
        skip,
        take: limit,
        include: {
          trip: {
            select: {
              id: true,
              title: true,
              destination: true,
              creator: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          offers: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auction.count({ where }),
    ]);

    return {
      data: auctions.map((a) => ({
        ...a,
        offerCount: a.offers.length,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllUsers(page = 1, limit = 10, role?: string) {
    const skip = (page - 1) * limit;

    const where = role ? { role: role as any } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              createdTrips: true,
              tripParticipants: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(userId: string, role: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
  }
}
