"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/components/ui/toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      toast({
        title: "PASSWORD UPDATED",
        description: "Your password has been reset successfully.",
        variant: "vibrant",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(result.error || "Failed to update password. Please try again.");
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
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl font-black uppercase text-slate-900">
                Password Reset Complete
              </h1>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your new password has been verified and updated. Redirecting you to sign in...
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="primary" size="md">
                    Sign In Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <div className="h-14 w-14 rounded-2xl bg-orange-50 text-[#ff5500] flex items-center justify-center mx-auto shadow-inner">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-black uppercase tracking-tight text-slate-900">
                    Set New Password
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Create a strong, secure password for your ay2fly account.
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
                    New Password (min. 6 characters)
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

                <div className="space-y-1.5">
                  <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-700">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Update Password <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100">
                <Link
                  href="/login"
                  className="text-xs font-display font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel and Return to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
