import { createClient } from "@/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Box,
} from "lucide-react";

export default async function AdminDashboard() {
  const supabase: any = await createClient();

  // Get counts
  const { count: availableCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "available");

  const { count: soldCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "sold");

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Get low stock (less than 2)
  const { data: lowStock } = await supabase
    .from("products")
    .select("*")
    .eq("status", "available")
    .lt("stock_quantity", 2)
    .order("stock_quantity", { ascending: true });

  // Get stock value
  const { data: stockValue } = await supabase
    .from("products")
    .select("buying_cost, stock_quantity")
    .eq("status", "available");

  const totalStockValue =
    stockValue?.reduce((sum: number, p: any) => sum + p.buying_cost * p.stock_quantity, 0) ||
    0;

  // Today's sales
  const today = new Date().toISOString().split("T")[0];
  const { data: todaySales } = await supabase
    .from("sales")
    .select("selling_price, profit")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  const todayRevenue =
    todaySales?.reduce((sum: number, s: any) => sum + s.selling_price, 0) || 0;
  const todayProfit =
    todaySales?.reduce((sum: number, s: any) => sum + s.profit, 0) || 0;

  // This week's sales
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const { data: weekSales } = await supabase
    .from("sales")
    .select("selling_price, profit")
    .gte("created_at", weekStart.toISOString());

  const weekRevenue =
    weekSales?.reduce((sum: number, s: any) => sum + s.selling_price, 0) || 0;
  const weekProfit =
    weekSales?.reduce((sum: number, s: any) => sum + s.profit, 0) || 0;

  // This month's sales
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const { data: monthSales } = await supabase
    .from("sales")
    .select("selling_price, profit")
    .gte("created_at", monthStart.toISOString());

  const monthRevenue =
    monthSales?.reduce((sum: number, s: any) => sum + s.selling_price, 0) || 0;
  const monthProfit =
    monthSales?.reduce((sum: number, s: any) => sum + s.profit, 0) || 0;

  // Total sales
  const { data: allSales } = await supabase
    .from("sales")
    .select("selling_price, profit, buying_price");

  const totalRevenue =
    allSales?.reduce((sum: number, s: any) => sum + s.selling_price, 0) || 0;
  const totalProfit =
    allSales?.reduce((sum: number, s: any) => sum + s.profit, 0) || 0;
  const totalBuyingCost =
    allSales?.reduce((sum: number, s: any) => sum + s.buying_price, 0) || 0;
  const totalProductsSold = allSales?.length || 0;

  const hasSales = totalProductsSold > 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Available</p>
              <p className="text-lg font-bold">{availableCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Box className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Sold</p>
              <p className="text-lg font-bold">{soldCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending Orders</p>
              <p className="text-lg font-bold">{pendingOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Stock Value</p>
              <p className="text-lg font-bold">
                {formatCurrency(totalStockValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Section */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="p-4 border-b flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Sales & Profit</h2>
        </div>

        {hasSales ? (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Today</p>
                <p className="font-semibold">{formatCurrency(todayRevenue)}</p>
                <p className="text-xs text-green-600">
                  Profit: {formatCurrency(todayProfit)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">This Week</p>
                <p className="font-semibold">{formatCurrency(weekRevenue)}</p>
                <p className="text-xs text-green-600">
                  Profit: {formatCurrency(weekProfit)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">This Month</p>
                <p className="font-semibold">{formatCurrency(monthRevenue)}</p>
                <p className="text-xs text-green-600">
                  Profit: {formatCurrency(monthProfit)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total All Time</p>
                <p className="font-semibold">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-green-600">
                  Profit: {formatCurrency(totalProfit)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between p-2 border-b">
                <span className="text-gray-600">Total Buying Cost</span>
                <span className="font-medium">
                  {formatCurrency(totalBuyingCost)}
                </span>
              </div>
              <div className="flex justify-between p-2 border-b">
                <span className="text-gray-600">Gross Profit</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(totalProfit)}
                </span>
              </div>
              <div className="flex justify-between p-2 border-b">
                <span className="text-gray-600">Products Sold</span>
                <span className="font-medium">{totalProductsSold}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No sales recorded yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Sales will appear here when orders are marked as completed.
            </p>
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      {lowStock && lowStock.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-4 border-b flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900">
              Low Stock ({lowStock.length})
            </h2>
          </div>
          <div className="divide-y">
            {lowStock.map((product: any) => (
              <div
                key={product.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    Size {product.size} ·{" "}
                    {product.stock_quantity === 0
                      ? "Out of stock"
                      : `${product.stock_quantity} left`}
                  </p>
                </div>
                <a
                  href={`/admin/products?edit=${product.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Restock
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
