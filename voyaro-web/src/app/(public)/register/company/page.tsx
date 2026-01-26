"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/translations";
import { companies } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function RegisterCompanyPage() {
  const { user, token, register } = useAuth();
  const { t: translate } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(user ? 2 : 1);
  const [userFormData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [companyFormData, setCompanyFormData] = useState({
    name: "",
    description: "",
    destinations: "",
    minGroupSize: "4",
    maxGroupSize: "20",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompanyFormData({ ...companyFormData, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (userFormData.password !== userFormData.confirmPassword) {
      setError(translate(t.auth.passwordsDoNotMatch));
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: userFormData.email,
        password: userFormData.password,
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        role: "COMPANY_ADMIN",
      });
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Please complete user registration first");
      return;
    }

    setIsLoading(true);

    try {
      await companies.create(token, {
        name: companyFormData.name,
        description: companyFormData.description || undefined,
        destinations: companyFormData.destinations.split(",").map((d) => d.trim()),
        minGroupSize: parseInt(companyFormData.minGroupSize),
        maxGroupSize: parseInt(companyFormData.maxGroupSize),
      });
      router.push("/company");
    } catch (err: any) {
      setError(err.message || "Company registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="text-center mb-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              Voyaro
            </Link>
          </div>
          <CardTitle className="text-2xl text-center">
            {step === 1 ? translate(t.auth.createAdminAccount) : translate(t.auth.registerYourCompanyTitle)}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1
              ? translate(t.auth.createAdminFirst)
              : translate(t.auth.tellUsAboutCompany)}
          </CardDescription>
          <div className="flex justify-center gap-2 pt-2">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-primary" : "bg-gray-300"}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-primary" : "bg-gray-300"}`} />
          </div>
        </CardHeader>

        {step === 1 ? (
          <form onSubmit={handleUserSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{translate(t.auth.firstName)}</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={userFormData.firstName}
                    onChange={handleUserChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{translate(t.auth.lastName)}</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={userFormData.lastName}
                    onChange={handleUserChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{translate(t.auth.email)}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userFormData.email}
                  onChange={handleUserChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{translate(t.auth.password)}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={userFormData.password}
                  onChange={handleUserChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{translate(t.auth.confirmPassword)}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={userFormData.confirmPassword}
                  onChange={handleUserChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                {translate(t.auth.continue)}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleCompanySubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">{translate(t.auth.companyName)}</Label>
                <Input
                  id="name"
                  name="name"
                  value={companyFormData.name}
                  onChange={handleCompanyChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{translate(t.auth.description)}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={companyFormData.description}
                  onChange={handleCompanyChange}
                  placeholder={translate(t.auth.descriptionPlaceholder)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinations">
                  {translate(t.auth.destinationsLabel)}
                </Label>
                <Input
                  id="destinations"
                  name="destinations"
                  value={companyFormData.destinations}
                  onChange={handleCompanyChange}
                  placeholder={translate(t.auth.destinationsPlaceholder)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minGroupSize">{translate(t.auth.minGroupSize)}</Label>
                  <Input
                    id="minGroupSize"
                    name="minGroupSize"
                    type="number"
                    value={companyFormData.minGroupSize}
                    onChange={handleCompanyChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxGroupSize">{translate(t.auth.maxGroupSize)}</Label>
                  <Input
                    id="maxGroupSize"
                    name="maxGroupSize"
                    type="number"
                    value={companyFormData.maxGroupSize}
                    onChange={handleCompanyChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                {translate(t.auth.completeRegistration)}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                {translate(t.auth.companyReviewNote)}
              </p>
            </CardFooter>
          </form>
        )}

        <div className="pb-6 text-center">
          <div className="text-sm text-muted-foreground">
            {translate(t.auth.alreadyHaveAccount)}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {translate(t.auth.signIn)}
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
