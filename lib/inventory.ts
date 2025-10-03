import inventoryData from '../inventory.json';
import { Product, ProductEntry, ProductVariantDetail, FilterOptions, SortOption } from './types';

// Type assertion for the imported JSON
const rawProducts: ProductEntry[] = inventoryData as ProductEntry[];

// Helper function to extract variant name from product name
function extractVariantName(product: ProductEntry): string {
  // Common patterns for variants
  const patterns = [
    /\((.*?)\)$/, // Anything in parentheses at the end
    /\s-\s(.+)$/, // Anything after " - "
    /:\s(.+)$/,   // Anything after ": "
  ];
  
  for (const pattern of patterns) {
    const match = product.Product.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  // Fallback: use color or other differentiator
  if (product.Color) {
    return product.Color;
  }
  
  // If no pattern matches, use the full product name
  return product.Product;
}

// Group products by ID to handle variants
function groupProductVariants(entries: ProductEntry[]): Product[] {
  const grouped = new Map<number, ProductEntry[]>();
  
  // Group entries by ID
  entries.forEach(entry => {
    if (!grouped.has(entry.ID)) {
      grouped.set(entry.ID, []);
    }
    grouped.get(entry.ID)!.push(entry);
  });
  
  // Convert grouped entries to Product format
  const products: Product[] = [];
  
  grouped.forEach((variants, id) => {
    // Sort variants by price (lowest first)
    variants.sort((a, b) => parsePrice(a.Price) - parsePrice(b.Price));
    
    const firstVariant = variants[0];
    const prices = variants.map(v => parsePrice(v.Price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Create variant details
    const variantDetails: ProductVariantDetail[] = variants.map((v, index) => ({
      ...v,
      variantName: variants.length > 1 ? extractVariantName(v) : 'Default',
      variantId: `${id}-${index}`
    }));
    
    // Extract base product name (remove variant suffixes)
    let baseProductName = firstVariant.Product;
    if (variants.length > 1) {
      // Try to find common prefix
      const names = variants.map(v => v.Product);
      let commonPrefix = names[0];
      for (let i = 1; i < names.length; i++) {
        let j = 0;
        while (j < commonPrefix.length && j < names[i].length && commonPrefix[j] === names[i][j]) {
          j++;
        }
        commonPrefix = commonPrefix.substring(0, j);
      }
      if (commonPrefix.length > 10) { // Only use if meaningful
        baseProductName = commonPrefix.trim().replace(/[-:,\s]+$/, '');
      }
    }
    
    const product: Product = {
      ID: id,
      Brand: firstVariant.Brand,
      Product: baseProductName,
      Category: firstVariant.Category,
      Badge: firstVariant.Badge,
      Description: firstVariant.Description,
      "Spec Type 1": firstVariant["Spec Type 1"],
      "Spec Type 2": firstVariant["Spec Type 2"],
      basePrice: formatPrice(minPrice),
      priceRange: minPrice === maxPrice 
        ? formatPrice(minPrice)
        : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`,
      variants: variantDetails,
      defaultVariant: variantDetails[0]
    };
    
    products.push(product);
  });
  
  return products;
}

// Get all grouped products
const products: Product[] = groupProductVariants(rawProducts);

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

// Get price range across all products
export function getPriceRange(): [number, number] {
  const prices: number[] = [];
  products.forEach(p => {
    p.variants.forEach(v => {
      prices.push(parsePrice(v.Price));
    });
  });
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
      return sorted.sort((a, b) => parsePrice(a.basePrice) - parsePrice(b.basePrice));
    case 'price-desc':
      return sorted.sort((a, b) => parsePrice(b.basePrice) - parsePrice(a.basePrice));
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
      const minProductPrice = Math.min(...p.variants.map(v => parsePrice(v.Price)));
      const maxProductPrice = Math.max(...p.variants.map(v => parsePrice(v.Price)));
      // Show product if any variant falls within the range
      return maxProductPrice >= min && minProductPrice <= max;
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
      (p.Category && p.Category.toLowerCase().includes(query)) ||
      p.variants.some(v => v.Product.toLowerCase().includes(query))
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

// Check if product has inventory (any variant in stock)
export function hasInventory(product: Product): boolean {
  // Check if any variant has inventory
  return product.variants.some(v => {
    if (v.variants && v.variants.length > 0) {
      return v.variants.some(size => size.inventory > 0);
    }
    return true; // No size variants means always available
  });
}

// Get total inventory count across all variants
export function getTotalInventory(product: Product): number {
  let total = 0;
  product.variants.forEach(v => {
    if (v.variants && v.variants.length > 0) {
      total += v.variants.reduce((sum, size) => sum + size.inventory, 0);
    } else {
      total += 1; // No size variants means 1 available
    }
  });
  return total;
}

// Get variant by ID
export function getVariantById(productId: number, variantId: string): ProductVariantDetail | undefined {
  const product = getProductById(productId);
  if (!product) return undefined;
  return product.variants.find(v => v.variantId === variantId);
}