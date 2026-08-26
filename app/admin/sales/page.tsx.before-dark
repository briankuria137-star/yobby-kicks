
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sales History</h1>

      {sales && sales.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
              <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <p className="text-xs text-gray-500 mb-1">Total Buying Cost</p>
              <p className="text-xl font-bold">{formatCurrency(totalCost)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <p className="text-xs text-gray-500 mb-1">Gross Profit</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalProfit)}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Size</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Customer</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-700">Quantity</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-700">Selling</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-700">Cost</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-700">Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sales.map((sale: any) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{formatDate(sale.created_at)}</td>
                      <td className="px-4 py-3 font-medium">{sale.product_name}</td>
                      <td className="px-4 py-3">{sale.size}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {sale.customer_name || "—"}
                        {sale.customer_phone && <div className="text-xs text-gray-400">{sale.customer_phone}</div>}
                      </td>
                      <td className="px-4 py-3 text-right">{sale.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(sale.selling_price)}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{formatCurrency(sale.buying_price)}</td>
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
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No sales recorded yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Sales will appear here when orders are marked as completed.
          </p>
        </div>
      )}
    </div>
  );
}
