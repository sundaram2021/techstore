
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getCart } from "@/lib/actions";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cart = await getCart();

    if (!cart || cart.items.length === 0 || !('id' in cart)) {
      return new NextResponse("Cart is empty", { status: 400 });
    }

    const line_items = cart.items.map((item) => {
      // Use the product data from our source of truth (the cart item already has it enriched)
      // but strictly relying on database price would be even safer. 
      // For now we trust the enriched cart which pulls from records.json in actions.ts
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product?.name || "Unknown Product",
            images: item.product?.image ? [item.product.image] : [],
            description: item.product?.description?.substring(0, 100),
          },
          unit_amount: Math.round((item.product?.price || 0) * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      };
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        cartId: cart.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
