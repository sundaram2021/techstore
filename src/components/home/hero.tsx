import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, Truck, ShieldCheck, Zap, Monitor } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-white tech-pattern">
            {/* Main Hero */}
            <div className="container mx-auto px-6 lg:px-8 pt-12 pb-24 sm:pt-20 sm:pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f9ff] text-sm font-medium text-[#0ea5e9]">
                            <Zap className="h-4 w-4" />
                            <span>Latest Tech 2026</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                            Discover
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9]">Premium</span>
                            <br />
                            Electronics
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-500 max-w-md leading-relaxed">
                            Explore cutting-edge technology and premium electronics.
                            From cameras to laptops, drones to monitors — find everything you need.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/products">
                                <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold btn-press group bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] hover:from-[#0284c7] hover:to-[#0369a1] border-0">
                                    Shop Now
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base font-semibold btn-press border-[#0ea5e9]/30 hover:bg-[#f0f9ff] hover:border-[#0ea5e9] hover:text-black">
                                View Catalog
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-12 pt-8">
                            <div>
                                <p className="text-3xl font-bold text-gray-900">10K+</p>
                                <p className="text-sm text-gray-500">Products</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">500+</p>
                                <p className="text-sm text-gray-500">Top Brands</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">4.9</p>
                                <p className="text-sm text-gray-500">Customer Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Featured Image Grid */}
                    <div className="relative lg:h-[600px] animate-fade-in" style={{ animationDelay: "200ms" }}>
                        <div className="grid grid-cols-2 gap-4 h-full">
                            {/* Large Featured Image */}
                            <div className="col-span-2 sm:col-span-1 sm:row-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] image-zoom">
                                <img
                                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=800&fit=crop"
                                    alt="Featured laptop"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0ea5e9]/20 to-transparent" />
                            </div>

                            {/* Smaller images */}
                            <div className="hidden sm:block relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] image-zoom">
                                <img
                                    src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop"
                                    alt="Camera equipment"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="hidden sm:block relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] image-zoom">
                                <img
                                    src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop"
                                    alt="Drone technology"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Floating Card */}
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl shadow-[#0ea5e9]/10 animate-float hidden lg:block border border-[#0ea5e9]/10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#0ea5e9] flex items-center justify-center">
                                    <Cpu className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Latest Tech</p>
                                    <p className="text-sm text-gray-500">Cutting-edge Innovation</p>
                                </div>
                            </div>
                        </div>

                        {/* Secondary floating card */}
                        <div className="absolute top-8 -right-4 bg-white rounded-2xl p-4 shadow-xl shadow-[#0ea5e9]/10 animate-float hidden lg:block border border-[#0ea5e9]/10" style={{ animationDelay: "1s" }}>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-[#f0f9ff] flex items-center justify-center">
                                    <Monitor className="h-5 w-5 text-[#0ea5e9]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">4K+ Displays</p>
                                    <p className="text-xs text-gray-500">Crystal Clear</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Bar */}
            <div className="border-y border-gray-100 bg-[#f0f9ff]/50">
                <div className="container mx-auto px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                            <Truck className="h-5 w-5 text-[#0ea5e9]" />
                            <span className="text-sm font-medium text-gray-600">Free Shipping Over $100</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-[#0ea5e9]" />
                            <span className="text-sm font-medium text-gray-600">Secure Checkout</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <Zap className="h-5 w-5 text-[#0ea5e9]" />
                            <span className="text-sm font-medium text-gray-600">Latest Technology</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
