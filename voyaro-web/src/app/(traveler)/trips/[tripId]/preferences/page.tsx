"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { trips as tripsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Settings, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const comfortLevels = [
  { value: "BUDGET", label: "Budget", description: "Hostels, budget hotels, local transport" },
  { value: "STANDARD", label: "Standard", description: "3-star hotels, comfortable transport" },
  { value: "COMFORT", label: "Comfort", description: "4-star hotels, private transport" },
  { value: "LUXURY", label: "Luxury", description: "5-star hotels, premium experiences" },
];

const commonPreferences = {
  mustHaves: [
    "Hotels",
    "Tours",
    "Transportation",
    "Airport transfers",
    "Travel insurance",
    "Local guides",
    "Meals included",
  ],
  niceToHaves: [
    "Free time",
    "Optional activities",
    "Spa access",
    "Group dinners",
    "Cultural experiences",
    "Photography",
  ],
  dealBreakers: [
    "Hostels",
    "Shared rooms",
    "Public transport only",
    "No A/C",
    "Long bus rides",
    "Early morning starts",
  ],
};

export default function TripPreferencesPage() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [budgetRange, setBudgetRange] = useState([500, 2000]);
  const [comfortLevel, setComfortLevel] = useState("STANDARD");
  const [mustHaves, setMustHaves] = useState<string[]>([]);
  const [niceToHaves, setNiceToHaves] = useState<string[]>([]);
  const [dealBreakers, setDealBreakers] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const togglePreference = (
    list: string[],
    setList: (list: string[]) => void,
    item: string
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      await tripsApi.submitPreferences(token, tripId as string, {
        minBudget: budgetRange[0],
        maxBudget: budgetRange[1],
        comfortLevel,
        mustHaves,
        niceToHaves,
        dealBreakers,
      });
      setIsSaved(true);
      setTimeout(() => router.push(`/trips/${tripId}`), 1500);
    } catch (error: any) {
      alert(error.message || "Failed to submit preferences");
    } finally {
      setIsLoading(false);
    }
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
              <Settings className="w-5 h-5" />
              Your Travel Preferences
            </CardTitle>
            <CardDescription>
              Help us understand what you&apos;re looking for in this trip
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Budget Range */}
            <div className="space-y-4">
              <Label>Budget per Person</Label>
              <div className="px-2">
                <Slider
                  value={budgetRange}
                  onValueChange={setBudgetRange}
                  min={100}
                  max={5000}
                  step={100}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatCurrency(budgetRange[0])}</span>
                <span>{formatCurrency(budgetRange[1])}</span>
              </div>
            </div>

            {/* Comfort Level */}
            <div className="space-y-3">
              <Label>Comfort Level</Label>
              <div className="grid gap-3">
                {comfortLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setComfortLevel(level.value)}
                    className={`text-left p-4 rounded-lg border-2 transition-colors ${
                      comfortLevel === level.value
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm text-muted-foreground">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Must Haves */}
            <div className="space-y-3">
              <Label>Must Haves</Label>
              <div className="flex flex-wrap gap-2">
                {commonPreferences.mustHaves.map((item) => (
                  <button
                    key={item}
                    onClick={() => togglePreference(mustHaves, setMustHaves, item)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      mustHaves.includes(item)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Nice to Haves */}
            <div className="space-y-3">
              <Label>Nice to Have</Label>
              <div className="flex flex-wrap gap-2">
                {commonPreferences.niceToHaves.map((item) => (
                  <button
                    key={item}
                    onClick={() => togglePreference(niceToHaves, setNiceToHaves, item)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      niceToHaves.includes(item)
                        ? "bg-blue-500 text-white"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Deal Breakers */}
            <div className="space-y-3">
              <Label>Deal Breakers</Label>
              <div className="flex flex-wrap gap-2">
                {commonPreferences.dealBreakers.map((item) => (
                  <button
                    key={item}
                    onClick={() => togglePreference(dealBreakers, setDealBreakers, item)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      dealBreakers.includes(item)
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <Label>Additional Notes (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requirements or preferences..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            {isSaved ? (
              <div className="flex items-center justify-center gap-2 text-green-600 py-3">
                <Check className="w-5 h-5" />
                Preferences saved! Redirecting...
              </div>
            ) : (
              <Button onClick={handleSubmit} isLoading={isLoading} className="w-full">
                Save Preferences
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
