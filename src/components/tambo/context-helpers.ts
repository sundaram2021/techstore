"use client";

import { checkUserPermissions } from "@/lib/actions";

/**
 * Context helpers are called every time a message is sent.
 * They provide Tambo with awareness of the current app state.
 * ContextHelpers = Record<string, () => unknown>
 */
export function createContextHelpers() {
  return {
    current_page: () => {
      if (typeof window === "undefined") return { page: "/" };
      const path = window.location.pathname;
      const pageMap: Record<string, string> = {
        "/": "Home page with featured products, categories, and newsletter signup",
        "/products":
          "Product listing page with filters (category, brand, price, rating)",
        "/cart": "Shopping cart page — user can view, update, and remove items",
        "/sign-in": "Sign-in page for existing users",
        "/sign-up": "Registration page for new users",
        "/settings": "User settings page for profile management",
        "/admin/dashboard":
          "Admin dashboard with analytics charts (brands, categories, prices)",
        "/checkout/success": "Checkout success / order confirmation page",
      };

      const productMatch = path.match(/^\/products\/(.+)$/);
      const description = productMatch
        ? `Product detail page for product ID: ${productMatch[1]}`
        : (pageMap[path] ?? `Page: ${path}`);

      return {
        page: path,
        description,
        productId: productMatch?.[1] ?? null,
      };
    },

    app_capabilities: () => ({
      capabilities: [
        "Search and filter products by keyword, category, brand, price range, rating",
        "Show featured/popular products",
        "Browse product categories",
        "Add products to cart",
        "View and manage shopping cart",
        "Compare products side-by-side",
        "Find products within a budget",
        "Subscribe to newsletter",
        "Sign in or create an account",
        "Sign out / log out the user",
        "Visualize data with charts (bar, pie, area, line)",
        "Show order confirmation details",
        "Like/unlike products",
        "Navigate to any page (home, products, cart, settings, sign-in, sign-up, admin dashboard, product detail)",
        "Initiate checkout and redirect to Stripe payment",
        "Update user profile name",
        "Highlight any UI element on the page to show the user where it is (use highlightElement tool)",
        "Start an interactive onboarding tour that highlights key elements one by one (use startOnboarding tool)",
      ],
      permissions: [
        "IMPORTANT: Only admin users can access the admin dashboard page and dashboard-related features (analytics, charts, admin actions).",
        "If a non-admin user asks about dashboard, analytics, admin features, or tries to navigate to the admin dashboard, tell them: 'You're not allowed to access admin features. Only admin users have access.'",
        "All authenticated users can access: home, products, cart, settings, checkout, product details.",
        "Unauthenticated users should be directed to sign in first for features requiring authentication (cart, likes, checkout, settings, profile updates).",
        "The sign out tool can be used when the user asks to log out or sign out.",
      ],
    }),

    /** Provides user authentication status so the AI knows the user's role */
    user_auth_status: async () => {
      try {
        const perms = await checkUserPermissions();
        return {
          authenticated: perms.authenticated,
          isAdmin: perms.isAdmin,
          userName: perms.userName ?? null,
          note: perms.isAdmin
            ? "User is an admin. They can access all features including dashboard."
            : perms.authenticated
              ? "User is authenticated but NOT an admin. They cannot access dashboard/admin features. If they ask for dashboard-related things, tell them they are not allowed."
              : "User is not authenticated. They should sign in for features requiring auth.",
        };
      } catch {
        return {
          authenticated: false,
          isAdmin: false,
          userName: null,
          note: "Could not determine auth status.",
        };
      }
    },

    current_time: () => ({ time: new Date().toISOString() }),

    /** Provides list of highlightable UI elements on the current page */
    highlightable_elements: () => {
      if (typeof window === "undefined") return { elements: [] };
      const path = window.location.pathname;

      // Elements always available (navbar)
      const always = [
        { id: "logo", description: "TechStore logo / home link" },
        { id: "nav-home", description: "Home navigation link" },
        { id: "nav-products", description: "Products navigation link" },
        { id: "nav-categories", description: "Categories navigation link" },
        { id: "nav-deals", description: "Deals navigation link" },
        { id: "search-button", description: "Search button to find products" },
        { id: "cart-button", description: "Shopping cart button" },
        { id: "footer", description: "Footer with links and newsletter" },
      ];

      // Page-specific elements
      const pageElements: Record<
        string,
        Array<{ id: string; description: string }>
      > = {
        "/": [
          { id: "hero-section", description: "Hero banner with main CTAs" },
          {
            id: "shop-now-button",
            description: "Shop Now button linking to products",
          },
          { id: "featured-products", description: "Featured products section" },
          {
            id: "categories-section",
            description: "Product categories section",
          },
          {
            id: "newsletter-section",
            description: "Newsletter subscription section",
          },
          { id: "newsletter-form", description: "Email subscription form" },
          { id: "cta-section", description: "Browse All Products CTA" },
        ],
        "/products": [
          { id: "products-page", description: "Products listing page" },
        ],
        "/cart": [
          {
            id: "cart-page",
            description: "Shopping cart with items and checkout",
          },
        ],
        "/settings": [
          { id: "settings-page", description: "User profile settings" },
        ],
        "/admin/dashboard": [
          { id: "dashboard-page", description: "Admin analytics dashboard" },
        ],
      };

      const extra = pageElements[path] ?? [];

      return {
        elements: [...always, ...extra],
        note: "Use the highlightElement tool with any of these element IDs to visually highlight them. Use startOnboarding for a guided tour.",
      };
    },
  };
}
