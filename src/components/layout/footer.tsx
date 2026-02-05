"use client";

import Link from "next/link";
import { Instagram, Twitter, Youtube, Mail, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/home/newsletter-form";

export function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0284c7] text-white mt-auto">
            <div className="container mx-auto px-6 py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center">
                                <Zap className="h-5 w-5 text-[#0ea5e9]" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">
                                TechStore
                            </span>
                        </Link>
                        <p className="text-sm text-white/80 leading-relaxed max-w-xs">
                            Your destination for premium electronics and cutting-edge technology. Experience the future today.
                        </p>
                        <div className="flex gap-4">
                            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white/10 text-white">
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white/10 text-white">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white/10 text-white">
                                <Youtube className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Shop</h3>
                        <nav className="space-y-4">
                            <Link href="/products" className="block text-sm text-white/80 hover:text-white transition-colors">
                                All Products
                            </Link>
                            <Link href="#" className="block text-sm text-white/80 hover:text-white transition-colors">
                                Laptops & Computers
                            </Link>
                            <Link href="#" className="block text-sm text-white/80 hover:text-white transition-colors">
                                Cameras & Drones
                            </Link>
                            <Link href="#" className="block text-sm text-white/80 hover:text-white transition-colors">
                                Weekly Deals
                            </Link>
                        </nav>
                    </div>

                    {/* Support */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Support</h3>
                        <nav className="space-y-4">
                            <Link href="#" className="block text-sm text-white/80 hover:text-white transition-colors">
                                Contact Us
                            </Link>
                            <Link href="#" className="block text-sm text-white/80 hover:text-white transition-colors">
                                FAQs
                            </Link>
                            <Link href="#" className="block text-sm text-white/80 hover:text-white transition-colors">
                                Shipping Info
                            </Link>
                            <Link href="#" className="block text-sm text-white/80 hover:text-white transition-colors">
                                Returns & Warranty
                            </Link>
                        </nav>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Stay Updated</h3>
                        <p className="text-sm text-white/80">
                            Subscribe for exclusive tech deals and new arrivals.
                        </p>
                        <NewsletterForm
                            className="w-full max-w-none flex-row gap-2"
                            inputClassName="h-11 px-4 text-sm rounded-full"
                            buttonClassName="h-11 px-6 text-sm bg-[#06b6d4] hover:bg-[#0891b2] rounded-full"
                        />
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-16 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/60">
                        © {new Date().getFullYear()} TechStore. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
