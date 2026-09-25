"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "INVALID EMAIL",
        description: "Please enter a valid email address.",
        variant: "error",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "MIDNIGHT PASS RESERVED",
        description: "Your priority access code will arrive before the next public drop.",
        variant: "metallic",
      });
    }, 600);
  };

  return (
    <section className="py-24 bg-[#0a0a0d] border-t border-[#1a1a20]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 rounded-xs backdrop-blur-xs">
          <Shield className="h-3.5 w-3.5 text-neutral-300" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#cbd5e1]">
            RESTRICTED RELEASE LIST
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            SECURE MIDNIGHT ACCESS
          </h2>
          <p className="text-xs sm:text-sm text-[#9ca3af] max-w-lg mx-auto leading-relaxed">
            Drop sizes are capped to maintain manufacturing fidelity. Members receive private access codes 15 minutes before global inventory opens.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-[#111116] border border-white/20 rounded-xs max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-display text-sm uppercase tracking-wider font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              PRIORITY INVITATION CONFIRMED
            </div>
            <p className="text-xs text-[#8e8e99]">
              Sent verification token to <strong className="text-white">{email}</strong>.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 h-12 bg-[#121217] border border-[#272730] rounded-xs px-4 text-xs sm:text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-white transition-colors"
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full sm:w-auto shrink-0"
            >
              Request Pass <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}

        <div className="text-[11px] font-mono text-[#52525b] uppercase tracking-wider">
          ZERO SPAM · ENCRYPTED DATABASE · INSTANT UNSUBSCRIBE AT ANY TIME
        </div>
      </div>
    </section>
  );
}
