import { z } from "zod/v3";

// ── Product schemas ──
export const productSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  price: z.number(),
  description: z.string().optional().default(""),
  category: z
    .object({
      id: z.string().optional().default(""),
      name: z.string().optional().default(""),
      image: z.string().optional().default(""),
    })
    .optional()
    .default({ id: "", name: "", image: "" }),
  images: z.array(z.string()).optional().default([]),
});

export const productListSchema = z.object({
  products: z.array(productSchema).describe("Array of products to display"),
  title: z.string().optional().describe("Optional heading above the list"),
});

// ── Product comparison ──
export const specEntrySchema = z.object({
  key: z.string().describe("Spec name, e.g. Storage, RAM"),
  value: z.string().describe("Spec value, e.g. 256GB, 8GB"),
});

export const comparisonItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  brand: z.string().optional(),
  rating: z.number().optional(),
  image: z.string().optional(),
  specs: z
    .array(specEntrySchema)
    .optional()
    .describe("Product specifications as key-value pairs"),
});

export const productComparisonSchema = z.object({
  products: z.array(comparisonItemSchema).min(2).max(4),
  highlightBest: z.boolean().optional(),
});

// ── Budget recommendations ──
export const budgetRecommendationSchema = z.object({
  budget: z.number().describe("User's maximum budget"),
  products: z.array(productSchema),
  title: z.string().optional(),
});

// ── Cart summary ──
export const cartItemDisplaySchema = z.object({
  id: z.string().optional().default(""),
  productId: z.string().optional().default(""),
  name: z.string(),
  price: z.number(),
  quantity: z.number().optional().default(1),
  image: z.string().optional(),
});

export const cartSummarySchema = z.object({
  items: z.array(cartItemDisplaySchema),
  total: z.number(),
});

// ── Category browser ──
export const categoryItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  image: z.string().optional(),
  count: z.number().optional(),
});

export const categoryBrowserSchema = z.object({
  categories: z.array(categoryItemSchema),
});

// ── Newsletter signup ──
export const newsletterSchema = z.object({
  prefilledEmail: z.string().email().optional(),
  message: z.string().optional(),
});

// ── Dashboard chart ──
export const chartDataPointSchema = z.object({
  name: z.string(),
  value: z.number(),
});

export const dashboardChartSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  data: z.array(chartDataPointSchema),
  chartType: z.enum(["bar", "pie", "area", "line"]),
});

// ── Auth form ──
export const authFormSchema = z.object({
  mode: z.enum(["sign-in", "sign-up"]),
  prefilledEmail: z.string().optional(),
});

// ── Order confirmation ──
export const orderConfirmationSchema = z.object({
  orderId: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
  total: z.number(),
  status: z.enum(["success", "pending", "failed"]).default("success"),
});

// ── Tool input schemas ──
export const searchInputSchema = z.object({
  query: z.string().describe("Search term for finding products"),
  limit: z.number().optional().default(6).describe("Max results to return"),
});

export const filterInputSchema = z.object({
  category: z.string().optional(),
  brand: z.array(z.string()).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  rating: z.number().optional(),
  limit: z.number().optional().default(8),
});

export const productIdSchema = z.object({
  productId: z.string().describe("Product objectID"),
});

export const addToCartInputSchema = z.object({
  productId: z.string().describe("Product objectID to add"),
  quantity: z.number().optional().default(1),
});

export const removeFromCartInputSchema = z.object({
  itemId: z.string().describe("Cart item ID to remove"),
});

export const subscribeInputSchema = z.object({
  email: z.string().email().describe("Email to subscribe"),
});

export const authInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});
