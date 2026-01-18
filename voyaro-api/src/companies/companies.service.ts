import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { UserRole, SubscriptionTier } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCompanyDto) {
    // Check if user already has a company
    const existingCompany = await this.prisma.tourCompany.findUnique({
      where: { adminId: userId },
    });

    if (existingCompany) {
      throw new ConflictException('You already have a company registered');
    }

    // Create company and update user role
    const [company] = await this.prisma.$transaction([
      this.prisma.tourCompany.create({
        data: {
          ...dto,
          adminId: userId,
          subscription: {
            create: {
              tier: SubscriptionTier.FREE,
              bidsUsedThisMonth: 0,
            },
          },
        },
        include: {
          subscription: true,
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.COMPANY_ADMIN },
      }),
    ]);

    return company;
  }

  async findById(id: string) {
    const company = await this.prisma.tourCompany.findUnique({
      where: { id },
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
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async findByAdmin(userId: string) {
    const company = await this.prisma.tourCompany.findUnique({
      where: { adminId: userId },
      include: {
        subscription: true,
        offers: {
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
          take: 10,
        },
      },
    });

    if (!company) {
      throw new NotFoundException('You do not have a company');
    }

    return company;
  }

  async update(userId: string, dto: UpdateCompanyDto) {
    const company = await this.prisma.tourCompany.findUnique({
      where: { adminId: userId },
    });

    if (!company) {
      throw new NotFoundException('You do not have a company');
    }

    return this.prisma.tourCompany.update({
      where: { id: company.id },
      data: dto,
      include: {
        subscription: true,
      },
    });
  }

  async getStats(userId: string) {
    const company = await this.prisma.tourCompany.findUnique({
      where: { adminId: userId },
    });

    if (!company) {
      throw new NotFoundException('You do not have a company');
    }

    const [totalOffers, wonTrips, activeOffers, pendingOffers] = await Promise.all([
      this.prisma.offer.count({
        where: { companyId: company.id },
      }),
      this.prisma.offer.count({
        where: {
          companyId: company.id,
          status: 'WINNER',
        },
      }),
      this.prisma.offer.count({
        where: {
          companyId: company.id,
          status: 'SUBMITTED',
          auction: { status: 'ACTIVE' },
        },
      }),
      this.prisma.offer.count({
        where: {
          companyId: company.id,
          status: 'PENDING',
        },
      }),
    ]);

    return {
      totalOffers,
      wonTrips,
      activeOffers,
      pendingOffers,
      winRate: totalOffers > 0 ? (wonTrips / totalOffers) * 100 : 0,
    };
  }

  async getWonTrips(userId: string) {
    const company = await this.prisma.tourCompany.findUnique({
      where: { adminId: userId },
    });

    if (!company) {
      throw new NotFoundException('You do not have a company');
    }

    return this.prisma.offer.findMany({
      where: {
        companyId: company.id,
        status: 'WINNER',
      },
      include: {
        auction: {
          include: {
            trip: {
              include: {
                creator: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
                participants: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findAll(page = 1, limit = 10, verified?: boolean) {
    const skip = (page - 1) * limit;

    const where = verified !== undefined
      ? { verificationStatus: verified ? 'VERIFIED' : 'PENDING' }
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
}
