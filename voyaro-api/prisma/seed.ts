import { PrismaClient, UserRole, SubscriptionTier, ComfortLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed default trip tags
  const defaultTags = [
    { slug: 'beach', emoji: '🏖', labelEn: 'Beach', labelKa: 'პლაჟი', sortOrder: 1 },
    { slug: 'adventure', emoji: '🏔', labelEn: 'Adventure', labelKa: 'თავგადასავალი', sortOrder: 2 },
    { slug: 'city', emoji: '🏙', labelEn: 'City', labelKa: 'ქალაქი', sortOrder: 3 },
    { slug: 'culture', emoji: '🏛', labelEn: 'Culture', labelKa: 'კულტურა', sortOrder: 4 },
    { slug: 'nightlife', emoji: '🎉', labelEn: 'Nightlife', labelKa: 'ღამის ცხოვრება', sortOrder: 5 },
    { slug: 'relax', emoji: '🧘', labelEn: 'Relax', labelKa: 'დასვენება', sortOrder: 6 },
    { slug: 'hiking', emoji: '🥾', labelEn: 'Hiking', labelKa: 'ლაშქრობა', sortOrder: 7 },
    { slug: 'food_wine', emoji: '🍷', labelEn: 'Food & Wine', labelKa: 'საკვები და ღვინო', sortOrder: 8 },
    { slug: 'boat', emoji: '🚤', labelEn: 'Boat', labelKa: 'ნავი', sortOrder: 9 },
    { slug: 'activities', emoji: '🎢', labelEn: 'Fun / Activities', labelKa: 'გართობა', sortOrder: 10 },
    { slug: 'family', emoji: '👨‍👩‍👧', labelEn: 'Family-friendly', labelKa: 'საოჯახო', sortOrder: 11 },
    { slug: 'romantic', emoji: '💑', labelEn: 'Romantic', labelKa: 'რომანტიული', sortOrder: 12 },
  ];

  console.log('Creating trip tags...');
  for (const tag of defaultTags) {
    await prisma.tripTag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log(`Created ${defaultTags.length} trip tags`);

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

  // Add preferences with selected tags
  const tagSets = [
    ['culture', 'food_wine', 'city'],
    ['culture', 'hiking', 'relax'],
    ['culture', 'food_wine', 'nightlife'],
  ];
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
          selectedTags: tagSets[index],
        },
      })
    )
  );
  console.log('Created preferences for all travelers');

  // Create group profile with aggregated tags
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
      topTags: ['culture', 'food_wine', 'hiking'],
      tagCounts: { culture: 3, food_wine: 2, city: 1, hiking: 1, relax: 1, nightlife: 1 },
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
