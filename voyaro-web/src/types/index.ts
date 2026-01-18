export type UserRole = "TRAVELER" | "COMPANY_ADMIN" | "PLATFORM_ADMIN";

export type TripStatus =
  | "COLLECTING_DATES"
  | "AUCTION_ACTIVE"
  | "AUCTION_ENDED"
  | "WINNER_SELECTED"
  | "COMPLETED"
  | "CANCELLED";

export type AuctionStatus = "ACTIVE" | "ENDED" | "WINNER_SELECTED" | "CANCELLED";

export type OfferStatus = "PENDING" | "SUBMITTED" | "WITHDRAWN" | "WINNER" | "REJECTED";

export type ComfortLevel = "BUDGET" | "STANDARD" | "COMFORT" | "LUXURY";

export type SubscriptionTier = "FREE" | "PRO" | "PREMIUM";

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  destination: string;
  theme?: string;
  status: TripStatus;
  inviteToken: string;
  minParticipants: number;
  maxParticipants: number;
  createdAt: string;
  creatorId: string;
  creator: Pick<User, "id" | "firstName" | "lastName">;
  participants: TripParticipant[];
  groupProfile?: GroupProfile;
  auction?: Auction;
}

export interface TripParticipant {
  id: string;
  userId: string;
  isConfirmed: boolean;
  joinedAt: string;
  confirmedAt?: string;
  user: Pick<User, "id" | "email" | "firstName" | "lastName">;
  dateAvailabilities?: DateAvailability[];
}

export interface DateAvailability {
  id: string;
  date: string;
  isAvailable: boolean;
}

export interface Preference {
  id: string;
  minBudget?: number;
  maxBudget?: number;
  comfortLevel: ComfortLevel;
  mustHaves: string[];
  niceToHaves: string[];
  dealBreakers: string[];
  notes?: string;
}

export interface GroupProfile {
  id: string;
  participantCount: number;
  avgMinBudget?: number;
  avgMaxBudget?: number;
  primaryComfortLevel: ComfortLevel;
  commonMustHaves: string[];
  commonNiceToHaves: string[];
  commonDealBreakers: string[];
  bestStartDate?: string;
  bestEndDate?: string;
  dateOverlapScore?: number;
}

export interface TourCompany {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  phone?: string;
  address?: string;
  destinations: string[];
  minGroupSize: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  subscription?: CompanySubscription;
}

export interface CompanySubscription {
  id: string;
  tier: SubscriptionTier;
  bidsUsedThisMonth: number;
  currentPeriodEnd?: string;
}

export interface Auction {
  id: string;
  status: AuctionStatus;
  startedAt: string;
  endsAt: string;
  destination: string;
  participantCount: number;
  startDate?: string;
  endDate?: string;
  minBudget?: number;
  maxBudget?: number;
  comfortLevel?: ComfortLevel;
  requirements: string[];
  trip?: Trip;
  offers?: Offer[];
  winningOfferId?: string;
}

export interface Offer {
  id: string;
  status: OfferStatus;
  title: string;
  description: string;
  pricePerPerson: number;
  totalPrice: number;
  inclusions: string[];
  exclusions: string[];
  itinerary?: string;
  score: number;
  priceScore: number;
  ratingScore: number;
  preferenceScore: number;
  voteCount: number;
  submittedAt: string;
  company: Pick<TourCompany, "id" | "name" | "logoUrl" | "rating" | "reviewCount">;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  bidsPerMonth: number;
  priceId?: string;
  features: string[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
