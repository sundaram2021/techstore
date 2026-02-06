# TechStore

TechStore is a Next.js e-commerce app with an AI shopping assistant ("ShopMate AI") powered by [Tambo AI](https://tambo.co/). It supports product discovery, recommendations, cart actions, navigation help, and guided onboarding highlights.

The product catalog is seeded from `records.json`, while user state (sessions, carts, likes) is stored in Postgres via Drizzle + Better Auth.

## What this app includes

- **Catalog + browsing**: `/products` with filtering.
- **Cart + likes**: add/remove items, like/unlike products.
- **Checkout**: Stripe Checkout session creation via `/api/checkout`.
- **Email**: Resend emails for newsletter subscription and receipt email on successful checkout.
- **Auth**: Better Auth (email/password + Google).
- **AI assistant**: a floating chat (FAB) on every page, backed by Tambo tools + Gen UI components.

## Setup

### Prerequisites

- Node.js 20+ (or Bun). This repo includes `bun.lock`, so Bun is the easiest path.
- Postgres database.
- (Optional) Tambo API key for the AI assistant.
- (Optional) Stripe + Resend keys for checkout + email.

### 1) Install dependencies

```bash
bun install
```

### 2) Configure environment variables

Create `.env.local` in the repo root.

```bash
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/techstore

# App URL (used by Stripe success/cancel URLs)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth (Google is optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Admin access (optional): users with this email can view /admin/dashboard
ADMIN_EMAIL=

# Payments + email (optional, but required for checkout + emails)
STRIPE_SECRET_KEY=
RESEND_API_KEY=

# Tambo (optional): enables ShopMate AI
NEXT_PUBLIC_TAMBO_API_KEY=
```

Notes:

- If `NEXT_PUBLIC_TAMBO_API_KEY` is not set, the app still runs, but Tambo features are disabled (see `TamboWrapper` in `src/components/tambo/tambo-provider.tsx`).
- Checkout requires both `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_APP_URL` (see `src/app/api/checkout/route.ts`).

### Quick local setup (no payments/email/AI)

If you just want to run the app locally to browse the catalog and try auth/cart, you can start with only `DATABASE_URL`.

Leaving `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, and `NEXT_PUBLIC_TAMBO_API_KEY` empty means checkout, emails, and the ShopMate AI chat won’t work (and routes like `/api/checkout` will fail).

### 3) Create DB tables (Drizzle)

The schema lives in `src/lib/auth-schema.ts` and is referenced by `drizzle.config.ts`.

Quick start (push schema directly to your DB):

```bash
bunx drizzle-kit push
```

Optional (generate + migrate):

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

### 4) Run the app

```bash
bun dev
```

Open `http://localhost:3000`.

## Tambo AI: how it’s integrated

Tambo is wired into the app in one place so it’s available everywhere:

- `src/app/providers.tsx` wraps the whole app with:
  - `TamboWrapper` (SDK provider + tool/component registration)
  - `TamboFab` (floating chat entrypoint)
  - `StoreEventSync` (bridges tool side-effects into the UI)

### Provider + feature gating

`TamboWrapper` reads `NEXT_PUBLIC_TAMBO_API_KEY` and only enables Tambo when it’s present:

- If the key is missing: it logs a warning and renders children without the Tambo provider.
- If the key is present: it mounts `TamboProvider` from `@tambo-ai/react`, passing:
  - `components` from `src/components/tambo/component-registry.ts`
  - `tools` from `src/components/tambo/tools.ts`
  - `contextHelpers` from `src/components/tambo/context-helpers.ts`

### The chat (FAB) UI

The floating chat lives in `src/components/tambo` and uses `@tambo-ai/react` primitives:

- `TamboThreadProvider` (thread scope)
- `useTamboThread` / `useTamboThreadInput` (send + streaming state)
- `useTamboSuggestions` (dynamic follow-up actions)
- `useTamboGenerationStage` (loading indicator)
- `useTamboVoice` (voice input + transcription)

`TamboFab` also gates the chat behind auth: if there’s no session it redirects to `/sign-in`.

### Tool side-effects: keeping the UI in sync

Tambo tools don’t mutate React state directly. Instead they emit events via `src/lib/store-events.ts`:

```text
Tambo tool -> emitStoreEvent(type, payload)
          -> StoreEventSync (in providers.tsx)
          -> invalidate React Query caches / router navigation / checkout redirect
```

Examples:

- `addToCart` emits `cart` so `useCart()` refetches.
- `navigateToPage` emits `navigation` so the router pushes.
- `initiateCheckout` emits `checkout` and the browser navigates to Stripe.

Event types are centralized in `src/lib/store-events.ts`. When adding a new event (or changing a payload shape), update the emitting tool(s) and any consumers (`StoreEventSync`, `useAISearchResults`, `HighlightOverlay`) together.

When adding a new store event:

1. Add the type (and any expected payload fields) in `src/lib/store-events.ts`.
2. Emit it from your Tambo tool via `emitStoreEvent(type, payload)`.
3. Handle it in the relevant consumer (`StoreEventSync`, `useAISearchResults`, `HighlightOverlay`).

### AI search that updates the Products page

`searchProducts` and other catalog tools emit `product-search`. The `/products` page listens via `useAISearchResults()` (`src/hooks/use-ai-search.ts`) and renders results using the same Gen UI list component used in chat:

- Listener: `useAISearchResults()`
- UI: `src/components/product/product-page-content.tsx`
- Renderer: `ProductListChat` (`src/components/tambo/generative/product-list-chat.tsx`)

### Onboarding + “show me where X is” highlighting

The `highlightElement` and `startOnboarding` tools emit `highlight` events.

- `HighlightOverlay` (`src/components/ui/highlight-overlay.tsx`) finds elements by their `data-highlight="..."` attribute, scrolls them into view, and adds a temporary highlight.
- Pages/components opt-in by adding `data-highlight` tags (for example: `data-highlight="featured-products"` on the home page section).

## Tambo tools used in this app

All tools are registered in `src/components/tambo/tools.ts`.

- **Catalog + discovery**: `searchProducts`, `getFilteredProducts`, `getProductById`, `getFeaturedProducts`, `getProductsByCategory`, `getCategories`, `getBrands`
- **Cart + likes**: `addToCart`, `removeFromCart`, `getCart`, `toggleLike`, `getLikes`
- **Navigation + flows**: `navigateToPage`, `initiateCheckout`
- **Account**: `updateUserProfile`, `signOut`
- **Guidance**: `highlightElement`, `startOnboarding`
- **Email**: `subscribeNewsletter`

Tool dependencies:

- `initiateCheckout` requires Stripe (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`).
- `subscribeNewsletter` (and checkout receipt email) require Resend (`RESEND_API_KEY`).

If those services aren’t configured in an environment, these tools will fail at runtime and shouldn’t be treated as always-available actions.

## Tambo Gen UI components used in this app

All components are registered in `src/components/tambo/component-registry.ts` (with Zod schemas in `src/components/tambo/schemas.ts`).

- `ProductCardChat`: single product card
- `ProductListChat`: list of products
- `ProductComparison`: compare 2–4 products
- `BudgetRecommendations`: budget-based picks
- `CartSummaryChat`: cart overview
- `CategoryBrowserChat`: category grid
- `NewsletterSignupChat`: newsletter inline signup
- `DashboardChartChat`: charts inside chat (bar/pie/area/line)
- `AuthFormChat`: sign-in/sign-up UI inside chat
- `OrderConfirmation`: order summary

Notes:

- `AuthFormChat` signs users in/up via the Better Auth client (`src/lib/auth-client.ts`) and then redirects to `/`.
- `DashboardChartChat` renders charts from a simple `Array<{ name: string; value: number }>` data shape.
