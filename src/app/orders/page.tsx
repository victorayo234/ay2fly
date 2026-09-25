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
        return <Badge variant="default" className="bg-emerald-500/15 text-emerald-300 border-emerald-500/40">Delivered</Badge>;
      case "shipped":
        return <Badge variant="metallic">In Transit (Shipped)</Badge>;
      case "processing":
        return <Badge variant="default" className="bg-blue-500/15 text-blue-300 border-blue-500/40">Processing</Badge>;
      case "confirmed":
        return <Badge variant="new">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="outOfStock">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6]">
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-[#202028] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Badge variant="metallic">DISPATCH ARCHIVES</Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-2">
              Order History
            </h1>
            <p className="text-xs text-[#8e8e99] font-mono mt-1">
              Historical purchase records, captured unit prices, and tracking status.
            </p>
          </div>

          <Link href="/shop">
            <Button variant="outline" size="sm">
              Explore New Drop <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-xs font-mono uppercase text-[#71717a]">
            Loading historical orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-4">
            <Package className="h-10 w-10 text-[#71717a] mx-auto stroke-1" />
            <h3 className="font-display uppercase text-base font-semibold text-white">
              No orders placed yet
            </h3>
            <p className="text-xs text-[#8e8e99] max-w-sm mx-auto">
              Your confirmed orders will appear here with live transit tracking.
            </p>
            <Link href="/shop" className="inline-block pt-2">
              <Button variant="primary" size="md">
                Browse Atelier
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Orders List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono uppercase text-[#71717a] tracking-wider">
                {orders.length} Records Found
              </div>
              <div className="space-y-3">
                {orders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-5 rounded-xs border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#14141a] border-white/40 shadow-lg"
                          : "bg-[#0e0e12] border-[#202028] hover:border-[#383842] hover:bg-[#121216]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-white">
                          #{order.order_number}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-[#8e8e99]">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <span className="font-mono font-bold text-white">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      <div className="mt-3 text-[11px] text-[#71717a] truncate font-mono">
                        {order.items?.length ?? 0} piece(s) · Sent to {order.shipping_address.city}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Order Detail Pane (7 cols) */}
            <div className="lg:col-span-7">
              {selectedOrder ? (
                <div className="p-6 sm:p-8 bg-[#0e0e12] border border-[#202028] rounded-xs space-y-8 sticky top-28 shadow-2xl">
                  {/* Top Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202028] pb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-bold text-white">
                          #{selectedOrder.order_number}
                        </span>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <p className="text-xs text-[#8e8e99] font-mono mt-1">
                        Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-[#71717a] font-mono uppercase">
                        Total Captured
                      </div>
                      <div className="font-mono text-xl font-bold text-white">
                        {formatPrice(selectedOrder.total)}
                      </div>
                    </div>
                  </div>

                  {/* Status Progress Track */}
                  <div className="p-4 bg-[#121217] border border-[#202028] rounded-xs space-y-3">
                    <div className="text-xs font-display uppercase tracking-wider text-white font-semibold flex items-center gap-2">
                      <Truck className="h-4 w-4 text-white" />
                      Fulfillment Status: <span className="uppercase text-neutral-300">{selectedOrder.status}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-[#202028] rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-500 ${
                          selectedOrder.status === "cancelled"
                            ? "bg-red-500 w-full"
                            : selectedOrder.status === "delivered"
                            ? "bg-emerald-400 w-full"
                            : selectedOrder.status === "shipped"
                            ? "bg-white w-3/4"
                            : selectedOrder.status === "processing"
                            ? "bg-white w-1/2"
                            : "bg-white w-1/4"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-[#71717a] uppercase pt-1">
                      <span>Confirmed</span>
                      <span>Processing</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Purchased Items */}
                  <div className="space-y-3">
                    <h3 className="font-display uppercase tracking-wider text-xs font-bold text-white">
                      Archived Items ({selectedOrder.items?.length || 0})
                    </h3>
                    <div className="divide-y divide-[#1e1e26] border border-[#202028] rounded-xs bg-[#121216]">
                      {selectedOrder.items?.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-11 bg-[#1a1a20] rounded-xs overflow-hidden border border-[#272730] shrink-0">
                              <Image
                                src={item.image_url}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-xs font-display uppercase font-semibold text-white">
                                {item.product_name}
                              </h4>
                              <div className="text-[11px] text-[#71717a] font-mono mt-0.5">
                                {item.color} · Size {item.size} · Qty {item.quantity}
                              </div>
                              <div className="text-[10px] text-[#52525b] font-mono">
                                Historical purchase price: {formatPrice(item.unit_price)}
                              </div>
                            </div>
                          </div>
                          <div className="font-mono text-xs font-bold text-white">
                            {formatPrice(item.unit_price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address & Totals */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#202028]">
                    <div className="space-y-2 text-xs">
                      <span className="font-display uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#71717a]" />
                        Dispatch Destination
                      </span>
                      <div className="text-[#a1a1aa] leading-relaxed font-sans bg-[#121217] p-3 rounded-xs border border-[#202028]">
                        <strong className="text-white block font-display">
                          {selectedOrder.shipping_address.name}
                        </strong>
                        {selectedOrder.shipping_address.address}
                        <br />
                        {selectedOrder.shipping_address.city},{" "}
                        {selectedOrder.shipping_address.state}{" "}
                        {selectedOrder.shipping_address.postal_code}
                        <br />
                        {selectedOrder.shipping_address.country}
                        <br />
                        <span className="text-[#71717a] font-mono block pt-1">
                          {selectedOrder.shipping_address.phone}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs bg-[#121217] p-3 rounded-xs border border-[#202028]">
                      <span className="font-display uppercase tracking-wider text-white font-semibold block">
                        Accounting Breakdown
                      </span>
                      <div className="space-y-1.5 pt-1 text-[#8e8e99]">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-mono text-white">
                            {formatPrice(selectedOrder.subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span className="font-mono text-white">
                            {selectedOrder.shipping === 0
                              ? "FREE"
                              : formatPrice(selectedOrder.shipping)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span className="font-mono text-white">
                            {formatPrice(selectedOrder.tax)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#202028]">
                          <span className="font-display uppercase">Total</span>
                          <span className="font-mono">
                            {formatPrice(selectedOrder.total)}
                          </span>
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
