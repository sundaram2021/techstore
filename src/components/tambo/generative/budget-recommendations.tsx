"use client";

import { ProductCardChat } from "./product-card-chat";

interface Product {
  id: string | number;
  title: string;
  price: number;
  description?: string;
  category?: { id?: string; name?: string; image?: string };
  images?: string[];
}

interface BudgetRecommendationsProps {
  budget: number;
  products: Product[];
  title?: string;
}

export function BudgetRecommendations({ budget, products, title }: BudgetRecommendationsProps) {
  const safeBudget = budget ?? 0;
  const withinBudget = (products ?? []).filter((p) => (p.price ?? 0) <= safeBudget);

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-sm text-gray-900">
          {title ?? "Within Your Budget"}
        </h3>
        <span className="text-xs font-medium text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full">
          Max ${safeBudget.toFixed(0)}
        </span>
      </div>

      {withinBudget.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No products found within ${safeBudget.toFixed(0)}. Try a higher budget.
        </p>
      ) : (
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {withinBudget
            .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
            .map((product, idx) => (
              <ProductCardChat key={product.id ?? idx} {...product} />
            ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-400 px-1">
        <div className="h-px flex-1 bg-gray-100" />
        <span>{withinBudget.length} of {(products ?? []).length} match</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>
    </div>
  );
}
