"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/translations";
import { trips } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagSelector } from "@/components/ui/tag-selector";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ArrowLeft } from "lucide-react";

const destinations = [
  // Popular Destinations
  { value: "anywhere", label: "🌍 Anywhere - Let companies suggest", isFlexible: true },

  // Europe
  { value: "Albania", label: "🇦🇱 Albania" },
  { value: "Andorra", label: "🇦🇩 Andorra" },
  { value: "Austria", label: "🇦🇹 Austria" },
  { value: "Belarus", label: "🇧🇾 Belarus" },
  { value: "Belgium", label: "🇧🇪 Belgium" },
  { value: "Bosnia and Herzegovina", label: "🇧🇦 Bosnia and Herzegovina" },
  { value: "Bulgaria", label: "🇧🇬 Bulgaria" },
  { value: "Croatia", label: "🇭🇷 Croatia" },
  { value: "Cyprus", label: "🇨🇾 Cyprus" },
  { value: "Czech Republic", label: "🇨🇿 Czech Republic" },
  { value: "Denmark", label: "🇩🇰 Denmark" },
  { value: "Estonia", label: "🇪🇪 Estonia" },
  { value: "Finland", label: "🇫🇮 Finland" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Georgia", label: "🇬🇪 Georgia" },
  { value: "Germany", label: "🇩🇪 Germany" },
  { value: "Greece", label: "🇬🇷 Greece" },
  { value: "Hungary", label: "🇭🇺 Hungary" },
  { value: "Iceland", label: "🇮🇸 Iceland" },
  { value: "Ireland", label: "🇮🇪 Ireland" },
  { value: "Italy", label: "🇮🇹 Italy" },
  { value: "Latvia", label: "🇱🇻 Latvia" },
  { value: "Lithuania", label: "🇱🇹 Lithuania" },
  { value: "Luxembourg", label: "🇱🇺 Luxembourg" },
  { value: "Malta", label: "🇲🇹 Malta" },
  { value: "Moldova", label: "🇲🇩 Moldova" },
  { value: "Monaco", label: "🇲🇨 Monaco" },
  { value: "Montenegro", label: "🇲🇪 Montenegro" },
  { value: "Netherlands", label: "🇳🇱 Netherlands" },
  { value: "North Macedonia", label: "🇲🇰 North Macedonia" },
  { value: "Norway", label: "🇳🇴 Norway" },
  { value: "Poland", label: "🇵🇱 Poland" },
  { value: "Portugal", label: "🇵🇹 Portugal" },
  { value: "Romania", label: "🇷🇴 Romania" },
  { value: "Russia", label: "🇷🇺 Russia" },
  { value: "San Marino", label: "🇸🇲 San Marino" },
  { value: "Serbia", label: "🇷🇸 Serbia" },
  { value: "Slovakia", label: "🇸🇰 Slovakia" },
  { value: "Slovenia", label: "🇸🇮 Slovenia" },
  { value: "Spain", label: "🇪🇸 Spain" },
  { value: "Sweden", label: "🇸🇪 Sweden" },
  { value: "Switzerland", label: "🇨🇭 Switzerland" },
  { value: "Turkey", label: "🇹🇷 Turkey" },
  { value: "Ukraine", label: "🇺🇦 Ukraine" },
  { value: "United Kingdom", label: "🇬🇧 United Kingdom" },

  // Asia
  { value: "Armenia", label: "🇦🇲 Armenia" },
  { value: "Azerbaijan", label: "🇦🇿 Azerbaijan" },
  { value: "Bahrain", label: "🇧🇭 Bahrain" },
  { value: "Bangladesh", label: "🇧🇩 Bangladesh" },
  { value: "Bhutan", label: "🇧🇹 Bhutan" },
  { value: "Brunei", label: "🇧🇳 Brunei" },
  { value: "Cambodia", label: "🇰🇭 Cambodia" },
  { value: "China", label: "🇨🇳 China" },
  { value: "India", label: "🇮🇳 India" },
  { value: "Indonesia", label: "🇮🇩 Indonesia" },
  { value: "Israel", label: "🇮🇱 Israel" },
  { value: "Japan", label: "🇯🇵 Japan" },
  { value: "Jordan", label: "🇯🇴 Jordan" },
  { value: "Kazakhstan", label: "🇰🇿 Kazakhstan" },
  { value: "Kuwait", label: "🇰🇼 Kuwait" },
  { value: "Kyrgyzstan", label: "🇰🇬 Kyrgyzstan" },
  { value: "Laos", label: "🇱🇦 Laos" },
  { value: "Lebanon", label: "🇱🇧 Lebanon" },
  { value: "Malaysia", label: "🇲🇾 Malaysia" },
  { value: "Maldives", label: "🇲🇻 Maldives" },
  { value: "Mongolia", label: "🇲🇳 Mongolia" },
  { value: "Myanmar", label: "🇲🇲 Myanmar" },
  { value: "Nepal", label: "🇳🇵 Nepal" },
  { value: "Oman", label: "🇴🇲 Oman" },
  { value: "Pakistan", label: "🇵🇰 Pakistan" },
  { value: "Philippines", label: "🇵🇭 Philippines" },
  { value: "Qatar", label: "🇶🇦 Qatar" },
  { value: "Saudi Arabia", label: "🇸🇦 Saudi Arabia" },
  { value: "Singapore", label: "🇸🇬 Singapore" },
  { value: "South Korea", label: "🇰🇷 South Korea" },
  { value: "Sri Lanka", label: "🇱🇰 Sri Lanka" },
  { value: "Taiwan", label: "🇹🇼 Taiwan" },
  { value: "Tajikistan", label: "🇹🇯 Tajikistan" },
  { value: "Thailand", label: "🇹🇭 Thailand" },
  { value: "Turkmenistan", label: "🇹🇲 Turkmenistan" },
  { value: "United Arab Emirates", label: "🇦🇪 United Arab Emirates" },
  { value: "Uzbekistan", label: "🇺🇿 Uzbekistan" },
  { value: "Vietnam", label: "🇻🇳 Vietnam" },

  // Africa
  { value: "Algeria", label: "🇩🇿 Algeria" },
  { value: "Botswana", label: "🇧🇼 Botswana" },
  { value: "Egypt", label: "🇪🇬 Egypt" },
  { value: "Ethiopia", label: "🇪🇹 Ethiopia" },
  { value: "Ghana", label: "🇬🇭 Ghana" },
  { value: "Kenya", label: "🇰🇪 Kenya" },
  { value: "Madagascar", label: "🇲🇬 Madagascar" },
  { value: "Mauritius", label: "🇲🇺 Mauritius" },
  { value: "Morocco", label: "🇲🇦 Morocco" },
  { value: "Namibia", label: "🇳🇦 Namibia" },
  { value: "Nigeria", label: "🇳🇬 Nigeria" },
  { value: "Rwanda", label: "🇷🇼 Rwanda" },
  { value: "Senegal", label: "🇸🇳 Senegal" },
  { value: "Seychelles", label: "🇸🇨 Seychelles" },
  { value: "South Africa", label: "🇿🇦 South Africa" },
  { value: "Tanzania", label: "🇹🇿 Tanzania" },
  { value: "Tunisia", label: "🇹🇳 Tunisia" },
  { value: "Uganda", label: "🇺🇬 Uganda" },
  { value: "Zambia", label: "🇿🇲 Zambia" },
  { value: "Zimbabwe", label: "🇿🇼 Zimbabwe" },

  // North America
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "Costa Rica", label: "🇨🇷 Costa Rica" },
  { value: "Cuba", label: "🇨🇺 Cuba" },
  { value: "Dominican Republic", label: "🇩🇴 Dominican Republic" },
  { value: "El Salvador", label: "🇸🇻 El Salvador" },
  { value: "Guatemala", label: "🇬🇹 Guatemala" },
  { value: "Honduras", label: "🇭🇳 Honduras" },
  { value: "Jamaica", label: "🇯🇲 Jamaica" },
  { value: "Mexico", label: "🇲🇽 Mexico" },
  { value: "Nicaragua", label: "🇳🇮 Nicaragua" },
  { value: "Panama", label: "🇵🇦 Panama" },
  { value: "Puerto Rico", label: "🇵🇷 Puerto Rico" },
  { value: "United States", label: "🇺🇸 United States" },

  // South America
  { value: "Argentina", label: "🇦🇷 Argentina" },
  { value: "Bolivia", label: "🇧🇴 Bolivia" },
  { value: "Brazil", label: "🇧🇷 Brazil" },
  { value: "Chile", label: "🇨🇱 Chile" },
  { value: "Colombia", label: "🇨🇴 Colombia" },
  { value: "Ecuador", label: "🇪🇨 Ecuador" },
  { value: "Paraguay", label: "🇵🇾 Paraguay" },
  { value: "Peru", label: "🇵🇪 Peru" },
  { value: "Uruguay", label: "🇺🇾 Uruguay" },
  { value: "Venezuela", label: "🇻🇪 Venezuela" },

  // Oceania
  { value: "Australia", label: "🇦🇺 Australia" },
  { value: "Fiji", label: "🇫🇯 Fiji" },
  { value: "New Zealand", label: "🇳🇿 New Zealand" },
  { value: "Papua New Guinea", label: "🇵🇬 Papua New Guinea" },
  { value: "Samoa", label: "🇼🇸 Samoa" },
  { value: "Tonga", label: "🇹🇴 Tonga" },
  { value: "Vanuatu", label: "🇻🇺 Vanuatu" },
];

