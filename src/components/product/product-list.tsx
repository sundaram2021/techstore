"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getProducts, getTotalProducts } from "@/lib/api";
import { ProductGrid } from "@/components/product/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, ChevronDown, Cpu } from "lucide-react";

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

import { ProductFilters } from "@/lib/types";

interface ProductListProps {
    filters?: ProductFilters;
}

export function ProductList({ filters }: ProductListProps) {
    // Fetch total products count
    const { data: totalProducts = 0 } = useQuery({
        queryKey: ["total-products", filters],
        queryFn: () => getTotalProducts(filters),
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["products", filters],
        queryFn: ({ pageParam = 0 }) => getProducts(pageParam, 12, filters),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const nextOffset = allPages.length * 12;
            return nextOffset < totalProducts ? nextOffset : undefined;
        },
    });

    const products = data?.pages.flatMap((page) => page) || [];

    if (status === "pending") {
        return (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(12)].map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="text-center py-20 px-6 rounded-3xl bg-[#f0f9ff]">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm">
                        <RefreshCw className="h-8 w-8 text-[#0ea5e9]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Failed to Load Products</h3>
                    <p className="text-gray-500">Something went wrong. Please try again.</p>
                    <Button onClick={() => refetch()} variant="outline" className="mt-4 btn-press border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#f0f9ff]">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16">
            {/* Product count */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Cpu className="h-4 w-4 text-[#0ea5e9]" />
                <span>Showing {products.length} of {totalProducts.toLocaleString()} products</span>
            </div>

            <ProductGrid products={products} />

            {hasNextPage && (
                <div className="flex justify-center">
                    <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        variant="outline"
                        size="lg"
                        className="h-14 px-10 rounded-full text-base font-medium btn-press border-[#0ea5e9]/30 hover:border-[#0ea5e9] hover:text-[#0ea5e9] hover:bg-[#f0f9ff]"
                    >
                        {isFetchingNextPage ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                Load More
                                <ChevronDown className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                </div>
            )}

            {!hasNextPage && products.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-400 font-medium flex items-center justify-center gap-2">
                        <Cpu className="h-4 w-4 text-[#0ea5e9]" />
                        You&apos;ve explored all products ✨
                    </p>
                </div>
            )}
        </div>
    );
}
