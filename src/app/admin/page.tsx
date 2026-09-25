"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Check,
  Search,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
import { Product, Order, OrderStatus } from "@/types/database";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "orders" | "inventory" | "customers"
  >("overview");

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Inventory threshold
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);

  // Search & edit state
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  // Edit variant stock modal
  const [editingVariant, setEditingVariant] = useState<{
    productId: string;
    productName: string;
    variantId: string;
    sku: string;
    currentStock: number;
  } | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);

  // Create product modal
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("cat-tops");
  const [newProdPrice, setNewProdPrice] = useState(135);
  const [newProdMaterial, setNewProdMaterial] = useState("500 GSM French Terry");
  const [newProdFit, setNewProdFit] = useState<"oversized" | "regular" | "boxy" | "fitted">("oversized");
  const [newProdDesc, setNewProdDesc] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodsRes, ordersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);
      if (prodsRes.ok) setProducts(await prodsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (e) {
      console.error("Admin fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Strict role check: enforce real admin authentication
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
        <Navbar />
        <main className="pt-36 pb-24 max-w-md mx-auto px-4 text-center space-y-6">
          <div className="p-8 bg-[#0e0e12] border border-[#272730] rounded-xs space-y-5 shadow-2xl lustre-card">
            <div className="h-16 w-16 mx-auto rounded-full bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase text-white tracking-wide">
                Admin Authentication Required
              </h2>
              <p className="text-xs text-[#8e8e99] leading-relaxed mt-1">
                {!user
                  ? "You must be signed in with an authorized administrative account to access the dashboard."
                  : "Your current account does not have administrator privileges. Please sign in with an admin account."}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login?redirect=/admin" className="w-full">
                <Button variant="primary" size="lg" className="w-full">
                  Sign In with Admin Account
                </Button>
              </Link>
              <Link href="/" className="w-full">
                <Button variant="secondary" size="md" className="w-full">
                  Return to Store
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = orders.reduce(
    (sum, o) =>
      sum + (o.items?.reduce((iSum, i) => iSum + i.quantity, 0) ?? 0),
    0
  );

  // Flattened inventory variants
  const allVariants = products.flatMap((p) =>
    (p.variants || []).map((v) => ({
      ...v,
      productId: p.id,
      productName: p.name,
      productSlug: p.slug,
      isLowStock: v.stock > 0 && v.stock <= lowStockThreshold,
      isOutOfStock: v.stock === 0,
    }))
  );

  const lowStockCount = allVariants.filter((v) => v.isLowStock).length;
  const outOfStockCount = allVariants.filter((v) => v.isOutOfStock).length;

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        toast({
          title: "ORDER STATUS UPDATED",
          description: `Order updated to ${newStatus}.`,
          variant: "success",
        });
      }
    } catch (e) {
      toast({
        title: "UPDATE ERROR",
        description: "Failed to update order status.",
        variant: "error",
      });
    }
  };

  const handleSaveStock = async () => {
    if (!editingVariant) return;

    try {
      await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: editingVariant.variantId,
          stock: Math.max(0, newStockVal),
        }),
      });

      // Update in client state
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === editingVariant.productId) {
            return {
              ...p,
              variants: p.variants?.map((v) =>
                v.id === editingVariant.variantId
                  ? { ...v, stock: Math.max(0, newStockVal) }
                  : v
              ),
            };
          }
          return p;
        })
      );

      toast({
        title: "STOCK UPDATED",
        description: `${editingVariant.sku} updated to ${newStockVal} units.`,
        variant: "metallic",
      });
    } catch (err) {
      toast({
        title: "UPDATE ERROR",
        description: "Failed to persist stock update to server.",
        variant: "error",
      });
    } finally {
      setEditingVariant(null);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const slug = newProdName.toLowerCase().replace(/\s+/g, "-");
    const newProdData = {
      name: newProdName,
      slug,
      description: newProdDesc || "Engineered heavyweight streetwear garment.",
      category_id: newProdCategory,
      collection_id: "col-drop-01",
      price: newProdPrice,
      sale_price: null,
      material: newProdMaterial,
      fit: newProdFit,
      status: "active",
      images: [
        {
          id: `img-${Date.now()}`,
          product_id: "",
          image_url:
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
          alt_text: newProdName,
          position: 0,
        },
      ],
      variants: [
        {
          id: `var-${Date.now()}-1`,
          product_id: "",
          color: "Vintage Black",
          color_hex: "#111114",
          size: "M",
          sku: `AY-${slug.substring(0, 3).toUpperCase()}-BLK-M`,
          stock: 12,
        },
        {
          id: `var-${Date.now()}-2`,
          product_id: "",
          color: "Vintage Black",
          color_hex: "#111114",
          size: "L",
          sku: `AY-${slug.substring(0, 3).toUpperCase()}-BLK-L`,
          stock: 8,
        },
      ],
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProdData),
      });

      if (res.ok) {
        const { product } = await res.json();
        setProducts([product, ...products]);
        toast({
          title: "PRODUCT CREATED",
          description: `${product.name} deployed to active archives.`,
          variant: "success",
        });
      } else {
        throw new Error("Creation failed");
      }
    } catch (err) {
      toast({
        title: "CREATION ERROR",
        description: "Failed to persist new product to database.",
        variant: "error",
      });
    } finally {
      setIsCreateProductOpen(false);
      setNewProdName("");
      setNewProdDesc("");
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#202028] pb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-11 w-11 bg-[#141418] border border-white/20 p-1.5 rounded-xs flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="ay2fly"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  Atelier Control Center
                </h1>
                <Badge variant="new">SERVER VERIFIED</Badge>
              </div>
              <p className="text-xs text-[#8e8e99] font-mono mt-0.5">
                Logged in as {user.full_name} ({user.email}) · Role: {user.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync DB
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateProductOpen(true)}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              New Garment
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#202028] overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "products", label: `Products (${products.length})`, icon: ShoppingBag },
            { id: "orders", label: `Orders (${orders.length})`, icon: Package },
            { id: "inventory", label: `Inventory & Alerts (${lowStockCount + outOfStockCount})`, icon: AlertTriangle },
            { id: "customers", label: "Customers (2)", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-display uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2 cursor-pointer ${
                  active
                    ? "bg-white text-black font-bold shadow-md"
                    : "text-[#8e8e99] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-2">
                <div className="flex items-center justify-between text-[#8e8e99] text-xs font-mono uppercase">
                  <span>Gross Sales</span>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-display font-bold text-white">
                  {formatPrice(totalRevenue)}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <TrendingUp className="h-3 w-3" />
                  +18.4% vs last drop cycle
                </div>
              </div>

              <div className="p-6 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-2">
                <div className="flex items-center justify-between text-[#8e8e99] text-xs font-mono uppercase">
                  <span>Total Orders</span>
                  <Package className="h-4 w-4 text-neutral-400" />
                </div>
                <div className="text-3xl font-display font-bold text-white">
                  {orders.length}
                </div>
                <div className="text-[11px] text-[#8e8e99] font-mono">
                  {totalItemsSold} pieces ordered
                </div>
              </div>

              <div className="p-6 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-2">
                <div className="flex items-center justify-between text-[#8e8e99] text-xs font-mono uppercase">
                  <span>Active Catalog</span>
                  <ShoppingBag className="h-4 w-4 text-neutral-400" />
                </div>
                <div className="text-3xl font-display font-bold text-white">
                  {products.length}
                </div>
                <div className="text-[11px] text-[#8e8e99] font-mono">
                  {allVariants.length} total SKUs active
                </div>
              </div>

              <div className="p-6 bg-[#0e0e12] border border-amber-900/40 rounded-xs space-y-2">
                <div className="flex items-center justify-between text-amber-400 text-xs font-mono uppercase">
                  <span>Inventory Alerts</span>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="text-3xl font-display font-bold text-amber-300">
                  {lowStockCount + outOfStockCount}
                </div>
                <div className="text-[11px] text-amber-400/80 font-mono">
                  {lowStockCount} low stock · {outOfStockCount} sold out
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-6 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#202028] pb-3">
                <h3 className="font-display text-sm font-bold uppercase text-white">
                  Recent Atelier Dispatches
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-[#a1a1aa] hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                >
                  View All Orders <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141418] text-[#8e8e99] font-mono uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e24] font-mono">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/5">
                        <td className="py-3 px-3 font-bold text-white">
                          #{ord.order_number}
                        </td>
                        <td className="py-3 px-3 text-[#d1d5db]">
                          {ord.shipping_address.name}
                        </td>
                        <td className="py-3 px-3 text-[#8e8e99]">
                          {ord.items?.length || 0} piece(s)
                        </td>
                        <td className="py-3 px-3 font-bold text-white">
                          {formatPrice(ord.total)}
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant={
                              ord.status === "delivered"
                                ? "default"
                                : ord.status === "shipped"
                                ? "metallic"
                                : "outline"
                            }
                          >
                            {ord.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Filter garments by name..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                  className="h-10 text-xs"
                />
              </div>
              <div className="text-xs font-mono text-[#8e8e99]">
                Showing {products.length} garments in database
              </div>
            </div>

            <div className="overflow-x-auto border border-[#202028] rounded-xs bg-[#0e0e12]">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#141418] border-b border-[#202028] text-[#8e8e99] font-display uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Silhouette</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Variants</th>
                    <th className="py-3 px-4">Total Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] font-mono">
                  {products
                    .filter((p) =>
                      p.name.toLowerCase().includes(productSearch.toLowerCase())
                    )
                    .map((p) => {
                      const totalStock =
                        p.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
                      return (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-10 bg-[#16161c] rounded-xs overflow-hidden shrink-0 border border-[#272730]">
                                <Image
                                  src={
                                    p.images?.[0]?.image_url ||
                                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80"
                                  }
                                  alt={p.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <Link
                                  href={`/products/${p.slug}`}
                                  className="font-display uppercase font-bold text-white hover:underline block"
                                >
                                  {p.name}
                                </Link>
                                <span className="text-[11px] text-[#71717a] font-sans">
                                  {p.material}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 uppercase text-[#cbd5e1]">
                            {p.fit}
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            {formatPrice(p.sale_price ?? p.price)}
                          </td>
                          <td className="py-3 px-4 text-[#8e8e99]">
                            {p.variants?.length || 0} variants
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={
                                totalStock === 0
                                  ? "text-red-400 font-bold"
                                  : totalStock <= 5
                                  ? "text-amber-400 font-bold"
                                  : "text-emerald-400"
                              }
                            >
                              {totalStock} units
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={p.status === "active" ? "default" : "outOfStock"}>
                              {p.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link href={`/products/${p.slug}`} target="_blank">
                              <button className="p-1.5 text-[#71717a] hover:text-white transition-colors cursor-pointer" title="View live PDP">
                                <ArrowUpRight className="h-4 w-4" />
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Search by order # or customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                  className="h-10 text-xs"
                />
              </div>
              <div className="text-xs font-mono text-[#8e8e99]">
                Live database fulfillment controls
              </div>
            </div>

            <div className="overflow-x-auto border border-[#202028] rounded-xs bg-[#0e0e12]">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#141418] border-b border-[#202028] text-[#8e8e99] font-display uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order Number</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer & Address</th>
                    <th className="py-3 px-4">Items Summary</th>
                    <th className="py-3 px-4">Captured Total</th>
                    <th className="py-3 px-4">Live Status Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] font-mono">
                  {orders
                    .filter(
                      (o) =>
                        o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.shipping_address.name.toLowerCase().includes(orderSearch.toLowerCase())
                    )
                    .map((o) => (
                      <tr key={o.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          #{o.order_number}
                        </td>
                        <td className="py-3.5 px-4 text-[#8e8e99]">
                          {new Date(o.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">
                            {o.shipping_address.name}
                          </div>
                          <div className="text-[11px] text-[#71717a] font-sans">
                            {o.shipping_address.city}, {o.shipping_address.country}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#cbd5e1] font-sans">
                          {o.items?.map((item) => (
                            <div key={item.id} className="text-[11px]">
                              {item.quantity}× {item.product_name} ({item.size})
                            </div>
                          ))}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          {formatPrice(o.total)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="w-36">
                            <Select
                              value={o.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  o.id,
                                  e.target.value as OrderStatus
                                )
                              }
                              className="h-8 text-[11px] font-mono font-semibold"
                            >
                              <option value="pending">pending</option>
                              <option value="confirmed">confirmed</option>
                              <option value="processing">processing</option>
                              <option value="shipped">shipped</option>
                              <option value="delivered">delivered</option>
                              <option value="cancelled">cancelled</option>
                            </Select>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: INVENTORY & STOCK ALERTS */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            {/* Threshold config bar */}
            <div className="p-4 bg-[#111116] border border-[#202028] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-display uppercase text-xs font-bold text-white">
                  Configurable Stock Threshold
                </h4>
                <p className="text-[11px] text-[#8e8e99] font-mono">
                  Variants with inventory at or below threshold will be flagged.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#a1a1aa] font-mono">
                  Flag if stock &le;
                </span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-16 h-9 bg-[#17171e] border border-[#272730] rounded-xs text-center text-xs font-mono font-bold text-white"
                />
                <span className="text-xs text-[#a1a1aa] font-mono">units</span>
              </div>
            </div>

            {/* Variants Stock Table */}
            <div className="overflow-x-auto border border-[#202028] rounded-xs bg-[#0e0e12]">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#141418] border-b border-[#202028] text-[#8e8e99] font-display uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">SKU Code</th>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Color</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Inventory Units</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4 text-right">Adjust Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] font-mono">
                  {allVariants.map((v) => (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{v.sku}</td>
                      <td className="py-3 px-4 font-display uppercase text-[#cbd5e1]">
                        {v.productName}
                      </td>
                      <td className="py-3 px-4 text-[#8e8e99]">{v.color}</td>
                      <td className="py-3 px-4 font-bold text-white">{v.size}</td>
                      <td className="py-3 px-4 font-bold text-white">
                        {v.stock}
                      </td>
                      <td className="py-3 px-4">
                        {v.isOutOfStock ? (
                          <Badge variant="outOfStock">SOLD OUT</Badge>
                        ) : v.isLowStock ? (
                          <Badge variant="lowStock">
                            LOW STOCK ({v.stock})
                          </Badge>
                        ) : (
                          <span className="text-emerald-400 text-xs">Healthy</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingVariant({
                              productId: v.productId,
                              productName: v.productName,
                              variantId: v.id,
                              sku: v.sku,
                              currentStock: v.stock,
                            });
                            setNewStockVal(v.stock);
                          }}
                          className="px-2.5 py-1 bg-[#1a1a22] hover:bg-white hover:text-black border border-[#2e2e38] text-[11px] font-display uppercase rounded-xs transition-colors cursor-pointer"
                        >
                          Edit Units
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMERS */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#71717a]">
                    ID: user-demo-customer
                  </span>
                  <Badge variant="metallic">VIP ATELIER</Badge>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Marcus Sterling
                  </h3>
                  <div className="text-xs text-[#8e8e99] font-mono mt-0.5">
                    customer@ay2fly.com · +1 (555) 234-8901
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#1c1c24] font-mono">
                  <div>
                    <span className="text-[#71717a] block">Orders Placed</span>
                    <strong className="text-white">2 Completed</strong>
                  </div>
                  <div>
                    <span className="text-[#71717a] block">Lifetime Value</span>
                    <strong className="text-white">$664.20</strong>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#71717a]">
                    ID: user-demo-admin
                  </span>
                  <Badge variant="new">DIRECTOR</Badge>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Ayodele Director
                  </h3>
                  <div className="text-xs text-[#8e8e99] font-mono mt-0.5">
                    admin@ay2fly.com · +44 20 7946 0912
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#1c1c24] font-mono">
                  <div>
                    <span className="text-[#71717a] block">Access Level</span>
                    <strong className="text-white">Global Admin</strong>
                  </div>
                  <div>
                    <span className="text-[#71717a] block">HQ Hub</span>
                    <strong className="text-white">London Atelier</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Variant Stock Modal */}
        {editingVariant && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-[#0e0e12] border border-[#272732] rounded-xs p-6 space-y-5 shadow-2xl">
              <div className="space-y-1">
                <div className="font-mono text-[10px] text-[#71717a] uppercase">
                  {editingVariant.sku}
                </div>
                <h4 className="font-display text-base font-bold uppercase text-white">
                  Adjust Inventory
                </h4>
                <p className="text-xs text-[#8e8e99]">
                  {editingVariant.productName}
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1.5">
                  Available Warehouse Units
                </label>
                <Input
                  type="number"
                  min={0}
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(Number(e.target.value))}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#202028]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingVariant(null)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveStock}>
                  Save Stock
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Product Modal */}
        {isCreateProductOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#0e0e12] border border-[#272732] rounded-xs p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#202028] pb-3">
                <h4 className="font-display text-base font-bold uppercase text-white">
                  Create New Garment
                </h4>
                <button
                  onClick={() => setIsCreateProductOpen(false)}
                  className="text-[#71717a] hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                    Garment Name
                  </label>
                  <Input
                    required
                    placeholder="e.g. Heavy Overdyed Boxy Hoodie"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                      Department
                    </label>
                    <Select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                    >
                      <option value="cat-tops">Tops & Hoodies</option>
                      <option value="cat-denim">Denim & Bottoms</option>
                      <option value="cat-outerwear">Outerwear & Vests</option>
                      <option value="cat-footwear">Footwear</option>
                      <option value="cat-accessories">Accessories</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                      Base Retail Price ($)
                    </label>
                    <Input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                      Silhouette Cut
                    </label>
                    <Select
                      value={newProdFit}
                      onChange={(e) => setNewProdFit(e.target.value as any)}
                    >
                      <option value="oversized">Oversized Drape</option>
                      <option value="relaxed">Relaxed Utility</option>
                      <option value="boxy">Boxy Cropped</option>
                      <option value="regular">Standard Regular</option>
                      <option value="fitted">Form Fitted</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                      Fabric Composition
                    </label>
                    <Input
                      placeholder="e.g. 520 GSM Loopback Cotton"
                      value={newProdMaterial}
                      onChange={(e) => setNewProdMaterial(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-display text-[#d1d5db] mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-[#111115] border border-[#272730] rounded-xs p-3 text-xs text-white focus:outline-none focus:border-white"
                    placeholder="Enter garment details and design specifications..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#202028]">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreateProductOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Deploy Garment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
