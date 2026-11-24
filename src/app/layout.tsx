import type { Metadata } from "next";
import { Suspense } from "react";
import { Arimo, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Layout/Home/Navbar/Navbar";
import Footer from "@/components/Layout/Home/Footer";
import Providers from "./providers";

const arimo = Arimo({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Oikko Bank | Digital Banking",
    template: "%s | Oikko Bank",
  },
  description:
    "Oikko Bank is a secure digital banking management platform. Manage your bank accounts, transfer funds, track transactions, apply for loans, and enjoy seamless digital banking.",
  keywords: [
    "Oikko Bank",
    "Digital Banking",
    "Online Banking",
    "Bank Management System",
    "Fund Transfer",
    "Loan Management",
    "Financial Management",
  ],
  authors: [{ name: "Oikko Bank" }],
  applicationName: "Oikko Bank",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${arimo.className} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          {children}
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
