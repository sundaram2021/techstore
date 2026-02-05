"use client";

import { useState } from "react";
import { ProductFilters as FilterType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getBrands, getCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductFiltersProps {
    filters: FilterType;
    setFilters: (filters: FilterType) => void;
}

export function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [isOpen, setIsOpen] = useState(false);

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    });

    const { data: brands = [] } = useQuery({
        queryKey: ["brands"],
        queryFn: () => getBrands(),
    });

    const activeFilterCount = [
        filters.category,
        filters.brand?.length,
        filters.minPrice !== undefined || filters.maxPrice !== undefined,
        filters.rating
    ].filter(Boolean).length;

    const clearFilters = () => {
        setFilters({});
        setPriceRange([0, 2000]);
    };

    const handleBrandChange = (brand: string) => {
        const currentBrands = filters.brand || [];
        const newBrands = currentBrands.includes(brand)
            ? currentBrands.filter(b => b !== brand)
            : [...currentBrands, brand];
        setFilters({ ...filters, brand: newBrands.length > 0 ? newBrands : undefined });
    };

    const FilterContent = () => (
        <div className="space-y-8">
            <br />

            {/* Categories */}
            <div className="space-y-4">
                <Label>Categories</Label>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`cat-${category.id}`}
                                checked={filters.category === category.id}
                                onCheckedChange={() =>
                                    setFilters({
                                        ...filters,
                                        category: filters.category === category.id ? undefined : category.id
                                    })
                                }
                            />
                            <label
                                htmlFor={`cat-${category.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {category.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Price Range</Label>
                </div>

                <Slider
                    defaultValue={[0, 2000]}
                    value={[filters.minPrice || 0, filters.maxPrice || 2000]}
                    max={2000}
                    step={10}
                    onValueChange={(val) => {
                        setPriceRange(val);
                        setFilters({ ...filters, minPrice: val[0], maxPrice: val[1] });
                    }}
                    className="py-4"
                />

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <Input
                            type="number"
                            value={filters.minPrice || 0}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setFilters({ ...filters, minPrice: val });
                                setPriceRange([val, priceRange[1]]);
                            }}
                            className="pl-6 h-9"
                            min={0}
                            max={2000}
                        />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <Input
                            type="number"
                            value={filters.maxPrice || 2000}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setFilters({ ...filters, maxPrice: val });
                                setPriceRange([priceRange[0], val]);
                            }}
                            className="pl-6 h-9"
                            min={0}
                            max={2000}
                        />
                    </div>
                </div>
            </div>

            <Separator />

            {/* Brands */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Brands</Label>
                    {filters.brand && filters.brand.length > 0 && (
                        <Button
                            variant="ghost"
                            className="h-auto p-0 text-xs text-[#0ea5e9]"
                            onClick={() => setFilters({ ...filters, brand: undefined })}
                        >
                            Clear
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-2">
                        {brands.map((brand) => (
                            <div key={brand} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`brand-${brand}`}
                                    checked={filters.brand?.includes(brand)}
                                    onCheckedChange={() => handleBrandChange(brand)}
                                />
                                <label
                                    htmlFor={`brand-${brand}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {brand}
                                </label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Filters - Hidden on mobile */}
            <div className="hidden lg:block w-72 space-y-8 pr-6 border-r border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-8 px-2 text-[#0ea5e9] hover:text-[#0ea5e9] hover:bg-[#f0f9ff]"
                        >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Reset
                        </Button>
                    )}
                </div>
                <FilterContent />
            </div>

            {/* Mobile Filters - Sheet/Drawer */}
            <div className="lg:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="gap-2 rounded-full border-[#0ea5e9]/30 hover:border-[#0ea5e9] hover:text-[#0ea5e9] hover:bg-[#f0f9ff]">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-[#0ea5e9] text-white hover:bg-[#0284c7]">
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle className="flex items-center justify-between">
                                <span>Filters</span>
                                {activeFilterCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="h-8 px-2 text-[#0ea5e9]"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                        Reset
                                    </Button>
                                )}
                            </SheetTitle>
                        </SheetHeader>
                        <FilterContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
