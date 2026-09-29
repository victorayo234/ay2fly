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
  CheckCircle2,
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
  const { user, logout, addAddress, removeAddress, updatePassword } = useAuth();
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
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [isUpdatingPw, setIsUpdatingPw] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
        <Navbar />
        <main className="pt-36 pb-24 max-w-md mx-auto px-4 text-center space-y-6 w-full">
          <div className="p-8 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-xl">
            <div className="h-16 w-16 mx-auto rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff5500]">
              <User className="h-8 w-8" />
            </div>
            <h2 className="font-display text-xl font-bold uppercase text-slate-900">
              Sign In to Your Account
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Please sign in to view your orders, saved addresses, and profile settings.
            </p>
            <Link href="/login" className="block pt-2">
              <Button variant="accent" size="lg" className="w-full shadow-lg shadow-orange-500/20 active:scale-95">
                Sign In
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
      label: addrLabel || "Home",
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
      description: "Added to your address book.",
      variant: "success",
    });

    // Reset inputs
    setAddrStreet("");
    setAddrCity("");
    setAddrState("");
    setAddrZip("");
    setAddrLabel("");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 6) {
      toast({
        title: "PASSWORD TOO SHORT",
        description: "Password must be at least 6 characters.",
        variant: "error",
      });
      return;
    }

    if (newPw !== confirmPw) {
      toast({
        title: "PASSWORDS DO NOT MATCH",
        description: "Please ensure both password fields match.",
        variant: "error",
      });
      return;
    }

    setIsUpdatingPw(true);
    try {
      if (updatePassword) {
        await updatePassword(newPw);
      }
      setNewPw("");
      setConfirmPw("");
      toast({
        title: "PASSWORD UPDATED",
        description: "Your account password has been updated.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "UPDATE FAILED",
        description: err.message || "Failed to update password.",
        variant: "error",
      });
    } finally {
      setIsUpdatingPw(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "SIGNED OUT",
      description: "You have signed out successfully.",
      variant: "default",
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        {/* Header Profile Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[#ff5500] text-white flex items-center justify-center font-display text-2xl font-bold uppercase shadow-md shadow-orange-500/25">
              {user.full_name?.charAt(0) || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900">
                  {user.full_name}
                </h1>
                {user.role === "admin" ? (
                  <Badge variant="accent">ADMIN</Badge>
                ) : (
                  <Badge variant="emerald">MEMBER</Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <Link href="/admin">
                <Button variant="accent" size="sm" className="gap-2 shadow-sm">
                  <ShieldAlert className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-slate-600 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-xs font-display uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "overview"
                ? "bg-slate-900 text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Overview
          </button>
          <Link
            href="/orders"
            className="px-4 py-2 text-xs font-display uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-2"
          >
            <Package className="h-3.5 w-3.5" />
            Orders
          </Link>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`px-4 py-2 text-xs font-display uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "addresses"
                ? "bg-slate-900 text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            Saved Addresses ({user.addresses?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 text-xs font-display uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "security"
                ? "bg-slate-900 text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            Security & Password
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-slate-400">
                  MEMBERSHIP
                </span>
                <Sparkles className="h-4 w-4 text-[#ff5500]" />
              </div>
              <div>
                <div className="text-xl font-display font-bold uppercase text-slate-900">
                  ay2fly Club
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Free standard shipping unlocked on all orders over $150.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-[#ff5500] hover:underline flex items-center gap-1"
                >
                  Browse Latest Drops <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-slate-400">
                  ORDERS
                </span>
                <Package className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <div className="text-xl font-display font-bold uppercase text-slate-900">
                  Order History
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Track delivery progress and review items from past purchases.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/orders"
                  className="text-xs font-semibold text-[#ff5500] hover:underline flex items-center gap-1"
                >
                  View My Orders <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-slate-400">
                  DEFAULT ADDRESS
                </span>
                <MapPin className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 font-mono">
                  {user.addresses && user.addresses[0]?.name ? user.addresses[0].name : user.full_name}
                </div>
                <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {user.addresses && user.addresses[0] ? (
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
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab("addresses")}
                  className="text-xs font-semibold text-[#ff5500] hover:underline cursor-pointer flex items-center gap-1"
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
                <h3 className="font-display text-lg font-bold uppercase text-slate-900">
                  Saved Addresses
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Addresses used during checkout for one-click ordering.
                </p>
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={() => setIsAddAddressOpen(true)}
                className="gap-2 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Address
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr, idx) => (
                  <div
                    key={addr.id || idx}
                    className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-sm relative group"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={idx === 0 ? "accent" : "outline"}>
                        {addr.label || (idx === 0 ? "Primary" : "Secondary")}
                      </Badge>
                      <button
                        onClick={() => addr.id && removeAddress(addr.id)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        aria-label="Delete address"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="font-display uppercase font-bold text-slate-900">
                        {addr.name}
                      </div>
                      <div className="text-slate-600 leading-relaxed">
                        {addr.address}
                        <br />
                        {addr.city}, {addr.state} {addr.postal_code}
                        <br />
                        {addr.country}
                      </div>
                      <div className="text-slate-500 font-mono pt-1">
                        {addr.phone}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-white border border-slate-200/80 rounded-3xl space-y-2 text-slate-500 text-xs">
                  <MapPin className="h-8 w-8 mx-auto text-slate-400" />
                  <p>You haven&apos;t added any addresses yet.</p>
                </div>
              )}
            </div>

            {/* Add Address Modal Form */}
            {isAddAddressOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-display uppercase text-sm font-bold text-slate-900">
                      Add New Address
                    </h4>
                    <button
                      onClick={() => setIsAddAddressOpen(false)}
                      className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Address Label (e.g. Home, Studio)
                      </label>
                      <Input
                        placeholder="Home"
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <Input
                          required
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <Input
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Street Address *
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          City *
                        </label>
                        <Input
                          required
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          State / County
                        </label>
                        <Input
                          value={addrState}
                          onChange={(e) => setAddrState(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Postal Code *
                        </label>
                        <Input
                          required
                          value={addrZip}
                          onChange={(e) => setAddrZip(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsAddAddressOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="accent" size="sm">
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
          <div className="max-w-md p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl space-y-6 shadow-sm">
            <div>
              <h3 className="font-display text-lg font-bold uppercase text-slate-900">
                Change Password
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your account password for secure login.
              </p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                size="md"
                className="w-full shadow-md shadow-orange-500/20 active:scale-95"
                isLoading={isUpdatingPw}
              >
                Update Password
              </Button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
