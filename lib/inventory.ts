import inventoryData from '../inventory.json';
import { Product, FilterOptions, SortOption } from './types';

// Type assertion for the imported JSON
const products: Product[] = inventoryData as Product[];

// Get all products
export function getAllProducts(): Product[] {
  return products;
}

// Get product by ID
export function getProductById(id: number): Product | undefined {
  return products.find(p => p.ID === id);
}

// Get unique categories
export function getCategories(): string[] {
  const categories = new Set<string>();
  products.forEach(p => {
    if (p.Category) categories.add(p.Category);
  });
  return Array.from(categories).sort();
}

// Get unique brands
export function getBrands(): string[] {
  const brands = new Set<string>();
  products.forEach(p => {
    if (p.Brand) brands.add(p.Brand);
  });
  return Array.from(brands).sort();
}

// Get unique badges
export function getBadges(): string[] {
  const badges = new Set<string>();
  products.forEach(p => {
    if (p.Badge) badges.add(p.Badge);
  });
  return Array.from(badges).sort();
}

// Parse price string to number
export function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace(/[$,]/g, ''));
}

// Format price for display
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

// Get price range
export function getPriceRange(): [number, number] {
  const prices = products.map(p => parsePrice(p.Price));
  return [Math.min(...prices), Math.max(...prices)];
}

// Sort products
export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.Product.localeCompare(b.Product));
    case 'name-desc':
      return sorted.sort((a, b) => b.Product.localeCompare(a.Product));
    case 'price-asc':
      return sorted.sort((a, b) => parsePrice(a.Price) - parsePrice(b.Price));
    case 'price-desc':
      return sorted.sort((a, b) => parsePrice(b.Price) - parsePrice(a.Price));
    case 'newest':
      // Products with "New Arrival" badge first, then by ID (assuming higher ID = newer)
      return sorted.sort((a, b) => {
        if (a.Badge === 'New Arrival' && b.Badge !== 'New Arrival') return -1;
        if (b.Badge === 'New Arrival' && a.Badge !== 'New Arrival') return 1;
        return b.ID - a.ID;
      });
    default:
      return sorted;
  }
}

// Filter products
export function filterProducts(filters: Partial<FilterOptions>): Product[] {
  let filtered = [...products];
  
  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(p => filters.categories!.includes(p.Category));
  }
  
  // Brand filter
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter(p => filters.brands!.includes(p.Brand));
  }
  
  // Price range filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(p => {
      const price = parsePrice(p.Price);
      return price >= min && price <= max;
    });
  }
  
  // Badge filter
  if (filters.badges && filters.badges.length > 0) {
    filtered = filtered.filter(p => 
      p.Badge && filters.badges!.includes(p.Badge)
    );
  }
  
  // Search query
  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.Product.toLowerCase().includes(query) ||
      p.Brand.toLowerCase().includes(query) ||
      p.Description.toLowerCase().includes(query) ||
      (p.Category && p.Category.toLowerCase().includes(query))
    );
  }
  
  // Sort
  if (filters.sortBy) {
    filtered = sortProducts(filtered, filters.sortBy);
  }
  
  return filtered;
}

// Get related products (same category, different product)
export function getRelatedProducts(productId: number, limit: number = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.ID !== productId && p.Category === product.Category)
    .slice(0, limit);
}

// Check if product has inventory
export function hasInventory(product: Product): boolean {
  if (product.variants.length === 0) return true; // No variants means always available
  return product.variants.some(v => v.inventory > 0);
}

// Get total inventory count
export function getTotalInventory(product: Product): number {
  if (product.variants.length === 0) return 1; // No variants means 1 available
  return product.variants.reduce((total, v) => total + v.inventory, 0);
}