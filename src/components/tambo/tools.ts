import { z } from "zod/v3";
import type { TamboTool } from "@tambo-ai/react";
import {
  searchProducts,
  getProducts,
  getProduct,
  getCategories,
  getBrands,
  getFeaturedProducts,
  getProductsByCategory,
} from "@/lib/api";
import {
  addToCart,
  removeFromCart,
  getCart,
  toggleLike,
  getLikes,
  subscribeToNewsletter,
  getSession,
  checkUserPermissions,
} from "@/lib/actions";
import { emitStoreEvent } from "@/lib/store-events";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

async function requireAuthenticated(actionLabel: string) {
  const perms = await checkUserPermissions();
  if (!perms.authenticated) {
    toast.error("Please sign in first");
    emitStoreEvent("navigation", { path: "/sign-in" });
    return { ok: false, perms, error: `Sign in required to ${actionLabel}.` };
  }
  return { ok: true, perms };
}

// ── Product search ──
export const searchProductsTool: TamboTool = {
  name: "searchProducts",
  description:
    "Search for products by keyword. Returns matching products with title, price, image, and category. Use this when the user asks to find, search, or look for products. The search results will also be shown on the main products page.",
  tool: async (input: { query: string; limit?: number }) => {
    const authCheck = await requireAuthenticated("search products");
    if (!authCheck.ok) return [];
    const results = await searchProducts(input.query, 0, input.limit ?? 20);
    // Sync results to the main products page UI
    emitStoreEvent("product-search", { query: input.query, results });
    // Navigate to /products if user is not already there
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/products"
    ) {
      emitStoreEvent("navigation", { path: "/products" });
    }
    return results;
  },
  inputSchema: z.object({
    query: z.string().describe("Search term"),
    limit: z.number().optional().describe("Max results, default 20"),
  }),
  outputSchema: z.array(z.any()),
};

// ── Filtered products ──
export const getFilteredProductsTool: TamboTool = {
  name: "getFilteredProducts",
  description:
    "Get products with filters: category, brand, price range, or rating. Use when user asks to browse by category, filter by brand, or find products in a price range.",
  tool: async (input: {
    category?: string;
    brand?: string[];
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    limit?: number;
  }) => {
    const authCheck = await requireAuthenticated("browse products");
    if (!authCheck.ok) return [];
    const results = await getProducts(0, input.limit ?? 8, {
      category: input.category,
      brand: input.brand,
      minPrice: input.minPrice,
      maxPrice: input.maxPrice,
      rating: input.rating,
    });

    const parts: string[] = [];
    if (input.category) parts.push(`Category: ${input.category}`);
    if (input.brand?.length) parts.push(`Brand: ${input.brand.join(", ")}`);
    if (input.minPrice !== undefined || input.maxPrice !== undefined) {
      parts.push(`Price: ${input.minPrice ?? 0}-${input.maxPrice ?? "max"}`);
    }
    if (input.rating !== undefined) parts.push(`Rating: ${input.rating}+`);

    const queryLabel =
      parts.length > 0 ? parts.join(" | ") : "Filtered products";

    emitStoreEvent("product-search", { query: queryLabel, results });
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/products"
    ) {
      emitStoreEvent("navigation", { path: "/products" });
    }

    return results;
  },
  inputSchema: z.object({
    category: z.string().optional().describe("Category name to filter"),
    brand: z.array(z.string()).optional().describe("Brand names"),
    minPrice: z.number().optional().describe("Minimum price"),
    maxPrice: z.number().optional().describe("Maximum price"),
    rating: z.number().optional().describe("Minimum rating"),
    limit: z.number().optional().describe("Max results, default 8"),
  }),
  outputSchema: z.array(z.any()),
};

// ── Single product ──
export const getProductByIdTool: TamboTool = {
  name: "getProductById",
  description: "Get detailed info for a single product by its ID.",
  tool: async (input: { productId: string }) => {
    const authCheck = await requireAuthenticated("view products");
    if (!authCheck.ok) return null;
    return await getProduct(input.productId);
  },
  inputSchema: z.object({
    productId: z.string().describe("Product objectID"),
  }),
  outputSchema: z.any(),
};

// ── Categories ──
export const getCategoriesList: TamboTool = {
  name: "getCategories",
  description:
    "Get all product categories. Use when user asks to browse or see categories.",
  tool: async () => {
    const authCheck = await requireAuthenticated("browse categories");
    if (!authCheck.ok) return [];
    return await getCategories();
  },
  inputSchema: z.object({}),
  outputSchema: z.array(z.any()),
};

