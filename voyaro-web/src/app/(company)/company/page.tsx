"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { companies, auctions as auctionsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatTimeRemaining } from "@/lib/utils";
import {
  Building2,
  Gavel,
  Trophy,
  TrendingUp,
  Clock,
  MapPin,
  Users,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { TourCompany, Auction } from "@/types";

export default function CompanyDashboardPage() {
  const { user, token, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [company, setCompany] = useState<TourCompany | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [matchingAuctions, setMatchingAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "COMPANY_ADMIN")) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (token && user?.role === "COMPANY_ADMIN") {
      loadData();
    }
  }, [token, user]);

  const loadData = async () => {
    try {
      const [companyData, statsData, auctionsData] = await Promise.all([
        companies.getMyCompany(token!),
        companies.getStats(token!),
        auctionsApi.getMatching(token!),
      ]);
      setCompany(companyData as TourCompany);
      setStats(statsData);
      setMatchingAuctions(auctionsData as Auction[]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Company not found</h2>
          <Link href="/register/company">
            <Button>Register Your Company</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isPending = company.verificationStatus === "PENDING";
  const isRejected = company.verificationStatus === "REJECTED";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              Voyaro
            </Link>
            <Badge variant="outline">Company</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{company.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Verification Warning */}
        {isPending && (
          <Card className="mb-6 border-yellow-500">
            <CardContent className="flex items-center gap-4 py-4">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold">Verification Pending</h3>
                <p className="text-sm text-muted-foreground">
                  Your company is under review. You cannot submit offers until verified.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isRejected && (
          <Card className="mb-6 border-destructive">
            <CardContent className="flex items-center gap-4 py-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <div>
                <h3 className="font-semibold">Verification Rejected</h3>
                <p className="text-sm text-muted-foreground">
                  Please contact support for more information.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Offers
              </CardTitle>
              <Gavel className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOffers || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Won Trips
              </CardTitle>
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.wonTrips || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Offers
              </CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeOffers || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Win Rate
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.winRate?.toFixed(1) || 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link href="/company/auctions">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Gavel className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Browse Auctions</CardTitle>
                <CardDescription>Find matching trips and submit offers</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/company/offers">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Building2 className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">My Offers</CardTitle>
                <CardDescription>Track your submitted offers</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/company/won">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Trophy className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Won Trips</CardTitle>
                <CardDescription>View your winning offers</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/company/subscription">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Subscription</CardTitle>
                <CardDescription>
                  {company.subscription?.tier || "FREE"} plan
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Matching Auctions */}
        <Card>
          <CardHeader>
            <CardTitle>Matching Auctions</CardTitle>
            <CardDescription>
              Auctions that match your company&apos;s destinations and capacity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matchingAuctions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No matching auctions found at the moment
              </div>
            ) : (
              <div className="space-y-4">
                {matchingAuctions.slice(0, 5).map((auction) => (
                  <div
                    key={auction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{auction.trip?.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {auction.destination}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {auction.participantCount} people
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeRemaining(auction.endsAt)}
                        </span>
                      </div>
                    </div>
                    <Link href={`/company/auctions?submit=${auction.id}`}>
                      <Button disabled={isPending || isRejected}>Submit Offer</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
