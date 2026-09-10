import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LexGuard — Know your rights. Document everything.",
  description:
    "LexGuard is a client-side attorney accountability and case documentation platform for Texas and California: plain-language rights guides (EN/ES), a timestamped case journal, a neutral red-flag rules engine, and a remedy router to state bar discipline, Client Security Funds, and fee arbitration.",
  keywords: ["attorney accountability", "state bar complaint", "client security fund", "legal client rights", "fee dispute", "Texas", "California"],
  robots: { index: false, follow: false }, // privacy: sensitive audience, no indexing (PRD §9.2)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
