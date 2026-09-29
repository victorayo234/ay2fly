"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, ArrowRight, ArrowLeft, RefreshCw, KeyRound } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/components/ui/toast";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const { resetPassword } = useAuth();
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email || email === "your email") return;
    setResending(true);
    await resetPassword(email);
    setResending(false);
    toast({
      title: "EMAIL RESENT",
      description: `We resent the reset instructions to ${email}.`,
      variant: "vibrant",
    });
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)] text-center">
      <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <MailCheck className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-slate-900">
          Check Your Inbox
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          We&apos;ve sent a password reset link and instructions to{" "}
          <strong className="text-slate-900 font-bold">{email}</strong>.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 leading-relaxed text-left space-y-2">
        <div className="font-bold text-slate-700">Didn&apos;t receive the email?</div>
        <ul className="list-disc list-inside space-y-1 text-[11px]">
          <li>Check your Spam or Junk folder</li>
          <li>Make sure the email entered is associated with your account</li>
        </ul>
      </div>

      <div className="space-y-3 pt-2">
        <Link href="/reset-password" className="block">
          <Button variant="primary" size="lg" className="w-full">
            <KeyRound className="h-4 w-4 mr-1" /> Enter New Password
          </Button>
        </Link>

        <Button
          variant="secondary"
          size="md"
          onClick={handleResend}
          isLoading={resending}
          className="w-full"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Resend Instructions
        </Button>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <Link
          href="/login"
          className="text-xs font-display font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between relative overflow-hidden">
      {/* Bold, vibrant colorful backdrop */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Navbar />

      <main className="pt-32 pb-24 max-w-md mx-auto px-4 sm:px-6 w-full flex-1 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center text-xs font-mono uppercase text-slate-400">
              Loading confirmation...
            </div>
          }
        >
          <ConfirmationContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
