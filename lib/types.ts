export interface ProductVariant {
  size?: string;
  color?: string;
  inventory: number;
}

export interface ProductEntry {
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

export interface ProductVariantDetail extends ProductEntry {
  variantName: string;
  variantId: string;
}

export interface Product {
  ID: number;
  Brand: string;
  Product: string;
  Category: string;
  Badge: string | null;
  Description: string;
  "Spec Type 1": string | null;
  "Spec Type 2": string | null;
  basePrice: string;  // Lowest price among variants
  priceRange: string; // e.g., "$899 - $1,195"
  variants: ProductVariantDetail[];
  defaultVariant: ProductVariantDetail;
}

export interface CartItem {
  productId: number;
  variantId: string;
  product: Product;
  variant: ProductVariantDetail;
  quantity: number;
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