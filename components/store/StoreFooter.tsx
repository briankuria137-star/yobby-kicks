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
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#09090B] text-white">
      <div className="luxury-container relative px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          <div>
            <h3 className="text-lg font-black tracking-[-0.04em] transition-colors duration-300 hover:text-accent">{settings.get("business_name") || "MWIHO KICKS"}</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">{settings.get("shop_description")}</p>
          </div>
          <div>
            <h4 className="eyebrow text-accent">Contact</h4>
            <div className="mt-4 space-y-3 text-sm text-white/45">
              <div className="flex items-center gap-2.5 transition-colors duration-300 hover:text-white">
                <MapPin className="h-4 w-4 text-accent/80" />
                <span>{settings.get("location") || "Mwihoko, Kenya"}</span>
              </div>
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:text-accent"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <div className="mt-4 flex gap-3">
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-white/55 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@{instagram}</span>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
          © {new Date().getFullYear()} {settings.get("business_name") || "MWIHO KICKS"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
