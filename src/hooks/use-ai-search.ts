"use client";

import { useState, useEffect, useCallback } from "react";
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

/**
 * Hook that listens for "product-search" store events emitted by Tambo AI tools
 * and exposes the search results + query so the products page can display them.
 */
export function useAISearchResults() {
  const [state, setState] = useState<AISearchState>({
    query: null,
    results: [],
    isActive: false,
  });

  useEffect(() => {
    return onStoreEvent((event) => {
      if (event.type === "product-search" && event.payload) {
        const { query, results } = event.payload as {
          query: string;
          results: LegacyProduct[];
        };
        setState({
          query: query ?? null,
          results: results ?? [],
          isActive: true,
        });
      }
    });
  }, []);

  const clearAISearch = useCallback(() => {
    setState({ query: null, results: [], isActive: false });
  }, []);

  return {
    aiSearchQuery: state.query,
    aiSearchResults: state.results,
    isAISearchActive: state.isActive,
    clearAISearch,
  };
}
