import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "KSh"): string {
  return `${currency} ${amount.toLocaleString("en-KE")}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateWhatsAppMessage(
  phone: string,
  businessName: string,
  productName: string,
  productId: string,
  size: string,
  price: number
): string {
  const message = encodeURIComponent(
    `🛍️ ${businessName.toUpperCase()} — ORDER REQUEST

Hello ${businessName} 👋

I'd like to order this pair:

👟 Product: ${productName}
🆔 Product ID: ${productId}
📏 Size: ${size}
💰 Price: KSh ${price.toLocaleString()}
📦 Quantity: 1

Please confirm:
1. Availability
2. Delivery options
3. Payment instructions

🔖 Product reference: ${productId}

Thank you.`
  );

  return `https://wa.me/${phone}?text=${message}`;
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    packed: "bg-purple-100 text-purple-800",
    out_for_delivery: "bg-orange-100 text-orange-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    paid: "Paid",
    packed: "Packed",
    out_for_delivery: "Out for Delivery",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    new: "New / Unused",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
  };
  return labels[condition] || condition;
}
