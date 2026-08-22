import Link from "next/link";
import { createClient } from "@/supabase/server";
import { formatCurrency } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Box,
  DollarSign,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

export default async function AdminDashboard() {
  const supabase: any = await createClient();

  const [
    { count: availableCount },
    { count: soldCount },
    { count: pendingOrders },
    { count: customerCount },
    { data: lowStock },
    { data: stockValue },
    { data: recentOrders },
    { data: allSales },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "available"),

    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "sold"),

    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("customers")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("products")
      .select("id, name, size, stock_quantity, price")
      .eq("status", "available")
      .lt("stock_quantity", 2)
      .order("stock_quantity", { ascending: true })
      .limit(5),

    supabase
      .from("products")
      .select("buying_cost, stock_quantity")
      .eq("status", "available"),

    supabase
      .from("orders")
      .select("id, customer_name, total_amount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("sales")
      .select(
        "selling_price, profit, buying_price, quantity, product_name, created_at"
      ),
  ]);

  const totalStockValue =
    stockValue?.reduce(
      (sum: number, product: any) =>
        sum + Number(product.buying_cost || 0) * Number(product.stock_quantity || 0),
      0
    ) || 0;

  const totalRevenue =
    allSales?.reduce(
      (sum: number, sale: any) => sum + Number(sale.selling_price || 0),
      0
    ) || 0;

  const totalProfit =
    allSales?.reduce(
      (sum: number, sale: any) => sum + Number(sale.profit || 0),
      0
    ) || 0;

  const totalBuyingCost =
    allSales?.reduce(
      (sum: number, sale: any) => sum + Number(sale.buying_price || 0),
      0
    ) || 0;

  const totalProductsSold =
    allSales?.reduce(
      (sum: number, sale: any) => sum + Number(sale.quantity || 1),
      0
    ) || 0;

  const profitMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const outOfStockCount =
    (soldCount || 0) > 0 ? soldCount || 0 : 0;

  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  const todaySales =
    allSales?.filter(
      (sale: any) => new Date(sale.created_at) >= todayStart
    ) || [];

  const todayRevenue = todaySales.reduce(
    (sum: number, sale: any) => sum + Number(sale.selling_price || 0),
    0
  );

  const todayProfit = todaySales.reduce(
    (sum: number, sale: any) => sum + Number(sale.profit || 0),
    0
  );

  const bestSelling = [...(allSales || [])]
    .reduce((products: any[], sale: any) => {
      const existing = products.find(
        (item) => item.name === sale.product_name
      );

      if (existing) {
        existing.quantity += Number(sale.quantity || 1);
      } else {
        products.push({
          name: sale.product_name,
          quantity: Number(sale.quantity || 1),
        });
      }

      return products;
    }, [])
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            MWIHO KICKS
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950">
            Business Dashboard
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            Monitor your inventory, sales, orders, and overall business
            performance from one place.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            <Package className="h-4 w-4" />
            Products
          </Link>

          <Link
            href="/admin/products?new=true"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-gray-100 p-2.5">
              <DollarSign className="h-5 w-5 text-gray-700" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Revenue
            </span>
          </div>

          <p className="mt-5 text-2xl font-black tracking-tight text-gray-950">
            {formatCurrency(totalRevenue)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {formatCurrency(todayRevenue)} today
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-green-50 p-2.5">
              <TrendingUp className="h-5 w-5 text-green-700" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Profit
            </span>
          </div>

          <p className="mt-5 text-2xl font-black tracking-tight text-gray-950">
            {formatCurrency(totalProfit)}
          </p>

          <p className="mt-1 text-xs text-green-600">
            {profitMargin.toFixed(1)}% margin
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-yellow-50 p-2.5">
              <ShoppingCart className="h-5 w-5 text-yellow-700" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Orders
            </span>
          </div>

          <p className="mt-5 text-2xl font-black tracking-tight text-gray-950">
            {pendingOrders || 0}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            pending orders
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <Box className="h-5 w-5 text-blue-700" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Inventory
            </span>
          </div>

          <p className="mt-5 text-2xl font-black tracking-tight text-gray-950">
            {formatCurrency(totalStockValue)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            current buying value
          </p>
        </div>
      </div>

      {/* PERFORMANCE + INVENTORY */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Performance
              </p>
              <h2 className="mt-1 font-bold text-gray-950">
                Sales overview
              </h2>
            </div>

            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="p-5">
              <p className="text-xs text-gray-500">Today</p>
              <p className="mt-2 text-lg font-black text-gray-950">
                {formatCurrency(todayRevenue)}
              </p>
              <p className="mt-1 text-xs text-green-600">
                +{formatCurrency(todayProfit)} profit
              </p>
            </div>

            <div className="p-5">
              <p className="text-xs text-gray-500">All-time sales</p>
              <p className="mt-2 text-lg font-black text-gray-950">
                {totalProductsSold}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                products sold
              </p>
            </div>

            <div className="p-5">
              <p className="text-xs text-gray-500">Buying cost</p>
              <p className="mt-2 text-lg font-black text-gray-950">
                {formatCurrency(totalBuyingCost)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                historical cost
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Profit health
              </p>
              <span className="text-sm font-bold text-gray-950">
                {profitMargin.toFixed(1)}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gray-950 transition-all"
                style={{ width: `${Math.min(Math.max(profitMargin, 0), 100)}%` }}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Inventory
              </p>
              <h2 className="mt-1 font-bold text-gray-950">
                Stock health
              </h2>
            </div>

            <Package className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-1 p-5">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <span className="text-sm text-gray-600">Available</span>
              <span className="font-black text-gray-950">
                {availableCount || 0}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-orange-50 p-4">
              <span className="text-sm text-orange-700">Low stock</span>
              <span className="font-black text-orange-800">
                {lowStock?.length || 0}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <span className="text-sm text-gray-600">Sold</span>
              <span className="font-black text-gray-950">
                {soldCount || 0}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
              <span className="text-sm text-blue-700">Customers</span>
              <span className="font-black text-blue-800">
                {customerCount || 0}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* LOWER GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* RECENT ORDERS */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Activity
              </p>
              <h2 className="mt-1 font-bold text-gray-950">
                Recent orders
              </h2>
            </div>

            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-950"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentOrders?.length ? (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-950">
                      {order.customer_name || "Walk-in customer"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-gray-950">
                      {formatCurrency(order.total_amount)}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-gray-600">
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <ShoppingCart className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-semibold text-gray-600">
                No orders yet
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Customer orders will appear here.
              </p>
            </div>
          )}
        </section>

        {/* BEST SELLERS */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Products
              </p>
              <h2 className="mt-1 font-bold text-gray-950">
                Best sellers
              </h2>
            </div>

            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>

          {bestSelling.length ? (
            <div className="divide-y divide-gray-100">
              {bestSelling.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center gap-4 p-5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-600">
                    {index + 1}
                  </div>

                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-800">
                    {product.name}
                  </p>

                  <span className="text-xs font-bold text-gray-500">
                    {product.quantity} sold
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <BarChart3 className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-semibold text-gray-600">
                No sales data yet
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Best sellers will appear after your first sales.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* LOW STOCK */}
      {lowStock?.length ? (
        <section className="rounded-2xl border border-orange-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-orange-100 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-50 p-2.5">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                  Attention required
                </p>
                <h2 className="mt-1 font-bold text-gray-950">
                  Low stock products
                </h2>
              </div>
            </div>

            <Link
              href="/admin/products"
              className="text-xs font-bold text-gray-600 hover:text-gray-950"
            >
              Manage inventory
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {lowStock.map((product: any) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-950">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Size {product.size} ·{" "}
                    {product.stock_quantity === 0
                      ? "Out of stock"
                      : `${product.stock_quantity} left`}
                  </p>
                </div>

                <Link
                  href={`/admin/products?edit=${product.id}`}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Restock
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* QUICK ACTIONS */}
      <section className="rounded-2xl bg-gray-950 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Quick actions
            </p>
            <h2 className="mt-1 text-xl font-black">
              Keep the store moving.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Link
              href="/admin/products?new=true"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-950 transition hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>

            <Link
              href="/admin/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
