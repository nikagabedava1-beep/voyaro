import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  UseGuards,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser, Roles } from '../common/decorators';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole, SubscriptionTier } from '@prisma/client';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('current')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN)
  async getCurrentSubscription(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.getCurrentSubscription(userId);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN)
  async createCheckoutSession(
    @CurrentUser('id') userId: string,
    @Body('tier') tier: SubscriptionTier,
  ) {
    return this.subscriptionsService.createCheckoutSession(userId, tier);
  }

  @Post('portal')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN)
  async createPortalSession(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.createPortalSession(userId);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.subscriptionsService.handleWebhook(
      signature,
      req.rawBody as Buffer,
    );
  }
}
