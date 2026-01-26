const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...init } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...init.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(response.status, error.message || "Request failed");
  }

  return response.json();
}

// Auth
export const auth = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  me: (token: string) => request("/auth/me", { token }),

  refresh: (token: string) =>
    request("/auth/refresh", { method: "POST", token }),
};

// Users
export const users = {
  getMe: (token: string) => request("/users/me", { token }),

  updateMe: (token: string, data: Partial<{ firstName: string; lastName: string; phone: string }>) =>
    request("/users/me", { method: "PATCH", token, body: JSON.stringify(data) }),
};

// Trips
export const trips = {
  create: (token: string, data: {
    title: string;
    destination: string;
    description?: string;
    theme?: string;
    selectedTags?: string[];
    minParticipants?: number;
    maxParticipants?: number;
  }) => request("/trips", { method: "POST", token, body: JSON.stringify(data) }),

  getMyTrips: (token: string) => request("/trips", { token }),

  getById: (token: string, id: string) => request(`/trips/${id}`, { token }),

  getByInvite: (token: string, inviteToken: string) =>
    request(`/trips/invite/${inviteToken}`, { token }),

  joinByInvite: (token: string, inviteToken: string) =>
    request(`/trips/join/${inviteToken}`, { method: "POST", token }),

  update: (token: string, id: string, data: Partial<{
    title: string;
    destination: string;
    description?: string;
  }>) => request(`/trips/${id}`, { method: "PATCH", token, body: JSON.stringify(data) }),

  delete: (token: string, id: string) =>
    request(`/trips/${id}`, { method: "DELETE", token }),

  submitDates: (token: string, id: string, dates: string[]) =>
    request(`/trips/${id}/dates`, {
      method: "POST",
      token,
      body: JSON.stringify({ availableDates: dates }),
    }),

  submitPreferences: (token: string, id: string, data: {
    minBudget?: number;
    maxBudget?: number;
    comfortLevel?: string;
    mustHaves?: string[];
    niceToHaves?: string[];
    dealBreakers?: string[];
    selectedTags?: string[];
  }) => request(`/trips/${id}/preferences`, { method: "POST", token, body: JSON.stringify(data) }),

  confirm: (token: string, id: string) =>
    request(`/trips/${id}/confirm`, { method: "POST", token }),
};

// Auctions
export const auctions = {
  start: (token: string, tripId: string) =>
    request(`/auctions/trip/${tripId}`, { method: "POST", token }),

  getActive: (token: string, page = 1, limit = 10) =>
    request(`/auctions?page=${page}&limit=${limit}`, { token }),

  getMatching: (token: string) => request("/auctions/matching", { token }),

  getById: (token: string, id: string) => request(`/auctions/${id}`, { token }),

  selectWinner: (token: string, auctionId: string, offerId: string) =>
    request(`/auctions/${auctionId}/select-winner`, {
      method: "POST",
      token,
      body: JSON.stringify({ offerId }),
    }),
};

// Offers
export const offers = {
  create: (token: string, auctionId: string, data: {
    title: string;
    description: string;
    pricePerPerson: number;
    inclusions: string[];
    exclusions?: string[];
    itinerary?: string;
  }) => request(`/offers/auction/${auctionId}`, { method: "POST", token, body: JSON.stringify(data) }),

  update: (token: string, offerId: string, data: Partial<{
    title: string;
    description: string;
    pricePerPerson: number;
    inclusions: string[];
  }>) => request(`/offers/${offerId}`, { method: "PATCH", token, body: JSON.stringify(data) }),

  withdraw: (token: string, offerId: string) =>
    request(`/offers/${offerId}/withdraw`, { method: "POST", token }),

  getById: (token: string, id: string) => request(`/offers/${id}`, { token }),

  getByAuction: (token: string, auctionId: string) =>
    request(`/offers/auction/${auctionId}`, { token }),

  vote: (token: string, offerId: string, rank = 1) =>
    request(`/offers/${offerId}/vote`, { method: "POST", token, body: JSON.stringify({ rank }) }),

  removeVote: (token: string, offerId: string) =>
    request(`/offers/${offerId}/vote`, { method: "DELETE", token }),
};

// Companies
export const companies = {
  create: (token: string, data: {
    name: string;
    description?: string;
    destinations: string[];
    minGroupSize?: number;
    maxGroupSize?: number;
  }) => request("/companies", { method: "POST", token, body: JSON.stringify(data) }),

  getMyCompany: (token: string) => request("/companies/me", { token }),

  updateMyCompany: (token: string, data: Partial<{
    name: string;
    description: string;
    destinations: string[];
  }>) => request("/companies/me", { method: "PATCH", token, body: JSON.stringify(data) }),

  getStats: (token: string) => request("/companies/me/stats", { token }),

  getWonTrips: (token: string) => request("/companies/me/won", { token }),

  getById: (token: string, id: string) => request(`/companies/${id}`, { token }),
};

// Subscriptions
export const subscriptions = {
  getPlans: () => request("/subscriptions/plans"),

  getCurrent: (token: string) => request("/subscriptions/current", { token }),

  createCheckout: (token: string, tier: string) =>
    request("/subscriptions/checkout", { method: "POST", token, body: JSON.stringify({ tier }) }),

  createPortal: (token: string) =>
    request("/subscriptions/portal", { method: "POST", token }),
};

// Tags
export const tags = {
  // Public - get active tags
  getAll: () => request("/tags"),

  // Admin
  getAllAdmin: (token: string) => request("/tags/admin", { token }),

  getById: (token: string, id: string) => request(`/tags/admin/${id}`, { token }),

  create: (token: string, data: {
    slug: string;
    emoji: string;
    labelEn: string;
    labelKa?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) => request("/tags/admin", { method: "POST", token, body: JSON.stringify(data) }),

  update: (token: string, id: string, data: Partial<{
    slug: string;
    emoji: string;
    labelEn: string;
    labelKa: string;
    isActive: boolean;
    sortOrder: number;
  }>) => request(`/tags/admin/${id}`, { method: "PATCH", token, body: JSON.stringify(data) }),

  delete: (token: string, id: string) =>
    request(`/tags/admin/${id}`, { method: "DELETE", token }),
};

// Admin
export const admin = {
  getDashboard: (token: string) => request("/admin/dashboard", { token }),

  getPendingVerifications: (token: string) =>
    request("/admin/companies/pending", { token }),

  getAllCompanies: (token: string, page = 1, limit = 100, verified?: boolean) =>
    request(`/admin/companies?page=${page}&limit=${limit}${verified !== undefined ? `&verified=${verified}` : ""}`, { token }),

  verifyCompany: (token: string, companyId: string) =>
    request(`/admin/companies/${companyId}/verify`, { method: "POST", token }),

  rejectCompany: (token: string, companyId: string, reason: string) =>
    request(`/admin/companies/${companyId}/reject`, {
      method: "POST",
      token,
      body: JSON.stringify({ reason }),
    }),

  getAllAuctions: (token: string, page = 1, limit = 10, status?: string) =>
    request(`/admin/auctions?page=${page}&limit=${limit}${status ? `&status=${status}` : ""}`, { token }),

  getAllUsers: (token: string, page = 1, limit = 10, role?: string) =>
    request(`/admin/users?page=${page}&limit=${limit}${role ? `&role=${role}` : ""}`, { token }),

  updateUserRole: (token: string, userId: string, role: string) =>
    request(`/admin/users/${userId}/role`, { method: "PATCH", token, body: JSON.stringify({ role }) }),
};
