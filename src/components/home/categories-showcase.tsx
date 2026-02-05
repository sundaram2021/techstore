"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Monitor, Camera, Gamepad2, WashingMachine, Car, Laptop, Speaker, Smartphone } from "lucide-react";

// Map category names to icons
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    "Computers & Tablets": Laptop,
    "Cameras & Camcorders": Camera,
    "Toys, Games & Drones": Gamepad2,
    "Appliances": WashingMachine,
    "Car Electronics & GPS": Car,
    "Best Buy Gift Cards": Speaker,
    "Audio": Speaker,
    "Cell Phones": Smartphone,
};

// Get icon for category
function getCategoryIcon(categoryName: string) {
    return categoryIcons[categoryName] || Monitor;
}

export function CategoriesShowcase() {
    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-3xl animate-shimmer" />
                ))}
            </div>
        );
    }

    const displayCategories = categories?.slice(0, 5) || [];

    return (
        <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
                <span className="text-sm font-medium text-[#0ea5e9] uppercase tracking-wider">Browse by</span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
                <p className="mt-4 text-gray-500">Explore our wide range of electronics and find exactly what you need.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {displayCategories.map((category, index) => {
                    const IconComponent = getCategoryIcon(category.name);
                    return (
                        <Link
                            key={category.id}
                            href={`/products?category=${category.id}`}
                            className={cn(
                                "group relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]",
                                "opacity-0 animate-fade-in-up transition-all duration-300",
                                "hover:shadow-xl hover:shadow-[#0ea5e9]/20 hover:scale-[1.02]"
                            )}
                            style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                        >
                            {/* Icon and gradient overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                                <div className="h-16 w-16 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <IconComponent className="h-8 w-8 text-[#0ea5e9]" />
                                </div>
                                <span className="text-gray-900 font-semibold text-center text-sm leading-tight px-2">
                                    {category.name}
                                </span>
                            </div>

                            {/* Hover gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/0 to-[#06b6d4]/0 group-hover:from-[#0ea5e9]/10 group-hover:to-[#06b6d4]/20 transition-all duration-300" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
