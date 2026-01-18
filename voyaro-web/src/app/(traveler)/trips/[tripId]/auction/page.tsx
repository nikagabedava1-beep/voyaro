"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { trips as tripsApi, offers as offersApi, auctions as auctionsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatTimeRemaining } from "@/lib/utils";
import { ArrowLeft, Clock, Star, ThumbsUp, Trophy, Check } from "lucide-react";
import { Trip, Offer } from "@/types";

export default function TripAuctionPage() {
  const { tripId } = useParams();
  const { user, token } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [votedOfferId, setVotedOfferId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token && tripId) {
      loadData();
    }
  }, [token, tripId]);

  const loadData = async () => {
    try {
      const tripData = await tripsApi.getById(token!, tripId as string);
      setTrip(tripData as Trip);

      if ((tripData as Trip).auction) {
        const offersData = await offersApi.getByAuction(token!, (tripData as Trip).auction!.id);
        setOffers(offersData as Offer[]);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (offerId: string) => {
    if (!token) return;

    try {
      await offersApi.vote(token, offerId);
      setVotedOfferId(offerId);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to vote");
    }
  };

  const handleSelectWinner = async (offerId: string) => {
    if (!token || !trip?.auction) return;

    try {
      await auctionsApi.selectWinner(token, trip.auction.id, offerId);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to select winner");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!trip || !trip.auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">No auction found</h2>
          <Link href={`/trips/${tripId}`}>
            <Button>Back to Trip</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isCreator = trip.creatorId === user?.id;
  const auctionEnded = trip.auction.status !== "ACTIVE";
  const hasWinner = trip.auction.status === "WINNER_SELECTED";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/trips/${tripId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trip
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Auction Status */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{trip.title} - Auction</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {auctionEnded ? "Auction ended" : formatTimeRemaining(trip.auction.endsAt)}
                  </span>
                  <Badge variant={auctionEnded ? "secondary" : "default"}>
                    {trip.auction.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{offers.length}</div>
                <div className="text-sm text-muted-foreground">offers received</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offers */}
        {offers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No offers yet</h3>
              <p className="text-muted-foreground">
                Tour companies will start submitting offers soon
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Top Offers</h2>
            {offers.map((offer, index) => {
              const isWinner = trip.auction?.winningOfferId === offer.id;

              return (
                <Card
                  key={offer.id}
                  className={`${isWinner ? "border-2 border-green-500" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {index === 0 && !hasWinner && (
                          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                            <Trophy className="w-5 h-5" />
                          </div>
                        )}
                        {isWinner && (
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                        {offer.company.logoUrl ? (
                          <img
                            src={offer.company.logoUrl}
                            alt={offer.company.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-xl font-bold">
                            {offer.company.name[0]}
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg">{offer.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            {offer.company.name}
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              {offer.company.rating.toFixed(1)}
                            </span>
                            <span>({offer.company.reviewCount} reviews)</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(offer.pricePerPerson)}
                        </div>
                        <div className="text-sm text-muted-foreground">per person</div>
                        <div className="text-sm font-medium">
                          Total: {formatCurrency(offer.totalPrice)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{offer.description}</p>

                    {/* Inclusions */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Included:</h4>
                      <div className="flex flex-wrap gap-2">
                        {offer.inclusions.map((item) => (
                          <Badge key={item} variant="secondary">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-4 mb-4 p-3 bg-muted rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold">{offer.score.toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">Overall</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{offer.priceScore.toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">Price</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{offer.ratingScore.toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{offer.preferenceScore.toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">Match</div>
                      </div>
                      <div className="flex-1" />
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-medium">{offer.voteCount} votes</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {!auctionEnded && (
                        <Button
                          variant={votedOfferId === offer.id ? "default" : "outline"}
                          onClick={() => handleVote(offer.id)}
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          {votedOfferId === offer.id ? "Voted" : "Vote"}
                        </Button>
                      )}
                      {isCreator && auctionEnded && !hasWinner && (
                        <Button onClick={() => handleSelectWinner(offer.id)}>
                          <Trophy className="w-4 h-4 mr-2" />
                          Select as Winner
                        </Button>
                      )}
                      {isWinner && (
                        <Badge className="bg-green-500 text-white px-4 py-2">
                          <Check className="w-4 h-4 mr-2" />
                          Winner
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
