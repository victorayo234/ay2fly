"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail, User, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/components/ui/toast";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const { signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please accept the terms and privacy agreement.");
      return;
    }

    setLoading(true);
    const result = await signup(fullName, email, password);
    setLoading(false);

    if (result.success) {
      toast({
        title: "ACCOUNT CREATED",
        description: `Welcome to ay2fly, ${fullName}.`,
        variant: "success",
      });
      router.push(redirect);
    } else {
      setError(result.error || "Failed to create account.");
    }
  };

  return (
    <div className="bg-[#0e0e12] border border-[#202028] rounded-xs p-6 sm:p-8 space-y-6 shadow-2xl lustre-card">
      <div className="text-center space-y-3">
        <div className="relative h-12 w-12 mx-auto">
          <Image
            src="/images/logo.png"
            alt="ay2fly"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Create an Account
          </h1>
          <p className="text-xs text-[#8e8e99] mt-1 font-mono">
            Join ay2fly for saved carts, order tracking, and drop access.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db] mb-1.5">
            Full Name
          </label>
          <Input
            type="text"
            required
            autoComplete="name"
            placeholder="Marcus Sterling"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="h-4 w-4" />}
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db] mb-1.5">
            Email Address
          </label>
          <Input
            type="email"
            required
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db] mb-1.5">
            Password
          </label>
          <Input
            type="password"
            required
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db] mb-1.5">
            Confirm Password
          </label>
          <Input
            type="password"
            required
            autoComplete="new-password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
          />
        </div>

        <div className="pt-2">
          <Checkbox
            checked={agreed}
            onCheckedChange={setAgreed}
            label="I agree to the ay2fly Terms of Service and Privacy Policy."
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={loading}
        >
          Create Account <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center text-xs text-[#8e8e99] pt-2 border-t border-[#1c1c24]">
        Already have an account?{" "}
        <Link
          href={`/login${redirect !== "/account" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
          className="text-white hover:underline font-semibold"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-32 pb-24 max-w-md mx-auto px-4 sm:px-6">
        <Suspense fallback={<div className="h-64 flex items-center justify-center text-xs font-mono">LOADING...</div>}>
          <SignupForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
