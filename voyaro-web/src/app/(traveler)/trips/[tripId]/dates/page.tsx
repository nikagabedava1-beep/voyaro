"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { trips as tripsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Check, Users } from "lucide-react";
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore } from "date-fns";
import { Trip, TripParticipant } from "@/types";

// Color palette for different members
const memberColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-yellow-500",
];

interface MemberDateSelection {
  oderId: string;
  name: string;
  initials: string;
  color: string;
  dates: string[];
}

export default function TripDatesPage() {
  const { tripId } = useParams();
  const { token, user } = useAuth();
  const router = useRouter();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [memberSelections, setMemberSelections] = useState<MemberDateSelection[]>([]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Load trip data with participant date selections
  useEffect(() => {
    if (token && tripId) {
      loadTripData();
    }
  }, [token, tripId]);

  const loadTripData = async () => {
    try {
      const data = await tripsApi.getById(token!, tripId as string) as Trip;
      setTrip(data);

      // Extract member date selections
      const selections: MemberDateSelection[] = data.participants
        .filter(p => p.dateAvailabilities && p.dateAvailabilities.length > 0)
        .map((participant, index) => ({
          oderId: participant.userId,
          name: `${participant.user.firstName} ${participant.user.lastName}`,
          initials: `${participant.user.firstName[0]}${participant.user.lastName[0]}`,
          color: memberColors[index % memberColors.length],
          dates: participant.dateAvailabilities!
            .filter(d => d.isAvailable)
            .map(d => format(new Date(d.date), "yyyy-MM-dd")),
        }));

      setMemberSelections(selections);

      // Load current user's previously selected dates
      const currentUserParticipant = data.participants.find(p => p.userId === user?.id);
      if (currentUserParticipant?.dateAvailabilities) {
        const userDates = currentUserParticipant.dateAvailabilities
          .filter(d => d.isAvailable)
          .map(d => format(new Date(d.date), "yyyy-MM-dd"));
        setSelectedDates(userDates);
      }
    } catch (error) {
      console.error("Failed to load trip:", error);
    }
  };

  // Get members who selected a specific date
  const getMembersForDate = (dateStr: string) => {
    return memberSelections.filter(member =>
      member.dates.includes(dateStr) && member.oderId !== user?.id
    );
  };

  const toggleDate = (date: Date) => {
    if (isBefore(date, new Date())) return;

    const dateStr = format(date, "yyyy-MM-dd");
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const handleSubmit = async () => {
    if (!token || selectedDates.length === 0) return;

    setIsLoading(true);
    try {
      await tripsApi.submitDates(token, tripId as string, selectedDates);
      setIsSaved(true);
      setTimeout(() => router.push(`/trips/${tripId}`), 1500);
    } catch (error: any) {
      alert(error.message || "Failed to submit dates");
    } finally {
      setIsLoading(false);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(addDays(monthStart, -1));
  };

  const nextMonth = () => {
    setCurrentMonth(addDays(monthEnd, 1));
  };

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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Your Available Dates
            </CardTitle>
            <CardDescription>
              Click on dates when you are available to travel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                Previous
              </Button>
              <h3 className="font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                Next
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {/* Empty cells for offset */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {/* Day cells */}
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const isSelected = selectedDates.includes(dateStr);
                const isPast = isBefore(day, new Date()) && !isToday(day);
                const membersOnDate = getMembersForDate(dateStr);

                return (
                  <button
                    key={dateStr}
                    onClick={() => toggleDate(day)}
                    disabled={isPast}
                    className={`
                      aspect-square flex flex-col items-center justify-center rounded-md text-sm transition-colors relative
                      ${isPast ? "text-muted-foreground opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-primary/10"}
                      ${isSelected ? "bg-primary text-primary-foreground" : ""}
                      ${isToday(day) && !isSelected ? "border-2 border-primary" : ""}
                    `}
                    title={membersOnDate.length > 0 ? `Selected by: ${membersOnDate.map(m => m.name).join(", ")}` : undefined}
                  >
                    <span>{format(day, "d")}</span>
                    {membersOnDate.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5 absolute bottom-1">
                        {membersOnDate.slice(0, 3).map((member) => (
                          <div
                            key={member.oderId}
                            className={`w-1.5 h-1.5 rounded-full ${member.color} ${isSelected ? "ring-1 ring-white" : ""}`}
                          />
                        ))}
                        {membersOnDate.length > 3 && (
                          <span className={`text-[8px] ${isSelected ? "text-white" : "text-muted-foreground"}`}>
                            +{membersOnDate.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Member Legend */}
            {memberSelections.length > 0 && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Group Members&apos; Availability</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {memberSelections.map((member) => (
                    <div key={member.oderId} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${member.color}`} />
                      <span className="text-sm">
                        {member.name}
                        {member.oderId === user?.id && " (You)"}
                        <span className="text-muted-foreground ml-1">({member.dates.length} days)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Dates Summary */}
            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-2">
                {selectedDates.length} dates selected
              </div>
              {selectedDates.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedDates.sort().slice(0, 10).map((date) => (
                    <span key={date} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                      {format(new Date(date), "MMM d")}
                    </span>
                  ))}
                  {selectedDates.length > 10 && (
                    <span className="text-muted-foreground text-sm">
                      +{selectedDates.length - 10} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            {isSaved ? (
              <div className="flex items-center justify-center gap-2 text-green-600 py-3">
                <Check className="w-5 h-5" />
                Dates saved! Redirecting...
              </div>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={selectedDates.length === 0}
                isLoading={isLoading}
                className="w-full"
              >
                Save Dates
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
