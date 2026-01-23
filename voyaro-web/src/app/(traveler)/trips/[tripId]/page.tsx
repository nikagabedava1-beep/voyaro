"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { trips as tripsApi, auctions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency, formatTimeRemaining } from "@/lib/utils";
import { ArrowLeft, MapPin, Users, Calendar, Settings, Copy, Share2, Gavel, Star } from "lucide-react";
import { Trip, TripStatus } from "@/types";

const statusColors: Record<TripStatus, string> = {
  COLLECTING_DATES: "bg-yellow-500",
  AUCTION_ACTIVE: "bg-blue-500",
  AUCTION_ENDED: "bg-purple-500",
  WINNER_SELECTED: "bg-green-500",
  COMPLETED: "bg-gray-500",
  CANCELLED: "bg-red-500",
};

export default function TripDetailPage() {
  const { tripId } = useParams();
  const { user, token } = useAuth();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingAuction, setIsStartingAuction] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token && tripId) {
      loadTrip();
    }
  }, [token, tripId]);

  const loadTrip = async () => {
    try {
      const data = await tripsApi.getById(token!, tripId as string);
      setTrip(data as Trip);
    } catch (error) {
      console.error("Failed to load trip:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteLink = () => {
    if (trip) {
      const inviteUrl = `${window.location.origin}/invite/${trip.inviteToken}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startAuction = async () => {
    if (!trip || !token) return;

    setIsStartingAuction(true);
    try {
      await auctions.start(token, trip.id);
      await loadTrip();
    } catch (error: any) {
      alert(error.message || "Failed to start auction");
    } finally {
      setIsStartingAuction(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Trip not found</h2>
          <Link href="/trips">
            <Button>Back to Trips</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isCreator = trip.creatorId === user?.id;
  const confirmedParticipants = trip.participants.filter((p) => p.isConfirmed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/trips" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to My Trips
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Trip Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{trip.title}</h1>
                <Badge className={`${statusColors[trip.status]} text-white`}>
                  {trip.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {trip.destination}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {confirmedParticipants} / {trip.maxParticipants} participants
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {formatDate(trip.createdAt)}
                </span>
              </div>
            </div>
            {isCreator && (
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invite Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Invite Friends
                </CardTitle>
                <CardDescription>
                  Share this link with friends to invite them to your trip
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <code className="flex-1 bg-muted px-3 py-2 rounded-md text-sm truncate">
                    {`${typeof window !== "undefined" ? window.location.origin : ""}/invite/${trip.inviteToken}`}
                  </code>
                  <Button variant="outline" onClick={copyInviteLink}>
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Cards */}
            <div className="grid md:grid-cols-1 gap-4">
              <Link href={`/trips/${trip.id}/dates`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Submit Dates</CardTitle>
                    <CardDescription>
                      Select your available dates for this trip
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>

            {/* Auction Section */}
            {trip.auction ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="w-5 h-5" />
                    Auction Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatTimeRemaining(trip.auction.endsAt)}
                      </div>
                      <div className="text-sm text-muted-foreground">Time remaining</div>
                    </div>
                    <Badge className="bg-blue-500 text-white">
                      {trip.auction.offers?.length || 0} offers
                    </Badge>
                  </div>
                  <Link href={`/trips/${trip.id}/auction`}>
                    <Button className="w-full">View Offers</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              isCreator &&
              trip.status === "COLLECTING_DATES" &&
              confirmedParticipants >= trip.minParticipants && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gavel className="w-5 h-5" />
                      Ready to Start Auction
                    </CardTitle>
                    <CardDescription>
                      You have enough confirmed participants to start the auction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={startAuction} isLoading={isStartingAuction} className="w-full">
                      Start 48-Hour Auction
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </div>

          {/* Right Column - Participants */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
                <CardDescription>
                  {confirmedParticipants} of {trip.maxParticipants} confirmed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {trip.participants.map((participant) => (
                    <li key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {participant.user.firstName[0]}
                          {participant.user.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium">
                            {participant.user.firstName} {participant.user.lastName}
                          </div>
                          {participant.userId === trip.creatorId && (
                            <span className="text-xs text-muted-foreground">Organizer</span>
                          )}
                        </div>
                      </div>
                      <Badge variant={participant.isConfirmed ? "default" : "outline"}>
                        {participant.isConfirmed ? "Confirmed" : "Pending"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Group Profile */}
            {trip.groupProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Group Profile</CardTitle>
                  <CardDescription>Aggregated preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trip.groupProfile.avgMinBudget && trip.groupProfile.avgMaxBudget && (
                    <div>
                      <div className="text-sm text-muted-foreground">Budget Range</div>
                      <div className="font-medium">
                        {formatCurrency(trip.groupProfile.avgMinBudget)} -{" "}
                        {formatCurrency(trip.groupProfile.avgMaxBudget)}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-muted-foreground">Comfort Level</div>
                    <div className="font-medium">{trip.groupProfile.primaryComfortLevel}</div>
                  </div>
                  {trip.groupProfile.bestStartDate && trip.groupProfile.bestEndDate && (
                    <div>
                      <div className="text-sm text-muted-foreground">Best Dates</div>
                      <div className="font-medium">
                        {formatDate(trip.groupProfile.bestStartDate)} -{" "}
                        {formatDate(trip.groupProfile.bestEndDate)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
