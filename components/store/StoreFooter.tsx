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
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#07070A] text-white shadow-[0_-30px_100px_rgba(0,0,0,0.3)]">
      <div className="luxury-container relative px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_0.85fr_0.85fr] md:gap-14">
          <div>
            <h3 className="text-xl font-black tracking-[-0.055em] transition-all duration-300 hover:-translate-y-0.5 hover:text-accent">{settings.get("business_name") || "MWIHO KICKS"}</h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/45">{settings.get("shop_description")}</p>
          </div>
          <div>
            <h4 className="eyebrow text-accent">Contact</h4>
            <div className="mt-5 space-y-3 text-sm text-white/45">
              <div className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.05]">
                <MapPin className="h-4 w-4 text-accent/80" />
                <span>{settings.get("location") || "Mwihoko, Kenya"}</span>
              </div>
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/20 hover:bg-accent/[0.06] hover:text-accent"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
          <div>
            <h4 className="eyebrow text-accent">Follow Us</h4>
            <div className="mt-5 flex flex-wrap gap-3">
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
        <div className="mt-14 border-t border-white/10 pt-7 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
          © {new Date().getFullYear()} {settings.get("business_name") || "MWIHO KICKS"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
