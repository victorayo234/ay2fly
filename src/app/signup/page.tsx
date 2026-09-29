"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User, AlertCircle, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/components/ui/toast";

function SignupForm() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
    if (!password || password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await signup(fullName, email, password);
    setLoading(false);

    if (result.success) {
      toast({
        title: "ACCOUNT CREATED",
        description: "Welcome to ay2fly. Your account is ready.",
        variant: "vibrant",
      });
      router.push("/account");
    } else {
      setError(result.error || "Signup failed. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setGoogleLoading(true);
    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (res.success) {
      router.push("/account");
    } else {
      setError("Google authentication could not be initiated.");
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)]">
      {/* Brand header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block relative h-12 w-12 mx-auto hover:scale-105 transition-transform">
          <Image
            src="/images/logo.png"
            alt="ay2fly mark"
            fill
            className="object-contain"
          />
        </Link>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
            Join ay2fly
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Create an account for early drop alerts, saved bag sync, and orders.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-600 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Google Sign Up */}
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={handleGoogleSignUp}
        isLoading={googleLoading}
        className="w-full h-12 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold text-slate-700 hover:bg-slate-50 border-slate-200 shadow-xs"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Sign up with Google
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative px-3 bg-white text-[11px] font-mono uppercase text-slate-400 font-bold">
          Or sign up with email
        </span>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-700">
            Full Name
          </label>
          <Input
            type="text"
            placeholder="Victor Ayo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="h-4 w-4" />}
            required
            autoComplete="name"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-700">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-700">
            Password (at least 6 characters)
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
            required
            autoComplete="new-password"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full h-12 rounded-2xl text-xs font-bold"
        >
          Create Account <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>

      {/* Login Switch */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#ff5500] font-bold hover:underline font-display"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between relative overflow-hidden">
      {/* Bold, colorful graffiti-style backdrop */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Navbar />

      <main className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 w-full flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Bold Streetwear Campaign Photo */}
          <div className="hidden lg:block lg:col-span-6 relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <Image
              src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85"
              alt="ay2fly Streetwear Community"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff5500] text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                COMMUNITY ACCESS
              </div>
              <h2 className="font-display text-2xl font-black uppercase tracking-tight leading-tight">
                Be First for Every Street Drop.
              </h2>
              <p className="text-xs text-slate-200">
                Exclusive drops, faster checkout, and real-time order tracking.
              </p>
            </div>
          </div>

          {/* Right Column: Sign Up Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center text-xs font-mono uppercase text-slate-400">
                  Loading registration...
                </div>
              }
            >
              <SignupForm />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
