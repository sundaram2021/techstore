"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, Heart, Eye, Zap } from "lucide-react";
import { toast } from "sonner";

import { LegacyProduct, Product } from "@/lib/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useLikes } from "@/hooks/use-likes";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface ProductCardProps {
    product: LegacyProduct;
    index?: number;
}

function mapLegacyToProduct(legacy: LegacyProduct): Product {
    return {
        objectID: legacy.id.toString(),
        name: legacy.title,
        description: legacy.description,
        brand: "Unknown",
        categories: [legacy.category.name],
        hierarchicalCategories: { lvl0: legacy.category.name },
        type: "Product",
        price: legacy.price,
        price_range: "$$",
        image: legacy.images[0] || "",
        url: "",
        free_shipping: false,
        popularity: 0,
        rating: 0,
    };
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { data: session } = authClient.useSession();
    const router = useRouter();

    // Hooks
    const { addToCart } = useCart();
    const { isLiked, toggleLike } = useLikes();

    const liked = isLiked(product.id.toString());

    // Clean and validate image URL (existing code)
    const getImageSrc = () => {
        if (imageError || !product.images?.length) {
            return PLACEHOLDER_IMAGE;
        }
        let src = product.images[0];
        src = src.replace(/^[\[\"\']+|[\]\"\'\\s]+$/g, "");
        src = src.replace(/\\\\/g, "");
        if (src.includes("placehold") || src.includes("placeholder")) {
            return PLACEHOLDER_IMAGE;
        }
        if (!src.startsWith("http") && !src.startsWith("/")) {
            return PLACEHOLDER_IMAGE;
        }
        return src;
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!session) {
            router.push("/sign-in");
            return;
        }

        const productPayload = mapLegacyToProduct(product);

        addToCart({
            productId: product.id.toString(),
            quantity: 1,
            product: productPayload
        });
    };

    const handleToggleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!session) {
            router.push("/sign-in");
            return;
        }
        toggleLike(product.id.toString());
    };

    return (
        <Card
            className={cn(
                "group relative overflow-hidden rounded-2xl border-0 bg-white shadow-sm transition-all duration-500",
                "hover:shadow-xl hover:shadow-[#0ea5e9]/10",
                "opacity-0 animate-fade-in-up"
            )}
            style={{ animationDelay: `${index * 75}ms`, animationFillMode: "forwards" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <Link
                href={`/products/${product.id}`}
                className="block relative aspect-[4/5] overflow-hidden bg-gray-50"
            >
                <Image
                    src={getImageSrc()}
                    alt={product.title}
                    fill
                    className={cn(
                        "object-cover transition-all duration-700",
                        isHovered ? "scale-110" : "scale-100"
                    )}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    onError={() => setImageError(true)}
                />

                {/* Overlay on hover */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/0 transition-all duration-300",
                        isHovered ? "bg-black/10" : ""
                    )}
                />

                {/* Quick Actions */}
                <div
                    className={cn(
                        "absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300",
                        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                >
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 h-11 bg-white/95 backdrop-blur-sm hover:bg-[#0ea5e9] hover:text-white rounded-xl font-medium btn-press"
                        onClick={handleAddToCart}
                    >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                            "h-11 w-11 bg-white/95 backdrop-blur-sm rounded-xl btn-press",
                            liked ? "text-red-500 hover:text-red-600 hover:bg-white" : "hover:bg-[#0ea5e9] hover:text-white"
                        )}
                        onClick={handleToggleLike}
                    >
                        <Heart className={cn("h-4 w-4", liked && "fill-current")} />
                    </Button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full text-gray-700">
                        <Zap className="h-3 w-3 text-[#0ea5e9]" />
                        {product.category?.name || "Product"}
                    </span>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <Link href={`/products/${product.id}`}>
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#0ea5e9] transition-colors">
                                {product.title}
                            </h3>
                        </Link>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                            {product.description}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </p>
                    <Link href={`/products/${product.id}`}>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#0ea5e9] gap-1 -mr-2">
                            <Eye className="h-4 w-4" />
                            View
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
