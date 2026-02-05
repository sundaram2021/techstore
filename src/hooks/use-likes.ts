"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLikes, toggleLike } from "@/lib/actions";

export function useLikes() {
    const queryClient = useQueryClient();
    const queryKey = ["likes"];

    const { data: likes = [], isLoading } = useQuery({
        queryKey,
        queryFn: async () => await getLikes(),
    });

    const toggleLikeMutation = useMutation({
        mutationFn: async (productId: string) => {
            return await toggleLike(productId);
        },
        onMutate: async (productId: string) => {
            await queryClient.cancelQueries({ queryKey });

            const previousLikes = queryClient.getQueryData<string[]>(queryKey) || [];
            
            let newLikes: string[];
            if (previousLikes.includes(productId)) {
                newLikes = previousLikes.filter(id => id !== productId);
            } else {
                newLikes = [...previousLikes, productId];
            }

            queryClient.setQueryData<string[]>(queryKey, newLikes);

            return { previousLikes };
        },
        onError: (err, productId, context) => {
            if (context?.previousLikes) {
                queryClient.setQueryData(queryKey, context.previousLikes);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const isLiked = (productId: string) => likes.includes(productId);

    return {
        likes,
        isLoading,
        isLiked,
        toggleLike: toggleLikeMutation.mutate,
    };
}
