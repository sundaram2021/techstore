import { Hero } from "@/components/home/hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoriesShowcase } from "@/components/home/categories-showcase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Quote, Zap, Star } from "lucide-react";
import { NewsletterForm } from "@/components/home/newsletter-form";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <Hero />

      {/* Featured Products Section */}
      <section className="py-20 sm:py-28 bg-white" data-highlight="featured-products">
        <div className="container mx-auto px-6 lg:px-8">
          <FeaturedProducts />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 sm:py-28 bg-gray-50 grid-pattern" data-highlight="categories-section">
        <div className="container mx-auto px-6 lg:px-8">
          <CategoriesShowcase />
        </div>
      </section>

      {/* Testimonial / Featured Banner */}
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

      {/* Newsletter CTA */}
      <section className="py-20 sm:py-28 bg-[#f0f9ff]" data-highlight="newsletter-section">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0ea5e9] uppercase tracking-wider">
              <Zap className="h-4 w-4" />
              Stay in the loop
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Get Exclusive Tech Updates
            </h2>
            <p className="text-lg text-gray-500">
              Be the first to know about new arrivals, exclusive deals, and the latest in tech innovation.
            </p>
            <NewsletterForm />
            <p className="text-sm text-gray-400">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 bg-white" data-highlight="cta-section">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-6">
            Ready to Explore More Tech?
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            Discover our complete collection of premium electronics and find your next tech upgrade.
          </p>
          <Link href="/products">
            <Button size="lg" className="h-14 px-10 rounded-full text-base font-semibold btn-press group bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] hover:from-[#0284c7] hover:to-[#0369a1]">
              Browse All Products
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
