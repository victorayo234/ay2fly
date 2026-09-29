"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ShieldAlert,
  ChevronDown,
  ArrowRight,
  Shirt,
  Scissors,
  Layers,
  Sparkles,
  Flame,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuth } from "@/lib/auth/auth-context";
import { SearchModal } from "@/components/layout/search-modal";

const CATEGORY_ITEMS = [
  { name: "Tops", slug: "tops", desc: "Heavyweight hoodies, tees & knits", icon: "👕" },
  { name: "Bottoms", slug: "bottoms", desc: "Baggy denim, sweatpants & cargos", icon: "👖" },
  { name: "Jackets", slug: "jackets", desc: "Bombers, raw truckers & shells", icon: "🧥" },
  { name: "Shoes", slug: "shoes", desc: "Chelsea boots, derbies & runners", icon: "👟" },
  { name: "Headwear", slug: "headwear", desc: "Beanies, trucker caps & buckets", icon: "🧢" },
  { name: "Eyewear", slug: "eyewear", desc: "Tinted frames & wire sunglasses", icon: "🕶️" },
  { name: "Socks", slug: "socks", desc: "Ribbed crew socks & accessories", icon: "🧦" },
];

const COLLECTION_ITEMS = [
  {
    name: "Drop 01: Fresh Street Monolith",
    slug: "drop-01",
    tag: "New Drop",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=400&q=80",
    desc: "Heavyweight boxy hoodies, raw wide denim & fresh street drops.",
  },
  {
    name: "Tactical Utility",
    slug: "tactical-atelier",
    tag: "Essential",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
    desc: "Engineered cargo pants, windbreakers & functional layers.",
  },
  {
    name: "Midnight Core",
    slug: "midnight-core",
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=400&q=80",
    desc: "Deep washed black streetwear silhouettes & staple pieces.",
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const isHome = pathname === "/";

  const { user, logout } = useAuth();
  const { openCart, isMobileNavOpen, toggleMobileNav, closeMobileNav, openSearch } =
    useUIStore();
  const totalCartCount = useCartStore((s) => s.totalCount());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  // Track previous counts for animation trigger
  const [cartBounced, setCartBounced] = useState(false);
  const [wishlistBounced, setWishlistBounced] = useState(false);

  useEffect(() => {
    if (totalCartCount > 0) {
      setCartBounced(true);
      const t = setTimeout(() => setCartBounced(false), 600);
      return () => clearTimeout(t);
    }
  }, [totalCartCount]);

  useEffect(() => {
    if (wishlistCount > 0) {
      setWishlistBounced(true);
      const t = setTimeout(() => setWishlistBounced(false), 600);
      return () => clearTimeout(t);
    }
  }, [wishlistCount]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled || !isHome
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] py-3"
            : "bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-4.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileNav}
            className="md:hidden p-2 -ml-2 text-slate-800 hover:text-[#ff5500] hover:bg-slate-100 rounded-xl transition-all active:scale-95 cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Left Navigation Links with Mega-Menus */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* Shop with Mega-Menu */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("shop")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/shop"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs uppercase font-display font-bold tracking-wider transition-all nav-link-hover ${
                  pathname.startsWith("/shop")
                    ? "text-[#ff5500] bg-orange-50/60"
                    : "text-slate-700 hover:text-[#ff5500] hover:bg-slate-100/70"
                }`}
              >
                <span>Shop</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeDropdown === "shop" ? "rotate-180 text-[#ff5500]" : "text-slate-400"
                  }`}
                />
              </Link>

              {/* Shop Mega-Menu Dropdown */}
              <AnimatePresence>
                {activeDropdown === "shop" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-2 w-[720px] bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.15)] p-6 z-50 grid grid-cols-12 gap-6"
                  >
                    {/* Left Column: Category Departments */}
                    <div className="col-span-7 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                          Departments
                        </span>
                        <Link
                          href="/shop"
                          onClick={() => setActiveDropdown(null)}
                          className="text-xs font-display font-bold text-[#ff5500] hover:underline flex items-center gap-1"
                        >
                          View All <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {CATEGORY_ITEMS.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/shop?category=${cat.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-lg group-hover:scale-110 transition-transform">
                              {cat.icon}
                            </span>
                            <div>
                              <div className="text-xs font-display font-bold text-slate-800 group-hover:text-[#ff5500] transition-colors">
                                {cat.name}
                              </div>
                              <div className="text-[10px] text-slate-500 leading-tight line-clamp-1">
                                {cat.desc}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Featured Drop Preview Card */}
                    <div className="col-span-5 bg-gradient-to-br from-orange-50 to-amber-50/40 rounded-2xl p-4 border border-orange-100/80 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ff5500] text-white text-[10px] font-display font-bold rounded-full mb-3 shadow-xs">
                          <Flame className="h-3 w-3" />
                          FEATURED DROP
                        </div>

                        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3 shadow-sm border border-orange-200/50">
                          <Image
                            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
                            alt="Featured Heavyweight Boxy Hoodie"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        <h4 className="font-display text-xs font-bold text-slate-900 uppercase">
                          Heavyweight Boxy Hoodie
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                          Our signature 520 GSM loopback cotton fit.
                        </p>
                      </div>

                      <Link
                        href="/products/heavyweight-boxy-hoodie"
                        onClick={() => setActiveDropdown(null)}
                        className="mt-3 flex items-center justify-between text-xs font-display font-bold text-[#ff5500] hover:text-[#e04b00] pt-2 border-t border-orange-200/40"
                      >
                        <span>Shop Drop · $145</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* New Drop Link */}
            <Link
              href="/shop?sort=newest"
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs uppercase font-display font-bold tracking-wider transition-all nav-link-hover ${
                pathname === "/shop"
                  ? "text-[#ff5500]"
                  : "text-slate-700 hover:text-[#ff5500] hover:bg-slate-100/70"
              }`}
            >
              <span>New Drop</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5500] animate-pulse" />
            </Link>

            {/* Collections with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("collections")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/collections"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs uppercase font-display font-bold tracking-wider transition-all nav-link-hover ${
                  pathname.startsWith("/collections")
                    ? "text-[#ff5500] bg-orange-50/60"
                    : "text-slate-700 hover:text-[#ff5500] hover:bg-slate-100/70"
                }`}
              >
                <span>Collections</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeDropdown === "collections" ? "rotate-180 text-[#ff5500]" : "text-slate-400"
                  }`}
                />
              </Link>

              {/* Collections Dropdown */}
              <AnimatePresence>
                {activeDropdown === "collections" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-2 w-[540px] bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.15)] p-5 z-50 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                        Curated Capsules
                      </span>
                      <Link
                        href="/collections"
                        onClick={() => setActiveDropdown(null)}
                        className="text-xs font-display font-bold text-[#ff5500] hover:underline"
                      >
                        Browse All
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {COLLECTION_ITEMS.map((col) => (
                        <Link
                          key={col.slug}
                          href={`/shop?collection=${col.slug}`}
                          onClick={() => setActiveDropdown(null)}
                          className="group flex items-center gap-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                        >
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                            <Image
                              src={col.image}
                              alt={col.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-display font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors truncate">
                                {col.name}
                              </span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {col.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {col.desc}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#ff5500] group-hover:translate-x-1 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* About Link */}
            <Link
              href="/about"
              className={`px-3 py-2 rounded-xl text-xs uppercase font-display font-bold tracking-wider transition-all nav-link-hover ${
                pathname === "/about"
                  ? "text-[#ff5500]"
                  : "text-slate-700 hover:text-[#ff5500] hover:bg-slate-100/70"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Center Brand Logo with Hover Bounce & Aura */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none"
            aria-label="ay2fly Home"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -4, 4, 0] }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-[0_0_20px_rgba(255,85,0,0.35)] transition-shadow"
            >
              <Image
                src="/images/logo.png"
                alt="ay2fly logo"
                fill
                priority
                className="object-contain"
              />
            </motion.div>
            <span className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 group-hover:text-[#ff5500] transition-colors">
              ay2fly
            </span>
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={openSearch}
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all active:scale-95 cursor-pointer"
              aria-label="Search catalog"
              title="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Admin shortcut - ONLY visible if logged in user is admin */}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-colors"
                title="Admin Dashboard"
              >
                <ShieldAlert className="h-4 w-4" />
              </Link>
            )}

            {/* Account / Auth */}
            {user ? (
              <Link
                href="/account"
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 bg-white hover:border-[#ff5500] hover:bg-orange-50/40 text-slate-800 text-xs font-display font-bold transition-all shadow-xs"
                title="Your Account"
              >
                <span className="h-6 w-6 rounded-full bg-[#ff5500] text-white text-[11px] font-bold flex items-center justify-center font-display uppercase">
                  {user.full_name?.charAt(0) || "U"}
                </span>
                <span className="hidden lg:inline text-xs font-semibold max-w-[80px] truncate">
                  {user.full_name?.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all active:scale-95"
                aria-label="Sign In"
                title="Sign In"
              >
                <User className="h-4.5 w-4.5" />
              </Link>
            )}

            {/* Wishlist Icon with Bouncy Badge */}
            <Link
              href="/wishlist"
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all relative active:scale-95"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <motion.div
                animate={wishlistBounced ? { scale: [1, 1.35, 1], rotate: [0, -12, 12, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Heart className="h-4.5 w-4.5" />
              </motion.div>

              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key="wishlist-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute top-1 right-1 h-4 w-4 bg-[#ff5500] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono shadow-xs"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart Trigger with Bouncy Badge & Instant Slide-In */}
            <button
              onClick={openCart}
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all relative cursor-pointer active:scale-95"
              aria-label="Open Cart"
              title="Shopping Bag"
            >
              <motion.div
                animate={cartBounced ? { scale: [1, 1.35, 1], rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <ShoppingBag className="h-4.5 w-4.5" />
              </motion.div>

              <AnimatePresence>
                {totalCartCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute top-1 right-1 h-4 w-4 bg-[#ff5500] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono shadow-xs"
                  >
                    {totalCartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Smooth Slide Transition */}
        <AnimatePresence>
          {isMobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 px-6 py-6 shadow-2xl backdrop-blur-xl overflow-hidden"
            >
              <nav className="flex flex-col space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-mono uppercase font-bold text-slate-400">
                    Explore ay2fly
                  </span>
                  <button
                    onClick={() => {
                      closeMobileNav();
                      openSearch();
                    }}
                    className="flex items-center gap-1.5 text-xs font-display font-bold text-[#ff5500]"
                  >
                    <Search className="h-3.5 w-3.5" /> Search
                  </button>
                </div>

                <Link
                  href="/shop"
                  onClick={closeMobileNav}
                  className="text-base font-display font-bold tracking-tight text-slate-900 hover:text-[#ff5500] flex items-center justify-between"
                >
                  <span>Shop All Streetwear</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>

                <div className="grid grid-cols-2 gap-2 py-1">
                  {CATEGORY_ITEMS.slice(0, 4).map((c) => (
                    <Link
                      key={c.slug}
                      href={`/shop?category=${c.slug}`}
                      onClick={closeMobileNav}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-xs font-display font-bold text-slate-800 flex items-center gap-2"
                    >
                      <span>{c.icon}</span>
                      <span>{c.name}</span>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/shop?sort=newest"
                  onClick={closeMobileNav}
                  className="text-base font-display font-bold tracking-tight text-slate-900 hover:text-[#ff5500] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    New Releases
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#ff5500]">
                      Hot
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/collections"
                  onClick={closeMobileNav}
                  className="text-base font-display font-bold tracking-tight text-slate-900 hover:text-[#ff5500] flex items-center justify-between"
                >
                  <span>Collections & Capsules</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/about"
                  onClick={closeMobileNav}
                  className="text-base font-display font-bold tracking-tight text-slate-900 hover:text-[#ff5500] flex items-center justify-between"
                >
                  <span>About ay2fly</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>

                {/* Auth & Account in Mobile Nav */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3 text-xs text-slate-500">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <Link
                        href="/account"
                        onClick={closeMobileNav}
                        className="text-slate-900 font-bold flex items-center gap-2"
                      >
                        <span className="h-6 w-6 rounded-full bg-[#ff5500] text-white flex items-center justify-center text-xs font-bold">
                          {user.full_name?.charAt(0)}
                        </span>
                        Account ({user.full_name})
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          closeMobileNav();
                        }}
                        className="text-red-500 font-bold hover:underline"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link
                        href="/login"
                        onClick={closeMobileNav}
                        className="flex-1 py-2.5 text-center text-xs font-display font-bold rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={closeMobileNav}
                        className="flex-1 py-2.5 text-center text-xs font-display font-bold rounded-xl bg-[#ff5500] text-white hover:bg-[#e04b00] shadow-sm"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={closeMobileNav}
                      className="text-amber-600 font-bold hover:underline flex items-center gap-1.5"
                    >
                      <ShieldAlert className="h-4 w-4" /> Admin Dashboard
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Overlay Modal */}
      <SearchModal />
    </>
  );
}
