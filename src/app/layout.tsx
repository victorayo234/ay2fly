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
  title: "ay2fly | Premium Gen-Z Streetwear & Essentials",
  description:
    "ay2fly is an architectural Gen-Z streetwear label. Oversized silhouettes, heavyweight raw denim, tactical layering, and contemporary footwear.",
  keywords: ["streetwear", "oversized hoodie", "raw denim", "tactical vest", "minimal fashion", "ay2fly"],
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
      className={`${syne.variable} ${manrope.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f6] font-sans flex flex-col selection:bg-white selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
