import { Product, ProductEntry, ProductVariantDetail, FilterOptions, SortOption } from './types';
import { createClient } from '@supabase/supabase-js';

// Supabase client for fetching product data
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
function groupProductVariants(entries: ProductEntry[], imageUrls: Map<number, string>): Product[] {
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
      defaultVariant: variantDetails[0],
      imageUrl: imageUrls.get(id) || undefined
    };

    products.push(product);
  });

  return products;
}

// Cache for grouped products
let productsCache: Product[] | null = null;

// Get all products from database
export async function getAllProducts(): Promise<Product[]> {
  if (productsCache) return productsCache;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform database rows to ProductEntry format
    const productEntries: ProductEntry[] = data.map(row => ({
      ID: row.id,
      Brand: row.brand || '',
      Product: row.name || '',
      MSRP: row.msrp ? String(row.msrp) : (row.price ? String(row.price) : '0'),
      Price: row.price ? String(row.price) : '0',
      Category: row.category || '',
      Badge: row.badge,
      Description: row.description || '',
      "Spec Type 1": row.spec_type_1,
      "Spec 1": row.spec_1,
      "Spec Type 2": row.spec_type_2,
      "Spec 2": row.spec_2,
      Color: row.color,
      variants: row.variants || []
    }));

    // Create image URL map
    const imageUrls = new Map<number, string>();
    data.forEach(row => {
      if (row.image_url) {
        imageUrls.set(row.id, row.image_url);
      }
    });

    productsCache = groupProductVariants(productEntries, imageUrls);
    return productsCache;
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return [];
  }
}

// Get all raw products for admin (with individual variants and prices)
export async function getAllRawProducts(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching raw products:', error);
      return [];
    }

    return (data || []).map(row => ({
      ID: row.id,
      Brand: row.brand || '',
      Product: row.name || '',
      Category: row.category || '',
      Badge: row.badge,
      Description: row.description || '',
      Msrp: row.msrp || row.price || 0,
      SalePrice: row.price || 0,
      UPC: row.upc,
      Inventory: row.inventory,
      variants: row.variants || [],
      images: row.images || [],
      image_url: row.image_url,
      price: row.price || 0,
      msrp: row.msrp,
      product: row.name,
      name: row.name,
      brand: row.brand,
      category: row.category,
      badge: row.badge
    }));
  } catch (error) {
    console.error('Error in getAllRawProducts:', error);
    return [];
  }
}

// Get product by ID
export async function getProductById(id: number): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find(p => p.ID === id);
}

// Get unique categories
export async function getCategories(): Promise<string[]> {
  const products = await getAllProducts();
  const categories = new Set<string>();
  products.forEach(p => {
    if (p.Category) categories.add(p.Category);
  });
  return Array.from(categories).sort();
}

// Get unique brands
export async function getBrands(): Promise<string[]> {
  const products = await getAllProducts();
  const brands = new Set<string>();
  products.forEach(p => {
    if (p.Brand) brands.add(p.Brand);
  });
  return Array.from(brands).sort();
}

// Get unique badges
export async function getBadges(): Promise<string[]> {
  const products = await getAllProducts();
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
export async function getPriceRange(): Promise<[number, number]> {
  const products = await getAllProducts();
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

// Filter products (async to load products from cache/database)
export async function filterProducts(filters: Partial<FilterOptions>): Promise<Product[]> {
  const allProducts = await getAllProducts();
  let filtered = [...allProducts];

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
export async function getRelatedProducts(productId: number, limit: number = 4): Promise<Product[]> {
  const products = await getAllProducts();
  const product = products.find(p => p.ID === productId);
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
export async function getVariantById(productId: number, variantId: string): Promise<ProductVariantDetail | undefined> {
  const product = await getProductById(productId);
  if (!product) return undefined;
  return product.variants.find(v => v.variantId === variantId);
}

// Get featured products (8 individual products based on badges)
export async function getFeaturedProducts(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Target badges (case-insensitive)
    const targetBadges = ['blow out', 'sale', 'instructor\'s choice', 'best seller', 'new arrival'];

    // Filter products with target badges
    const featuredProducts = data.filter(p =>
      p.badge && targetBadges.includes(p.badge.toLowerCase())
    );

    // If we have 8 or more featured products, return first 8
    let selectedProducts = featuredProducts.length >= 8
      ? featuredProducts.slice(0, 8)
      : featuredProducts;

    // If we have fewer than 8, fill with random products
    if (selectedProducts.length < 8) {
      const remainingProducts = data.filter(p => !selectedProducts.includes(p));
      const shuffled = remainingProducts.sort(() => Math.random() - 0.5);
      const randomProducts = shuffled.slice(0, 8 - selectedProducts.length);
      selectedProducts = [...selectedProducts, ...randomProducts];
    }

    // Transform to include both capitalized and lowercase fields for compatibility
    return selectedProducts.map(row => ({
      ID: row.id,
      Brand: row.brand || '',
      Product: row.name || '',
      Category: row.category || '',
      Badge: row.badge,
      Description: row.description || '',
      Msrp: row.msrp || row.price || 0,
      SalePrice: row.price || 0,
      image_url: row.image_url,
      id: row.id,
      product: row.name,
      name: row.name,
      brand: row.brand,
      category: row.category,
      badge: row.badge,
      price: row.price || 0,
      msrp: row.msrp
    }));
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

// Get categories from database with product counts
export async function getCategoriesFromDB(): Promise<any[]> {
  try {
    // Fetch all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return [];
    }

    if (!categories || categories.length === 0) {
      return [];
    }

    // Fetch all products to count by category
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('category');

    if (productsError) {
      console.error('Error fetching products for count:', productsError);
      return categories.map(cat => ({
        ...cat,
        itemCount: 0
      }));
    }

    // Count products per category
    const productCounts = new Map<string, number>();
    products?.forEach(product => {
      if (product.category) {
        const count = productCounts.get(product.category) || 0;
        productCounts.set(product.category, count + 1);
      }
    });

    // Combine categories with counts
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      itemCount: productCounts.get(cat.name) || 0,
      image_url: cat.image_url || null,
      display_order: cat.display_order
    }));
  } catch (error) {
    console.error('Error in getCategoriesFromDB:', error);
    return [];
  }
}
