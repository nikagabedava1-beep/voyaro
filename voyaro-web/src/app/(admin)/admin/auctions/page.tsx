"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { admin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatTimeRemaining, formatCurrency } from "@/lib/utils";
import { ArrowLeft, Gavel, MapPin, Users, Clock, DollarSign } from "lucide-react";
import { AuctionStatus } from "@/types";

const statusColors: Record<AuctionStatus, string> = {
  ACTIVE: "bg-blue-500",
  ENDED: "bg-gray-500",
  WINNER_SELECTED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

export default function AdminAuctionsPage() {
  const { token } = useAuth();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (token) {
      loadAuctions();
    }
  }, [token, filter, page]);

  const loadAuctions = async () => {
    setIsLoading(true);
    try {
      const status = filter === "all" ? undefined : filter;
      const data = await admin.getAllAuctions(token!, page, 20, status);
      setAuctions((data as any).data || []);
      setTotalPages((data as any).meta?.totalPages || 1);
    } catch (error) {
      console.error("Failed to load auctions:", error);
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
            href="/admin"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Gavel className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">All Auctions</h1>
            <p className="text-muted-foreground">
              Monitor auctions on the platform
            </p>
          </div>
        </div>

        <Tabs value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ACTIVE">Active</TabsTrigger>
            <TabsTrigger value="ENDED">Ended</TabsTrigger>
            <TabsTrigger value="WINNER_SELECTED">Winner Selected</TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : auctions.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">No auctions found</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {auctions.map((auction) => (
                    <Card key={auction.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {auction.trip?.title}
                              <Badge
                                className={`${
                                  statusColors[auction.status as AuctionStatus]
                                } text-white`}
                              >
                                {auction.status.replace(/_/g, " ")}
                              </Badge>
                            </CardTitle>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {auction.destination}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {auction.participantCount} participants
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {auction.offerCount || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">offers</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Budget Range</div>
                            <div className="font-medium">
                              {auction.minBudget && auction.maxBudget
                                ? `${formatCurrency(auction.minBudget)} - ${formatCurrency(
                                    auction.maxBudget
                                  )}`
                                : "Flexible"}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Comfort Level</div>
                            <div className="font-medium">
                              {auction.comfortLevel || "Not specified"}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Started</div>
                            <div className="font-medium">{formatDate(auction.startedAt)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              {auction.status === "ACTIVE" ? "Time Left" : "Ended"}
                            </div>
                            <div className="font-medium flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {auction.status === "ACTIVE"
                                ? formatTimeRemaining(auction.endsAt)
                                : formatDate(auction.endsAt)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            Organizer: {auction.trip?.creator?.firstName}{" "}
                            {auction.trip?.creator?.lastName}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
