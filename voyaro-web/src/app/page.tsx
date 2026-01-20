"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/translations";
import { MapPin, Users, Gavel, CheckCircle, Building2, Trophy } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const { t: translate } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">Voyaro</div>
        <div className="flex gap-4 items-center">
          <LanguageSwitcher />
          {user ? (
            <Link href={user.role === "COMPANY_ADMIN" ? "/company" : user.role === "PLATFORM_ADMIN" ? "/admin" : "/trips"}>
              <Button>{translate(t.nav.goToDashboard)}</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{translate(t.nav.login)}</Button>
              </Link>
              <Link href="/register/traveler">
                <Button>{translate(t.nav.getStarted)}</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {translate(t.landing.heroTitle)} <span className="text-primary">{translate(t.landing.heroTitleHighlight)}</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {translate(t.landing.heroDescription)}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register/traveler">
            <Button size="lg" className="text-lg px-8">
              {translate(t.landing.planTrip)}
            </Button>
          </Link>
          <Link href="/register/company">
            <Button size="lg" variant="outline" className="text-lg px-8">
              {translate(t.landing.forTourCompanies)}
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works - Travelers */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          {translate(t.landing.howItWorks)}
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{translate(t.landing.createTrip)}</h3>
            <p className="text-gray-600 text-sm">
              {translate(t.landing.createTripDesc)}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{translate(t.landing.collectPreferences)}</h3>
            <p className="text-gray-600 text-sm">
              {translate(t.landing.collectPreferencesDesc)}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gavel className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{translate(t.landing.startAuction)}</h3>
            <p className="text-gray-600 text-sm">
              {translate(t.landing.startAuctionDesc)}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{translate(t.landing.chooseBook)}</h3>
            <p className="text-gray-600 text-sm">
              {translate(t.landing.chooseBookDesc)}
            </p>
          </div>
        </div>
      </section>

      {/* For Tour Companies */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {translate(t.landing.forCompanies)}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Building2 className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{translate(t.landing.discoverGroups)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {translate(t.landing.discoverGroupsDesc)}
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Gavel className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{translate(t.landing.submitOffers)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {translate(t.landing.submitOffersDesc)}
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Trophy className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{translate(t.landing.winBusiness)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {translate(t.landing.winBusinessDesc)}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Link href="/register/company">
              <Button size="lg">{translate(t.landing.registerCompany)}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          {translate(t.landing.pricingTitle)}
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          {translate(t.landing.pricingDescription)}
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{translate(t.landing.free)}</CardTitle>
              <div className="text-3xl font-bold">$0</div>
              <CardDescription>{translate(t.landing.perfectForStarting)}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  2 {translate(t.landing.bidsPerMonth)}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {translate(t.landing.basicProfile)}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {translate(t.landing.emailSupport)}
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-primary border-2 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm">
              {translate(t.landing.popular)}
            </div>
            <CardHeader>
              <CardTitle>{translate(t.landing.pro)}</CardTitle>
              <div className="text-3xl font-bold">$49/mo</div>
              <CardDescription>{translate(t.landing.forGrowingCompanies)}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {translate(t.landing.unlimitedBids)}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {translate(t.landing.prioritySupport)}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {translate(t.landing.analyticsDashboard)}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {translate(t.landing.customBranding)}
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{translate(t.landing.premium)}</CardTitle>
              <div className="text-3xl font-bold">$99/mo</div>
              <CardDescription>{translate(t.landing.forEnterprise)}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {translate(t.landing.everythingInPro)}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {translate(t.landing.featuredPlacement)}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {translate(t.landing.dedicatedManager)}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {translate(t.landing.apiAccess)}
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
              © 2024 Voyaro. {translate(t.footer.allRightsReserved)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
