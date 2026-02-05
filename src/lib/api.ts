"use server";

import productsData from "../../records.json";
import { Category, Product, LegacyProduct, ProductFilters } from "./types";
import { PLACEHOLDER_IMAGE } from "./constants";

// Helper to transform Product to LegacyProduct format for component compatibility
function transformToLegacyProduct(product: Product): LegacyProduct {
  return {
    id: product.objectID,
    title: product.name,
    price: product.price,
    description: product.description,
    category: {
      id: product.hierarchicalCategories.lvl0,
      name: product.hierarchicalCategories.lvl0,
      image: product.image || PLACEHOLDER_IMAGE,
    },
    images: [product.image || PLACEHOLDER_IMAGE],
  };
}

// Helper to filter products
function applyFilters(products: Product[], filters?: ProductFilters): Product[] {
  if (!filters) return products;
  
  return products.filter(p => {
    if (filters.category && p.hierarchicalCategories.lvl0 !== filters.category) return false;
    if (filters.brand && filters.brand.length > 0 && !filters.brand.includes(p.brand)) return false;
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;
    if (filters.rating !== undefined && p.rating < filters.rating) return false;
    if (filters.search) {
       const lowerQuery = filters.search.toLowerCase();
       return (
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.brand.toLowerCase().includes(lowerQuery)
       );
    }
    return true;
  });
}

// Get unique categories from the data
function extractCategories(): Category[] {
  const categoryMap = new Map<string, Category>();
  
  (productsData as Product[]).forEach((product) => {
    const categoryName = product.hierarchicalCategories.lvl0;
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, {
        id: categoryName,
        name: categoryName,
        image: product.image || PLACEHOLDER_IMAGE,
      });
    }
  });
  
  return Array.from(categoryMap.values());
}

// Get products with pagination and filtering
export async function getProducts(offset = 0, limit = 10, filters?: ProductFilters): Promise<LegacyProduct[]> {
  // Simulate async behavior
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  const filteredProducts = applyFilters(productsData as Product[], filters);
  const products = filteredProducts.slice(offset, offset + limit);
  // Serializable return data
  return JSON.parse(JSON.stringify(products.map(transformToLegacyProduct)));
}

// Get a single product by ID
export async function getProduct(id: string): Promise<LegacyProduct> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  const product = (productsData as Product[]).find((p) => p.objectID === id);
  
  if (!product) {
    throw new Error("Product not found");
  }
  
  return JSON.parse(JSON.stringify(transformToLegacyProduct(product)));
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return JSON.parse(JSON.stringify(extractCategories()));
}

// Get unique brands
export async function getBrands(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const brands = new Set((productsData as Product[]).map(p => p.brand));
  return Array.from(brands).sort();
}

// Get products by category (Legacy wrapper using new filter system)
export async function getProductsByCategory(
  categoryId: string,
  offset = 0,
  limit = 10
): Promise<LegacyProduct[]> {
  return getProducts(offset, limit, { category: categoryId });
}

// Get total product count with optional filters
export async function getTotalProducts(filters?: ProductFilters): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const filteredProducts = applyFilters(productsData as Product[], filters);
  return filteredProducts.length;
}

// Search products (Legacy wrapper using new filter system)
export async function searchProducts(
  query: string,
  offset = 0,
  limit = 10
): Promise<LegacyProduct[]> {
  return getProducts(offset, limit, { search: query });
}
