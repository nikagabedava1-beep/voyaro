"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Compass, Users, Sparkles } from "lucide-react";

function LoginFormContent() {
  const { login } = useAuth();
  const { t: translate } = useLanguage();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password, redirectUrl || undefined);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Top Section - Trust & Explanation (55-65% height) */}
      <div className="flex-1 flex flex-col px-6 pt-12 pb-6 min-h-[55vh]">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold text-primary tracking-tight">
            Voyaro
          </Link>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {translate(t.auth.welcomeBack)}
          </h1>
          <p className="text-gray-500 text-sm">
            {translate(t.auth.enterCredentials)}
          </p>
        </div>

        {/* Value Propositions */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-gray-500">{translate(t.auth.groupTrips)}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-gray-500">{translate(t.auth.bestDeals)}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
              <Compass className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-gray-500">{translate(t.auth.easyPlanning)}</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              {translate(t.auth.email)}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              {translate(t.auth.password)}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl font-medium"
            isLoading={isLoading}
          >
            {translate(t.auth.signIn)}
          </Button>

          <div className="text-sm text-center text-gray-500 pt-2">
            {translate(t.auth.noAccount)}{" "}
            <Link href="/register/traveler" className="text-primary font-medium hover:underline">
              {translate(t.auth.signUpTraveler)}
            </Link>
            {" "}{translate(t.auth.or)}{" "}
            <Link href="/register/company" className="text-primary font-medium hover:underline">
              {translate(t.auth.registerCompany)}
            </Link>
          </div>
        </form>
      </div>

      {/* Bottom Section - Emotional Travel Image (35-45% height) */}
      <div className="relative h-[40vh] min-h-[280px]">
        {/* Gradient Overlay at Top */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent z-10 rounded-t-3xl" />

        {/* Travel Image Container with Rounded Top Corners */}
        <div className="absolute inset-0 rounded-t-3xl overflow-hidden">
          <Image
            src="/images/login-travel.jpg"
            alt="Inspiring travel destination"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
