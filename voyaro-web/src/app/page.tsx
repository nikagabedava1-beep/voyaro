"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { MapPin, Users, Gavel, CheckCircle, Building2, Trophy } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">Voyaro</div>
        <div className="flex gap-4">
          {user ? (
            <Link href={user.role === "COMPANY_ADMIN" ? "/company" : user.role === "PLATFORM_ADMIN" ? "/admin" : "/trips"}>
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register/traveler">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Group Travel, <span className="text-primary">Simplified</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Plan trips with friends, find the best dates for everyone, and let tour
          companies compete for your business through our unique auction system.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register/traveler">
            <Button size="lg" className="text-lg px-8">
              Plan a Trip
            </Button>
          </Link>
          <Link href="/register/company">
            <Button size="lg" variant="outline" className="text-lg px-8">
              For Tour Companies
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works - Travelers */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works for Travelers
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Create a Trip</h3>
            <p className="text-gray-600 text-sm">
              Set your destination, invite friends, and share a unique invite link
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Collect Preferences</h3>
            <p className="text-gray-600 text-sm">
              Everyone submits their available dates and travel preferences
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gavel className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Start Auction</h3>
            <p className="text-gray-600 text-sm">
              Launch a 48-hour auction and receive competing offers from tour companies
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Choose & Book</h3>
            <p className="text-gray-600 text-sm">
              Vote with your group on the best offer and book your dream trip
            </p>
          </div>
        </div>
      </section>

      {/* For Tour Companies */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            For Tour Companies
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Building2 className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Discover Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find groups looking for travel experiences that match your
                  destinations and expertise
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Gavel className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Submit Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compete in auctions by submitting your best offers with detailed
                  itineraries and pricing
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Trophy className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Win Business</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Win trips through competitive pricing, great reviews, and matching
                  group preferences
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Link href="/register/company">
              <Button size="lg">Register Your Company</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          Company Subscription Plans
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Choose the plan that fits your business. Start free and upgrade as you grow.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="text-3xl font-bold">$0</div>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  2 bids per month
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Basic company profile
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Email support
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-primary border-2 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm">
              Popular
            </div>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <div className="text-3xl font-bold">$49/mo</div>
              <CardDescription>For growing tour companies</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Unlimited bids
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Analytics dashboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Custom branding
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <div className="text-3xl font-bold">$99/mo</div>
              <CardDescription>For enterprise tour operators</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Featured placement
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Dedicated account manager
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  API access
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold mb-4 md:mb-0">Voyaro</div>
            <div className="text-gray-400 text-sm">
              © 2024 Voyaro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