// ── Brands ──
export const getBrandsList: TamboTool = {
  name: "getBrands",
  description: "Get all available product brands.",
  tool: async () => {
    const authCheck = await requireAuthenticated("browse brands");
    if (!authCheck.ok) return [];
    return await getBrands();
  },
  inputSchema: z.object({}),
  outputSchema: z.array(z.string()),
};

// ── Featured products ──
export const getFeaturedTool: TamboTool = {
  name: "getFeaturedProducts",
  description:
    "Get curated featured/popular products. Use when user asks for best, popular, or featured products.",
  tool: async () => {
    const authCheck = await requireAuthenticated("view featured products");
    if (!authCheck.ok) return [];
    return await getFeaturedProducts();
  },
  inputSchema: z.object({}),
  outputSchema: z.array(z.any()),
};

// ── Products by category ──
export const getProductsByCategoryTool: TamboTool = {
  name: "getProductsByCategory",
  description: "Get products from a specific category.",
  tool: async (input: { category: string; limit?: number }) => {
    const authCheck = await requireAuthenticated("browse products");
    if (!authCheck.ok) return [];
    const results = await getProductsByCategory(
      input.category,
      0,
      input.limit ?? 8,
    );
    emitStoreEvent("product-search", {
      query: `Category: ${input.category}`,
      results,
    });
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/products"
    ) {
      emitStoreEvent("navigation", { path: "/products" });
    }
    return results;
  },
  inputSchema: z.object({
    category: z.string().describe("Category name"),
    limit: z.number().optional().describe("Max results"),
  }),
  outputSchema: z.array(z.any()),
};

// ── Add to cart ──
export const addToCartTool: TamboTool = {
  name: "addToCart",
  description:
    "Add a product to the user's shopping cart. Requires the product objectID. Use when user asks to add something to cart.",
  tool: async (input: { productId: string; quantity?: number }) => {
    const result = await addToCart(input.productId, input.quantity ?? 1);
    emitStoreEvent("cart");
    toast.success("Product added to cart");
    return result;
  },
  inputSchema: z.object({
    productId: z.string().describe("Product objectID to add"),
    quantity: z.number().optional().describe("Quantity, default 1"),
  }),
  outputSchema: z.object({ success: z.boolean() }),
};

// ── Remove from cart ──
export const removeFromCartTool: TamboTool = {
  name: "removeFromCart",
  description: "Remove an item from the user's cart by cart item ID.",
  tool: async (input: { itemId: string }) => {
    const result = await removeFromCart(input.itemId);
    emitStoreEvent("cart");
    toast.success("Item removed from cart");
    return result;
  },
  inputSchema: z.object({
    itemId: z.string().describe("Cart item ID to remove"),
  }),
  outputSchema: z.object({ success: z.boolean() }),
};

// ── Get cart ──
export const getCartTool: TamboTool = {
  name: "getCart",
  description: "Get the user's current shopping cart with items and total.",
  tool: async () => await getCart(),
  inputSchema: z.object({}),
  outputSchema: z.any(),
};

// ── Toggle like ──
export const toggleLikeTool: TamboTool = {
  name: "toggleLike",
  description: "Like or unlike a product for the user.",
  tool: async (input: { productId: string }) => {
    const result = await toggleLike(input.productId);
    emitStoreEvent("likes");
    toast.success(result.liked ? "Product liked" : "Product unliked");
    return result;
  },
  inputSchema: z.object({
    productId: z.string().describe("Product objectID"),
  }),
  outputSchema: z.object({ liked: z.boolean() }),
};

// ── Get likes ──
export const getLikesTool: TamboTool = {
  name: "getLikes",
  description: "Get list of product IDs the user has liked.",
  tool: async () => await getLikes(),
  inputSchema: z.object({}),
  outputSchema: z.array(z.string()),
};

// ── Subscribe newsletter ──
export const subscribeNewsletterTool: TamboTool = {
  name: "subscribeNewsletter",
  description:
    "Subscribe an email to the TechStore newsletter. Ask the user for their email first.",
  tool: async (input: { email: string }) => {
    return await subscribeToNewsletter(input.email);
  },
  inputSchema: z.object({
    email: z.string().describe("Email address to subscribe"),
  }),
  outputSchema: z.object({ success: z.boolean() }),
};

// ── Navigate to page ──
const PAGE_ROUTES: Record<string, string> = {
  home: "/",
  products: "/products",
  cart: "/cart",
  settings: "/settings",
  "sign-in": "/sign-in",
  "sign-up": "/sign-up",
  "admin-dashboard": "/admin/dashboard",
  "checkout-success": "/checkout/success",
};

// Pages that don't require authentication
const PUBLIC_PAGES = new Set([
  "home",
  "products",
  "sign-in",
  "sign-up",
  "product-detail",
]);
// Pages that require admin role
const ADMIN_PAGES = new Set(["admin-dashboard"]);

