import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ay2fly | Bold Gen-Z Streetwear & Everyday Drops",
  description:
    "Lagos energy. Global streetwear craft. Discover vibrant hoodies, selvedge denim, heavyweight tees, and limited drops from ay2fly.",
  keywords: ["streetwear", "oversized hoodie", "selvedge denim", "joggers", "graphic tees", "ay2fly", "lagos fashion"],
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans flex flex-col selection:bg-[#ff5500] selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
