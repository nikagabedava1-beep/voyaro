"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { admin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Users, MapPin, Building2 } from "lucide-react";
import { UserRole } from "@/types";

const roleColors: Record<UserRole, string> = {
  TRAVELER: "bg-blue-500",
  COMPANY_ADMIN: "bg-purple-500",
  PLATFORM_ADMIN: "bg-red-500",
};

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token, filter, page]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const role = filter === "all" ? undefined : filter;
      const data = await admin.getAllUsers(token!, page, 20, role);
      setUsers((data as any).data || []);
      setTotalPages((data as any).meta?.totalPages || 1);
    } catch (error) {
      console.error("Failed to load users:", error);
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
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="text-muted-foreground">View and manage all users</p>
          </div>
        </div>

        <Tabs value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="TRAVELER">Travelers</TabsTrigger>
            <TabsTrigger value="COMPANY_ADMIN">Company Admins</TabsTrigger>
            <TabsTrigger value="PLATFORM_ADMIN">Platform Admins</TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : users.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">No users found</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-lg font-semibold">
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </div>
                            <div>
                              <div className="font-semibold">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {user._count?.createdTrips || 0} trips created
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                {user._count?.tripParticipants || 0} trips joined
                              </div>
                            </div>
                            <Badge className={`${roleColors[user.role as UserRole]} text-white`}>
                              {user.role}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              Joined {formatDate(user.createdAt)}
                            </div>
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
