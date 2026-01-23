"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/translations";
import { MapPin, Users, Gavel, CheckCircle, Building2, Trophy, Plane, Globe, Heart } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const { t: translate } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative min-h-[90vh] flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            alt="Travel adventure"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-8 h-8" />
            Voyaro
          </div>
          <div className="flex gap-4 items-center">
            <LanguageSwitcher />
            {user ? (
              <Link href={user.role === "COMPANY_ADMIN" ? "/company" : user.role === "PLATFORM_ADMIN" ? "/admin" : "/trips"}>
                <Button className="bg-white text-gray-900 hover:bg-gray-100">{translate(t.nav.goToDashboard)}</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/20">{translate(t.nav.login)}</Button>
                </Link>
                <Link href="/register/traveler">
                  <Button className="bg-white text-gray-900 hover:bg-gray-100">{translate(t.nav.getStarted)}</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <section className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
              <Plane className="w-4 h-4" />
              <span>Plan group trips the smart way</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {translate(t.landing.heroTitle)}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                {translate(t.landing.heroTitleHighlight)}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              {translate(t.landing.heroDescription)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register/traveler">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 border-0 shadow-lg shadow-blue-500/25">
                  {translate(t.landing.planTrip)}
                </Button>
              </Link>
              <Link href="/register/company">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                  {translate(t.landing.forTourCompanies)}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span>Trusted by travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Verified tour companies</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Group-friendly pricing</span>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll indicator */}
        <div className="relative z-10 pb-8 flex justify-center">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* How It Works - Travelers */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl font-bold mt-2 text-gray-900">
              {translate(t.landing.howItWorks)}
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              From planning to booking, we make group travel seamless and fun
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent hidden md:block -translate-y-1/2" />
              </div>
              <span className="text-5xl font-bold text-gray-100">01</span>
              <h3 className="font-bold text-lg mt-2 text-gray-900">{translate(t.landing.createTrip)}</h3>
              <p className="text-gray-600 mt-2">
                {translate(t.landing.createTripDesc)}
              </p>
            </div>
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-transparent hidden md:block -translate-y-1/2" />
              </div>
              <span className="text-5xl font-bold text-gray-100">02</span>
              <h3 className="font-bold text-lg mt-2 text-gray-900">{translate(t.landing.collectPreferences)}</h3>
              <p className="text-gray-600 mt-2">
                {translate(t.landing.collectPreferencesDesc)}
              </p>
            </div>
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                  <Gavel className="w-10 h-10 text-white" />
                </div>
                <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-orange-200 to-transparent hidden md:block -translate-y-1/2" />
              </div>
              <span className="text-5xl font-bold text-gray-100">03</span>
              <h3 className="font-bold text-lg mt-2 text-gray-900">{translate(t.landing.startAuction)}</h3>
              <p className="text-gray-600 mt-2">
                {translate(t.landing.startAuctionDesc)}
              </p>
            </div>
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <span className="text-5xl font-bold text-gray-100">04</span>
              <h3 className="font-bold text-lg mt-2 text-gray-900">{translate(t.landing.chooseBook)}</h3>
              <p className="text-gray-600 mt-2">
                {translate(t.landing.chooseBookDesc)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Tour Companies */}
      <section className="relative py-24 overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">For Businesses</span>
            <h2 className="text-4xl font-bold mt-2 text-white">
              {translate(t.landing.forCompanies)}
            </h2>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              Connect with pre-qualified groups ready to book their next adventure
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white">{translate(t.landing.discoverGroups)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {translate(t.landing.discoverGroupsDesc)}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mb-4">
                  <Gavel className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white">{translate(t.landing.submitOffers)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {translate(t.landing.submitOffersDesc)}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mb-4">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white">{translate(t.landing.winBusiness)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {translate(t.landing.winBusinessDesc)}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Link href="/register/company">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg">
                {translate(t.landing.registerCompany)}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl font-bold mt-2 text-gray-900">
              {translate(t.landing.pricingTitle)}
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {translate(t.landing.pricingDescription)}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
              <CardHeader className="pb-8">
                <CardTitle className="text-xl">{translate(t.landing.free)}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="mt-2">{translate(t.landing.perfectForStarting)}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>2 {translate(t.landing.bidsPerMonth)}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{translate(t.landing.basicProfile)}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{translate(t.landing.emailSupport)}</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-8">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary relative shadow-xl shadow-primary/10 scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                {translate(t.landing.popular)}
              </div>
              <CardHeader className="pb-8">
                <CardTitle className="text-xl">{translate(t.landing.pro)}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$49</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="mt-2">{translate(t.landing.forGrowingCompanies)}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{translate(t.landing.unlimitedBids)}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{translate(t.landing.prioritySupport)}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{translate(t.landing.analyticsDashboard)}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{translate(t.landing.customBranding)}</span>
                  </li>
                </ul>
                <Button className="w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-500">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
              <CardHeader className="pb-8">
                <CardTitle className="text-xl">{translate(t.landing.premium)}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="mt-2">{translate(t.landing.forEnterprise)}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{translate(t.landing.everythingInPro)}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{translate(t.landing.featuredPlacement)}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{translate(t.landing.dedicatedManager)}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{translate(t.landing.apiAccess)}</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-8">Get Started</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered the smarter way to plan group trips
          </p>
          <Link href="/register/traveler">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
              Create Your First Trip
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Globe className="w-7 h-7" />
                Voyaro
              </div>
              <p className="text-gray-400 text-sm">
                Making group travel planning simple, fun, and affordable for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Travelers</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/register/traveler" className="hover:text-white transition-colors">Create a Trip</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/register/company" className="hover:text-white transition-colors">Partner With Us</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Company Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2025 Voyaro. {translate(t.footer.allRightsReserved)}
              </div>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
