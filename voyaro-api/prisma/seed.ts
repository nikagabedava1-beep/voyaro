import { PrismaClient, UserRole, SubscriptionTier, ComfortLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@voyaro.com' },
    update: {},
    create: {
      email: 'admin@voyaro.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.PLATFORM_ADMIN,
    },
  });
  console.log('Created admin user:', admin.email);

  // Create traveler users
  const travelerPassword = await bcrypt.hash('traveler123', 10);
  const travelers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        passwordHash: travelerPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.TRAVELER,
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        passwordHash: travelerPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        role: UserRole.TRAVELER,
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        passwordHash: travelerPassword,
        firstName: 'Bob',
        lastName: 'Johnson',
        role: UserRole.TRAVELER,
      },
    }),
  ]);
  console.log('Created traveler users:', travelers.map(t => t.email));

  // Create company admin user
  const companyPassword = await bcrypt.hash('company123', 10);
  const companyAdmin = await prisma.user.upsert({
    where: { email: 'company@adventure.com' },
    update: {},
    create: {
      email: 'company@adventure.com',
      passwordHash: companyPassword,
      firstName: 'Adventure',
      lastName: 'Tours',
      role: UserRole.COMPANY_ADMIN,
    },
  });
  console.log('Created company admin:', companyAdmin.email);

  // Create tour company
  const company = await prisma.tourCompany.upsert({
    where: { adminId: companyAdmin.id },
    update: {},
    create: {
      name: 'Adventure Tours Inc.',
      description: 'Premium adventure travel experiences around the world',
      adminId: companyAdmin.id,
      destinations: ['Italy', 'Spain', 'Greece', 'Croatia', 'Portugal'],
      minGroupSize: 4,
      maxGroupSize: 20,
      rating: 4.5,
      reviewCount: 127,
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
      subscription: {
        create: {
          tier: SubscriptionTier.PRO,
          bidsUsedThisMonth: 0,
        },
      },
    },
  });
  console.log('Created company:', company.name);

  // Create a sample trip
  const trip = await prisma.trip.create({
    data: {
      title: 'Italy Adventure 2024',
      description: 'Explore the beautiful cities and countryside of Italy',
      destination: 'Italy',
      theme: 'Cultural & Historical',
      creatorId: travelers[0].id,
      minParticipants: 4,
      maxParticipants: 12,
      participants: {
        create: [
          {
            userId: travelers[0].id,
            isConfirmed: true,
            confirmedAt: new Date(),
          },
          {
            userId: travelers[1].id,
            isConfirmed: true,
            confirmedAt: new Date(),
          },
          {
            userId: travelers[2].id,
            isConfirmed: true,
            confirmedAt: new Date(),
          },
        ],
      },
    },
  });
  console.log('Created trip:', trip.title);

  // Add preferences
  await Promise.all(
    travelers.map((traveler, index) =>
      prisma.preference.create({
        data: {
          tripId: trip.id,
          submittedById: traveler.id,
          minBudget: 1000 + index * 200,
          maxBudget: 2000 + index * 300,
          comfortLevel: index === 0 ? ComfortLevel.COMFORT : ComfortLevel.STANDARD,
          mustHaves: ['Hotels', 'Tours', 'Transportation'],
          niceToHaves: ['Airport transfers', 'Travel insurance'],
          dealBreakers: ['Hostels'],
        },
      })
    )
  );
  console.log('Created preferences for all travelers');

  // Create group profile
  await prisma.groupProfile.create({
    data: {
      tripId: trip.id,
      participantCount: 3,
      avgMinBudget: 1200,
      avgMaxBudget: 2300,
      primaryComfortLevel: ComfortLevel.STANDARD,
      commonMustHaves: ['Hotels', 'Tours', 'Transportation'],
      commonNiceToHaves: ['Airport transfers'],
      commonDealBreakers: ['Hostels'],
      bestStartDate: new Date('2024-06-15'),
      bestEndDate: new Date('2024-06-25'),
      dateOverlapScore: 0.9,
    },
  });
  console.log('Created group profile');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
