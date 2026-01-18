"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { companies } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, MapPin, Clock, Trophy, X } from "lucide-react";
import { Offer, OfferStatus } from "@/types";

const statusColors: Record<OfferStatus, string> = {
  PENDING: "bg-gray-500",
  SUBMITTED: "bg-blue-500",
  WITHDRAWN: "bg-gray-400",
  WINNER: "bg-green-500",
  REJECTED: "bg-red-500",
};

export default function CompanyOffersPage() {
  const { token } = useAuth();
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadOffers();
    }
  }, [token]);

  const loadOffers = async () => {
    try {
      const companyData = await companies.getMyCompany(token!);
      setOffers((companyData as any).offers || []);
    } catch (error) {
      console.error("Failed to load offers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My Offers</h1>
        <p className="text-muted-foreground mb-8">
          Track all your submitted offers
        </p>

        {offers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No offers yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by browsing available auctions
              </p>
              <Link href="/company/auctions">
                <Button>Browse Auctions</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        {offer.auction?.trip?.title} - {offer.auction?.trip?.destination}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${statusColors[offer.status as OfferStatus]} text-white`}>
                        {offer.status}
                      </Badge>
                      {offer.status === "WINNER" && (
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Price per Person</div>
                      <div className="font-semibold">{formatCurrency(offer.pricePerPerson)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Price</div>
                      <div className="font-semibold">{formatCurrency(offer.totalPrice)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Score</div>
                      <div className="font-semibold">{offer.score?.toFixed(1) || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Votes</div>
                      <div className="font-semibold">{offer.voteCount || 0}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Submitted {formatDate(offer.submittedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
