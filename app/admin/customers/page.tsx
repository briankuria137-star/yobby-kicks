"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/supabase/client";
import { formatCurrency, formatDateTime, getOrderStatusLabel } from "@/lib/utils";
import { Search, ChevronDown, ChevronUp, Users, ShoppingBag } from "lucide-react";

const supabase: any = createClient();

type Customer = {
  id: string;
  name: string;
  phone: string;
  location: string | null;
  created_at: string;
};

type CustomerOrder = {
  id: string;
  order_number: string | null;
  customer_id: string | null;
  total_amount: number;
  status: string;
  created_at: string;
};

type CustomerWithStats = Customer & {
  orders: CustomerOrder[];
  orderCount: number;
  totalSpent: number;
  lastOrder: CustomerOrder | null;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);

    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .select("id, name, phone, location, created_at")
      .order("created_at", { ascending: false });

    if (customerError || !customerData) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    const customerIds = customerData.map((customer: Customer) => customer.id);

    let orders: CustomerOrder[] = [];

    if (customerIds.length > 0) {
      const { data: orderData } = await supabase
        .from("orders")
        .select("id, order_number, customer_id, total_amount, status, created_at")
        .in("customer_id", customerIds)
        .order("created_at", { ascending: false });

      orders = orderData || [];
    }

    const grouped = customerData.map((customer: Customer) => {
      const customerOrders = orders.filter(
        (order) => order.customer_id === customer.id
      );

      const totalSpent = customerOrders.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      );

      return {
        ...customer,
        orders: customerOrders,
        orderCount: customerOrders.length,
        totalSpent,
        lastOrder: customerOrders[0] || null,
      };
    });

    setCustomers(grouped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        (customer.location || "").toLowerCase().includes(query)
    );
  }, [customers, search]);

  const totalCustomers = customers.length;
  const returningCustomers = customers.filter(
    (customer) => customer.orderCount > 1
  ).length;
  const totalCustomerRevenue = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-sm text-white/60 mt-1">
            Manage customers and understand their buying history.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="text-sm border border-white/[0.08] rounded-md px-3 py-2 hover:bg-[#0f0f14]"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111116] rounded-lg border border-white/[0.08] p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Users className="w-4 h-4" />
            Customers
          </div>
          <p className="text-2xl font-bold mt-2">{totalCustomers}</p>
        </div>

        <div className="bg-[#111116] rounded-lg border border-white/[0.08] p-4">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <ShoppingBag className="w-4 h-4" />
            Returning Customers
          </div>
          <p className="text-2xl font-bold mt-2">{returningCustomers}</p>
        </div>

        <div className="bg-[#111116] rounded-lg border border-white/[0.08] p-4">
          <p className="text-sm text-white/60">Customer Revenue</p>
          <p className="text-2xl font-bold mt-2">
            {formatCurrency(totalCustomerRevenue)}
          </p>
        </div>
      </div>

      <div className="bg-[#111116] rounded-lg border border-white/[0.08] mb-4 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone or location..."
            className="w-full rounded-md border border-white/[0.08] bg-[#111116] pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="bg-[#111116] rounded-lg border border-white/[0.08] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/60">
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-white/60">
            <Users className="w-8 h-8 mx-auto mb-2 text-white/20" />
            <p>No customers found.</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredCustomers.map((customer) => {
              const expanded = expandedCustomer === customer.id;

              return (
                <div key={customer.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">
                          {customer.name || "Unknown Customer"}
                        </p>

                        {customer.orderCount > 1 && (
                          <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                            Returning
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-white/60 mt-1">
                        {customer.phone}
                        {customer.location ? ` · ${customer.location}` : ""}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-white/70">
                        <span>
                          <strong>{customer.orderCount}</strong>{" "}
                          {customer.orderCount === 1 ? "order" : "orders"}
                        </span>

                        <span>
                          <strong>{formatCurrency(customer.totalSpent)}</strong>{" "}
                          spent
                        </span>

                        <span>
                          Last order:{" "}
                          {customer.lastOrder
                            ? formatDateTime(customer.lastOrder.created_at)
                            : "Never"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedCustomer(expanded ? null : customer.id)
                      }
                      className="p-2 rounded-md hover:bg-[#0f0f14]"
                    >
                      {expanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {expanded && (
                    <div className="mt-4 pt-4 border-t border-white/[0.08]">
                      <p className="font-medium text-sm mb-2">
                        Order History
                      </p>

                      {customer.orders.length === 0 ? (
                        <p className="text-xs text-white/60">
                          No orders linked to this customer.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {customer.orders.map((order) => (
                            <div
                              key={order.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-[#0f0f14] px-3 py-2 text-xs"
                            >
                              <span className="font-medium">
                                {order.order_number ||
                                  `Order #${order.id.slice(0, 8)}`}
                              </span>

                              <span className="text-white/60">
                                {formatDateTime(order.created_at)}
                              </span>

                              <span>
                                {getOrderStatusLabel(order.status as any)}
                              </span>

                              <span className="font-medium">
                                {formatCurrency(order.total_amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-white/40 mt-3">
                        Customer since {formatDateTime(customer.created_at)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
