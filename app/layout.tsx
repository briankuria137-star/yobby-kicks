import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yobby-kicks.vercel.app"),
  title: "Online Store | Quality Products",
  description:
    "Browse quality products from our online store. Explore our collection and order conveniently via WhatsApp.",
  keywords: [
    "online store",
    "quality products",
    "online shopping",
    "Kenya"
  ],
  openGraph: {
    title: "Online Store | Quality Products",
    description:
      "Quality products, conveniently available online.",
    url: "https://yobby-kicks.vercel.app",
    siteName: "Online Store",
    type: "website",
    locale: "en_KE"
  },
  verification: { google: "6t1qdpvNlv88tc9Gyv-W1HplRuWujNyr1mhImhh0VZE" },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-cream text-ink">{children}</body>
    </html>
  );
}