export default function CreateTripPage() {
  const { token } = useAuth();
  const { t: translate } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    participants: "4",
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
      setError(translate(t.trips.loginToCreate));
      return;
    }

    setIsLoading(true);

    try {
      const isFlexibleDestination = formData.destination === "anywhere";
      const participantsCount = parseInt(formData.participants);
      const trip = await trips.create(token, {
        title: formData.title,
        description: formData.description || undefined,
        destination: isFlexibleDestination ? "Anywhere" : formData.destination,
        selectedTags: selectedTags.length > 0 ? selectedTags : undefined,
        minParticipants: 2,
        maxParticipants: participantsCount,
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
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/trips" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            {translate(t.trips.backToMyTrips)}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{translate(t.trips.createNewTrip)}</CardTitle>
            <CardDescription>
              {translate(t.trips.setupGroupTrip)}
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
                <Label htmlFor="title">{translate(t.trips.tripTitle)}</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={translate(t.trips.tripTitlePlaceholder)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">{translate(t.trips.destination)}</Label>
                <Select
                  value={formData.destination}
                  onValueChange={(value) => handleSelectChange("destination", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={translate(t.trips.selectDestination)} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {destinations.map((dest) => (
                      <SelectItem
                        key={dest.value}
                        value={dest.value}
                        className={dest.isFlexible ? "font-medium text-primary" : ""}
                      >
                        {dest.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {translate(t.trips.anywhereHint)}
                </p>
              </div>

              <div className="space-y-3">
                <Label>{translate(t.trips.tripInterests)}</Label>
                <p className="text-sm text-muted-foreground -mt-1">
                  {translate(t.trips.whatExperiences)}
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
                <Label htmlFor="description">{translate(t.trips.descriptionOptional)}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={translate(t.trips.describePlans)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants">{translate(t.trips.numberOfFriends)}</Label>
                <Input
                  id="participants"
                  name="participants"
                  type="number"
                  min="2"
                  max="50"
                  value={formData.participants}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {translate(t.trips.numberOfFriendsHint)}
                </p>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                {translate(t.trips.createTrip)}
              </Button>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  );
}
