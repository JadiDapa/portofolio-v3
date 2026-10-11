import type { Metadata } from "next";
import localFont from "next/font/local";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers/Providers";
import { Toaster } from "sonner";

const generalSans = localFont({
  src: "./fonts/GeneralSans-Variable.woff2",
  variable: "--font-sans",
  weight: "300 700",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Tall condensed display face for the footer wordmark
const anton = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Daffa Althaf Ridovani | Software Engineer",
  description:
    "Portfolio of Daffa Althaf Ridovani — Software Engineer and Electrical Engineer building web, app, AI, hardware and IoT projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        geistSans.variable,
        geistMono.variable,
        generalSans.variable,
        anton.variable,
      )}
      suppressHydrationWarning
      lang="en"
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <Providers>
          <Toaster richColors position="top-right" />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
