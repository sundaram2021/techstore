import { getProduct } from "@/lib/api";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Home, ShoppingBag, Cpu } from "lucide-react";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;

    try {
        const product = await getProduct(resolvedParams.id);
        return (
            <div className="min-h-screen bg-white">
                {/* Breadcrumb */}
                <div className="border-b border-gray-100 bg-[#f0f9ff]/50">
                    <div className="container mx-auto px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-gray-400 hover:text-[#0ea5e9] transition-colors">
                                <Home className="h-4 w-4" />
                            </Link>
                            <span className="text-gray-300">/</span>
                            <Link href="/products" className="text-gray-400 hover:text-[#0ea5e9] transition-colors">
                                Products
                            </Link>
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
                        </nav>
                    </div>
                </div>

                {/* Product Content */}
                <div className="container mx-auto px-6 lg:px-8 py-12 sm:py-16">
                    <ProductDetailView product={product} />
                </div>
            </div>
        );
    } catch {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center px-6 py-20 max-w-lg animate-fade-in">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] flex items-center justify-center mx-auto mb-8">
                        <Cpu className="h-10 w-10 text-[#0ea5e9]" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        The product you&apos;re looking for doesn&apos;t exist or may have been removed from our collection.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products">
                            <Button size="lg" className="w-full sm:w-auto rounded-full btn-press bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] hover:from-[#0284c7] hover:to-[#0369a1]">
                                Browse Products
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full btn-press border-[#0ea5e9]/30 hover:border-[#0ea5e9] hover:text-[#0ea5e9]">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
