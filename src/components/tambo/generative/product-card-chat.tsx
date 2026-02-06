"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

/** Validate an image URL — returns PLACEHOLDER_IMAGE for anything invalid */
function safeImageSrc(src: string | undefined): string {
  if (!src || typeof src !== "string") return PLACEHOLDER_IMAGE;
  if (src.startsWith("/")) return src; // local path
  try {
    new URL(src);
    return src;
  } catch {
    return PLACEHOLDER_IMAGE;
  }
}

interface ProductCardChatProps {
  id: string | number;
  title: string;
  price: number;
  description?: string;
  category?: { id?: string; name?: string; image?: string };
  images?: string[];
}

export function ProductCardChat({
  id,
  title,
  price,
  description,
  images,
  category,
}: ProductCardChatProps) {
  const { addToCart } = useCart();

  const imageSrc = safeImageSrc(images?.[0]);
  const categoryName = category?.name ?? "";

  const handleAdd = () => {
    addToCart({
      productId: String(id),
      quantity: 1,
      product: { objectID: String(id), name: title ?? "Product", price: price ?? 0, description: description ?? "", brand: "", categories: [], hierarchicalCategories: { lvl0: categoryName }, type: "", price_range: "", image: imageSrc, url: "", free_shipping: false, popularity: 0, rating: 0 },
    });
    toast.success(`${title ?? "Product"} added to cart`);
  };

  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
        <Image
          src={imageSrc}
          alt={title ?? "Product"}
          fill
          className="object-cover"
          sizes="80px"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${id}`} className="hover:underline">
          <h4 className="font-medium text-sm text-gray-900 truncate">{title ?? "Product"}</h4>
        </Link>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{categoryName}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-sm text-cyan-600">${(price ?? 0).toFixed(2)}</span>
          <Button
            size="sm"
            onClick={handleAdd}
            className="h-7 px-2.5 text-xs bg-cyan-500 hover:bg-cyan-600 rounded-lg"
          >
            <ShoppingBag className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
