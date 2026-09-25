"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "@/components/ui/toast";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AuthProvider } from "@/lib/auth/auth-context";
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <NuqsAdapter>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <SmoothScrollProvider>
            {children}
            <CartDrawer />
            <ToastContainer />
          </SmoothScrollProvider>
        </AuthProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
