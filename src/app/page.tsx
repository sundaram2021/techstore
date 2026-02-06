import { Suspense } from "react";
import { FeaturedProducts, FeaturedProductsSkeleton } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { CategoriesShowcase } from "@/components/home/categories-showcase";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { NewsletterForm } from "@/components/home/newsletter-form";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <Hero />

      {/* Featured Products Section */}
      <section className="py-20 sm:py-28 bg-white" data-highlight="featured-products">
        <div className="container mx-auto px-6 lg:px-8">
          <Suspense fallback={<FeaturedProductsSkeleton />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 sm:py-28 bg-gray-50 grid-pattern" data-highlight="categories-section">
        <div className="container mx-auto px-6 lg:px-8">
          <CategoriesShowcase />
        </div>
      </section>

      {/* Testimonial / Featured Banner */}
      <TestimonialsSection />

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
