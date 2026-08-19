import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MWIHO KICKS | Quality Mtumba Footwear in Mwihoko, Kenya",
  description:
    "Browse quality second-hand shoes for men, women, and kids at MWIHO KICKS in Mwihoko, Kenya. Order via WhatsApp.",
  openGraph: {
    title: "MWIHO KICKS",
    description: "Quality mtumba footwear in Mwihoko, Kenya",
    type: "website",
  },
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
