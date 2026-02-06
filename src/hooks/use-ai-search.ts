"use client";

import { useSyncExternalStore } from "react";
import { onStoreEvent } from "@/lib/store-events";
import type { LegacyProduct } from "@/lib/types";

interface AISearchState {
  /** The search query the AI used */
  query: string | null;
  /** The product results from the AI search */
  results: LegacyProduct[];
  /** Whether AI search results are currently being displayed */
  isActive: boolean;
}

// 1. Define the store state and listeners outside the hook (Singleton pattern)
let currentState: AISearchState = {
  query: null,
  results: [],
  isActive: false,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

// 2. Subscribe to the external event source (Event Bus)
// This ensures our local store stays in sync with the event bus
if (typeof window !== "undefined") {
    onStoreEvent((event) => {
      if (event.type === "product-search" && event.payload) {
        const { query, results } = event.payload as {
          query: string;
          results: LegacyProduct[];
        };
        currentState = {
          query: query ?? null,
          results: results ?? [],
          isActive: true,
        };
        notify();
      }
    });
}

const store = {
  subscribe(callback: () => void) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  getSnapshot() {
    return currentState;
  },
  getServerSnapshot() {
    return currentState;
  },
  clear() {
    currentState = { query: null, results: [], isActive: false };
    notify();
  }
};

/**
 * Hook that listens for "product-search" store events emitted by Tambo AI tools
 * and exposes the search results + query so the products page can display them.
 * 
 * Refactored to use `useSyncExternalStore` effectively.
 */
export function useAISearchResults() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return {
    aiSearchQuery: state.query,
    aiSearchResults: state.results,
    isAISearchActive: state.isActive,
    clearAISearch: store.clear,
  };
}
