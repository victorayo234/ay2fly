"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserRole, ShippingAddress } from "@/types/database";
import { supabase } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export interface UserSession {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  addresses: ShippingAddress[];
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserSession>) => Promise<void>;
  addAddress: (address: ShippingAddress) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch user's real DB profile and addresses from Supabase
  const fetchUserProfile = async (userId: string, email: string, metadataName?: string): Promise<UserSession> => {
    try {
      const [profileRes, addrRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("addresses").select("*").eq("user_id", userId),
      ]);

      const profile = profileRes.data;
      const addresses: ShippingAddress[] = (addrRes.data || []).map((a: any) => ({
        id: a.id,
        user_id: a.user_id,
        label: a.label || "Home",
        name: a.name,
        address: a.address,
        city: a.city,
        state: a.state,
        country: a.country,
        postal_code: a.postal_code,
        phone: a.phone,
      }));

      return {
        id: userId,
        email: email,
        full_name: profile?.full_name || metadataName || email.split("@")[0],
        role: (profile?.role as UserRole) || "customer",
        phone: profile?.phone || "",
        addresses,
      };
    } catch (err) {
      console.error("Error fetching profile from Supabase:", err);
      return {
        id: userId,
        email,
        full_name: metadataName || email.split("@")[0],
        role: "customer",
        phone: "",
        addresses: [],
      };
    }
  };

  // Sync Supabase Auth state on mount and on changes
  useEffect(() => {
    let isMounted = true;

    // 1. Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        const fullUser = await fetchUserProfile(
          session.user.id,
          session.user.email || "",
          session.user.user_metadata?.full_name
        );
        if (isMounted) setUser(fullUser);
      } else {
        if (isMounted) setUser(null);
      }
      if (isMounted) setIsLoading(false);
    });

    // 2. Real-time auth listener for login/logout/token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          const fullUser = await fetchUserProfile(
            session.user.id,
            session.user.email || "",
            session.user.user_metadata?.full_name
          );
          if (isMounted) {
            setUser(fullUser);
            useCartStore.getState().syncWithUser(fullUser.id);
            useWishlistStore.getState().syncWithUser(fullUser.id);
          }
        } else {
          if (isMounted) {
            setUser(null);
            useCartStore.getState().syncWithUser(null);
            useWishlistStore.getState().syncWithUser(null);
          }
        }
        if (isMounted) setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    const updated = await fetchUserProfile(user.id, user.email, user.full_name);
    setUser(updated);
  };

  // Real Supabase Auth Login
  const login = async (email: string, password?: string) => {
    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const fullUser = await fetchUserProfile(
          data.user.id,
          data.user.email || email,
          data.user.user_metadata?.full_name
        );
        setUser(fullUser);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to sign in." };
    }
  };

  // Real Supabase Auth Signup
  const signup = async (fullName: string, email: string, password?: string) => {
    if (!fullName || !email || !password) {
      return { success: false, error: "All fields are required." };
    }

    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: "customer",
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Fetch or create profile in DB
        const fullUser = await fetchUserProfile(
          data.user.id,
          data.user.email || cleanEmail,
          fullName.trim()
        );
        setUser(fullUser);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to create account." };
    }
  };

  // Real Supabase Auth Google OAuth
  const loginWithGoogle = async () => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/account`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to initiate Google sign in." };
    }
  };

  // Real Supabase Auth Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
    }
  };

  // Update Profile in real Supabase Database
  const updateProfile = async (data: Partial<UserSession>) => {
    if (!user) return;
    try {
      const updates: any = {};
      if (data.full_name !== undefined) updates.full_name = data.full_name;
      if (data.phone !== undefined) updates.phone = data.phone;

      if (Object.keys(updates).length > 0) {
        await supabase.from("profiles").update(updates).eq("id", user.id);
      }

      setUser((prev) => (prev ? { ...prev, ...data } : null));
    } catch (err) {
      console.error("Update profile error:", err);
    }
  };

  // Save new address into real Supabase Database
  const addAddress = async (address: ShippingAddress) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          label: address.label || "Home",
          name: address.name,
          address: address.address,
          city: address.city,
          state: address.state,
          country: address.country,
          postal_code: address.postal_code,
          phone: address.phone,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const saved: ShippingAddress = {
          id: data.id,
          user_id: data.user_id,
          label: data.label,
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postal_code: data.postal_code,
          phone: data.phone,
        };
        setUser((prev) => (prev ? { ...prev, addresses: [...prev.addresses, saved] } : null));
      }
    } catch (err) {
      console.error("Add address error:", err);
    }
  };

  // Remove address from real Supabase Database
  const removeAddress = async (addressId: string) => {
    if (!user) return;
    try {
      await supabase.from("addresses").delete().eq("id", addressId).eq("user_id", user.id);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              addresses: prev.addresses.filter((a) => a.id !== addressId),
            }
          : null
      );
    } catch (err) {
      console.error("Remove address error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
