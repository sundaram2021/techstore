"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, Loader2, ChevronRight, Zap, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/api";
import { LegacyProduct } from "@/lib/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<LegacyProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Mock refreshing recent searches (in a real app, this would be persisted)
    const recentSearches = ["Wireless Headphones", "Gaming Laptop", "Smart Watch"];
    const trendingCategories = ["Laptops", "Smartphones", "Cameras", "Audio"];

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim()) {
                setIsLoading(true);
                try {
                    const data = await searchProducts(query);
                    setResults(data);
                    setSelectedIndex(-1);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
            } else if (e.key === "Enter" && selectedIndex >= 0) {
                e.preventDefault();
                handleSelect(results[selectedIndex].id);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    // Focus & cleanup
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = "unset";
            setQuery("");
            setResults([]);
            setSelectedIndex(-1);
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const handleSelect = (productId: string | number) => {
        router.push(`/products/${productId}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 sm:pt-20 px-4">
            {/* Backdrop with extensive blur */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Panel */}
            <div
                ref={containerRef}
                className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
                {/* Search Input Header */}
                <div className="relative border-b border-gray-100/50 bg-white/50">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <SearchIcon className={cn("h-6 w-6 transition-colors duration-200", isLoading ? "text-[#0ea5e9]" : "text-gray-400")} />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        className="h-20 w-full border-0 bg-transparent pl-16 pr-16 text-xl text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                        placeholder="What are you looking for?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-6 flex items-center gap-3">
                        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-[#0ea5e9]" />}
                        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500 font-sans">
                            ESC
                        </kbd>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">

                    {/* Empty State / Initial View */}
                    {(query === "" && results.length === 0) && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Recent Searches */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Clock className="h-3 w-3" /> Recent Searches
                                </h3>
                                <div className="space-y-2">
                                    {recentSearches.map((term, i) => (
                                        <button
                                            key={i}
                                            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 text-left text-gray-600 group transition-colors"
                                            onClick={() => setQuery(term)}
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#f0f9ff] group-hover:text-[#0ea5e9] transition-colors">
                                                <SearchIcon className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium group-hover:text-gray-900 transition-colors">{term}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Trending */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp className="h-3 w-3" /> Trending Categories
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {trendingCategories.map((cat, i) => (
                                        <button
                                            key={i}
                                            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-[#0ea5e9] hover:text-[#0ea5e9] hover:bg-[#f0f9ff] transition-all"
                                            onClick={() => {
                                                setQuery(cat);
                                                // Trigger search immediately
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results List */}
                    {results.length > 0 && (
                        <div className="p-4 space-y-2">
                            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Products ({results.length})
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {results.map((product, index) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleSelect(product.id)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={cn(
                                            "group flex cursor-pointer select-none items-center gap-4 rounded-2xl p-3 transition-all duration-200",
                                            selectedIndex === index ? "bg-[#f0f9ff] ring-1 ring-[#0ea5e9]/20" : "hover:bg-gray-50 bg-white border border-transparent"
                                        )}
                                    >
                                        <div className="relative h-16 w-16 flex-none overflow-hidden rounded-xl bg-white border border-gray-100 group-hover:border-[#0ea5e9]/20 transition-colors">
                                            <Image
                                                src={product.images[0] || PLACEHOLDER_IMAGE}
                                                alt=""
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-auto min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className={cn(
                                                    "font-medium truncate transition-colors",
                                                    selectedIndex === index ? "text-[#0ea5e9]" : "text-gray-900"
                                                )}>
                                                    {product.title}
                                                </p>
                                                <Badge variant="secondary" className="hidden sm:inline-flex bg-white/50 text-gray-500 font-normal">
                                                    ${product.price.toFixed(2)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-white group-hover:text-[#0ea5e9] transition-colors">
                                                    <Zap className="h-3 w-3" />
                                                    {product.category?.name || "Tech"}
                                                </span>
                                                <span className="truncate max-w-[200px] hidden sm:block">
                                                    {product.description}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowRight className={cn(
                                            "h-5 w-5 flex-none transition-all duration-300",
                                            selectedIndex === index ? "text-[#0ea5e9] translate-x-0 opacity-100" : "text-gray-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                                        )} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {query !== "" && results.length === 0 && !isLoading && (
                        <div className="py-16 text-center">
                            <div className="mx-auto h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                <SearchIcon className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">No matching products</h3>
                            <p className="mt-2 text-gray-500 max-w-xs mx-auto">
                                We couldn&apos;t find any products matching &quot;<span className="text-gray-900 font-medium">{query}</span>&quot;.
                                <br />Try checking for typos or using different keywords.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {results.length > 0 && (
                    <div className="bg-gray-50/50 backdrop-blur border-t border-gray-100 px-6 py-4 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex gap-4">
                            <span><kbd className="font-sans font-semibold text-gray-900">↑↓</kbd> to navigate</span>
                            <span><kbd className="font-sans font-semibold text-gray-900">Enter</kbd> to select</span>
                        </div>
                        <span className="hidden sm:inline">Showing top {results.length} results</span>
                    </div>
                )}
            </div>
        </div>
    );
}
