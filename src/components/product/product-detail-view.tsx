"use client";

import Image from "next/image";
import { LegacyProduct } from "@/lib/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { RelatedProducts } from "./related-products";
import { ShoppingCart, Heart, Share2, Check, Truck, RotateCcw, ShieldCheck, Star, Zap, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductDetailViewProps {
    product: LegacyProduct;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageError, setImageError] = useState<Record<number, boolean>>({});

    // Clean and get valid images - use local placeholder on error
    const getValidImages = () => {
        if (!product.images?.length) {
            return [PLACEHOLDER_IMAGE];
        }
        return product.images.map((img, index) => {
            if (imageError[index]) {
                return PLACEHOLDER_IMAGE;
            }
            let src = img.replace(/^[\[\"\']+|[\]\"\'\\s]+$/g, "");
            src = src.replace(/\\\\/g, "");

            // Skip placeholder URLs
            if (src.includes("placehold") || src.includes("placeholder")) {
                return PLACEHOLDER_IMAGE;
            }

            if (!src.startsWith("http") && !src.startsWith("/")) {
                return PLACEHOLDER_IMAGE;
            }
            return src;
        });
    };

    const images = getValidImages();

    const handleImageError = (index: number) => {
        setImageError(prev => ({ ...prev, [index]: true }));
    };

    return (
        <div className="space-y-24">
            {/* Main Product Section */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
                {/* Image Gallery */}
                <div className="space-y-4 animate-fade-in">
                    {/* Main Image */}
                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">
                        <Image
                            src={images[selectedImage]}
                            alt={product.title}
                            fill
                            className="object-cover transition-all duration-500"
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            unoptimized
                            onError={() => handleImageError(selectedImage)}
                        />
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={cn(
                                        "relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 transition-all duration-200",
                                        selectedImage === index
                                            ? "ring-2 ring-[#0ea5e9] ring-offset-2"
                                            : "opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <Image
                                        src={img}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                        unoptimized
                                        onError={() => handleImageError(index)}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                    {/* Category & Rating */}
                    <div className="flex items-center gap-4 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-[#f0f9ff] rounded-full text-[#0ea5e9]">
                            <Zap className="h-3 w-3" />
                            {product.category?.name || "Product"}
                        </span>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn("h-4 w-4", i < 4 ? "fill-[#0ea5e9] text-[#0ea5e9]" : "text-gray-200")}
                                />
                            ))}
                            <span className="ml-2 text-sm text-gray-500">(128 reviews)</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        {product.title}
                    </h1>

                    {/* Price */}
                    <div className="mt-6 flex items-baseline gap-4">
                        <span className="text-3xl sm:text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        <span className="text-lg text-gray-400 line-through">${(product.price * 1.3).toFixed(2)}</span>
                        <span className="px-2 py-1 text-sm font-semibold text-[#0ea5e9] bg-[#f0f9ff] rounded-lg">Save 23%</span>
                    </div>

                    {/* Description */}
                    <p className="mt-8 text-lg text-gray-600 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Features */}
                    <div className="mt-8 flex flex-wrap gap-3">
                        <span className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-full">
                            <Check className="h-4 w-4 text-green-500" />
                            In Stock
                        </span>
                        <span className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-full">
                            <Truck className="h-4 w-4 text-[#0ea5e9]" />
                            Free Shipping
                        </span>
                        <span className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-full">
                            <RotateCcw className="h-4 w-4 text-[#0ea5e9]" />
                            30-Day Returns
                        </span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="flex-1 h-14 text-base font-semibold rounded-full btn-press gap-2 bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] hover:from-[#0284c7] hover:to-[#0369a1]">
                            <ShoppingCart className="h-5 w-5" />
                            Add to Cart
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className={cn(
                                "h-14 px-6 text-base font-semibold rounded-full btn-press gap-2",
                                isWishlisted && "bg-[#f0f9ff] border-[#0ea5e9] text-[#0ea5e9]"
                            )}
                            onClick={() => setIsWishlisted(!isWishlisted)}
                        >
                            <Heart className={cn("h-5 w-5", isWishlisted && "fill-[#0ea5e9]")} />
                            {isWishlisted ? "Saved" : "Save"}
                        </Button>
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-full btn-press">
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-10 pt-10 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#06b6d4]/20 to-[#0ea5e9]/20 flex items-center justify-center">
                                <Truck className="h-6 w-6 text-[#0ea5e9]" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Free Delivery</p>
                                <p className="text-xs text-gray-500">Orders over $100</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#06b6d4]/20 to-[#0ea5e9]/20 flex items-center justify-center">
                                <RotateCcw className="h-6 w-6 text-[#0ea5e9]" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Easy Returns</p>
                                <p className="text-xs text-gray-500">30-day policy</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#06b6d4]/20 to-[#0ea5e9]/20 flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6 text-[#0ea5e9]" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Secure Payment</p>
                                <p className="text-xs text-gray-500">SSL encrypted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Rows */}
            <div className="space-y-20 border-t border-gray-100 pt-20">
                {/* Row 1: You may also like */}
                <RelatedProducts
                    categoryId={product.category.id}
                    currentProductId={product.id}
                    title="You May Also Like"
                    subtitle="Similar Products"
                    offset={0}
                    limit={4}
                    icon={Zap}
                />

                {/* Row 2: Recommended Products */}
                <RelatedProducts
                    categoryId={product.category.id}
                    currentProductId={product.id}
                    title="Recommended For You"
                    subtitle="Hand Picked"
                    offset={5} // Offset by 5 to ensure distinct products from first row
                    limit={4}
                    icon={ThumbsUp}
                />
            </div>
        </div>
    );
}
