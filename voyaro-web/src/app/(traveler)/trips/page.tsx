"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { trips as tripsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Plus, MapPin, Users, Gavel, LogOut } from "lucide-react";
import { Trip, TripStatus } from "@/types";

const statusColors: Record<TripStatus, string> = {
  COLLECTING_DATES: "bg-yellow-500",
  AUCTION_ACTIVE: "bg-blue-500",
  AUCTION_ENDED: "bg-purple-500",
  WINNER_SELECTED: "bg-green-500",
  COMPLETED: "bg-gray-500",
  CANCELLED: "bg-red-500",
};

const statusLabels: Record<TripStatus, string> = {
  COLLECTING_DATES: "Collecting Dates",
  AUCTION_ACTIVE: "Auction Active",
  AUCTION_ENDED: "Auction Ended",
  WINNER_SELECTED: "Winner Selected",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function TripsPage() {
  const { user, token, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (token) {
      loadTrips();
    }
  }, [token]);

  const loadTrips = async () => {
    try {
      const data = await tripsApi.getMyTrips(token!);
      setTrips(data as any[]);
    } catch (error) {
      console.error("Failed to load trips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Voyaro
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Trips</h1>
            <p className="text-muted-foreground">
              Manage your group travel plans
            </p>
          </div>
          <Link href="/trips/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Trip
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : trips.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first trip and invite friends to join!
              </p>
              <Link href="/trips/create">
                <Button>Create Your First Trip</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{trip.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {trip.destination}
                        </CardDescription>
                      </div>
                      <Badge className={`${statusColors[trip.status as TripStatus]} text-white`}>
                        {statusLabels[trip.status as TripStatus]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {trip.participantCount} participants
                      </div>
                      <div>{formatDate(trip.createdAt)}</div>
                    </div>
                    {trip.isCreator && (
                      <Badge variant="outline" className="mt-2">
                        Organizer
                      </Badge>
                    )}
                    {trip.auction?.status === "ACTIVE" && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-blue-600">
                        <Gavel className="w-4 h-4" />
                        Auction in progress
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
