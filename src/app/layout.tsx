import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Civic Voice - Local Governance News",
    template: "%s | Civic Voice"
  },
  description: "Independent journalism focused on municipal and provincial governance. Holding power accountable through investigative reporting and civic engagement.",
  keywords: ["local news", "municipal governance", "provincial politics", "investigative journalism", "civic engagement", "city council", "government accountability"],
  authors: [{ name: "Civic Voice Editorial Team" }],
  creator: "Civic Voice",
  publisher: "Civic Voice",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Civic Voice",
    title: "Civic Voice - Local Governance News",
    description: "Independent journalism focused on municipal and provincial governance. Holding power accountable through investigative reporting.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Civic Voice - Local Governance News",
    description: "Independent journalism focused on municipal and provincial governance.",
    creator: "@civicvoice",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {children}
        <Toaster />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}