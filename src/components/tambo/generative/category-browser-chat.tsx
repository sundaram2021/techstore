"use client";

import Image from "next/image";
import Link from "next/link";
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

interface CategoryItem {
  id?: string;
  name: string;
  image?: string;
  count?: number;
}

interface CategoryBrowserChatProps {
  categories: CategoryItem[];
}

export function CategoryBrowserChat({ categories }: CategoryBrowserChatProps) {
  if (!categories?.length) {
    return <p className="text-sm text-gray-500 text-center py-3">No categories available.</p>;
  }

  return (
    <div className="space-y-2 w-full">
      <h3 className="font-semibold text-sm text-gray-900 px-1">Browse Categories</h3>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat, idx) => (
          <Link
            key={cat.id ?? cat.name ?? idx}
            href={`/products?category=${encodeURIComponent(cat.name ?? "")}`}
            className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 bg-white hover:border-cyan-200 hover:shadow-sm transition-all"
          >
            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
              <Image
                src={safeImageSrc(cat.image)}
                alt={cat.name ?? "Category"}
                fill
                className="object-cover"
                sizes="40px"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate group-hover:text-cyan-600 transition-colors">
                {cat.name ?? "Category"}
              </p>
              {cat.count != null && (
                <p className="text-[10px] text-gray-400">{cat.count} items</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
