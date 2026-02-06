"use client";

import { Quote, Zap, Star } from "lucide-react";

export function TestimonialsSection() {
    return (
        <section className="py-20 sm:py-28 bg-white">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="relative rounded-3xl bg-gradient-to-br from-[#06b6d4] via-[#0ea5e9] to-[#0284c7] p-12 sm:p-16 lg:p-20 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

                    {/* Tech grid pattern */}
                    <div className="absolute inset-0 opacity-10 grid-pattern" />

                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <Quote className="h-12 w-12 text-white/40 mx-auto mb-8" />
                        <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white leading-relaxed">
                            &ldquo;The tech quality is exceptional. Every product I&apos;ve purchased exceeded my expectations.
                            Best Buy has become my go-to for premium electronics.&rdquo;
                        </blockquote>
                        <div className="mt-10 flex items-center justify-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-white">Tech Enthusiast</p>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-white text-white" />
                                    ))}
                                    <span className="text-sm text-white/70 ml-1">Verified Buyer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
