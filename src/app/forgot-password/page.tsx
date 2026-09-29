"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Mail, AlertCircle, KeyRound, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (result.success) {
      // Direct navigation to the confirmation screen
      router.push(`/forgot-password/confirmation?email=${encodeURIComponent(email)}`);
    } else {
      setError(result.error || "Unable to send reset instructions. Please check your email.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between relative overflow-hidden">
      {/* Bold, vibrant graffiti-style backdrop */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Navbar />

      <main className="pt-32 pb-24 max-w-md mx-auto px-4 sm:px-6 w-full flex-1 flex items-center justify-center">
        <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)]">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 text-[#ff5500] flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black uppercase tracking-tight text-slate-900">
                Forgot Password?
              </h1>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Enter your account email below and we will send you a secure link to reset your password.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-600 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-700">
                Account Email
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full h-12 rounded-2xl text-xs font-bold"
            >
              Send Reset Link <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <Link
              href="/login"
              className="text-xs font-display font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
