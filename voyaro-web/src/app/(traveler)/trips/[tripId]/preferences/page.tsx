"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { trips as tripsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { TagSelector } from "@/components/ui/tag-selector";
import { ArrowLeft, Settings, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const comfortLevels = [
  { value: "BUDGET", label: "Budget", description: "Hostels, budget hotels, local transport" },
  { value: "STANDARD", label: "Standard", description: "3-star hotels, comfortable transport" },
  { value: "COMFORT", label: "Comfort", description: "4-star hotels, private transport" },
  { value: "LUXURY", label: "Luxury", description: "5-star hotels, premium experiences" },
];

export default function TripPreferencesPage() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [budgetRange, setBudgetRange] = useState([500, 2000]);
  const [comfortLevel, setComfortLevel] = useState("STANDARD");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      await tripsApi.submitPreferences(token, tripId as string, {
        minBudget: budgetRange[0],
        maxBudget: budgetRange[1],
        comfortLevel,
        selectedTags,
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

            {/* Trip Preferences */}
            <div className="space-y-3">
              <Label>What are you looking for in this trip?</Label>
              <p className="text-sm text-muted-foreground">
                Select up to 5 preferences that matter most to you
              </p>
              <TagSelector
                selectedTags={selectedTags}
                onChange={setSelectedTags}
                maxSelections={5}
              />
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
