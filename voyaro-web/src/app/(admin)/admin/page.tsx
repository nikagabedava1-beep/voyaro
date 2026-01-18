"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { admin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  Gavel,
  CheckCircle,
  Clock,
  Trophy,
  LogOut,
  Shield,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, token, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "PLATFORM_ADMIN")) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (token && user?.role === "PLATFORM_ADMIN") {
      loadData();
    }
  }, [token, user]);

  const loadData = async () => {
    try {
      const [statsData, verificationsData] = await Promise.all([
        admin.getDashboard(token!),
        admin.getPendingVerifications(token!),
      ]);
      setStats(statsData);
      setPendingVerifications(verificationsData as any[]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (companyId: string) => {
    try {
      await admin.verifyCompany(token!, companyId);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to verify company");
    }
  };

  const handleReject = async (companyId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await admin.rejectCompany(token!, companyId, reason);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to reject company");
    }
  };

  if (authLoading || isLoading) {
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
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              Voyaro
            </Link>
            <Badge variant="destructive" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Admin
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.firstName} {user?.lastName}
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
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Companies
              </CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCompanies || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Verifications
              </CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.pendingVerifications || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Auctions
              </CardTitle>
              <Gavel className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeAuctions || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Trips
              </CardTitle>
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.completedTrips || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/companies">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <Building2 className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Manage Companies</CardTitle>
                <CardDescription>
                  Verify and manage tour companies
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/admin/users">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/admin/auctions">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <Gavel className="w-8 h-8 text-primary mb-2" />
                <CardTitle>View Auctions</CardTitle>
                <CardDescription>Monitor all auctions on the platform</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Company Verifications</CardTitle>
            <CardDescription>
              Companies waiting for approval to submit offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingVerifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending verifications
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVerifications.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{company.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        Admin: {company.admin?.firstName} {company.admin?.lastName} (
                        {company.admin?.email})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Destinations: {company.destinations?.join(", ")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleVerify(company.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verify
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(company.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
