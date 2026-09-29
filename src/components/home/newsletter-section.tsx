"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Flame, Mail } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
        variant: "danger",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "WELCOME TO THE CREW",
        description: "You'll be the first to know when the next drop goes live.",
        variant: "vibrant",
      });
    }, 600);
  };

  return (
    <section className="py-20 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <Badge variant="vibrant">
          <Flame className="h-3.5 w-3.5 mr-1" />
          VIP DROP ALERTS
        </Badge>

        <div className="space-y-3">
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900">
            Join the ay2fly Crew
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Get early access to limited edition drops, exclusive discount codes, and community updates before anyone else.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-display text-sm uppercase tracking-wider font-bold">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              You&apos;re on the VIP list
            </div>
            <p className="text-xs text-emerald-600">
              We&apos;ve sent a confirmation to <strong className="text-slate-900">{email}</strong>.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <div className="w-full sm:flex-1">
              <Input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                className="h-13 rounded-2xl text-xs"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full sm:w-auto h-13 rounded-2xl shrink-0 text-xs font-bold"
            >
              Join VIP List <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>
        )}

        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          NO SPAM · ONE-CLICK UNSUBSCRIBE ANYTIME · PRIVACY RESPECTED
        </div>
      </div>
    </section>
  );
}
