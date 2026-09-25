"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, User, Menu, X, ShieldAlert } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuth } from "@/lib/auth/auth-context";
import { SearchModal } from "@/components/layout/search-modal";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { user, logout } = useAuth();
  const { openCart, isMobileNavOpen, toggleMobileNav, closeMobileNav, openSearch } =
    useUIStore();
  const totalCartCount = useCartStore((s) => s.totalCount());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled || !isHome
            ? "bg-[#09090b]/90 backdrop-blur-md border-b border-[#222228] py-3.5"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileNav}
            className="md:hidden p-2 -ml-2 text-white hover:text-neutral-300 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Left Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/shop"
              className={`text-xs uppercase font-display font-medium tracking-widest transition-colors ${
                pathname === "/shop" ? "text-white font-bold" : "text-[#d1d5db] hover:text-white"
              }`}
            >
              Shop
            </Link>
            <Link
              href="/shop?sort=newest"
              className="text-xs uppercase font-display font-medium tracking-widest text-[#d1d5db] hover:text-white transition-colors"
            >
              New Drop
            </Link>
            <Link
              href="/collections"
              className={`text-xs uppercase font-display font-medium tracking-widest transition-colors ${
                pathname.startsWith("/collections") ? "text-white font-bold" : "text-[#d1d5db] hover:text-white"
              }`}
            >
              Collections
            </Link>
            <Link
              href="/about"
              className={`text-xs uppercase font-display font-medium tracking-widest transition-colors ${
                pathname === "/about" ? "text-white font-bold" : "text-[#d1d5db] hover:text-white"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Center Brand Logo (Canonical Hexagonal Mark) */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none"
            aria-label="ay2fly Home"
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="ay2fly logo mark"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="font-display text-lg sm:text-xl font-extrabold uppercase tracking-tight metallic-text hidden sm:inline-block">
              ay2fly
            </span>
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={openSearch}
              className="p-2 text-[#d1d5db] hover:text-white transition-colors cursor-pointer"
              aria-label="Search catalog"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Admin shortcut - ONLY visible if logged in user is admin */}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="p-2 text-amber-400 hover:text-amber-300 transition-colors"
                title="Admin Dashboard"
              >
                <ShieldAlert className="h-4 w-4" />
              </Link>
            )}

            {/* Account / Auth */}
            {user ? (
              <Link
                href="/account"
                className="flex items-center gap-2 p-1.5 px-2 rounded-xs border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-display transition-colors"
                title="Your Account"
              >
                <span className="h-5 w-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center font-display uppercase">
                  {user.full_name?.charAt(0) || "U"}
                </span>
                <span className="hidden lg:inline text-[11px] font-medium max-w-[80px] truncate">
                  {user.full_name?.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-2 text-[#d1d5db] hover:text-white transition-colors"
                aria-label="Sign In"
                title="Sign In"
              >
                <User className="h-4.5 w-4.5" />
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 text-[#d1d5db] hover:text-white transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="h-4.5 w-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="p-2 text-[#d1d5db] hover:text-white transition-colors relative cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="md:hidden fixed inset-x-0 top-full bg-[#09090b]/98 border-b border-[#222228] px-6 py-6 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/shop"
                onClick={closeMobileNav}
                className="text-base uppercase font-display font-semibold tracking-wider text-white hover:text-neutral-300"
              >
                Shop All
              </Link>
              <Link
                href="/shop?sort=newest"
                onClick={closeMobileNav}
                className="text-base uppercase font-display font-semibold tracking-wider text-white hover:text-neutral-300"
              >
                New Releases
              </Link>
              <Link
                href="/collections"
                onClick={closeMobileNav}
                className="text-base uppercase font-display font-semibold tracking-wider text-white hover:text-neutral-300"
              >
                Collections
              </Link>
              <Link
                href="/about"
                onClick={closeMobileNav}
                className="text-base uppercase font-display font-semibold tracking-wider text-white hover:text-neutral-300"
              >
                About ay2fly
              </Link>
              <div className="pt-4 border-t border-[#222228] flex flex-col gap-3 text-xs text-[#a1a1aa]">
                {user ? (
                  <div className="flex items-center justify-between">
                    <Link href="/account" onClick={closeMobileNav} className="text-white font-semibold">
                      Account ({user.full_name})
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMobileNav();
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Link href="/login" onClick={closeMobileNav} className="text-white hover:underline">
                      Sign In
                    </Link>
                    <Link href="/signup" onClick={closeMobileNav} className="text-white font-semibold hover:underline">
                      Create Account
                    </Link>
                  </div>
                )}
                {user?.role === "admin" && (
                  <Link href="/admin" onClick={closeMobileNav} className="text-amber-400 hover:text-amber-300">
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Global Search Overlay Modal */}
      <SearchModal />
    </>
  );
}
