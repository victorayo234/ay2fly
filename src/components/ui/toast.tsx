"use client";

import * as React from "react";
import { create } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "metallic";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    const duration = toast.duration || 4000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function toast(props: Omit<ToastItem, "id">) {
  useToastStore.getState().addToast(props);
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={cn(
              "pointer-events-auto relative flex items-start gap-3.5 p-4 rounded-xs border shadow-2xl backdrop-blur-xl",
              item.variant === "success" &&
                "bg-[#0e1713]/95 border-emerald-500/40 text-emerald-200 shadow-[0_4px_24px_rgba(16,185,129,0.15)]",
              item.variant === "error" &&
                "bg-[#1c0e0e]/95 border-red-500/40 text-red-200 shadow-[0_4px_24px_rgba(239,68,68,0.15)]",
              item.variant === "metallic" &&
                "bg-[#141418]/95 border-white/30 text-white shadow-[0_4px_24px_rgba(255,255,255,0.12)]",
              (!item.variant || item.variant === "default") &&
                "bg-[#111115]/95 border-[#2e2e38] text-[#f4f4f6]"
            )}
          >
            <div className="pt-0.5 shrink-0">
              {item.variant === "success" && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              )}
              {item.variant === "error" && (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              {item.variant === "metallic" && (
                <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-neutral-400 to-white" />
              )}
              {(!item.variant || item.variant === "default") && (
                <Info className="h-4 w-4 text-neutral-400" />
              )}
            </div>

            <div className="flex-1 pr-4">
              <div className="font-display uppercase tracking-wider text-xs font-semibold text-white">
                {item.title}
              </div>
              {item.description && (
                <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="absolute top-3.5 right-3 text-[#71717a] hover:text-white transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
