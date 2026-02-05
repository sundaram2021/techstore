
import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";
import { ReceiptEmail } from "@/components/email/receipt-template";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { clearCart } from "@/lib/actions";

interface Props {
    searchParams: Promise<{
        session_id?: string;
    }>;
}

export default async function SuccessPage({ searchParams }: Props) {
    const { session_id } = await searchParams;

    if (!session_id) {
        redirect("/");
    }

    // Verify the session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items", "line_items.data.price.product"],
    });

    if (!session || session.status !== "complete") {
        if (session.payment_status !== 'paid') {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <h1 className="text-xl font-bold text-red-500">Payment not completed</h1>
                    <p className="text-gray-600 mb-4">It looks like your payment hasn't been processed yet.</p>
                    <Link href="/cart">
                        <Button>Return to Cart</Button>
                    </Link>
                </div>
            )
        }
    }

    // Clear the cart if cartId is present in metadata
    if (session.metadata?.cartId) {
        await clearCart(session.metadata.cartId);
    }

    const customerEmail = session.customer_details?.email;
    const deliveryDays = Math.floor(Math.random() * (7 - 4 + 1)) + 4; // Random between 4 and 7
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    const formattedDate = deliveryDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    // Prepare email data
    const items = session.line_items?.data.map((item) => ({
        name: item.description || "Product",
        quantity: item.quantity || 1,
        price: (item.price?.unit_amount || 0) / 100,
        image: (item.price?.product as any).images?.[0] || null,
    })) || [];

    const total = (session.amount_total || 0) / 100;

    // Send Email
    if (customerEmail) {
        try {
            await resend.emails.send({
                from: "TechStore <onboarding@resend.dev>", // USE YOUR VERIFIED DOMAIN IN PROD
                to: customerEmail,
                subject: "Your Order Confirmation - TechStore",
                react: <ReceiptEmail
                    orderId={session.id.slice(-8).toUpperCase()} // Short ID
                    items={items}
                    total={total}
                    deliveryDate={formattedDate}
                />,
            });
        } catch (error) {
            console.error("Failed to send email:", error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-500 mb-8">
                    Thank you for your purchase. We've sent a confirmation email to <span className="font-medium text-gray-900">{customerEmail}</span>.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                    <p className="text-blue-900 font-medium mb-1">Estimated Delivery</p>
                    <p className="text-2xl font-bold text-blue-600">{formattedDate}</p>
                    <p className="text-xs text-blue-400 mt-2">Arriving in {deliveryDays} days</p>
                </div>

                <div className="space-y-3">
                    <Link href="/products">
                        <Button className="w-full h-12 rounded-xl text-base font-bold bg-black hover:bg-gray-800 text-white shadow-lg btn-press">
                            Continue Shopping
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" className="w-full text-gray-500 hover:text-gray-900">
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
