import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { AuctionsModule } from './auctions/auctions.module';
import { OffersModule } from './offers/offers.module';
import { CompaniesModule } from './companies/companies.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AdminModule } from './admin/admin.module';
import { AlgorithmsModule } from './algorithms/algorithms.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TripsModule,
    AuctionsModule,
    OffersModule,
    CompaniesModule,
    SubscriptionsModule,
    AdminModule,
    AlgorithmsModule,
    SchedulerModule,
  ],
})
export class AppModule {}
