import type { TamboComponent } from "@tambo-ai/react";
import {
  productListSchema,
  productComparisonSchema,
  budgetRecommendationSchema,
  cartSummarySchema,
  categoryBrowserSchema,
  newsletterSchema,
  dashboardChartSchema,
  authFormSchema,
  orderConfirmationSchema,
  productSchema,
} from "./schemas";
import {
  ProductCardChat,
  ProductListChat,
  ProductComparison,
  BudgetRecommendations,
  CartSummaryChat,
  CategoryBrowserChat,
  NewsletterSignupChat,
  DashboardChartChat,
  AuthFormChat,
  OrderConfirmation,
} from "./generative";

export const tamboComponents: TamboComponent[] = [
  {
    name: "ProductCardChat",
    description:
      "Compact product card for displaying a single product in chat. Shows image, title, price, category, and an Add to Cart button.",
    component: ProductCardChat,
    propsSchema: productSchema,
  },
  {
    name: "ProductListChat",
    description:
      "Scrollable list of product cards in chat. Use this to show search results, featured products, or filtered product lists.",
    component: ProductListChat,
    propsSchema: productListSchema,
  },
  {
    name: "ProductComparison",
    description:
      "Side-by-side comparison table for 2–4 products. Shows price, brand, rating, and specs. Use when user wants to compare products.",
    component: ProductComparison,
    propsSchema: productComparisonSchema,
  },
  {
    name: "BudgetRecommendations",
    description:
      "Shows products within a user's budget, sorted by price (best value). Use when user specifies a budget or max price.",
    component: BudgetRecommendations,
    propsSchema: budgetRecommendationSchema,
  },
  {
    name: "CartSummaryChat",
    description:
      "Displays the user's current shopping cart with items, quantities, and total. Use when user asks about their cart.",
    component: CartSummaryChat,
    propsSchema: cartSummarySchema,
  },
  {
    name: "CategoryBrowserChat",
    description:
      "Grid of clickable category cards with images. Use when user wants to browse or explore categories.",
    component: CategoryBrowserChat,
    propsSchema: categoryBrowserSchema,
  },
  {
    name: "NewsletterSignupChat",
    description:
      "Inline email subscription form. Use when user wants to subscribe to the newsletter or get updates.",
    component: NewsletterSignupChat,
    propsSchema: newsletterSchema,
  },
  {
    name: "DashboardChartChat",
    description:
      "Data visualization chart (bar, pie, area, or line) rendered in chat. Use for analytics, stats, price distributions, or any data visualization.",
    component: DashboardChartChat,
    propsSchema: dashboardChartSchema,
  },
  {
    name: "AuthFormChat",
    description:
      "Sign-in or sign-up form rendered in chat. Use when user wants to log in, register, or create an account.",
    component: AuthFormChat,
    propsSchema: authFormSchema,
  },
  {
    name: "OrderConfirmation",
    description:
      "Order confirmation summary showing items, total, and status. Use after a checkout or when showing order details.",
    component: OrderConfirmation,
    propsSchema: orderConfirmationSchema,
  },
];
