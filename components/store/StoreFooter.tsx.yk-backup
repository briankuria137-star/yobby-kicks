"use client";

import { MessageCircle, Instagram, MapPin } from "lucide-react";

export function StoreFooter({
  settings,
}: {
  settings: Map<string, string>;
}) {
  const whatsapp = settings.get("whatsapp_number");
  const instagram = settings.get("instagram_username");

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">{settings.get("business_name") || "MWIHO KICKS"}</h3>
            <p className="text-gray-300 text-sm">{settings.get("shop_description")}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{settings.get("location") || "Mwihoko, Kenya"}</span>
              </div>
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <div className="flex gap-3">
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@{instagram}</span>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} {settings.get("business_name") || "MWIHO KICKS"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
