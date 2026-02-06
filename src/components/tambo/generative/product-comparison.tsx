"use client";

import Image from "next/image";
import { Star, Check, X } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

function safeImageSrc(src: string | undefined): string {
  if (!src || typeof src !== "string") return PLACEHOLDER_IMAGE;
  if (src.startsWith("/")) return src;
  try {
    new URL(src);
    return src;
  } catch {
    return PLACEHOLDER_IMAGE;
  }
}

interface SpecEntry {
  key: string;
  value: string;
}

interface ComparisonItem {
  name: string;
  price: number;
  brand?: string;
  rating?: number;
  image?: string;
  specs?: SpecEntry[];
}

interface ProductComparisonProps {
  products: ComparisonItem[];
  highlightBest?: boolean;
}

export function ProductComparison({ products, highlightBest }: ProductComparisonProps) {
  const bestIdx = highlightBest
    ? products.reduce((best, p, i) => (p.rating ?? 0) > (products[best].rating ?? 0) ? i : best, 0)
    : -1;

  // Collect all spec keys
  const specKeys = Array.from(
    new Set(products.flatMap((p) => (p.specs ?? []).map((s) => s.key)))
  );

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[280px]">
        <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
          {/* Product headers */}
          {products.map((p, i) => (
            <div
              key={i}
              className={`text-center p-3 rounded-xl border ${
                i === bestIdx ? "border-cyan-400 bg-cyan-50" : "border-gray-100 bg-white"
              }`}
            >
              {i === bestIdx && (
                <span className="inline-block text-[10px] font-bold text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded-full mb-2">
                  BEST PICK
                </span>
              )}
              <div className="relative w-12 h-12 mx-auto rounded-lg overflow-hidden bg-gray-50 mb-2">
                <Image
                  src={safeImageSrc(p.image)}
                  alt={p.name ?? "Product"}
                  fill
                  className="object-cover"
                  sizes="48px"
                  unoptimized
                />
              </div>
              <h4 className="font-semibold text-xs text-gray-900 truncate">{p.name ?? "Product"}</h4>
              {p.brand && <p className="text-[10px] text-gray-500">{p.brand}</p>}
              <p className="font-bold text-sm text-cyan-600 mt-1">${(p.price ?? 0).toFixed(2)}</p>
              {p.rating != null && (
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] text-gray-600">{p.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Specs table */}
        {specKeys.length > 0 && (
          <div className="mt-3 border rounded-xl overflow-hidden text-xs">
            {specKeys.map((key, ri) => (
              <div
                key={key}
                className={`grid items-center ${ri % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                style={{ gridTemplateColumns: `100px repeat(${products.length}, minmax(0, 1fr))` }}
              >
                <span className="px-3 py-2 font-medium text-gray-700 truncate">{key}</span>
                {products.map((p, i) => (
                  <span key={i} className="px-2 py-2 text-center text-gray-600 truncate">
                    {p.specs?.find((s) => s.key === key)?.value ?? "—"}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
