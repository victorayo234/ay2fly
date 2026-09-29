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
      <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
        <Navbar />
        <main className="pt-36 pb-24 max-w-md mx-auto px-4 text-center space-y-6 w-full">
          <div className="p-8 bg-white border border-slate-200/80 rounded-3xl space-y-5 shadow-xl">
            <div className="h-16 w-16 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase text-slate-900">
                Admin Access Required
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                {!user
                  ? "You must be signed in with an authorized admin account to access the dashboard."
                  : "Your current account does not have administrator privileges. Please sign in with an admin account."}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login?redirect=/admin" className="w-full">
                <Button variant="accent" size="lg" className="w-full shadow-lg shadow-orange-500/20 active:scale-95">
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
        variant: "success",
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
      description: newProdDesc || "Heavyweight premium streetwear piece.",
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
          sku: `${slug.toUpperCase().slice(0, 6)}-BLK-S`,
          size: "S",
          color: "Pitch Black",
          stock: 12,
        },
        {
          id: `var-${Date.now()}-2`,
          product_id: "",
          sku: `${slug.toUpperCase().slice(0, 6)}-BLK-M`,
          size: "M",
          color: "Pitch Black",
          stock: 15,
        },
        {
          id: `var-${Date.now()}-3`,
          product_id: "",
          sku: `${slug.toUpperCase().slice(0, 6)}-BLK-L`,
          size: "L",
          color: "Pitch Black",
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
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
        toast({
          title: "GARMENT CREATED",
          description: `${newProdName} added to the live catalog.`,
          variant: "success",
        });
      }
    } catch (e) {
      toast({
        title: "CREATION ERROR",
        description: "Failed to persist new garment to database.",
        variant: "error",
      });
    } finally {
      setIsCreateProductOpen(false);
      setNewProdName("");
      setNewProdDesc("");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 bg-white border border-slate-200 p-2 rounded-2xl flex items-center justify-center shadow-sm">
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
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900">
                  Store Admin
                </h1>
                <Badge variant="accent">LIVE DATABASE</Badge>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Logged in as {user.full_name} ({user.email}) · Role: {user.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync DB
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setIsCreateProductOpen(true)}
              className="gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 text-xs"
            >
              <Plus className="h-4 w-4" />
              New Garment
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "products", label: `Products (${products.length})`, icon: ShoppingBag },
            { id: "orders", label: `Orders (${orders.length})`, icon: Package },
            { id: "inventory", label: `Inventory & Alerts (${lowStockCount + outOfStockCount})`, icon: AlertTriangle },
            { id: "customers", label: "Customers", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-display uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  active
                    ? "bg-slate-900 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
              <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                  <span>Gross Sales</span>
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-display font-extrabold text-slate-900">
                  {formatPrice(totalRevenue)}
                </div>
                <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  +18.4% vs last drop cycle
                </div>
              </div>

              <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                  <span>Total Orders</span>
                  <Package className="h-4 w-4 text-slate-400" />
                </div>
                <div className="text-3xl font-display font-extrabold text-slate-900">
                  {orders.length}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {totalItemsSold} pieces ordered
                </div>
              </div>

              <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                  <span>Active Catalog</span>
                  <ShoppingBag className="h-4 w-4 text-slate-400" />
                </div>
                <div className="text-3xl font-display font-extrabold text-slate-900">
                  {products.length}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {allVariants.length} total SKUs active
                </div>
              </div>

              <div className="p-6 bg-white border border-amber-200 rounded-3xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-amber-700 text-xs font-semibold uppercase">
                  <span>Inventory Alerts</span>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-3xl font-display font-extrabold text-amber-600">
                  {lowStockCount + outOfStockCount}
                </div>
                <div className="text-[11px] text-amber-700 font-medium">
                  {lowStockCount} low stock · {outOfStockCount} sold out
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display text-sm font-bold uppercase text-slate-900">
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-[#ff5500] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  View All Orders <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-medium uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">
                          #{ord.order_number}
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-sans">
                          {ord.shipping_address.name}
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-sans">
                          {ord.items?.length || 0} piece(s)
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {formatPrice(ord.total)}
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant={
                              ord.status === "delivered"
                                ? "emerald"
                                : ord.status === "shipped"
                                ? "accent"
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
              <div className="text-xs text-slate-500 font-medium">
                Showing {products.length} garments in database
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-display uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Cut</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Variants</th>
                    <th className="py-3 px-4">Total Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {products
                    .filter((p) =>
                      p.name.toLowerCase().includes(productSearch.toLowerCase())
                    )
                    .map((p) => {
                      const totalStock =
                        p.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-10 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
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
                                  className="font-display uppercase font-bold text-slate-900 hover:text-[#ff5500] hover:underline block"
                                >
                                  {p.name}
                                </Link>
                                <span className="text-[11px] text-slate-500 font-sans">
                                  {p.material}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 uppercase text-slate-700 font-sans">
                            {p.fit}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {formatPrice(p.sale_price ?? p.price)}
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-sans">
                            {p.variants?.length || 0} variants
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={
                                totalStock === 0
                                  ? "text-red-500 font-bold"
                                  : totalStock <= 5
                                  ? "text-amber-600 font-bold"
                                  : "text-emerald-600 font-bold"
                              }
                            >
                              {totalStock} units
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={p.status === "active" ? "emerald" : "outOfStock"}>
                              {p.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link href={`/products/${p.slug}`} target="_blank">
                              <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer" title="View product page">
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
              <div className="text-xs text-slate-500 font-medium">
                Live database order management
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-display uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order Number</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer & Address</th>
                    <th className="py-3 px-4">Items Summary</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {orders
                    .filter(
                      (o) =>
                        o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.shipping_address.name.toLowerCase().includes(orderSearch.toLowerCase())
                    )
                    .map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          #{o.order_number}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(o.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 font-sans">
                            {o.shipping_address.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-sans">
                            {o.shipping_address.city}, {o.shipping_address.country}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-sans">
                          {o.items?.map((item) => (
                            <div key={item.id} className="text-[11px]">
                              {item.quantity}× {item.product_name} ({item.size})
                            </div>
                          ))}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#ff5500]">
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
                              className="h-8 text-[11px] font-medium"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
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
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h4 className="font-display uppercase text-xs font-bold text-slate-900">
                  Stock Alert Threshold
                </h4>
                <p className="text-[11px] text-slate-500">
                  Variants with inventory at or below threshold will be flagged.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 font-medium">
                  Alert if stock &le;
                </span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-16 h-9 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-900 focus:outline-none focus:border-[#ff5500]"
                />
                <span className="text-xs text-slate-600 font-medium">units</span>
              </div>
            </div>

            {/* Variants Stock Table */}
            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-display uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Color</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {allVariants.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{v.sku}</td>
                      <td className="py-3 px-4 font-display uppercase text-slate-700">
                        {v.productName}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-sans">{v.color}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{v.size}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
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
                          <span className="text-emerald-600 font-semibold text-xs">Healthy</span>
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
                          className="px-3 py-1 bg-slate-100 hover:bg-[#ff5500] hover:text-white border border-slate-200 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Edit Stock
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
              <div className="p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-400">
                    ID: user-demo-customer
                  </span>
                  <Badge variant="accent">VIP MEMBER</Badge>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Marcus Sterling
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    customer@ay2fly.com · +1 (555) 234-8901
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 font-mono">
                  <div>
                    <span className="text-slate-400 block">Orders Placed</span>
                    <strong className="text-slate-900">2 Completed</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Lifetime Value</span>
                    <strong className="text-[#ff5500]">$664.20</strong>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-400">
                    ID: user-demo-admin
                  </span>
                  <Badge variant="emerald">ADMINISTRATOR</Badge>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Ayodele Director
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    admin@ay2fly.com · +44 20 7946 0912
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 font-mono">
                  <div>
                    <span className="text-slate-400 block">Role</span>
                    <strong className="text-slate-900">Store Administrator</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">HQ</span>
                    <strong className="text-slate-900">Lagos / London</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Variant Stock Modal */}
        {editingVariant && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="space-y-1">
                <div className="font-mono text-[10px] text-slate-400 uppercase">
                  {editingVariant.sku}
                </div>
                <h4 className="font-display text-base font-bold uppercase text-slate-900">
                  Update Inventory
                </h4>
                <p className="text-xs text-slate-500">
                  {editingVariant.productName}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Available Warehouse Stock
                </label>
                <Input
                  type="number"
                  min={0}
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(Number(e.target.value))}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingVariant(null)}
                >
                  Cancel
                </Button>
                <Button variant="accent" size="sm" onClick={handleSaveStock}>
                  Save Stock
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Product Modal */}
        {isCreateProductOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-display text-base font-bold uppercase text-slate-900">
                  Create New Garment
                </h4>
                <button
                  onClick={() => setIsCreateProductOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Garment Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Heavy Orange Boxy Hoodie"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Garment Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#ff5500]"
                    placeholder="Enter garment details and fit description..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsCreateProductOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent" size="sm">
                    Publish Garment
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
