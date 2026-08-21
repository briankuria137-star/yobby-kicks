import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yobby-kicks.vercel.app"),
  title: "Yobby Kicks | Quality Mtumba Shoes in Mwihoko, Kenya",
  description:
    "Shop quality second-hand and mtumba shoes for men, women, and kids at Yobby Kicks in Mwihoko, Kenya. Browse our collection and order via WhatsApp.",
  keywords: [
    "Yobby Kicks",
    "shoes in Mwihoko",
    "mtumba shoes Mwihoko",
    "second hand shoes Kenya",
    "affordable shoes Kenya",
    "shoes Ruiru",
    "mtumba footwear Kenya"
  ],
  openGraph: {
    title: "Yobby Kicks | Quality Mtumba Shoes in Mwihoko",
    description:
      "Quality second-hand and mtumba footwear in Mwihoko, Kenya.",
    url: "https://yobby-kicks.vercel.app",
    siteName: "Yobby Kicks",
    type: "website",
    locale: "en_KE"
  },
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
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
