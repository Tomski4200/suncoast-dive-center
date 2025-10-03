export interface ProductVariant {
  size?: string;
  color?: string;
  inventory: number;
}

export interface Product {
  ID: number;
  Brand: string;
  Product: string;
  MSRP: string;
  Price: string;
  Category: string;
  Badge: string | null;
  Description: string;
  "Spec Type 1": string | null;
  "Spec 1": string | null;
  "Spec Type 2": string | null;
  "Spec 2": string | null;
  Color: string | null;
  variants: ProductVariant[];
}

export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';
export type ViewMode = 'grid' | 'list';

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  badges: string[];
  searchQuery: string;
  sortBy: SortOption;
}