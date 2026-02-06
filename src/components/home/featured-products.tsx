"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "@/lib/api";
import { ProductGrid } from "@/components/product/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, Cpu } from "lucide-react";

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

export function FeaturedProducts() {
    const { data: products, isLoading, error, refetch } = useQuery({
        queryKey: ["featured-products", "curated"],
        queryFn: () => getFeaturedProducts(),
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 px-6 rounded-3xl bg-[#f0f9ff]">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm">
                        <RefreshCw className="h-8 w-8 text-[#0ea5e9]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Failed to Load Products</h3>
                    <p className="text-gray-500">We couldn&apos;t fetch the products. Please try again.</p>
                    <Button onClick={() => refetch()} variant="outline" className="mt-4 btn-press border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#f0f9ff]">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex items-end justify-between">
                <div>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0ea5e9] uppercase tracking-wider">
                        <Cpu className="h-4 w-4" />
                        Top Tech Picks
                    </span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Featured Products</h2>
                </div>
                <Link href="/products">
                    <Button variant="ghost" className="group text-base font-medium hidden sm:flex hover:text-[#0ea5e9] hover:bg-[#f0f9ff]">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
            </div>

            {products && <ProductGrid products={products} />}

            <div className="text-center pt-4 sm:hidden">
                <Link href="/products">
                    <Button variant="outline" className="w-full sm:w-auto btn-press border-[#0ea5e9]/30 hover:border-[#0ea5e9] hover:bg-[#f0f9ff]">
                        View All Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
