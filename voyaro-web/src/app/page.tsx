"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/translations";
import { Check, Users, Building2, Shield, Globe, Plane } from "lucide-react";

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
          <div className="flex gap-3 items-center">
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
              <span>{translate(t.landing.heroTagline)}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              {translate(t.landing.heroTitle1)}<br />
              {translate(t.landing.heroTitle2)}<br />
              {translate(t.landing.heroTitle3)}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              {translate(t.landing.heroDescription)}
            </p>
            <div className="mt-8 space-y-1 text-white/60">
              <p>{translate(t.landing.noSearching)}</p>
              <p>{translate(t.landing.noArguing)}</p>
              <p>{translate(t.landing.noOverpaying)}</p>
            </div>
            <div className="mt-10">
              <Link href="/register/traveler">
                <Button size="lg" className="text-base px-8 py-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 border-0 shadow-lg shadow-blue-500/25">
                  {translate(t.landing.startTripFree)}
                </Button>
              </Link>
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

      {/* Sub-Hero Explanation */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {translate(t.landing.subHeroText)}
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            {translate(t.landing.howItWorks)}
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform text-white text-2xl font-bold">
                  1
                </div>
                <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent hidden md:block -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {translate(t.landing.createTrip)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {translate(t.landing.createTripDesc)}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform text-white text-2xl font-bold">
                  2
                </div>
                <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-transparent hidden md:block -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {translate(t.landing.agreeAsGroup)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {translate(t.landing.agreeAsGroupDesc)}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform text-white text-2xl font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {translate(t.landing.receiveOffers)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {translate(t.landing.receiveOffersDesc)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Voyaro */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {translate(t.landing.whyVoyaro)}
          </h2>
          <div className="max-w-2xl mx-auto">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 text-lg">{translate(t.landing.designedForGroups)}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 text-lg">{translate(t.landing.betterPrices)}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 text-lg">{translate(t.landing.localExperts)}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 text-lg">{translate(t.landing.noHiddenFees)}</span>
              </li>
            </ul>
            <p className="mt-8 text-center text-gray-500">
              {translate(t.landing.voyaroDoesntSell)}
            </p>
          </div>
        </div>
      </section>

      {/* For Travelers & For Tour Companies */}
      <section className="relative py-24 overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* For Travelers */}
            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{translate(t.landing.forTravelers)}</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{translate(t.landing.planTripsEveryone)}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{translate(t.landing.seeAllOffers)}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{translate(t.landing.chooseBasedOn)}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{translate(t.landing.stayInControl)}</span>
                </li>
              </ul>
              <p className="text-sm text-white/50 mb-6">{translate(t.landing.alwaysFree)}</p>
              <Link href="/register/traveler">
                <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">{translate(t.landing.startGroupTrip)}</Button>
              </Link>
            </div>

            {/* For Tour Companies */}
            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{translate(t.landing.forTourCompanies)}</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{translate(t.landing.accessReadyTrips)}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{translate(t.landing.competeFairly)}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{translate(t.landing.noAds)}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{translate(t.landing.payOnlyPlatform)}</span>
                </li>
              </ul>
              <div className="mb-6 h-5"></div>
              <Link href="/register/company">
                <Button className="w-full bg-transparent border border-white/30 text-white hover:bg-white/10">{translate(t.landing.joinAsCompany)}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Legal Transparency */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start gap-4 max-w-2xl mx-auto">
            <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-500 leading-relaxed">
              {translate(t.landing.trustText)}
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {translate(t.landing.planSmarter)}
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            {translate(t.landing.createInMinutes)}
          </p>
          <Link href="/register/traveler">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
              {translate(t.landing.startYourTrip)}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6" />
              <span className="text-xl font-semibold">Voyaro</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/login" className="hover:text-white transition-colors">{translate(t.nav.login)}</Link>
              <Link href="/register/traveler" className="hover:text-white transition-colors">{translate(t.landing.startGroupTrip)}</Link>
              <Link href="/register/company" className="hover:text-white transition-colors">{translate(t.landing.forTourCompanies)}</Link>
            </div>
            <div className="text-sm text-gray-500">
              &copy; 2025 Voyaro. {translate(t.footer.allRightsReserved)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
