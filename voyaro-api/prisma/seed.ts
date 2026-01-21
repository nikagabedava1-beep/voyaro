import { PrismaClient, UserRole, SubscriptionTier, ComfortLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed default trip tags - comprehensive list of travel interests
  const defaultTags = [
    // Beach & Water
    { slug: 'beach', emoji: '🏖', labelEn: 'Beach', labelKa: 'პლაჟი', sortOrder: 1 },
    { slug: 'swimming', emoji: '🏊', labelEn: 'Swimming', labelKa: 'ცურვა', sortOrder: 2 },
    { slug: 'surfing', emoji: '🏄', labelEn: 'Surfing', labelKa: 'სერფინგი', sortOrder: 3 },
    { slug: 'diving', emoji: '🤿', labelEn: 'Diving', labelKa: 'ყვინთვა', sortOrder: 4 },
    { slug: 'boat', emoji: '🚤', labelEn: 'Boating', labelKa: 'ნავით სეირნობა', sortOrder: 5 },
    { slug: 'cruise', emoji: '🛳', labelEn: 'Cruise', labelKa: 'კრუიზი', sortOrder: 6 },

    // Mountains & Adventure
    { slug: 'adventure', emoji: '🏔', labelEn: 'Adventure', labelKa: 'თავგადასავალი', sortOrder: 10 },
    { slug: 'hiking', emoji: '🥾', labelEn: 'Hiking', labelKa: 'ლაშქრობა', sortOrder: 11 },
    { slug: 'camping', emoji: '⛺', labelEn: 'Camping', labelKa: 'კემპინგი', sortOrder: 12 },
    { slug: 'climbing', emoji: '🧗', labelEn: 'Climbing', labelKa: 'ალპინიზმი', sortOrder: 13 },
    { slug: 'skiing', emoji: '⛷', labelEn: 'Skiing', labelKa: 'სათხილამურო', sortOrder: 14 },
    { slug: 'snowboarding', emoji: '🏂', labelEn: 'Snowboarding', labelKa: 'სნოუბორდი', sortOrder: 15 },

    // City & Urban
    { slug: 'city', emoji: '🏙', labelEn: 'City Break', labelKa: 'ქალაქი', sortOrder: 20 },
    { slug: 'shopping', emoji: '🛍', labelEn: 'Shopping', labelKa: 'შოპინგი', sortOrder: 21 },
    { slug: 'nightlife', emoji: '🌃', labelEn: 'Nightlife', labelKa: 'ღამის ცხოვრება', sortOrder: 22 },
    { slug: 'casino', emoji: '🎰', labelEn: 'Casino', labelKa: 'კაზინო', sortOrder: 23 },

    // Culture & History
    { slug: 'culture', emoji: '🏛', labelEn: 'Culture', labelKa: 'კულტურა', sortOrder: 30 },
    { slug: 'museum', emoji: '🖼', labelEn: 'Museums', labelKa: 'მუზეუმები', sortOrder: 31 },
    { slug: 'temple', emoji: '🛕', labelEn: 'Temples', labelKa: 'ტაძრები', sortOrder: 32 },
    { slug: 'castle', emoji: '🏰', labelEn: 'Castles', labelKa: 'ციხეები', sortOrder: 33 },
    { slug: 'art', emoji: '🎨', labelEn: 'Art', labelKa: 'ხელოვნება', sortOrder: 34 },
    { slug: 'theater', emoji: '🎭', labelEn: 'Theater', labelKa: 'თეატრი', sortOrder: 35 },
    { slug: 'music', emoji: '🎵', labelEn: 'Music', labelKa: 'მუსიკა', sortOrder: 36 },

    // Food & Drink
    { slug: 'food_wine', emoji: '🍷', labelEn: 'Food & Wine', labelKa: 'საკვები და ღვინო', sortOrder: 40 },
    { slug: 'local_cuisine', emoji: '🍽', labelEn: 'Local Cuisine', labelKa: 'ადგილობრივი სამზარეულო', sortOrder: 41 },
    { slug: 'coffee', emoji: '☕', labelEn: 'Coffee Culture', labelKa: 'ყავის კულტურა', sortOrder: 42 },
    { slug: 'beer', emoji: '🍺', labelEn: 'Craft Beer', labelKa: 'ხელნაკეთი ლუდი', sortOrder: 43 },

    // Nature & Wildlife
    { slug: 'wildlife', emoji: '🦁', labelEn: 'Wildlife', labelKa: 'ველური ბუნება', sortOrder: 50 },
    { slug: 'safari', emoji: '🦒', labelEn: 'Safari', labelKa: 'საფარი', sortOrder: 51 },
    { slug: 'forest', emoji: '🌲', labelEn: 'Forest', labelKa: 'ტყე', sortOrder: 52 },
    { slug: 'garden', emoji: '🌸', labelEn: 'Gardens', labelKa: 'ბაღები', sortOrder: 53 },
    { slug: 'birdwatching', emoji: '🦅', labelEn: 'Birdwatching', labelKa: 'ფრინველების დაკვირვება', sortOrder: 54 },

    // Wellness & Relaxation
    { slug: 'relax', emoji: '🧘', labelEn: 'Relaxation', labelKa: 'დასვენება', sortOrder: 60 },
    { slug: 'spa', emoji: '💆', labelEn: 'Spa', labelKa: 'სპა', sortOrder: 61 },
    { slug: 'yoga', emoji: '🧘', labelEn: 'Yoga', labelKa: 'იოგა', sortOrder: 62 },
    { slug: 'meditation', emoji: '🪷', labelEn: 'Meditation', labelKa: 'მედიტაცია', sortOrder: 63 },
    { slug: 'hot_spring', emoji: '♨', labelEn: 'Hot Springs', labelKa: 'ცხელი წყაროები', sortOrder: 64 },

    // Active & Sports
    { slug: 'activities', emoji: '🎢', labelEn: 'Activities', labelKa: 'აქტივობები', sortOrder: 70 },
    { slug: 'golf', emoji: '⛳', labelEn: 'Golf', labelKa: 'გოლფი', sortOrder: 71 },
    { slug: 'tennis', emoji: '🎾', labelEn: 'Tennis', labelKa: 'ჩოგბურთი', sortOrder: 72 },
    { slug: 'cycling', emoji: '🚴', labelEn: 'Cycling', labelKa: 'ველოსიპედი', sortOrder: 73 },
    { slug: 'running', emoji: '🏃', labelEn: 'Running', labelKa: 'სირბილი', sortOrder: 74 },
    { slug: 'fishing', emoji: '🎣', labelEn: 'Fishing', labelKa: 'თევზაობა', sortOrder: 75 },

    // Special Interest
    { slug: 'photography', emoji: '📷', labelEn: 'Photography', labelKa: 'ფოტოგრაფია', sortOrder: 80 },
    { slug: 'road_trip', emoji: '🚗', labelEn: 'Road Trip', labelKa: 'საავტომობილო მოგზაურობა', sortOrder: 81 },
    { slug: 'train', emoji: '🚂', labelEn: 'Train Journey', labelKa: 'მატარებლით მოგზაურობა', sortOrder: 82 },
    { slug: 'helicopter', emoji: '🚁', labelEn: 'Helicopter Tours', labelKa: 'ვერტმფრენის ტურები', sortOrder: 83 },
    { slug: 'hot_air_balloon', emoji: '🎈', labelEn: 'Hot Air Balloon', labelKa: 'საჰაერო ბუშტი', sortOrder: 84 },

    // Family & Social
    { slug: 'family', emoji: '👨‍👩‍👧', labelEn: 'Family-friendly', labelKa: 'საოჯახო', sortOrder: 90 },
    { slug: 'romantic', emoji: '💑', labelEn: 'Romantic', labelKa: 'რომანტიული', sortOrder: 91 },
    { slug: 'solo', emoji: '🧳', labelEn: 'Solo Travel', labelKa: 'მარტო მოგზაურობა', sortOrder: 92 },
    { slug: 'group', emoji: '👥', labelEn: 'Group Travel', labelKa: 'ჯგუფური მოგზაურობა', sortOrder: 93 },
    { slug: 'pet_friendly', emoji: '🐕', labelEn: 'Pet Friendly', labelKa: 'შინაური ცხოველებით', sortOrder: 94 },

    // Luxury
    { slug: 'luxury', emoji: '⭐', labelEn: 'Luxury', labelKa: 'ლუქსი', sortOrder: 100 },
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
