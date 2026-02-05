
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import recordData from "../../../../records.json";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AdminCharts from "./components/admin-charts";
import { Product } from "@/lib/types";

export default async function AdminDashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const adminEmail = process.env.ADMIN_EMAIL;

    // Strict Admin Check
    if (!session || session.user.email !== adminEmail) {
        redirect("/");
    }

    // Process Data from JSON
    const products = recordData as unknown as Product[];
    const totalProducts = products.length;

    // Calculate simulated revenue (random assumption: specific units per product)
    // Actually, let's just sum prices as "Potential Inventory Value"
    const totalInventoryValue = products.reduce((acc, curr) => acc + (curr.price || 0), 0);

    // Calculate Average Rating
    const totalRating = products.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const averageRating = (totalRating / totalProducts).toFixed(1);

    // Prepare Data for Charts
    // 1. Top Brands
    const brandCounts = products.reduce((acc: Record<string, number>, curr) => {
        if (curr.brand) {
            acc[curr.brand] = (acc[curr.brand] || 0) + 1;
        }
        return acc;
    }, {});
    const topBrands = Object.entries(brandCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({ name, value }));

    // 2. Categories Distribution (Using Level 0 or 1)
    const categoryCounts = products.reduce((acc: Record<string, number>, curr) => {
        if (curr.categories && curr.categories.length > 0) {
            const cat = curr.categories[0];
            acc[cat] = (acc[cat] || 0) + 1;
        }
        return acc;
    }, {});
    const categoryData = Object.entries(categoryCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Usage top 5 for pie

    // 3. Price Range Distribution
    // Creating buckets
    const priceRanges: Record<string, number> = {
        "0-50": 0,
        "50-200": 0,
        "200-500": 0,
        "500-1000": 0,
        "1000+": 0
    };

    products.forEach(item => {
        const p = item.price || 0;
        if (p <= 50) priceRanges["0-50"]++;
        else if (p <= 200) priceRanges["50-200"]++;
        else if (p <= 500) priceRanges["200-500"]++;
        else if (p <= 1000) priceRanges["500-1000"]++;
        else priceRanges["1000+"]++;
    });
    const priceData = Object.entries(priceRanges).map(([name, value]) => ({ name, value }));

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <p className="text-xs text-muted-foreground">Estimated retail value</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageRating}</div>
                        <p className="text-xs text-muted-foreground">Across all products</p>
                    </CardContent>
                </Card>
            </div>

            {/* Visualizations Client Component */}
            <AdminCharts
                brandData={topBrands}
                categoryData={categoryData}
                priceData={priceData}
            />
        </div>
    );
}
