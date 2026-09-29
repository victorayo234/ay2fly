"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, ArrowRight, Eye, Calendar, MapPin, CheckCircle2, Clock, Truck, Shield } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { Order, OrderStatus } from "@/types/database";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const query = user?.role === "admin" ? "" : user ? `?userId=${user.id}` : "";
        const res = await fetch(`/api/orders${query}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
          if (data.length > 0) setSelectedOrder(data[0]);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return <Badge variant="emerald">Delivered</Badge>;
      case "shipped":
        return <Badge variant="accent">In Transit</Badge>;
      case "processing":
        return <Badge variant="default" className="bg-blue-100 text-blue-700 border-blue-200">Processing</Badge>;
      case "confirmed":
        return <Badge variant="accent">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="outOfStock">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Badge variant="accent">PURCHASE HISTORY</Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900 mt-2">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track live delivery progress and review past orders.
            </p>
          </div>

          <Link href="/shop">
            <Button variant="outline" size="sm" className="gap-2">
              Browse Latest Drops <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-xs font-mono uppercase text-slate-400">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm">
            <Package className="h-12 w-12 text-slate-400 mx-auto stroke-1" />
            <h3 className="font-display uppercase text-lg font-bold text-slate-900">
              No orders placed yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Your confirmed streetwear purchases will appear here with live transit updates.
            </p>
            <Link href="/shop" className="inline-block pt-2">
              <Button variant="accent" size="md">
                Explore The Shop
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Orders List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-medium uppercase text-slate-500 tracking-wider">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"} Found
              </div>
              <div className="space-y-3">
                {orders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white border-[#ff5500] ring-2 ring-orange-500/20 shadow-md"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          #{order.order_number}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <span className="font-mono font-bold text-[#ff5500]">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-400 truncate">
                        {order.items?.length ?? 0} item(s) · Ships to {order.shipping_address.city}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Order Detail Pane (7 cols) */}
            <div className="lg:col-span-7">
              {selectedOrder ? (
                <div className="p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl space-y-6 sticky top-28 shadow-sm">
                  {/* Top Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-bold text-slate-900">
                          #{selectedOrder.order_number}
                        </span>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-400 uppercase font-medium">
                        Total Amount
                      </div>
                      <div className="font-mono text-xl font-bold text-[#ff5500]">
                        {formatPrice(selectedOrder.total)}
                      </div>
                    </div>
                  </div>

                  {/* Status Progress Track */}
                  <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                    <div className="text-xs font-display uppercase tracking-wider text-slate-900 font-bold flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#ff5500]" />
                      Status: <span className="uppercase text-[#ff5500]">{selectedOrder.status}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-500 ${
                          selectedOrder.status === "cancelled"
                            ? "bg-red-500 w-full"
                            : selectedOrder.status === "delivered"
                            ? "bg-emerald-500 w-full"
                            : selectedOrder.status === "shipped"
                            ? "bg-[#ff5500] w-3/4"
                            : selectedOrder.status === "processing"
                            ? "bg-[#ff5500] w-1/2"
                            : "bg-[#ff5500] w-1/4"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] font-medium text-slate-500 uppercase pt-1">
                      <span>Confirmed</span>
                      <span>Processing</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Purchased Items */}
                  <div className="space-y-3">
                    <h3 className="font-display uppercase tracking-wider text-xs font-bold text-slate-900">
                      Ordered Items ({selectedOrder.items?.length || 0})
                    </h3>
                    <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl bg-white overflow-hidden">
                      {selectedOrder.items?.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-12 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                              <Image
                                src={item.image_url}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-xs font-display uppercase font-bold text-slate-900">
                                {item.product_name}
                              </h4>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                {item.color} · Size {item.size} · Qty {item.quantity}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Unit Price: {formatPrice(item.unit_price)}
                              </div>
                            </div>
                          </div>
                          <div className="font-mono text-xs font-bold text-slate-900">
                            {formatPrice(item.unit_price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address & Totals */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="space-y-2 text-xs">
                      <span className="font-display uppercase tracking-wider text-slate-900 font-bold flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        Shipping Destination
                      </span>
                      <div className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block font-display">
                          {selectedOrder.shipping_address.name}
                        </strong>
                        {selectedOrder.shipping_address.address}
                        <br />
                        {selectedOrder.shipping_address.city},{" "}
                        {selectedOrder.shipping_address.state}{" "}
                        {selectedOrder.shipping_address.postalCode}
                        <br />
                        {selectedOrder.shipping_address.country}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <span className="font-display uppercase tracking-wider text-slate-900 font-bold flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-slate-400" />
                        Order Breakdown
                      </span>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal:</span>
                          <span className="text-slate-900">{formatPrice(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Shipping:</span>
                          <span className="text-slate-900">
                            {selectedOrder.shipping_fee === 0
                              ? "FREE"
                              : formatPrice(selectedOrder.shipping_fee)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Estimated Tax:</span>
                          <span className="text-slate-900">{formatPrice(selectedOrder.tax)}</span>
                        </div>
                        <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1.5 text-sm">
                          <span>Total:</span>
                          <span className="text-[#ff5500]">{formatPrice(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
