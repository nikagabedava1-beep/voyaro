"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/translations";
import { trips as tripsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { MapPin, Users, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { Trip } from "@/types";

export default function InvitePage() {
  const { token: inviteToken } = useParams();
  const { user, token } = useAuth();
  const { t: translate } = useLanguage();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (inviteToken) {
      loadTripByInvite();
    }
  }, [inviteToken, token]);

  const loadTripByInvite = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (token) {
        const data = await tripsApi.getByInvite(token, inviteToken as string);
        setTrip(data as Trip);
      } else {
        // For non-logged-in users, we'll show a generic invite page
        setTrip(null);
      }
    } catch (err: any) {
      console.error("Failed to load trip:", err);
      setError(err.message || "Invalid or expired invite link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinTrip = async () => {
    if (!token) {
      // Redirect to login with return URL
      router.push(`/login?redirect=/invite/${inviteToken}`);
      return;
    }

    setIsJoining(true);
    try {
      await tripsApi.joinByInvite(token, inviteToken as string);
      setJoined(true);
      setTimeout(() => {
        router.push("/trips");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to join trip");
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{translate(t.invite.loadingInvitation)}</p>
        </div>
      </div>
    );
  }

  if (joined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">{translate(t.invite.youreIn)}</CardTitle>
            <CardDescription>
              {translate(t.invite.successfullyJoined)}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">{translate(t.invite.invalidInvitation)}</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>{translate(t.invite.goToHomepage)}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show invite page for logged-in users with trip details
  if (trip) {
    const confirmedParticipants = trip.participants?.filter((p) => p.isConfirmed).length || 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{translate(t.invite.youreInvited)}</CardTitle>
            <CardDescription>
              {trip.creator?.firstName} {trip.creator?.lastName} {translate(t.invite.invitedToJoin)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg">{trip.title}</h3>
              {trip.description && (
                <p className="text-muted-foreground text-sm">{trip.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {trip.destination}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {confirmedParticipants} / {trip.maxParticipants} {translate(t.invite.joined)}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <Button
              onClick={handleJoinTrip}
              className="w-full"
              size="lg"
              disabled={isJoining}
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {translate(t.invite.joining)}
                </>
              ) : (
                translate(t.invite.joinThisTrip)
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {translate(t.invite.byJoining)}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show invite page for non-logged-in users
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{translate(t.invite.youreInvited)}</CardTitle>
          <CardDescription>
            {translate(t.invite.someoneInvited)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-muted-foreground">
              {translate(t.invite.signInOrCreate)}
            </p>
          </div>

          <div className="space-y-3">
            <Link href={`/login?redirect=/invite/${inviteToken}`}>
              <Button className="w-full" size="lg">
                {translate(t.invite.signInToJoin)}
              </Button>
            </Link>
            <Link href={`/register/traveler?redirect=/invite/${inviteToken}`}>
              <Button variant="outline" className="w-full" size="lg">
                {translate(t.invite.createAccount)}
              </Button>
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {translate(t.invite.alreadyHaveAccount)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