export const navigateToPageTool: TamboTool = {
  name: "navigateToPage",
  description:
    "Navigate the user to a different page in the app. Use when user asks to go to a page, open a page, take me to, navigate to, etc. For product detail pages pass the product objectID. Note: admin dashboard is only accessible to admin users.",
  tool: async (input: { page: string; productId?: string }) => {
    // ── Permission checks ──
    if (!PUBLIC_PAGES.has(input.page)) {
      const perms = await checkUserPermissions();

      if (!perms.authenticated) {
        toast.error("Please sign in first");
        emitStoreEvent("navigation", { path: "/sign-in" });
        return {
          navigatedTo: "/sign-in",
          error: "Not authenticated. Please sign in first.",
        };
      }

      if (ADMIN_PAGES.has(input.page) && !perms.isAdmin) {
        toast.error("Sorry, you're not allowed to access admin features");
        return {
          navigatedTo: null,
          error:
            "Sorry, you're not allowed to access the admin dashboard. Only admin users have access.",
        };
      }
    }

    let path: string;
    if (input.page === "product-detail" && input.productId) {
      path = `/products/${input.productId}`;
    } else {
      path = PAGE_ROUTES[input.page] ?? "/";
    }
    emitStoreEvent("navigation", { path });
    toast.success(`Navigating to ${input.page.replace("-", " ")}`);
    return { navigatedTo: path };
  },
  inputSchema: z.object({
    page: z
      .enum([
        "home",
        "products",
        "cart",
        "settings",
        "sign-in",
        "sign-up",
        "admin-dashboard",
        "product-detail",
        "checkout-success",
      ])
      .describe("Target page name"),
    productId: z
      .string()
      .optional()
      .describe("Product ID for product detail page"),
  }),
  outputSchema: z.object({
    navigatedTo: z.string().nullable(),
    error: z.string().optional(),
  }),
};

// ── Initiate checkout ──
export const initiateCheckoutTool: TamboTool = {
  name: "initiateCheckout",
  description:
    "Start the checkout process for the user's cart. Redirects user to Stripe checkout. Use when user says checkout, pay, buy, purchase, or complete order.",
  tool: async () => {
    const session = await getSession();
    if (!session) {
      toast.error("Please sign in to checkout");
      emitStoreEvent("navigation", { path: "/sign-in" });
      return { success: false, error: "Not authenticated" };
    }
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        toast.success("Redirecting to checkout...");
        emitStoreEvent("checkout", { url: data.url });
        return { success: true, checkoutUrl: data.url };
      }
      toast.error(data.error || "Checkout failed");
      return {
        success: false,
        error: data.error || "Failed to create checkout session",
      };
    } catch {
      toast.error("Checkout failed. Please try again.");
      return { success: false, error: "Checkout request failed" };
    }
  },
  inputSchema: z.object({}),
  outputSchema: z.object({
    success: z.boolean(),
    checkoutUrl: z.string().optional(),
    error: z.string().optional(),
  }),
};

// ── Update user profile ──
export const updateUserProfileTool: TamboTool = {
  name: "updateUserProfile",
  description:
    "Update the user's profile name. Use when user asks to change name, update profile, or rename.",
  tool: async (input: { name: string }) => {
    try {
      await authClient.updateUser({ name: input.name });
      emitStoreEvent("profile", { name: input.name });
      toast.success(`Name updated to "${input.name}"`);
      return { success: true, updatedName: input.name };
    } catch {
      toast.error("Failed to update profile");
      return { success: false, error: "Update failed" };
    }
  },
  inputSchema: z.object({
    name: z.string().describe("New display name for the user"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    updatedName: z.string().optional(),
    error: z.string().optional(),
  }),
};

// ── Sign out ──
export const signOutTool: TamboTool = {
  name: "signOut",
  description:
    "Sign out / log out the current user. Use when user asks to sign out, log out, or logout.",
  tool: async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      emitStoreEvent("navigation", { path: "/" });
      return { success: true };
    } catch {
      toast.error("Failed to sign out");
      return { success: false, error: "Sign out failed" };
    }
  },
  inputSchema: z.object({}),
  outputSchema: z.object({
    success: z.boolean(),
    error: z.string().optional(),
  }),
};

// ── Highlight UI element ──
const HIGHLIGHT_ELEMENTS = [
  "logo",
  "nav-home",
  "nav-products",
  "nav-categories",
  "nav-deals",
  "search-button",
  "cart-button",
  "user-menu",
  "sign-in-button",
  "hero-section",
  "shop-now-button",
  "featured-products",
  "categories-section",
  "newsletter-section",
  "newsletter-form",
  "cta-section",
  "footer",
  "products-page",
  "cart-page",
  "settings-page",
  "dashboard-page",
] as const;

