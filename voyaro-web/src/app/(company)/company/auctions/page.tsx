"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { auctions as auctionsApi, offers as offersApi, companies } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatTimeRemaining, formatDate } from "@/lib/utils";
import { ArrowLeft, MapPin, Users, Clock, Calendar, DollarSign, X } from "lucide-react";
import { Auction, TourCompany } from "@/types";

function CompanyAuctionsContent() {
  const searchParams = useSearchParams();
  const submitToAuctionId = searchParams.get("submit");
  const { token } = useAuth();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [company, setCompany] = useState<TourCompany | null>(null);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: "",
    description: "",
    pricePerPerson: "",
    inclusions: "",
    exclusions: "",
    itinerary: "",
  });

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  useEffect(() => {
    if (submitToAuctionId && auctions.length > 0) {
      const auction = auctions.find((a) => a.id === submitToAuctionId);
      if (auction) {
        setSelectedAuction(auction);
      }
    }
  }, [submitToAuctionId, auctions]);

  const loadData = async () => {
    try {
      const [auctionsData, companyData] = await Promise.all([
        auctionsApi.getMatching(token!),
        companies.getMyCompany(token!),
      ]);
      setAuctions(auctionsData as Auction[]);
      setCompany(companyData as TourCompany);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction || !token) return;

    setIsSubmitting(true);
    try {
      await offersApi.create(token, selectedAuction.id, {
        title: offerForm.title,
        description: offerForm.description,
        pricePerPerson: parseFloat(offerForm.pricePerPerson),
        inclusions: offerForm.inclusions.split(",").map((s) => s.trim()),
        exclusions: offerForm.exclusions
          ? offerForm.exclusions.split(",").map((s) => s.trim())
          : undefined,
        itinerary: offerForm.itinerary || undefined,
      });
      setSelectedAuction(null);
      setOfferForm({
        title: "",
        description: "",
        pricePerPerson: "",
        inclusions: "",
        exclusions: "",
        itinerary: "",
      });
      await loadData();
      alert("Offer submitted successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to submit offer");
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-3xl font-bold mb-2">Available Auctions</h1>
        <p className="text-muted-foreground mb-8">
          Browse and submit offers to matching auctions
        </p>

        {auctions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No matching auctions</h3>
              <p className="text-muted-foreground">
                There are no active auctions matching your company&apos;s profile right now
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {auctions.map((auction) => (
              <Card key={auction.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{auction.trip?.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {auction.destination}
                      </CardDescription>
                    </div>
                    <Badge>{formatTimeRemaining(auction.endsAt)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{auction.participantCount} participants</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {auction.minBudget && auction.maxBudget
                          ? `${formatCurrency(auction.minBudget)} - ${formatCurrency(auction.maxBudget)}`
                          : "Budget flexible"}
                      </span>
                    </div>
                    {auction.startDate && auction.endDate && (
                      <div className="flex items-center gap-2 text-sm col-span-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {formatDate(auction.startDate)} - {formatDate(auction.endDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  {auction.requirements.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Requirements:</div>
                      <div className="flex flex-wrap gap-2">
                        {auction.requirements.slice(0, 5).map((req) => (
                          <Badge key={req} variant="outline">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setSelectedAuction(auction)}
                    className="w-full"
                    disabled={company?.verificationStatus !== "VERIFIED"}
                  >
                    Submit Offer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Submit Offer Modal */}
        {selectedAuction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Submit Offer</CardTitle>
                    <CardDescription>
                      {selectedAuction.trip?.title} - {selectedAuction.destination}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedAuction(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <form onSubmit={handleSubmitOffer}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Offer Title</Label>
                    <Input
                      id="title"
                      value={offerForm.title}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, title: e.target.value })
                      }
                      placeholder="e.g., Premium Italy Experience"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={offerForm.description}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, description: e.target.value })
                      }
                      placeholder="Describe your offer..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerPerson">
                      Price per Person ($)
                      <span className="text-sm text-muted-foreground ml-2">
                        Total: {offerForm.pricePerPerson
                          ? formatCurrency(
                              parseFloat(offerForm.pricePerPerson) *
                                selectedAuction.participantCount
                            )
                          : "$0"}
                      </span>
                    </Label>
                    <Input
                      id="pricePerPerson"
                      type="number"
                      value={offerForm.pricePerPerson}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, pricePerPerson: e.target.value })
                      }
                      placeholder="1500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inclusions">Inclusions (comma-separated)</Label>
                    <Input
                      id="inclusions"
                      value={offerForm.inclusions}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, inclusions: e.target.value })
                      }
                      placeholder="Hotels, Meals, Tours, Transportation"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exclusions">Exclusions (comma-separated, optional)</Label>
                    <Input
                      id="exclusions"
                      value={offerForm.exclusions}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, exclusions: e.target.value })
                      }
                      placeholder="Flights, Travel insurance"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="itinerary">Itinerary (optional)</Label>
                    <Textarea
                      id="itinerary"
                      value={offerForm.itinerary}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, itinerary: e.target.value })
                      }
                      placeholder="Day-by-day itinerary..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedAuction(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting} className="flex-1">
                      Submit Offer
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CompanyAuctionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <CompanyAuctionsContent />
    </Suspense>
  );
}
