"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Settings, LogOut, Store } from "lucide-react";
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
    <aside className="w-full md:w-64 bg-primary text-white md:min-h-screen md:sticky md:top-0">
      <div className="p-4 border-b border-gray-700 flex items-center gap-2">
        <Store className="w-5 h-5" />
        <div>
          <p className="font-bold">MWIHO KICKS</p>
          <p className="text-xs text-gray-400">Admin</p>
        </div>
      </div>
      <nav className="p-3 grid grid-cols-2 md:grid-cols-1 gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                active ? "bg-white text-gray-900" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-700 mt-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
          <Store className="w-4 h-4" />
          View Store
        </Link>
        <button onClick={signOut} className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-300 hover:bg-red-900/40 hover:text-white">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
