"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "@/lib/api";
import { ProductGrid } from "./product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu, Star } from "lucide-react";

interface RelatedProductsProps {
    categoryId: string;
    currentProductId: number | string;
    title?: string;
    subtitle?: string;
    offset?: number;
    limit?: number;
    icon?: React.ElementType;
}

function ProductSkeleton() {
    return (
        <div className="space-y-4">
            <div className="aspect-[4/5] rounded-2xl animate-shimmer" />
            <div className="space-y-3 px-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
            </div>
        </div>
    );
}

export function RelatedProducts({
    categoryId,
    currentProductId,
    title = "Related Products",
    subtitle = "You may also like",
    offset = 0,
    limit = 4,
    icon: Icon = Cpu
}: RelatedProductsProps) {
    // We fetch limit + 1 just in case the current product is in the result set, so we can filter it out efficiently
    const fetchLimit = limit + 2;

    const { data: products, isLoading } = useQuery({
        queryKey: ["related-products", categoryId, offset, fetchLimit],
        queryFn: () => getProductsByCategory(categoryId, offset, fetchLimit),
    });

    const related = products
        ?.filter((p) => String(p.id) !== String(currentProductId))
        .slice(0, limit) || [];

    if (isLoading) {
        return (
            <div className="space-y-10">
                <div>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0ea5e9] uppercase tracking-wider">
                        <Icon className="h-4 w-4" />
                        {subtitle}
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
                </div>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(limit)].map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (related.length === 0) return null;

    return (
        <div className="space-y-10">
            <div>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0ea5e9] uppercase tracking-wider">
                    <Icon className="h-4 w-4" />
                    {subtitle}
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
            </div>
            <ProductGrid products={related} />
        </div>
    );
}
