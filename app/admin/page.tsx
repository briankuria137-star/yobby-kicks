import Link from "next/link";
import { createClient } from "@/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Box,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Package,
  Plus,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

function percentage(value: number, total: number) {
  if (!total) return 0;
  return (value / total) * 100;
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function getPulse(margin: number, pending: number, lowStock: number) {
  if (pending >= 5 || lowStock >= 5) {
    return {
      label: "Needs Attention",
      tone: "text-amber-300",
      dot: "bg-amber-300",
    };
  }

  if (margin >= 35 && pending < 3) {
    return {
      label: "Strong",
      tone: "text-lime-300",
      dot: "bg-lime-300",
    };
  }

  return {
    label: "Stable",
    tone: "text-violet-300",
    dot: "bg-violet-300",
  };
}

export default async function AdminDashboard() {
  const supabase: any = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("*");

  const settingsMap = new Map<string, string>(
    settings?.map(
      (s: any) => [s.key, s.value] as [string, string]
    ) || []
  );

  const businessName =
    settingsMap.get("business_name") || "Your Business";

  const [
    availableResult,
    soldResult,
    pendingResult,
    productsResult,
    salesResult,
    ordersResult,
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
      .from("products")
      .select(
        "id, name, category, size, price, buying_cost, stock_quantity, status, created_at"
      )
      .order("created_at", { ascending: false }),

    supabase
      .from("sales")
      .select(
        "id, product_id, product_name, selling_price, buying_price, profit, quantity, customer_name, created_at"
      )
      .order("created_at", { ascending: false }),

    supabase
      .from("orders")
      .select(
        "id, customer_name, total_amount, status, payment_status, delivery_status, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const availableCount = availableResult.count || 0;
  const soldCount = soldResult.count || 0;
  const pendingOrders = pendingResult.count || 0;

  const products = productsResult.data || [];
  const sales = salesResult.data || [];
  const recentOrders = ordersResult.data || [];

  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const previousWeekStart = new Date(weekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const monthStart = new Date(now);
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const availableProducts = products.filter(
    (product: any) => product.status === "available"
  );

  const lowStock = availableProducts
    .filter((product: any) => product.stock_quantity < 2)
    .sort((a: any, b: any) => a.stock_quantity - b.stock_quantity);

  const criticalStock = availableProducts.filter(
    (product: any) => product.stock_quantity === 0
  ).length;

  const healthyStock = availableProducts.filter(
    (product: any) => product.stock_quantity >= 2
  ).length;

  const stockValue = availableProducts.reduce(
    (sum: number, product: any) =>
      sum + (product.buying_cost || 0) * (product.stock_quantity || 0),
    0
  );

  const todaySales = sales.filter(
    (sale: any) => new Date(sale.created_at) >= todayStart
  );

  const yesterdaySales = sales.filter((sale: any) => {
    const date = new Date(sale.created_at);
    return date >= yesterdayStart && date < todayStart;
  });

  const weekSales = sales.filter(
    (sale: any) => new Date(sale.created_at) >= weekStart
  );

  const previousWeekSales = sales.filter((sale: any) => {
    const date = new Date(sale.created_at);
    return date >= previousWeekStart && date < weekStart;
  });

  const monthSales = sales.filter(
    (sale: any) => new Date(sale.created_at) >= monthStart
  );

  const sumRevenue = (items: any[]) =>
    items.reduce(
      (sum: number, sale: any) => sum + (sale.selling_price || 0),
      0
    );

  const sumProfit = (items: any[]) =>
    items.reduce(
      (sum: number, sale: any) => sum + (sale.profit || 0),
      0
    );

  const todayRevenue = sumRevenue(todaySales);
  const todayProfit = sumProfit(todaySales);

  const yesterdayRevenue = sumRevenue(yesterdaySales);

  const weekRevenue = sumRevenue(weekSales);
  const weekProfit = sumProfit(weekSales);

  const previousWeekRevenue = sumRevenue(previousWeekSales);

  const monthRevenue = sumRevenue(monthSales);
  const monthProfit = sumProfit(monthSales);

  const totalRevenue = sumRevenue(sales);
  const totalProfit = sumProfit(sales);
  const totalBuyingCost = sales.reduce(
    (sum: number, sale: any) => sum + (sale.buying_price || 0),
    0
  );

  const totalUnitsSold = sales.reduce(
    (sum: number, sale: any) => sum + (sale.quantity || 1),
    0
  );

  const profitMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const todayChange =
    yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : 0;

  const weekChange =
    previousWeekRevenue > 0
      ? ((weekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100
      : 0;

  const pulse = getPulse(profitMargin, pendingOrders, lowStock.length);

  const topProducts = Object.values(
    sales.reduce((groups: Record<string, any>, sale: any) => {
      const key = sale.product_id || sale.product_name;

      if (!groups[key]) {
        groups[key] = {
          name: sale.product_name,
          units: 0,
          revenue: 0,
          profit: 0,
        };
      }

      groups[key].units += sale.quantity || 1;
      groups[key].revenue += sale.selling_price || 0;
      groups[key].profit += sale.profit || 0;

      return groups;
    }, {})
  )
    .sort((a: any, b: any) => b.units - a.units)
    .slice(0, 5);

  const slowMovingProducts = availableProducts.filter(
    (product: any) =>
      !sales.some((sale: any) => sale.product_id === product.id)
  );

  const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  let insight = "Your store is ready for its next sale.";
  let insightDetail =
    "Keep adding quality inventory and watch which products move fastest.";

  if (pendingOrders >= 3) {
    insight = `${pendingOrders} orders need attention.`;
    insightDetail =
      "Clearing your order queue quickly can improve customer experience and reduce missed sales.";
  } else if (lowStock.length >= 3) {
    insight = `${lowStock.length} products are running low.`;
    insightDetail =
      "Review your inventory before the next sourcing trip so your strongest products stay available.";
  } else if (margin >= 35) {
    insight = "Your margins are looking healthy.";
    insightDetail =
      "Products generating strong margins are worth tracking closely when planning your next stock purchase.";
  } else if (slowMovingProducts.length > 0) {
    insight = `${slowMovingProducts.length} products have no recorded sales.`;
    insightDetail =
      "Consider featuring slow movers, adjusting pricing, or creating a limited-time offer.";
  }

  const activity = [
    ...recentOrders.map((order: any) => ({
      type: "order",
      title: `Order from ${order.customer_name || "Customer"}`,
      detail: `${order.status.replaceAll("_", " ")} · ${formatCurrency(
        order.total_amount || 0
      )}`,
      date: order.created_at,
    })),
    ...sales.slice(0, 5).map((sale: any) => ({
      type: "sale",
      title: `${sale.product_name} sold`,
      detail: `Profit ${formatCurrency(sale.profit || 0)}`,
      date: sale.created_at,
    })),
  ]
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 7);

  return (
    <div className="min-h-full bg-[#09090b] text-white">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-300 shadow-[0_0_10px_rgba(190,242,100,0.8)]" />
            YK// SYSTEM ONLINE
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Command Center
          </h1>

          <p className="mt-1 text-sm text-white/75">
            Your business, at a glance.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#15151b] px-3 py-2.5 text-xs font-bold transition hover:border-violet-400/40 hover:bg-violet-500/10"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-3 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400"
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
          </Link>
        </div>
      </div>

      {/* BUSINESS PULSE */}
      <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-950 via-[#111116] to-[#09090b] p-5 shadow-2xl sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70">
                YK// BUSINESS PULSE
              </p>
              <p className="mt-1 text-sm font-semibold">
                Today&apos;s performance
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/20 px-3 py-1.5">
              <span
                className={`h-2 w-2 rounded-full ${pulse.dot} shadow-[0_0_10px_currentColor]`}
              />
              <span className={`text-[10px] font-bold ${pulse.tone}`}>
                {pulse.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/70">
                Revenue
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight">
                {formatCurrency(todayRevenue)}
              </p>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-bold">
                {todayChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-lime-300" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-pink-300" />
                )}
                <span
                  className={
                    todayChange >= 0 ? "text-lime-300" : "text-pink-300"
                  }
                >
                  {Math.abs(todayChange).toFixed(1)}%
                </span>
                <span className="text-white/60">vs yesterday</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/70">
                Profit
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight text-lime-300">
                {formatCurrency(todayProfit)}
              </p>
              <p className="mt-1 text-[10px] text-white/65">
                {formatPercent(
                  todayRevenue > 0
                    ? (todayProfit / todayRevenue) * 100
                    : 0
                )}{" "}
                margin
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/70">
                Orders
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight">
                {pendingOrders}
              </p>
              <p className="mt-1 text-[10px] text-white/65">
                awaiting action
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/70">
                Stock Capital
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight">
                {formatCurrency(stockValue)}
              </p>
              <p className="mt-1 text-[10px] text-white/65">
                {availableCount} available products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI GRID */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "This Week",
            value: formatCurrency(weekRevenue),
            sub: `${formatCurrency(weekProfit)} profit`,
            icon: TrendingUp,
            accent: "text-violet-300",
          },
          {
            label: "This Month",
            value: formatCurrency(monthRevenue),
            sub: `${formatCurrency(monthProfit)} profit`,
            icon: BarChart3,
            accent: "text-pink-300",
          },
          {
            label: "All-Time Profit",
            value: formatCurrency(totalProfit),
            sub: `${formatPercent(margin)} margin`,
            icon: CircleDollarSign,
            accent: "text-lime-300",
          },
          {
            label: "Units Sold",
            value: totalUnitsSold.toString(),
            sub: `${soldCount} sold products`,
            icon: Package,
            accent: "text-cyan-300",
          },
        ].map(({ label, value, sub, icon: Icon, accent }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/[0.08] bg-[#111116] p-4 transition hover:border-white/20 hover:bg-[#15151b]"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
                {label}
              </span>
              <Icon className={`h-4 w-4 ${accent}`} />
            </div>
            <p className="text-lg font-black tracking-tight sm:text-xl">
              {value}
            </p>
            <p className="mt-1 text-[10px] text-white/65">{sub}</p>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        {/* SALES MOMENTUM */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#111116] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-violet-300">
                YK// SALES MOMENTUM
              </p>
              <h2 className="mt-1 text-lg font-black">Performance snapshot</h2>
            </div>

            <Activity className="h-5 w-5 text-white/60" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
              <p className="text-[10px] uppercase tracking-wider text-white/65">
                Weekly Revenue
              </p>
              <p className="mt-2 text-2xl font-black">
                {formatCurrency(weekRevenue)}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#15151b]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          percentage(
                            weekRevenue,
                            Math.max(monthRevenue, weekRevenue)
                          ),
                          4
                        ),
                        100
                      )}%`,
                    }}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    weekChange >= 0 ? "text-lime-300" : "text-pink-300"
                  }`}
                >
                  {weekChange >= 0 ? "+" : ""}
                  {weekChange.toFixed(1)}%
                </span>
              </div>

              <p className="mt-2 text-[10px] text-white/60">
                compared with previous week
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
              <p className="text-[10px] uppercase tracking-wider text-white/65">
                Gross Margin
              </p>
              <p className="mt-2 text-2xl font-black text-lime-300">
                {formatPercent(profitMargin)}
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#15151b]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-300"
                  style={{
                    width: `${Math.min(Math.max(profitMargin, 2), 100)}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[10px] text-white/60">
                {formatCurrency(totalProfit)} gross profit
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/[0.06] bg-black/20">
            <div className="p-3 text-center">
              <p className="text-[9px] uppercase tracking-wider text-white/60">
                Today
              </p>
              <p className="mt-1 text-sm font-black">
                {todaySales.length}
              </p>
            </div>
            <div className="p-3 text-center">
              <p className="text-[9px] uppercase tracking-wider text-white/60">
                Week
              </p>
              <p className="mt-1 text-sm font-black">
                {weekSales.length}
              </p>
            </div>
            <div className="p-3 text-center">
              <p className="text-[9px] uppercase tracking-wider text-white/60">
                Month
              </p>
              <p className="mt-1 text-sm font-black">
                {monthSales.length}
              </p>
            </div>
          </div>
        </section>

        {/* INVENTORY RADAR */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#111116] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-pink-300">
                YK// INVENTORY RADAR
              </p>
              <h2 className="mt-1 text-lg font-black">Stock health</h2>
            </div>

            <Link
              href="/admin/products"
              className="text-[10px] font-bold text-white/70 transition hover:text-white"
            >
              Manage →
            </Link>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-red-400/10 bg-red-500/5 p-3 text-center">
              <p className="text-xl font-black text-red-300">
                {criticalStock}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-wider text-white/60">
                Critical
              </p>
            </div>

            <div className="rounded-2xl border border-amber-400/10 bg-amber-500/5 p-3 text-center">
              <p className="text-xl font-black text-amber-300">
                {lowStock.length}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-wider text-white/60">
                Low
              </p>
            </div>

            <div className="rounded-2xl border border-lime-400/10 bg-lime-500/5 p-3 text-center">
              <p className="text-xl font-black text-lime-300">
                {healthyStock}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-wider text-white/60">
                Healthy
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex justify-between text-[9px] uppercase tracking-wider">
              <span className="text-white/60">Capital in inventory</span>
              <span className="font-bold text-white/60">
                {formatCurrency(stockValue)}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#15151b]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-400"
                style={{
                  width: `${Math.min(
                    percentage(healthyStock, Math.max(availableProducts.length, 1)),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {lowStock.length > 0 ? (
            <div className="space-y-2">
              {lowStock.slice(0, 3).map((product: any) => (
                <Link
                  key={product.id}
                  href={`/admin/products?edit=${product.id}`}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 p-3 transition hover:border-pink-400/20"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">
                      {product.name}
                    </p>
                    <p className="text-[9px] text-white/60">
                      Size {product.size}
                    </p>
                  </div>

                  <span className="shrink-0 text-[9px] font-black uppercase text-amber-300">
                    {product.stock_quantity === 0
                      ? "Out"
                      : `${product.stock_quantity} left`}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-lime-400/10 bg-lime-500/5 p-3 text-center text-xs text-lime-300">
              Inventory is looking healthy.
            </div>
          )}
        </section>
      </div>

      {/* LOWER GRID */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* TOP PERFORMERS */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#111116] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-300">
                YK// WHAT&apos;S MOVING
              </p>
              <h2 className="mt-1 text-lg font-black">Top performers</h2>
            </div>

            <Zap className="h-5 w-5 text-cyan-300" />
          </div>

          {topProducts.length > 0 ? (
            <div className="space-y-2">
              {topProducts.map((product: any, index: number) => (
                <div
                  key={product.name}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-black/20 p-3"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                      index === 0
                        ? "bg-violet-500 text-white"
                        : "bg-[#15151b] text-white/70"
                    }`}
                  >
                    #{index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-[9px] text-white/60">
                      {product.units} units ·{" "}
                      {formatCurrency(product.revenue)} revenue
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-lime-300">
                      {formatCurrency(product.profit)}
                    </p>
                    <p className="text-[8px] uppercase tracking-wider text-white/55">
                      profit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.08] p-8 text-center">
              <Package className="mx-auto h-8 w-8 text-white/75" />
              <p className="mt-3 text-sm font-semibold text-white/50">
                No sales data yet
              </p>
              <p className="mt-1 text-[10px] text-white/55">
                Your top performers will appear here after your first sales.
              </p>
            </div>
          )}
        </section>

        {/* ACTION CENTER */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#111116] p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-300">
              YK// ACTION CENTER
            </p>
            <h2 className="mt-1 text-lg font-black">
              Things that need attention
            </h2>
          </div>

          <div className="space-y-2">
            {pendingOrders > 0 && (
              <Link
                href="/admin/orders"
                className="group flex items-center gap-3 rounded-2xl border border-amber-400/10 bg-amber-500/5 p-3 transition hover:border-amber-400/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                  <ShoppingCart className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold">
                    {pendingOrders} pending order
                    {pendingOrders === 1 ? "" : "s"}
                  </p>
                  <p className="text-[9px] text-white/60">
                    Review and process your order queue.
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-white/50 transition group-hover:translate-x-1" />
              </Link>
            )}

            {lowStock.length > 0 && (
              <Link
                href="/admin/products"
                className="group flex items-center gap-3 rounded-2xl border border-red-400/10 bg-red-500/5 p-3 transition hover:border-red-400/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold">
                    {lowStock.length} low-stock product
                    {lowStock.length === 1 ? "" : "s"}
                  </p>
                  <p className="text-[9px] text-white/60">
                    Review inventory before your next sourcing trip.
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-white/50 transition group-hover:translate-x-1" />
              </Link>
            )}

            {slowMovingProducts.length > 0 && (
              <Link
                href="/admin/products"
                className="group flex items-center gap-3 rounded-2xl border border-violet-400/10 bg-violet-500/5 p-3 transition hover:border-violet-400/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                  <Clock3 className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold">
                    {slowMovingProducts.length} product
                    {slowMovingProducts.length === 1 ? "" : "s"} with no sales
                  </p>
                  <p className="text-[9px] text-white/60">
                    Consider featuring or repricing slow movers.
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-white/50 transition group-hover:translate-x-1" />
              </Link>
            )}

            {pendingOrders === 0 &&
              lowStock.length === 0 &&
              slowMovingProducts.length === 0 && (
                <div className="rounded-2xl border border-lime-400/10 bg-lime-500/5 p-5 text-center">
                  <CheckCircle2 className="mx-auto h-6 w-6 text-lime-300" />
                  <p className="mt-2 text-xs font-bold text-lime-200">
                    All systems looking good.
                  </p>
                  <p className="mt-1 text-[9px] text-white/60">
                    No immediate actions required.
                  </p>
                </div>
              )}
          </div>
        </section>
      </div>

      {/* SMART INSIGHT */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-violet-400/15 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/5 to-transparent p-5 sm:p-6">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-violet-300">
              YK// BUSINESS INSIGHT
            </p>
            <h2 className="mt-1 text-sm font-black">{insight}</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-white/70">
              {insightDetail}
            </p>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#111116] p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/65">
              YK// LIVE FEED
            </p>
            <h2 className="mt-1 text-lg font-black">Recent activity</h2>
          </div>

          <Activity className="h-5 w-5 text-white/55" />
        </div>

        {activity.length > 0 ? (
          <div className="divide-y divide-white/5">
            {activity.map((item: any, index: number) => (
              <div
                key={`${item.date}-${index}`}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                    item.type === "sale"
                      ? "bg-lime-400/10 text-lime-300"
                      : "bg-violet-400/10 text-violet-300"
                  }`}
                >
                  {item.type === "sale" ? (
                    <CircleDollarSign className="h-4 w-4" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{item.title}</p>
                  <p className="truncate text-[9px] text-white/60">
                    {item.detail}
                  </p>
                </div>

                <p className="shrink-0 text-[9px] text-white/55">
                  {formatDate(item.date)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Box className="mx-auto h-7 w-7 text-white/10" />
            <p className="mt-2 text-xs text-white/60">
              Activity will appear here as your store gets busy.
            </p>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <div className="flex flex-col gap-2 py-6 text-[9px] uppercase tracking-[0.18em] text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <span>{businessName} CONTROL SYSTEM</span>
        <span>{formatDate(now.toISOString())}</span>
      </div>
    </div>
  );
}
