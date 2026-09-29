"use client";

import * as React from "react";
import { create } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "metallic" | "accent";

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
              "pointer-events-auto relative flex items-start gap-3.5 p-4 rounded-2xl border shadow-xl bg-white",
              item.variant === "success" &&
                "border-emerald-300 shadow-emerald-500/10",
              item.variant === "error" &&
                "border-red-300 shadow-red-500/10",
              (item.variant === "metallic" || item.variant === "accent") &&
                "border-orange-300 shadow-orange-500/10",
              (!item.variant || item.variant === "default") &&
                "border-slate-200 shadow-slate-900/10"
            )}
          >
            <div className="pt-0.5 shrink-0">
              {item.variant === "success" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              )}
              {item.variant === "error" && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              {(item.variant === "metallic" || item.variant === "accent") && (
                <div className="h-5 w-5 rounded-full bg-[#ff5500] flex items-center justify-center text-white">
                  <Sparkles className="h-3 w-3" />
                </div>
              )}
              {(!item.variant || item.variant === "default") && (
                <Info className="h-5 w-5 text-slate-500" />
              )}
            </div>

            <div className="flex-1 pr-4">
              <div className="font-display uppercase tracking-wider text-xs font-bold text-slate-900">
                {item.title}
              </div>
              {item.description && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
