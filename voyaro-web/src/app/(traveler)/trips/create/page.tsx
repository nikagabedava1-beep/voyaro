"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { trips } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagSelector } from "@/components/ui/tag-selector";
import { ArrowLeft } from "lucide-react";

const destinations = [
  "Italy",
  "Spain",
  "Greece",
  "Croatia",
  "Portugal",
  "France",
  "Germany",
  "Japan",
  "Thailand",
  "Mexico",
  "Peru",
  "Morocco",
];

export default function CreateTripPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    minParticipants: "2",
    maxParticipants: "12",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Please log in to create a trip");
      return;
    }

    setIsLoading(true);

    try {
      const trip = await trips.create(token, {
        title: formData.title,
        description: formData.description || undefined,
        destination: formData.destination,
        selectedTags: selectedTags.length > 0 ? selectedTags : undefined,
        minParticipants: parseInt(formData.minParticipants),
        maxParticipants: parseInt(formData.maxParticipants),
      });
      router.push(`/trips/${(trip as any).id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create trip");
    } finally {
      setIsLoading(false);
    }
  };

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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Trip</CardTitle>
            <CardDescription>
              Set up your group trip and invite friends to join
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Trip Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Summer Adventure 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Select
                  value={formData.destination}
                  onValueChange={(value) => handleSelectChange("destination", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest} value={dest}>
                        {dest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Trip Interests (optional)</Label>
                <p className="text-sm text-muted-foreground -mt-1">
                  What type of experiences are you looking for?
                </p>
                <TagSelector
                  selectedTags={selectedTags}
                  onChange={setSelectedTags}
                  maxSelections={5}
                  showCounter={true}
                  columns={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your trip plans..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minParticipants">Min Participants</Label>
                  <Input
                    id="minParticipants"
                    name="minParticipants"
                    type="number"
                    min="2"
                    value={formData.minParticipants}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    name="maxParticipants"
                    type="number"
                    max="50"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Trip
              </Button>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  );
}
