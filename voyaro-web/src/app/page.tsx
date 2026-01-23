"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useAuth } from "@/hooks/use-auth";
import { Check, Users, Calendar, MessageSquare, Award, Building2, Shield } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-900">Voyaro</div>
          <div className="flex gap-3 items-center">
            <LanguageSwitcher />
            {user ? (
              <Link href={user.role === "COMPANY_ADMIN" ? "/company" : user.role === "PLATFORM_ADMIN" ? "/admin" : "/trips"}>
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register/traveler">
                  <Button size="sm">Start a Trip</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Plan one trip.<br />
            Get multiple offers.<br />
            Choose the best.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Voyaro helps groups plan trips together and receive competing offers from verified local tour companies.
          </p>
          <div className="mt-8 space-y-1 text-gray-500">
            <p>No searching.</p>
            <p>No arguing.</p>
            <p>No overpaying.</p>
          </div>
          <div className="mt-10">
            <Link href="/register/traveler">
              <Button size="lg" className="text-base px-8 py-6">
                Start a Trip — Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sub-Hero Explanation */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Voyaro is a group travel marketplace where tour companies compete for your trip — not the other way around.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center mx-auto mb-6 text-lg font-medium">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Create a group trip
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Choose destination ideas, dates, budget, and activities using simple visual tags. Invite friends and let everyone add their availability.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center mx-auto mb-6 text-lg font-medium">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Agree once as a group
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Voyaro automatically finds the best dates for everyone and builds a group travel profile. No endless chats. No confusion.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center mx-auto mb-6 text-lg font-medium">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Receive competing offers
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Local tour companies review your trip and send their best offers. Compare, vote, and choose together.
            </p>
          </div>
        </div>
      </section>

      {/* Why Voyaro */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-12">
            Why Voyaro
          </h2>
          <div className="max-w-2xl mx-auto">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Designed specifically for groups</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Better prices through real competition</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Offers from local experts only</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">No hidden fees or commissions</span>
              </li>
            </ul>
            <p className="mt-8 text-center text-gray-500 text-sm">
              Voyaro doesn&apos;t sell trips — it helps you choose the best one.
            </p>
          </div>
        </div>
      </section>

      {/* For Travelers & For Tour Companies */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* For Travelers */}
          <div className="p-8 rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-gray-900" />
              <h3 className="text-xl font-semibold text-gray-900">For Travelers</h3>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Plan trips everyone agrees on</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600">See all offers in one place</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Choose based on price, comfort, and activities</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Stay in control as a group</span>
              </li>
            </ul>
            <p className="text-sm text-gray-500 mb-6">Always free for travelers.</p>
            <Link href="/register/traveler">
              <Button className="w-full">Start a Group Trip</Button>
            </Link>
          </div>

          {/* For Tour Companies */}
          <div className="p-8 rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-gray-900" />
              <h3 className="text-xl font-semibold text-gray-900">For Tour Companies</h3>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Access ready-to-book group trips</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Compete fairly and transparently</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600">No ads, no lead chasing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Pay only for platform access</span>
              </li>
            </ul>
            <div className="mb-6 h-5"></div>
            <Link href="/register/company">
              <Button variant="outline" className="w-full">Join as a Tour Company</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Legal Transparency */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start gap-4 max-w-2xl mx-auto">
            <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-500 leading-relaxed">
              Voyaro is a technology platform.
              We do not sell tours or handle traveler payments.
              All travel services are provided directly by verified tour companies.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Plan smarter. Travel together.
          </h2>
          <p className="text-gray-600 mb-10">
            Create a trip in minutes and let the best offers come to you.
          </p>
          <Link href="/register/traveler">
            <Button size="lg" className="text-base px-8 py-6">
              Start Your Trip — Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              &copy; 2025 Voyaro
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
              <Link href="/register/traveler" className="hover:text-gray-900 transition-colors">Start a Trip</Link>
              <Link href="/register/company" className="hover:text-gray-900 transition-colors">For Companies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
