"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/components/ui/toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast({
        title: "WELCOME BACK",
        description: "Signed in successfully to your ay2fly account.",
        variant: "metallic",
      });
      router.push(redirect);
    } else {
      setError(result.error || "Authentication failed.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (res.success) {
      toast({
        title: "SIGNED IN WITH GOOGLE",
        description: "Welcome to ay2fly.",
        variant: "metallic",
      });
      router.push(redirect);
    } else {
      setError("Google authentication could not be completed.");
    }
  };

  return (
    <div className="bg-[#0e0e12] border border-[#202028] rounded-xs p-6 sm:p-8 space-y-6 shadow-2xl lustre-card">
      {/* Brand header */}
      <div className="text-center space-y-3">
        <div className="relative h-12 w-12 mx-auto">
          <Image
            src="/images/logo.png"
            alt="ay2fly mark"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Sign In to ay2fly
          </h1>
          <p className="text-xs text-[#8e8e99] mt-1 font-mono">
            Enter your credentials to access your account, orders, and saved pieces.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db] mb-1.5">
            Email Address
          </label>
          <Input
            type="email"
            required
            autoComplete="email"
            placeholder="your-email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs uppercase font-display tracking-wider text-[#d1d5db]">
              Password
            </label>
            <span className="text-[11px] text-[#71717a] hover:text-white cursor-pointer">
              Forgot?
            </span>
          </div>
          <Input
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={loading}
        >
          Sign In <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Google OAuth Simulation */}
      <div className="space-y-3 pt-2 border-t border-[#1c1c24]">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full h-11 bg-[#131317] hover:bg-[#1b1b20] border border-[#272730] text-xs font-display uppercase tracking-wider font-semibold text-[#cbd5e1] hover:text-white rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#ffffff"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#d1d5db"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#9ca3af"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#ffffff"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {googleLoading ? "Signing In..." : "Continue with Google"}
        </button>
      </div>

      <div className="text-center text-xs text-[#8e8e99]">
        Don&apos;t have an account?{" "}
        <Link
          href={`/signup${redirect !== "/account" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
          className="text-white hover:underline font-semibold"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-32 pb-24 max-w-md mx-auto px-4 sm:px-6">
        <Suspense fallback={<div className="h-64 flex items-center justify-center text-xs font-mono">LOADING...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
