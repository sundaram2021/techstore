import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "destructive";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "border-transparent bg-[#0ea5e9] text-white hover:bg-[#0284c7]/80",
        secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200/80",
        outline: "text-gray-900 border-gray-200",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600/80",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge };
