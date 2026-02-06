"use client";

import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { TamboWrapper } from "@/components/tambo/tambo-provider";
import { TamboFab } from "@/components/tambo/tambo-fab";
import { onStoreEvent, type StoreEvent } from "@/lib/store-events";
import { HighlightOverlay } from "@/components/ui/highlight-overlay";

const QUERY_KEY_MAP: Record<string, string[][]> = {
    cart: [["cart"]],
    likes: [["likes"]],
};

/** Syncs Tambo tool mutations with React Query caches and triggers side-effects */
function StoreEventSync() {
    const qc = useQueryClient();
    const router = useRouter();

    useEffect(() => {
        return onStoreEvent((event: StoreEvent) => {
            const { type, payload } = event;

            // Invalidate related React Query caches
            const keys = QUERY_KEY_MAP[type];
            if (keys) {
                keys.forEach((key) => qc.invalidateQueries({ queryKey: key }));
            }

            // Handle navigation events
            if (type === "navigation" && payload?.path) {
                router.push(payload.path as string);
            }

            // Handle checkout redirect
            if (type === "checkout" && payload?.url) {
                window.location.href = payload.url as string;
            }

            // Handle profile updates — refresh router to re-fetch session data
            if (type === "profile") {
                router.refresh();
            }
        });
    }, [qc, router]);

    return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <StoreEventSync />
            <TamboWrapper>
                {children}
                <TamboFab />
                <HighlightOverlay />
            </TamboWrapper>
            <Toaster />
        </QueryClientProvider>
    );
}
