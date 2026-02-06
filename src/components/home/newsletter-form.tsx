
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/lib/actions";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface NewsletterFormProps {
    className?: string;
    inputClassName?: string;
    buttonClassName?: string;
}

export function NewsletterForm({ className, inputClassName, buttonClassName }: NewsletterFormProps) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsLoading(true);

        try {
            const result = await subscribeToNewsletter(email);
            if (result.success) {
                toast.success("Subscribed successfully! Check your email.");
                setEmail("");
            } else {
                toast.error("Failed to subscribe. Please try again.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn("flex flex-col sm:flex-row gap-4 max-w-md mx-auto", className)} data-highlight="newsletter-form">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                    "flex-1 h-14 px-6 rounded-full border border-gray-200 bg-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all",
                    inputClassName
                )}
                disabled={isLoading}
            />
            <Button
                type="submit"
                size="lg"
                className={cn(
                    "h-14 px-8 rounded-full text-base font-semibold btn-press bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] hover:from-[#0284c7] hover:to-[#0369a1]",
                    buttonClassName
                )}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subscribing...
                    </>
                ) : (
                    "Subscribe"
                )}
            </Button>
        </form>
    );
}
