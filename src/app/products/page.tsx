"use client";

import { useState } from "react";
import { ProductList } from "@/components/product/product-list";
import { ProductFilters } from "@/components/product/product-filters";
import { Cpu } from "lucide-react";
import { ProductFilters as FilterType } from "@/lib/types";

export default function ProductsPage() {
    const [filters, setFilters] = useState<FilterType>({});

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] border-b border-gray-100 grid-pattern">
                <div className="container mx-auto px-6 lg:px-8 py-16 sm:py-20">
                    <div className="max-w-2xl animate-fade-in-up">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0ea5e9] uppercase tracking-wider">
                            <Cpu className="h-4 w-4" />
                            Electronics Collection
                        </span>
                        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                            All Products
                        </h1>
                        <p className="mt-6 text-lg text-gray-500 leading-relaxed">
                            Explore our complete collection of electronics. From laptops and cameras to drones and monitors — find the perfect tech for you.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 lg:px-8 py-12 sm:py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters: Sidebar on Desktop, Button on Mobile */}
                    <ProductFilters filters={filters} setFilters={setFilters} />

                    <div className="flex-1 min-w-0">
                        {/* Mobile Header Context - Optional */}
                        <div className="lg:hidden mb-6 flex items-center justify-between pb-4 border-b border-gray-100">
                            <p className="text-sm text-gray-500 font-medium">
                                Browse Collection
                            </p>
                        </div>

                        <ProductList filters={filters} />
                    </div>
                </div>
            </div>
        </div>
    );
}
