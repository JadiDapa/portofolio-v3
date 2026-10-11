import type { Metadata } from "next";
import localFont from "next/font/local";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers/Providers";
import { Toaster } from "sonner";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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

const DESCRIPTION =
  "Portfolio of Daffa Althaf Ridovani — Software Engineer and Electrical Engineer building software, IoT, AI, electrical and control systems.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Software Engineer`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "Daffa Althaf Ridovani",
    "Software Engineer",
    "Electrical Engineer",
    "IoT",
    "Control & Automation",
    "Indonesia",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Software Engineer`,
    description: DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
