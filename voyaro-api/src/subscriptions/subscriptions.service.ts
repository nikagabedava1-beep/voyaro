import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { SubscriptionTier } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') || '',
      { apiVersion: '2024-11-20.acacia' },
    );
  }

  async getPlans() {
    return [
      {
        tier: SubscriptionTier.FREE,
        name: 'Free',
        price: 0,
        bidsPerMonth: 2,
        features: ['2 bids per month', 'Basic profile', 'Email support'],
      },
      {
        tier: SubscriptionTier.PRO,
        name: 'Pro',
        price: 49,
        bidsPerMonth: -1,
        priceId: this.configService.get<string>('STRIPE_PRO_PRICE_ID'),
        features: [
          'Unlimited bids',
          'Priority support',
          'Analytics dashboard',
          'Custom branding',
        ],
      },
      {
        tier: SubscriptionTier.PREMIUM,
        name: 'Premium',
        price: 99,
        bidsPerMonth: -1,
        priceId: this.configService.get<string>('STRIPE_PREMIUM_PRICE_ID'),
        features: [
          'Everything in Pro',
          'Featured placement',
          'Dedicated account manager',
          'API access',
          'White-label options',
        ],
      },
    ];
  }

  async createCheckoutSession(userId: string, tier: SubscriptionTier) {
    const company = await this.prisma.tourCompany.findUnique({
      where: { adminId: userId },
      include: { subscription: true, admin: true },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (tier === SubscriptionTier.FREE) {
      throw new BadRequestException('Cannot checkout for free tier');
    }

    const priceId =
      tier === SubscriptionTier.PRO
        ? this.configService.get<string>('STRIPE_PRO_PRICE_ID')
        : this.configService.get<string>('STRIPE_PREMIUM_PRICE_ID');

    if (!priceId) {
      throw new BadRequestException('Price ID not configured');
    }

    // Create or get Stripe customer
    let customerId = company.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: company.admin.email,
        name: company.name,
        metadata: {
          companyId: company.id,
          userId,
        },
      });
      customerId = customer.id;

      await this.prisma.companySubscription.update({
        where: { companyId: company.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${this.configService.get<string>('FRONTEND_URL')}/company/subscription?success=true`,
      cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/company/subscription?canceled=true`,
      metadata: {
        companyId: company.id,
        tier,
      },
    });

    return { url: session.url };
  }

  async createPortalSession(userId: string) {
    const company = await this.prisma.tourCompany.findUnique({
      where: { adminId: userId },
      include: { subscription: true },
    });

    if (!company?.subscription?.stripeCustomerId) {
      throw new BadRequestException('No active subscription found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: company.subscription.stripeCustomerId,
      return_url: `${this.configService.get<string>('FRONTEND_URL')}/company/subscription`,
    });

    return { url: session.url };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutComplete(session);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionUpdate(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionDeleted(subscription);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await this.handlePaymentSucceeded(invoice);
        break;
      }
    }

    return { received: true };
  }

  private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const companyId = session.metadata?.companyId;
    const tier = session.metadata?.tier as SubscriptionTier;

    if (!companyId || !tier) return;

    const subscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    await this.prisma.companySubscription.update({
      where: { companyId },
      data: {
        tier,
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        bidsUsedThisMonth: 0,
      },
    });
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const companySubscription = await this.prisma.companySubscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!companySubscription) return;

    // Determine tier based on price
    const priceId = subscription.items.data[0]?.price.id;
    let tier = SubscriptionTier.FREE;

    if (priceId === this.configService.get<string>('STRIPE_PRO_PRICE_ID')) {
      tier = SubscriptionTier.PRO;
    } else if (priceId === this.configService.get<string>('STRIPE_PREMIUM_PRICE_ID')) {
      tier = SubscriptionTier.PREMIUM;
    }

    await this.prisma.companySubscription.update({
      where: { id: companySubscription.id },
      data: {
        tier,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const companySubscription = await this.prisma.companySubscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!companySubscription) return;

    await this.prisma.companySubscription.update({
      where: { id: companySubscription.id },
      data: {
        tier: SubscriptionTier.FREE,
        stripeSubscriptionId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
      },
    });
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    if (!invoice.subscription) return;

    const companySubscription = await this.prisma.companySubscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (!companySubscription) return;

    // Reset monthly bid count on successful payment
    await this.prisma.companySubscription.update({
      where: { id: companySubscription.id },
      data: {
        bidsUsedThisMonth: 0,
        bidsResetAt: new Date(),
      },
    });
  }

  async getCurrentSubscription(userId: string) {
    const company = await this.prisma.tourCompany.findUnique({
      where: { adminId: userId },
      include: { subscription: true },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company.subscription;
  }
}
