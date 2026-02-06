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

interface ProductListChatProps {
  products: Product[];
  title?: string;
}

export function ProductListChat({ products, title }: ProductListChatProps) {
  if (!products?.length) {
    return (
      <div className="text-center py-4 text-sm text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      {title && (
        <h3 className="font-semibold text-sm text-gray-900 px-1">{title}</h3>
      )}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
        {products.map((product, idx) => (
          <ProductCardChat key={product.id ?? idx} {...product} />
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center pt-1">
        {products.length} product{products.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
