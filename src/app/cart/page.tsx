"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const { cart, isLoading, updateItem, removeItem } = useCart();

    // Helpers
    const getImageSrc = (image: string) => {
        if (!image) return PLACEHOLDER_IMAGE;
        let src = image;
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

    if (isLoading) {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-20 min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ea5e9]"></div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
                <Image src={PLACEHOLDER_IMAGE} alt="Empty Cart" width={200} height={200} className="opacity-20 mb-6 grayscale" />
                {/* Could use a better empty cart illustration */}

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
                <p className="text-gray-500 mb-8 max-w-md">
                    Looks like you haven't added anything to your cart yet. Explore our premium selection of tech products.
                </p>
                <Link href="/products">
                    <Button size="lg" className="h-12 px-8 rounded-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 lg:px-8 py-10" data-highlight="cart-page">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({cart.items.length})</h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Cart Items List */}
                <div className="flex-1 space-y-6">
                    {cart.items.map((item) => (
                        <div key={item.id} className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            {/* Product Image */}
                            <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                                {item.product && (
                                    <Image
                                        src={getImageSrc(item.product.image)}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {item.product?.name || "Product Name Unavailable"}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                                {item.product?.description}
                                            </p>
                                        </div>
                                        <p className="font-bold text-gray-900 text-lg">
                                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-100">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full hover:bg-white hover:text-gray-900"
                                            onClick={() => {
                                                if (item.quantity > 1) {
                                                    updateItem({ itemId: item.id, quantity: item.quantity - 1 });
                                                } else {
                                                    removeItem({ itemId: item.id });
                                                }
                                            }}
                                            disabled={isLoading}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full hover:bg-white hover:text-gray-900"
                                            onClick={() => updateItem({ itemId: item.id, quantity: item.quantity + 1 })}
                                            disabled={isLoading}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => removeItem({ itemId: item.id })}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-96">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${cart.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (Estimated)</span>
                                <span>${(cart.total * 0.08).toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-gray-100 my-4" />
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>${(cart.total * 1.08).toFixed(2)}</span>
                            </div>
                        </div>

                        <CheckoutButton />

                        <p className="text-xs text-center text-gray-400 mt-4">
                            Secure Checkout powered by Stripe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckoutButton() {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/checkout", {
                method: "POST",
            });

            if (!response.ok) {
                // Handle error (maybe show a toast)
                console.error("Failed to create checkout session");
                return;
            }

            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] hover:from-[#0284c7] hover:to-[#0369a1] text-white shadow-lg shadow-[#0ea5e9]/20 btn-press"
        >
            {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
                <>
                    Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                </>
            )}
        </Button>
    );
}
import * as React from "react";
