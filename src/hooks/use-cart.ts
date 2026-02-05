"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartItem, removeFromCart } from "@/lib/actions";
import { Product } from "@/lib/types";

// Type for the cart returned by getCart
type CartData = Awaited<ReturnType<typeof getCart>>;

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
            
            // Check if items exists, if not initialize it (though type says it should exist if total exists)
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
                newItems.unshift({
                    id: `temp-${Date.now()}`,
                    cartId: (currentCart as any).id || "temp-cart-id", 
                    productId,
                    quantity,
                    addedAt: new Date(),
                    product: product,
                });
            }

            // Recalculate total
            const newTotal = newItems.reduce((acc, item) => {
                 return acc + ((item.product?.price || 0) * item.quantity);
            }, 0);

            // We need to preserve other properties if they exist
            const newCart = {
                ...currentCart,
                items: newItems,
                total: newTotal
            } as any; // Cast to any to satisfy the union type

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

                 // Recalculate total
                 const newTotal = newItems.reduce((acc, item) => {
                    return acc + ((item.product?.price || 0) * item.quantity);
               }, 0);

                queryClient.setQueryData<CartData>(queryKey, {
                    ...previousCart,
                    items: newItems,
                    total: newTotal
                } as any);
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
                
                  // Recalculate total
                  const newTotal = newItems.reduce((acc, item) => {
                    return acc + ((item.product?.price || 0) * item.quantity);
               }, 0);

                queryClient.setQueryData<CartData>(queryKey, {
                    ...previousCart,
                    items: newItems,
                    total: newTotal
                } as any);
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
