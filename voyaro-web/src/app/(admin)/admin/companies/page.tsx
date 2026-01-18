"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { companies as companiesApi, admin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Building2, CheckCircle, X, Star } from "lucide-react";
import { VerificationStatus } from "@/types";

const statusColors: Record<VerificationStatus, string> = {
  PENDING: "bg-yellow-500",
  VERIFIED: "bg-green-500",
  REJECTED: "bg-red-500",
};

export default function AdminCompaniesPage() {
  const { token } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (token) {
      loadCompanies();
    }
  }, [token, filter]);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const verified = filter === "verified" ? true : filter === "pending" ? false : undefined;
      const data = await companiesApi.findAll
        ? (companiesApi as any).findAll(token!, 1, 100, verified)
        : { data: [] };
      setCompanies((data as any).data || []);
    } catch (error) {
      console.error("Failed to load companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (companyId: string) => {
    try {
      await admin.verifyCompany(token!, companyId);
      await loadCompanies();
    } catch (error: any) {
      alert(error.message || "Failed to verify company");
    }
  };

  const handleReject = async (companyId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await admin.rejectCompany(token!, companyId, reason);
      await loadCompanies();
    } catch (error: any) {
      alert(error.message || "Failed to reject company");
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
          <Building2 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Manage Companies</h1>
            <p className="text-muted-foreground">
              View and manage all tour companies
            </p>
          </div>
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : companies.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">No companies found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {companies.map((company) => (
                  <Card key={company.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {company.name}
                            <Badge
                              className={`${
                                statusColors[company.verificationStatus as VerificationStatus]
                              } text-white`}
                            >
                              {company.verificationStatus}
                            </Badge>
                          </CardTitle>
                          <div className="text-sm text-muted-foreground mt-1">
                            Admin: {company.admin?.firstName} {company.admin?.lastName} (
                            {company.admin?.email})
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{company.rating?.toFixed(1) || "N/A"}</span>
                          <span className="text-muted-foreground text-sm">
                            ({company.reviewCount || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Destinations</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {company.destinations?.map((dest: string) => (
                              <Badge key={dest} variant="outline">
                                {dest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Group Size</div>
                          <div>
                            {company.minGroupSize} - {company.maxGroupSize} people
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Subscription</div>
                          <Badge variant="secondary">
                            {company.subscription?.tier || "FREE"}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Registered</div>
                          <div>{formatDate(company.createdAt)}</div>
                        </div>
                      </div>

                      {company.verificationStatus === "PENDING" && (
                        <div className="flex gap-2 pt-4 border-t">
                          <Button size="sm" onClick={() => handleVerify(company.id)}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(company.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {company.verificationStatus === "REJECTED" && company.rejectionReason && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm mt-4">
                          Rejection reason: {company.rejectionReason}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
