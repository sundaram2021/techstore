"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartItem, removeFromCart } from "@/lib/actions";
import { Product } from "@/lib/types";

// Type for the cart returned by getCart
// We extract the item type for easier usage in helpers
type CartData = Awaited<ReturnType<typeof getCart>>;
type CartItem = CartData["items"][number];

function calculateCartTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => {
        return acc + ((item.product?.price || 0) * item.quantity);
    }, 0);
}

export function useCart() {
    const queryClient = useQueryClient();
    const queryKey = ["cart"];

    const { data: cart, isLoading } = useQuery({
        queryKey,
        queryFn: async () => await getCart(),
    });

    const addToCartMutation = useMutation({
        mutationFn: async ({ productId, quantity }: { productId: string; quantity: number, product: Product }) => {
            return await addToCart(productId, quantity);
        },
        onMutate: async ({ productId, quantity, product }) => {
            await queryClient.cancelQueries({ queryKey });

            const previousCart = queryClient.getQueryData<CartData>(queryKey);

            // Default empty cart structure if none exists
            const currentCart = previousCart || { items: [], total: 0 };
            const items = currentCart.items || [];

            const existingItemIndex = items.findIndex((item) => item.productId === productId);
            
            let newItems = [...items];
            
            if (existingItemIndex > -1) {
                const existingItem = newItems[existingItemIndex];
                newItems[existingItemIndex] = {
                    ...existingItem,
                    quantity: existingItem.quantity + quantity,
                };
            } else {
                // Optimistic new item
                // We ensure it matches the CartItem shape as closely as possible
                const newItem: CartItem = {
                    id: `temp-${Date.now()}`,
                    cartId: "id" in currentCart ? currentCart.id : "temp-cart-id", 
                    productId,
                    quantity,
                    addedAt: new Date(), // Optimistic Date
                    product: product,
                };
                newItems.unshift(newItem);
            }

            const newTotal = calculateCartTotal(newItems);

            // We need to preserve other properties if they exist
            // using "as CartData" is safer than "as any" here as we know we've adhered to the shape
            const newCart = {
                ...currentCart,
                items: newItems,
                total: newTotal
            } as CartData;

            queryClient.setQueryData<CartData>(queryKey, newCart);

            return { previousCart };
        },
        onError: (err, newTodo, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(queryKey, context.previousCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const updateItemMutation = useMutation({
        mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
            return await updateCartItem(itemId, quantity);
        },
        onMutate: async ({ itemId, quantity }) => {
            await queryClient.cancelQueries({ queryKey });

            const previousCart = queryClient.getQueryData<CartData>(queryKey);

            if (previousCart && previousCart.items) {
                const newItems = previousCart.items.map(item => 
                    item.id === itemId ? { ...item, quantity } : item
                );

                const newTotal = calculateCartTotal(newItems);

                queryClient.setQueryData<CartData>(queryKey, {
                    ...previousCart,
                    items: newItems,
                    total: newTotal
                } as CartData);
            }

            return { previousCart };
        },
        onError: (err, variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(queryKey, context.previousCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const removeItemMutation = useMutation({
        mutationFn: async ({ itemId }: { itemId: string }) => {
            return await removeFromCart(itemId);
        },
        onMutate: async ({ itemId }) => {
            await queryClient.cancelQueries({ queryKey });

            const previousCart = queryClient.getQueryData<CartData>(queryKey);

            if (previousCart && previousCart.items) {
                const newItems = previousCart.items.filter(item => item.id !== itemId);
                
                const newTotal = calculateCartTotal(newItems);

                queryClient.setQueryData<CartData>(queryKey, {
                    ...previousCart,
                    items: newItems,
                    total: newTotal
                } as CartData);
            }

            return { previousCart };
        },
        onError: (err, variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(queryKey, context.previousCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        cart,
        isLoading,
        addToCart: addToCartMutation.mutate,
        addToCartAsync: addToCartMutation.mutateAsync,
        updateItem: updateItemMutation.mutate,
        removeItem: removeItemMutation.mutate,
    };
}
