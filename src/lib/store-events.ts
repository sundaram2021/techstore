/**
 * Lightweight event bus for bridging Tambo tool mutations
 * with the React Query cache so the UI updates in real-time.
 *
 * Tools fire events → the React-side listener invalidates queries.
 */

export type StoreEventType =
  | "cart"
  | "likes"
  | "profile"
  | "navigation"
  | "checkout"
  | "product-search"
  | "highlight";

export interface StoreEvent {
  type: StoreEventType;
  payload?: Record<string, unknown>;
}

type Listener = (event: StoreEvent) => void;

const listeners = new Set<Listener>();

/** Subscribe to store mutation events. Returns an unsubscribe fn. */
export function onStoreEvent(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Emit a store mutation event (called from Tambo tools). */
export function emitStoreEvent(
  type: StoreEventType,
  payload?: Record<string, unknown>,
) {
  listeners.forEach((fn) => fn({ type, payload }));
}
