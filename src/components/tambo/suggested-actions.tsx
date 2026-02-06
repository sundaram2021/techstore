"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    ShoppingBag,
    Tag,
    HelpCircle,
    Sparkles,
    BarChart3,
    LogIn,
    Heart,
    LayoutGrid,
    Settings,
    CreditCard,
    Navigation,
    User,
    MapPin,
} from "lucide-react";
import type { SuggestedAction } from "./types";

/** Return page-specific suggestions based on current URL */
function getPageActions(): SuggestedAction[] {
    if (typeof window === "undefined") return [];

    const path = window.location.pathname;

    if (path === "/") {
        return [
            { label: "Help me onboard", prompt: "Help me in onboarding", icon: <MapPin className="w-3.5 h-3.5" /> },
            { label: "Featured products", prompt: "Show me the featured products", icon: <Sparkles className="w-3.5 h-3.5" /> },
            { label: "Browse categories", prompt: "Show me all categories I can browse", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
            { label: "Best deals under $100", prompt: "Find the best products under $100", icon: <Tag className="w-3.5 h-3.5" /> },
        ];
    }

    if (path === "/products") {
        return [
            { label: "Top rated", prompt: "Show me top rated products with rating above 4", icon: <Sparkles className="w-3.5 h-3.5" /> },
            { label: "Compare products", prompt: "Help me compare some popular products", icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { label: "Budget picks", prompt: "Find the best products under my budget of $200", icon: <Tag className="w-3.5 h-3.5" /> },
            { label: "Free shipping", prompt: "Show me products with free shipping", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
        ];
    }

    if (path.startsWith("/products/")) {
        return [
            { label: "Add to cart", prompt: "Add this product to my cart", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
            { label: "Find similar", prompt: "Show me similar products to this one", icon: <HelpCircle className="w-3.5 h-3.5" /> },
            { label: "Compare", prompt: "Compare this product with alternatives", icon: <BarChart3 className="w-3.5 h-3.5" /> },
        ];
    }

    if (path === "/cart") {
        return [
            { label: "Show my cart", prompt: "Show me what's in my cart", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
            { label: "Better deals", prompt: "Are there cheaper alternatives for items in my cart?", icon: <Tag className="w-3.5 h-3.5" /> },
            { label: "Checkout now", prompt: "Help me checkout and pay for my cart", icon: <CreditCard className="w-3.5 h-3.5" /> },
        ];
    }

    if (path === "/settings") {
        return [
            { label: "Update my name", prompt: "Change my display name", icon: <User className="w-3.5 h-3.5" /> },
            { label: "Go to products", prompt: "Take me to the products page", icon: <Navigation className="w-3.5 h-3.5" /> },
            { label: "View my cart", prompt: "Take me to my cart", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
        ];
    }

    if (path === "/sign-in" || path === "/sign-up") {
        return [
            { label: path === "/sign-in" ? "Sign in" : "Register", prompt: path === "/sign-in" ? "Help me sign in to my account" : "Help me create an account", icon: <LogIn className="w-3.5 h-3.5" /> },
        ];
    }

    if (path === "/admin/dashboard") {
        return [
            { label: "Brand chart", prompt: "Show me a chart of top brands by product count", icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { label: "Price analysis", prompt: "Visualize the price distribution across products", icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { label: "Category breakdown", prompt: "Show a pie chart of category distribution", icon: <BarChart3 className="w-3.5 h-3.5" /> },
        ];
    }

    // Default fallback
    return [
        { label: "Help me onboard", prompt: "Help me in onboarding", icon: <MapPin className="w-3.5 h-3.5" /> },
        { label: "Browse products", prompt: "Show me your best products", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
        { label: "Today's deals", prompt: "What are today's best deals?", icon: <Tag className="w-3.5 h-3.5" /> },
        { label: "Help me find", prompt: "Help me find a product under $500", icon: <HelpCircle className="w-3.5 h-3.5" /> },
    ];
}

interface SuggestedActionsProps {
    onSelect: (prompt: string) => void;
    actions?: SuggestedAction[];
}

export function SuggestedActions({ onSelect, actions }: SuggestedActionsProps) {
    const pageActions = useMemo(() => actions ?? getPageActions(), [actions]);

    return (
        <div className="flex flex-wrap gap-2 p-4 border-t border-gray-100">
            {pageActions.map((action, index) => (
                <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onSelect(action.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                     bg-gradient-to-r from-cyan-50 to-teal-50
                     text-cyan-700 rounded-full border border-cyan-200/50
                     hover:from-cyan-100 hover:to-teal-100 hover:border-cyan-300
                     transition-all duration-200 hover:shadow-sm"
                >
                    {action.icon}
                    {action.label}
                </motion.button>
            ))}
        </div>
    );
}
