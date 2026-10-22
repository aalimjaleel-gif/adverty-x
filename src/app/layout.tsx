import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Adverty X — Digital Agency, Academy & Subscriptions",
  description: "Modern digital solutions including web development, business automation, social media management, paid ads, expert courses, and premium digital subscriptions.",
  keywords: [
    "digital agency",
    "web development",
    "website redesign",
    "automation",
    "social media management",
    "video editing add-on",
    "online academy",
    "digital subscriptions",
  ],
  authors: [{ name: "Adverty X" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakarta.className} min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-brand-500 selection:text-white`}>
        <Navbar />
        <main className="flex-1 pb-16 lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
