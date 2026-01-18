"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { subscriptions, companies } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Check, Zap, Crown, Building2 } from "lucide-react";
import { SubscriptionPlan, CompanySubscription, SubscriptionTier } from "@/types";

export default function CompanySubscriptionPage() {
  const { token } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CompanySubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      const [plansData, companyData] = await Promise.all([
        subscriptions.getPlans(),
        companies.getMyCompany(token!),
      ]);
      setPlans(plansData as SubscriptionPlan[]);
      setCurrentSubscription((companyData as any).subscription);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!token) return;

    setIsUpgrading(tier);
    try {
      const result = await subscriptions.createCheckout(token, tier);
      window.location.href = (result as any).url;
    } catch (error: any) {
      alert(error.message || "Failed to start checkout");
    } finally {
      setIsUpgrading(null);
    }
  };

  const handleManageBilling = async () => {
    if (!token) return;

    try {
      const result = await subscriptions.createPortal(token);
      window.location.href = (result as any).url;
    } catch (error: any) {
      alert(error.message || "Failed to open billing portal");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const planIcons: Record<SubscriptionTier, React.ReactNode> = {
    FREE: <Building2 className="w-8 h-8" />,
    PRO: <Zap className="w-8 h-8" />,
    PREMIUM: <Crown className="w-8 h-8" />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/company"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Choose the plan that best fits your business needs
          </p>
        </div>

        {/* Current Plan */}
        {currentSubscription && (
          <Card className="mb-8">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Current Plan</div>
                  <div className="text-xl font-bold">{currentSubscription.tier}</div>
                  {currentSubscription.tier === "FREE" && (
                    <div className="text-sm text-muted-foreground">
                      {currentSubscription.bidsUsedThisMonth} / 2 bids used this month
                    </div>
                  )}
                  {currentSubscription.currentPeriodEnd && (
                    <div className="text-sm text-muted-foreground">
                      Renews {formatDate(currentSubscription.currentPeriodEnd)}
                    </div>
                  )}
                </div>
                {currentSubscription.tier !== "FREE" && (
                  <Button variant="outline" onClick={handleManageBilling}>
                    Manage Billing
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = currentSubscription?.tier === plan.tier;
            const isPopular = plan.tier === "PRO";

            return (
              <Card
                key={plan.tier}
                className={`relative ${isPopular ? "border-primary border-2" : ""} ${
                  isCurrent ? "bg-primary/5" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm">
                    Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="mx-auto text-primary mb-2">
                    {planIcons[plan.tier]}
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    {plan.price > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /mo
                      </span>
                    )}
                  </div>
                  <CardDescription>
                    {plan.bidsPerMonth === -1
                      ? "Unlimited bids"
                      : `${plan.bidsPerMonth} bids per month`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <Badge className="w-full justify-center py-2">Current Plan</Badge>
                  ) : plan.tier === "FREE" ? (
                    <Button variant="outline" className="w-full" disabled>
                      Free Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleUpgrade(plan.tier)}
                      isLoading={isUpgrading === plan.tier}
                    >
                      Upgrade to {plan.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
