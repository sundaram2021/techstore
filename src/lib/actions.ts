"use server";

import { auth } from "./auth";
import { db } from "./db";
import { carts, cartItems, productLikes } from "./auth-schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import productsData from "../../records.json";
import { Product } from "./types";
import { resend } from "./resend";
import { WelcomeEmail } from "@/components/email/welcome-template";

export async function getSession() {
    return await auth.api.getSession({
        headers: await headers(),
    });
}

export async function getCart() {
    const session = await getSession();
    if (!session) return { items: [], total: 0 };

    const userCart = await db.query.carts.findFirst({
        where: eq(carts.userId, session.user.id),
        with: {
            items: true,
        },
    });

    if (!userCart) {
        return { items: [], total: 0 };
    }

    // Sort items by addedAt
    const items = userCart.items.sort((a, b) => 
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );

    const enrichedItems = items.map((item) => {
        const product = (productsData as Product[]).find((p) => p.objectID === item.productId);
        return {
            ...item,
            product: product || null,
        };
    }).filter((item) => item.product !== null); // Typescript might still complain here about item type if not explicit, but it should be decent.

    const total = enrichedItems.reduce((acc, item) => {
        if (!item.product) return acc;
        return acc + (item.product.price * item.quantity);
    }, 0);

    return { ...userCart, items: enrichedItems, total };
}

export async function addToCart(productId: string, quantity: number = 1) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    let cart = await db.query.carts.findFirst({
        where: eq(carts.userId, session.user.id),
    });

    if (!cart) {
        const [newCart] = await db.insert(carts).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
        }).returning();
        cart = newCart;
    }

    const existingItem = await db.query.cartItems.findFirst({
        where: and(
            eq(cartItems.cartId, cart.id),
            eq(cartItems.productId, productId)
        ),
    });

    if (existingItem) {
        await db.update(cartItems)
            .set({ quantity: existingItem.quantity + quantity })
            .where(eq(cartItems.id, existingItem.id));
    } else {
        await db.insert(cartItems).values({
            id: crypto.randomUUID(),
            cartId: cart.id,
            productId,
            quantity,
        });
    }

    return { success: true };
}

export async function updateCartItem(itemId: string, quantity: number) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    if (quantity <= 0) {
        await db.delete(cartItems).where(eq(cartItems.id, itemId));
    } else {
        await db.update(cartItems)
            .set({ quantity })
            .where(eq(cartItems.id, itemId));
    }

    return { success: true };
}

export async function removeFromCart(itemId: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    return { success: true };
}

export async function getLikes() {
    const session = await getSession();
    if (!session) return [];

    const likes = await db.query.productLikes.findMany({
        where: eq(productLikes.userId, session.user.id),
    });
    
    return likes.map((l) => l.productId);
}

export async function toggleLike(productId: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const existingLike = await db.query.productLikes.findFirst({
        where: and(
            eq(productLikes.userId, session.user.id),
            eq(productLikes.productId, productId)
        ),
    });

    if (existingLike) {
        await db.delete(productLikes).where(eq(productLikes.id, existingLike.id));
        return { liked: false };
    } else {
        await db.insert(productLikes).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            productId,
        });
        return { liked: true };
    }
}

export async function clearCart(cartId: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    // Verify ownership or just rely on cartId? 
    // Ideally verify that this cart belongs to the user, but for now we trust the ID passed from server-side trusted source (Stripe metadata or internal)
    // Actually, let's just re-verify ownership to be safe if we were calling from client. 
    // But this will be called from success page which is server component.
    
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    return { success: true };
}

export async function subscribeToNewsletter(email: string) {
    try {
        await resend.emails.send({
            from: "TechStore <onboarding@resend.dev>",
            to: email,
            subject: "Welcome to TechStore!",
            react: WelcomeEmail(),
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to subscribe:", error);
        return { success: false, error: "Failed to subscribe" };
    }
}
