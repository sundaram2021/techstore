"use client";

import { CheckCircle, Clock, XCircle, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationProps {
  orderId?: string;
  items: OrderItem[];
  total: number;
  status?: "success" | "pending" | "failed";
}

const statusConfig = {
  success: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", label: "Confirmed" },
  pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Pending" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Failed" },
};

export function OrderConfirmation({ orderId, items, total, status = "success" }: OrderConfirmationProps) {
  const { icon: Icon, color, bg, label } = statusConfig[status];

  return (
    <div className="space-y-3 w-full">
      <div className={`flex items-center gap-2.5 p-3 rounded-xl ${bg}`}>
        <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
        <div>
          <p className={`text-sm font-semibold ${color}`}>Order {label}</p>
          {orderId && <p className="text-xs text-gray-500">#{orderId}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm px-1">
            <span className="text-gray-700 truncate flex-1">
              {item.name ?? "Item"} <span className="text-gray-400">×{item.quantity ?? 1}</span>
            </span>
            <span className="font-medium text-gray-900 ml-2">${((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 px-1">
        <span className="text-sm font-medium text-gray-700">Total</span>
        <span className="text-base font-bold text-gray-900">${(total ?? 0).toFixed(2)}</span>
      </div>

      <Link href="/products" className="block">
        <Button size="sm" variant="outline" className="w-full text-xs rounded-lg">
          <Package className="w-3 h-3 mr-1.5" />
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}
