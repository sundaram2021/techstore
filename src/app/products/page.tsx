"use client";

import { useState } from "react";
import { ProductList } from "@/components/product/product-list";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductListChat } from "@/components/tambo/generative/product-list-chat";
import { Cpu, Sparkles, X } from "lucide-react";
import { ProductFilters as FilterType } from "@/lib/types";
import { useAISearchResults } from "@/hooks/use-ai-search";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
    const [filters, setFilters] = useState<FilterType>({});
    const { aiSearchQuery, aiSearchResults, isAISearchActive, clearAISearch } =
        useAISearchResults();

    return (
        <div className="min-h-screen bg-white" data-highlight="products-page">
            {/* Page Header */}
            <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] border-b border-gray-100 grid-pattern">
                <div className="container mx-auto px-6 lg:px-8 py-16 sm:py-20">
                    <div className="max-w-2xl animate-fade-in-up">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0ea5e9] uppercase tracking-wider">
                            <Cpu className="h-4 w-4" />
                            Electronics Collection
                        </span>
                        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                            {isAISearchActive ? `Results for "${aiSearchQuery}"` : "All Products"}
                        </h1>
                        <p className="mt-6 text-lg text-gray-500 leading-relaxed">
                            {isAISearchActive
                                ? `ShopMate AI found ${aiSearchResults.length} product${aiSearchResults.length !== 1 ? "s" : ""} matching your search.`
                                : "Explore our complete collection of electronics. From laptops and cameras to drones and monitors — find the perfect tech for you."}
                        </p>
                    </div>
                </div>
            </div>

            {/* AI Search Banner */}
            {isAISearchActive && (
                <div className="container mx-auto px-6 lg:px-8 pt-8">
                    <div className="flex items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200/60 px-5 py-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-cyan-700">
                            <Sparkles className="h-4 w-4" />
                            AI Search: &ldquo;{aiSearchQuery}&rdquo; &mdash; {aiSearchResults.length} result{aiSearchResults.length !== 1 ? "s" : ""}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAISearch}
                            className="text-cyan-600 hover:text-cyan-800 hover:bg-cyan-100"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-6 lg:px-8 py-12 sm:py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters: Sidebar on Desktop, Button on Mobile — hidden during AI search */}
                    {!isAISearchActive && (
                        <ProductFilters filters={filters} setFilters={setFilters} />
                    )}

                    <div className="flex-1 min-w-0">
                        {/* Mobile Header Context - Optional */}
                        {!isAISearchActive && (
                            <div className="lg:hidden mb-6 flex items-center justify-between pb-4 border-b border-gray-100">
                                <p className="text-sm text-gray-500 font-medium">
                                    Browse Collection
                                </p>
                            </div>
                        )}

                        {isAISearchActive ? (
                            <div className="space-y-10">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Sparkles className="h-4 w-4 text-[#0ea5e9]" />
                                    <span>Showing {aiSearchResults.length} AI search result{aiSearchResults.length !== 1 ? "s" : ""}</span>
                                </div>
                                <ProductListChat
                                    products={aiSearchResults}
                                    title="ShopMate AI results"
                                />
                            </div>
                        ) : (
                            <ProductList filters={filters} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
