"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { companies } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, MapPin, Users, Calendar, Trophy, Mail, Phone } from "lucide-react";

export default function CompanyWonTripsPage() {
  const { token } = useAuth();
  const [wonTrips, setWonTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadWonTrips();
    }
  }, [token]);

  const loadWonTrips = async () => {
    try {
      const data = await companies.getWonTrips(token!);
      setWonTrips(data as any[]);
    } catch (error) {
      console.error("Failed to load won trips:", error);
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
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold">Won Trips</h1>
            <p className="text-muted-foreground">
              Trips where your offer was selected
            </p>
          </div>
        </div>

        {wonTrips.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No won trips yet</h3>
              <p className="text-muted-foreground mb-4">
                Keep submitting competitive offers to win trips!
              </p>
              <Link href="/company/auctions">
                <Button>Browse Auctions</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {wonTrips.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <Badge className="bg-green-500 text-white">Winner</Badge>
                      </div>
                      <CardTitle>{offer.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        {offer.auction?.trip?.title} - {offer.auction?.trip?.destination}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(offer.totalPrice)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(offer.pricePerPerson)} per person
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Trip Details */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{offer.auction?.participantCount} participants</span>
                    </div>
                    {offer.auction?.startDate && offer.auction?.endDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {formatDate(offer.auction.startDate)} -{" "}
                          {formatDate(offer.auction.endDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Organizer Contact */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Trip Organizer</h4>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {offer.auction?.trip?.creator?.firstName?.[0]}
                          {offer.auction?.trip?.creator?.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-medium">
                            {offer.auction?.trip?.creator?.firstName}{" "}
                            {offer.auction?.trip?.creator?.lastName}
                          </div>
                        </div>
                      </div>
                      {offer.auction?.trip?.creator?.email && (
                        <a
                          href={`mailto:${offer.auction.trip.creator.email}`}
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <Mail className="w-4 h-4" />
                          {offer.auction.trip.creator.email}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Participants */}
                  {offer.auction?.trip?.participants && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-3">
                        Participants ({offer.auction.trip.participants.length})
                      </h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {offer.auction.trip.participants.map((p: any) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-2 p-2 bg-muted rounded"
                          >
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm">
                              {p.user?.firstName?.[0]}
                              {p.user?.lastName?.[0]}
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {p.user?.firstName} {p.user?.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {p.user?.email}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
