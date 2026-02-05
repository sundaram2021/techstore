// Category structure derived from hierarchicalCategories
export interface Category {
  id: string;
  name: string;
  image: string;
}

// Product structure matching records.json
export interface Product {
  objectID: string;
  name: string;
  description: string;
  brand: string;
  categories: string[];
  hierarchicalCategories: {
    lvl0: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
  };
  type: string;
  price: number;
  price_range: string;
  image: string;
  url: string;
  free_shipping: boolean;
  popularity: number;
  rating: number;
}

// Type for backwards compatibility in components
export interface LegacyProduct {
  id: number | string;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
}

export interface ProductFilters {
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
}
