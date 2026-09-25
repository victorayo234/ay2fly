"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  Plus,
  Trash2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/components/ui/toast";
import { ShippingAddress } from "@/types/database";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, addAddress, removeAddress, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "addresses" | "security">("overview");

  // Address modal form
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addrLabel, setAddrLabel] = useState("");
  const [addrName, setAddrName] = useState(user?.full_name || "");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrCountry, setAddrCountry] = useState("United States");
  const [addrZip, setAddrZip] = useState("");
  const [addrPhone, setAddrPhone] = useState(user?.phone || "");

  // Password form
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
        <Navbar />
        <main className="pt-36 pb-24 max-w-md mx-auto px-4 text-center space-y-6">
          <div className="p-8 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-4">
            <h2 className="font-display text-xl font-bold uppercase text-white">
              Authentication Required
            </h2>
            <p className="text-xs text-[#8e8e99] leading-relaxed">
              Please sign in to view your atelier account, saved addresses, and order history.
            </p>
            <Link href="/login" className="block">
              <Button variant="primary" size="md" className="w-full">
                Sign In to Account
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrCity || !addrZip) {
      toast({
        title: "INCOMPLETE ADDRESS",
        description: "Please fill in all required address fields.",
        variant: "error",
      });
      return;
    }

    const newAddress: ShippingAddress = {
      label: addrLabel || "Residence",
      name: addrName || user.full_name,
      address: addrStreet,
      city: addrCity,
      state: addrState,
      country: addrCountry,
      postal_code: addrZip,
      phone: addrPhone,
    };

    addAddress(newAddress);
    setIsAddAddressOpen(false);
    toast({
      title: "ADDRESS SAVED",
      description: "Added to your dispatch address book.",
      variant: "success",
    });

    // Reset
    setAddrStreet("");
    setAddrCity("");
    setAddrZip("");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 6) {
      toast({
        title: "PASSWORD TOO SHORT",
        description: "New password must be at least 6 characters.",
        variant: "error",
      });
      return;
    }
    setCurrentPw("");
    setNewPw("");
    toast({
      title: "SECURITY UPDATED",
      description: "Password updated successfully across all devices.",
      variant: "metallic",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "SIGNED OUT",
      description: "Session terminated securely.",
      variant: "default",
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-32 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Profile Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#202028] pb-6 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#181820] border border-[#2e2e38] flex items-center justify-center text-white font-display text-xl font-bold uppercase shadow-inner">
              {user.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                  {user.full_name}
                </h1>
                {user.role === "admin" ? (
                  <Badge variant="new">ADMIN PRIVILEGE</Badge>
                ) : (
                  <Badge variant="metallic">ATELIER MEMBER</Badge>
                )}
              </div>
              <p className="text-xs text-[#8e8e99] font-mono mt-0.5">
                {user.email} · ID: {user.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <Link href="/admin">
                <Button variant="metallic" size="sm" className="gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  Admin Console
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-[#a1a1aa] hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#202028] overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-xs font-display uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "overview"
                ? "bg-white text-black font-bold"
                : "text-[#8e8e99] hover:text-white hover:bg-white/5"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Overview
          </button>
          <Link
            href="/orders"
            className="px-4 py-2 text-xs font-display uppercase tracking-wider text-[#8e8e99] hover:text-white hover:bg-white/5 rounded-xs transition-colors flex items-center gap-2"
          >
            <Package className="h-3.5 w-3.5" />
            Order Archives
          </Link>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`px-4 py-2 text-xs font-display uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "addresses"
                ? "bg-white text-black font-bold"
                : "text-[#8e8e99] hover:text-white hover:bg-white/5"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            Saved Addresses ({user.addresses.length})
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 text-xs font-display uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "security"
                ? "bg-white text-black font-bold"
                : "text-[#8e8e99] hover:text-white hover:bg-white/5"
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            Security & Login
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-[#71717a]">
                  MEMBERSHIP
                </span>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xl font-display font-bold uppercase text-white">
                  Tier 01: Archival
                </div>
                <p className="text-xs text-[#8e8e99] mt-1 leading-relaxed">
                  Complimentary express shipping unlocked on all domestic orders over $150.
                </p>
              </div>
              <div className="pt-2 border-t border-[#1c1c24]">
                <Link
                  href="/shop"
                  className="text-xs font-display uppercase tracking-wider text-white hover:underline flex items-center gap-1"
                >
                  Browse Current Drops <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="p-6 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-[#71717a]">
                  ORDER HISTORY
                </span>
                <Package className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xl font-display font-bold uppercase text-white">
                  Past Shipments
                </div>
                <p className="text-xs text-[#8e8e99] mt-1 leading-relaxed">
                  Inspect live delivery tracking and historical order items purchased.
                </p>
              </div>
              <div className="pt-2 border-t border-[#1c1c24]">
                <Link
                  href="/orders"
                  className="text-xs font-display uppercase tracking-wider text-white hover:underline flex items-center gap-1"
                >
                  View Order Archives <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="p-6 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-[#71717a]">
                  DEFAULT DISPATCH
                </span>
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-mono">
                  {user.addresses[0]?.name || user.full_name}
                </div>
                <div className="text-xs text-[#8e8e99] mt-1 leading-relaxed">
                  {user.addresses[0] ? (
                    <>
                      {user.addresses[0].address}
                      <br />
                      {user.addresses[0].city}, {user.addresses[0].postal_code}
                    </>
                  ) : (
                    "No default address set."
                  )}
                </div>
              </div>
              <div className="pt-2 border-t border-[#1c1c24]">
                <button
                  onClick={() => setActiveTab("addresses")}
                  className="text-xs font-display uppercase tracking-wider text-white hover:underline cursor-pointer flex items-center gap-1"
                >
                  Manage Address Book <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold uppercase text-white">
                  Dispatch Address Book
                </h3>
                <p className="text-xs text-[#8e8e99] font-mono mt-0.5">
                  Addresses used during checkout for one-click delivery assignment.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddAddressOpen(true)}
                className="gap-2"
              >
                <Plus className="h-3.5 w-3.5" />
                Add New Address
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.addresses.map((addr, idx) => (
                <div
                  key={addr.id || idx}
                  className="p-5 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={idx === 0 ? "metallic" : "outline"}>
                      {addr.label || (idx === 0 ? "Primary" : "Secondary")}
                    </Badge>
                    <button
                      onClick={() => addr.id && removeAddress(addr.id)}
                      className="text-[#71717a] hover:text-red-400 p-1 transition-colors cursor-pointer"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-display uppercase font-bold text-white">
                      {addr.name}
                    </div>
                    <div className="text-[#a1a1aa] leading-relaxed">
                      {addr.address}
                      <br />
                      {addr.city}, {addr.state} {addr.postal_code}
                      <br />
                      {addr.country}
                    </div>
                    <div className="text-[#71717a] font-mono pt-1">
                      {addr.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Address Modal Form */}
            {isAddAddressOpen && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-[#0e0e12] border border-[#272732] rounded-xs p-6 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#202028] pb-3">
                    <h4 className="font-display uppercase text-sm font-bold text-white">
                      Add Dispatch Address
                    </h4>
                    <button
                      onClick={() => setIsAddAddressOpen(false)}
                      className="text-[#71717a] hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                        Address Label (e.g. Home, Studio)
                      </label>
                      <Input
                        placeholder="Studio Loft"
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                          Full Name
                        </label>
                        <Input
                          required
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                          Phone Number
                        </label>
                        <Input
                          required
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                        Street Address
                      </label>
                      <Input
                        required
                        placeholder="18 Redchurch St"
                        value={addrStreet}
                        onChange={(e) => setAddrStreet(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                          City
                        </label>
                        <Input
                          required
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                          State / County
                        </label>
                        <Input
                          value={addrState}
                          onChange={(e) => setAddrState(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                          Postal Code
                        </label>
                        <Input
                          required
                          value={addrZip}
                          onChange={(e) => setAddrZip(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#202028]">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddAddressOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" size="sm">
                        Save Address
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Security & Password */}
        {activeTab === "security" && (
          <div className="max-w-md p-6 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold uppercase text-white">
                Account Security
              </h3>
              <p className="text-xs text-[#8e8e99] font-mono mt-0.5">
                Update account password and session authentication credentials.
              </p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                  Current Password
                </label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Update Security Credentials
              </Button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
