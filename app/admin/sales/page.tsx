
import { createClient } from "@/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export default async function AdminSalesPage() {
  const supabase: any = await createClient();

  const { data: sales } = await supabase
    .from("sales")
    .select("*")
    .order("created_at", { ascending: false });

  const totalRevenue = sales?.reduce((sum: number, s: any) => sum + s.selling_price, 0) || 0;
  const totalProfit = sales?.reduce((sum: number, s: any) => sum + s.profit, 0) || 0;
  const totalCost = sales?.reduce((sum: number, s: any) => sum + s.buying_price, 0) || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Sales History</h1>

      {sales && sales.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/[0.035] rounded-lg p-4 shadow-sm border border-white/10">
              <p className="text-xs text-white/60 mb-1">Total Revenue</p>
              <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-white/[0.035] rounded-lg p-4 shadow-sm border border-white/10">
              <p className="text-xs text-white/60 mb-1">Total Buying Cost</p>
              <p className="text-xl font-bold">{formatCurrency(totalCost)}</p>
            </div>
            <div className="bg-white/[0.035] rounded-lg p-4 shadow-sm border border-white/10">
              <p className="text-xs text-white/60 mb-1">Gross Profit</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalProfit)}</p>
            </div>
          </div>

          <div className="bg-white/[0.035] rounded-lg shadow-sm border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.03] border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-white/80">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-white/80">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-white/80">Size</th>
                    <th className="text-left px-4 py-3 font-medium text-white/80">Customer</th>
                    <th className="text-right px-4 py-3 font-medium text-white/80">Quantity</th>
                    <th className="text-right px-4 py-3 font-medium text-white/80">Selling</th>
                    <th className="text-right px-4 py-3 font-medium text-white/80">Cost</th>
                    <th className="text-right px-4 py-3 font-medium text-white/80">Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sales.map((sale: any) => (
                    <tr key={sale.id} className="hover:bg-white/[0.03]">
                      <td className="px-4 py-3 text-white/70">{formatDate(sale.created_at)}</td>
                      <td className="px-4 py-3 font-medium">{sale.product_name}</td>
                      <td className="px-4 py-3">{sale.size}</td>
                      <td className="px-4 py-3 text-white/70">
                        {sale.customer_name || "—"}
                        {sale.customer_phone && <div className="text-xs text-white/40">{sale.customer_phone}</div>}
                      </td>
                      <td className="px-4 py-3 text-right">{sale.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(sale.selling_price)}</td>
                      <td className="px-4 py-3 text-right text-white/60">{formatCurrency(sale.buying_price)}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">
                        {formatCurrency(sale.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white/[0.035] rounded-lg shadow-sm border border-white/10 p-12 text-center">
          <TrendingUp className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/60">No sales recorded yet.</p>
          <p className="text-sm text-white/40 mt-1">
            Sales will appear here when orders are marked as completed.
          </p>
        </div>
      )}
    </div>
  );
}