export const highlightElementTool: TamboTool = {
  name: "highlightElement",
  description:
    "Highlight a UI element on the page to show the user where it is. The element will get a glowing cyan border for a few seconds and scroll into view. Use when the user asks 'where is X?', 'show me the cart button', 'how do I search?', 'find the settings', or needs visual guidance to locate something on the page. Always provide a helpful label describing what the element does.",
  tool: async (input: { elementId: string; label?: string }) => {
    const label = input.label ?? input.elementId.replace(/-/g, " ");
    emitStoreEvent("highlight", {
      elementId: input.elementId,
      label,
      duration: 3500,
    });
    return { success: true, highlighted: input.elementId };
  },
  inputSchema: z.object({
    elementId: z
      .enum(HIGHLIGHT_ELEMENTS as unknown as [string, ...string[]])
      .describe("The identifier of the UI element to highlight"),
    label: z
      .string()
      .optional()
      .describe(
        "A short description shown as a tooltip near the highlighted element, e.g. 'Click here to view your cart'",
      ),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    highlighted: z.string(),
  }),
};

// ── Onboarding tour ──
const ONBOARDING_STEPS: Record<
  string,
  Array<{ elementId: string; label: string }>
> = {
  home: [
    { elementId: "logo", label: "TechStore logo — click to return home" },
    { elementId: "nav-products", label: "Browse all products here" },
    { elementId: "search-button", label: "Search for any product instantly" },
    { elementId: "cart-button", label: "View your shopping cart" },
    {
      elementId: "featured-products",
      label: "Check out our featured products",
    },
    { elementId: "categories-section", label: "Browse products by category" },
    {
      elementId: "newsletter-section",
      label: "Subscribe for exclusive tech updates",
    },
  ],
  products: [
    { elementId: "search-button", label: "Search for specific products" },
    { elementId: "products-page", label: "Browse and filter the full catalog" },
    { elementId: "cart-button", label: "Items you add will appear here" },
  ],
  cart: [
    { elementId: "cart-page", label: "Review items in your cart" },
    { elementId: "nav-products", label: "Continue shopping here" },
  ],
  settings: [
    { elementId: "settings-page", label: "Update your profile information" },
    { elementId: "nav-products", label: "Browse products" },
    { elementId: "cart-button", label: "View your cart" },
  ],
  default: [
    { elementId: "logo", label: "TechStore — click to go home" },
    { elementId: "nav-products", label: "Browse all products" },
    { elementId: "search-button", label: "Search for products" },
    { elementId: "cart-button", label: "Your shopping cart" },
  ],
};

export const startOnboardingTool: TamboTool = {
  name: "startOnboarding",
  description:
    "Start an interactive onboarding tour that highlights key UI elements one by one. Use when the user asks for help getting started, wants a tour of the app, says 'help me in onboarding', 'show me around', 'how does this app work', or is a first-time user needing guidance. The tour will highlight each element sequentially with a description.",
  tool: async (input: { page?: string }) => {
    let currentPage = input.page ?? "default";
    if (typeof window !== "undefined" && !input.page) {
      const path = window.location.pathname;
      if (path === "/") currentPage = "home";
      else if (path === "/products") currentPage = "products";
      else if (path === "/cart") currentPage = "cart";
      else if (path === "/settings") currentPage = "settings";
      else currentPage = "default";
    }
    const steps = ONBOARDING_STEPS[currentPage] ?? ONBOARDING_STEPS.default;
    emitStoreEvent("highlight", { steps });
    return {
      success: true,
      message: `Starting onboarding tour with ${steps.length} steps`,
      steps: steps.map((s) => s.label),
    };
  },
  inputSchema: z.object({
    page: z
      .enum(["home", "products", "cart", "settings", "default"])
      .optional()
      .describe(
        "Which page's onboarding tour to run. Defaults to the current page.",
      ),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    steps: z.array(z.string()),
  }),
};

// ── Aggregate export ──
export const tamboTools: TamboTool[] = [
  searchProductsTool,
  getFilteredProductsTool,
  getProductByIdTool,
  getCategoriesList,
  getBrandsList,
  getFeaturedTool,
  getProductsByCategoryTool,
  addToCartTool,
  removeFromCartTool,
  getCartTool,
  toggleLikeTool,
  getLikesTool,
  subscribeNewsletterTool,
  navigateToPageTool,
  initiateCheckoutTool,
  updateUserProfileTool,
  signOutTool,
  highlightElementTool,
  startOnboardingTool,
];
