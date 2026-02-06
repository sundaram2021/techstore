"use client";

import { ShoppingBag, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CartItemDisplay {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartSummaryChatProps {
  items: CartItemDisplay[];
  total: number;
}

export function CartSummaryChat({ items, total }: CartSummaryChatProps) {
  if (!items?.length) {
    return (
      <div className="text-center py-6 space-y-2">
        <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto" />
        <p className="text-sm text-gray-500">Your cart is empty</p>
        <Link href="/products">
          <Button size="sm" variant="outline" className="text-xs mt-1">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-cyan-500" />
          Your Cart
        </h3>
        <span className="text-xs text-gray-500">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {items.map((item, idx) => (
          <div key={item.id ?? item.name ?? idx} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name ?? "Item"}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity ?? 1}</p>
            </div>
            <span className="text-sm font-semibold text-gray-900 ml-2">
              ${((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 px-1">
        <span className="text-sm font-medium text-gray-700">Total</span>
        <span className="text-base font-bold text-cyan-600">${(total ?? 0).toFixed(2)}</span>
      </div>

      <Link href="/cart" className="block">
        <Button size="sm" className="w-full text-xs bg-cyan-500 hover:bg-cyan-600 rounded-lg">
          <ExternalLink className="w-3 h-3 mr-1.5" />
          View Full Cart
        </Button>
      </Link>
    </div>
  );
}
