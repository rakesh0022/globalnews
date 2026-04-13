import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import PreferencesProvider from "@/components/providers/PreferencesProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import PageWrapper from "@/components/motion/PageWrapper";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "NewsHub — Stay Informed",
    template: "%s | NewsHub",
  },
  description:
    "Your modern news hub. Get the latest in technology, sports, business, health, and science.",
  keywords: ["news", "technology", "sports", "business", "health", "science"],
  authors: [{ name: "NewsHub" }],
  creator: "NewsHub",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "NewsHub — Stay Informed",
    description: "Your modern news hub. Get the latest breaking news.",
    type: "website",
    locale: "en_US",
    siteName: "NewsHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewsHub — Stay Informed",
    description: "Your modern news hub. Get the latest breaking news.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] dark:bg-[#060b14] text-slate-900 dark:text-slate-100">
        <ThemeProvider>
          <Navbar />

          <main className="flex-1">
            <PreferencesProvider>
              <PageWrapper>{children}</PageWrapper>
            </PreferencesProvider>
          </main>

          <div className="hidden sm:block">
            <Footer />
          </div>

          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
