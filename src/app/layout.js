"use client";

import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Remove metadata export for client component usage (or move to a separate layout.server.js if server metadata is strict requirement, but for this specific request, converting to client component to use hooks is the direct path for conditional rendering based on pathname without complex route groups).
// Alternatively, keep layout server-side and use a client wrapper. But straightforward solution for "hide in path" is conditioned rendering.
// Since user asked to edit layout.js directly:

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen flex flex-col overflow-x-hidden bg-[#1c1917]`}
      >
        <Toaster position="top-center" richColors/>
        {!isDashboard && <Navbar />}
        {children}
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}

