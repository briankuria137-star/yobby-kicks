"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Settings,
  LogOut,
  Store,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/supabase/client";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/sales", label: "Sales", icon: TrendingUp },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-full shrink-0 bg-primary text-white md:sticky md:top-0 md:h-screen md:w-64">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <Store className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-bold tracking-wide">MWIHO KICKS</p>
            <p className="text-[10px] uppercase tracking-widest text-white/50">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="grid grid-cols-2 gap-1.5 p-3 md:grid-cols-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  active
                    ? "text-gray-900"
                    : "text-white/45 group-hover:text-white"
                }`}
              />

              <span>{label}</span>

              {active && (
                <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-gray-900 md:block" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-white/10 p-3 md:absolute md:bottom-0 md:left-0 md:w-64">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View Store</span>
        </Link>

        <button
          onClick={signOut}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>

        <p className="mt-3 px-3 text-[9px] uppercase tracking-widest text-white/25">
          MWIHO KICKS • Admin
        </p>
      </div>
    </aside>
  );
}
