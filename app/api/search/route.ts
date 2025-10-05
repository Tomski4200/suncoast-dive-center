import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

// Static pages metadata for search
const staticPages = [
  {
    title: 'Home',
    url: '/',
    description: 'Suncoast Dive Center - Florida\'s premier dive center offering courses, equipment, and charters',
    keywords: ['home', 'suncoast', 'dive center', 'florida', 'gulf coast']
  },
  {
    title: 'Services',
    url: '/services',
    description: 'Dive courses, PADI certifications, equipment rental, tank fills, and equipment service',
    keywords: ['services', 'courses', 'padi', 'certification', 'equipment', 'rental', 'tank fills']
  },
  {
    title: 'Visibility Reports',
    url: '/visibility',
    description: 'Current dive site visibility reports and conditions',
    keywords: ['visibility', 'dive sites', 'conditions', 'reports']
  },
  {
    title: 'About Us',
    url: '/about',
    description: 'About Suncoast Dive Center - our mission, team, and commitment to diving excellence',
    keywords: ['about', 'team', 'mission', 'history']
  },
  {
    title: 'Contact',
    url: '/contact',
    description: 'Contact us - location, hours, phone, and email',
    keywords: ['contact', 'location', 'hours', 'phone', 'email', 'address']
  },
  {
    title: 'Legal Information',
    url: '/legal',
    description: 'Legal documents including Terms of Service and Privacy Policy',
    keywords: ['legal', 'terms', 'privacy', 'policy']
  },
  {
    title: 'Blog',
    url: '/blog',
    description: 'From the Deep - diving tips, stories, and news',
    keywords: ['blog', 'articles', 'news', 'stories', 'tips']
  },
  {
    title: 'Dive Shop',
    url: '/diveshop',
    description: 'Browse our complete selection of diving equipment, gear, and accessories',
    keywords: ['shop', 'products', 'equipment', 'gear', 'buy', 'purchase']
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim().toLowerCase();

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const results = [];

    // Search Products (limit 5)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, brand, category, description')
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(5);

    if (!productsError && products) {
      products.forEach(product => {
        results.push({
          title: product.name,
          url: `/diveshop/${product.id}`,
          description: product.description || `${product.brand || 'Product'} - ${product.category || 'Dive Equipment'}`,
          category: 'products'
        });
      });
    }

    // Search Blog Posts (limit 5)
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts_with_categories')
      .select('id, title, slug, excerpt_text, category_name')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,excerpt_text.ilike.%${query}%,category_name.ilike.%${query}%`)
      .limit(5);

    if (!blogError && blogPosts) {
      blogPosts.forEach(post => {
        results.push({
          title: post.title,
          url: `/blog/${post.slug}`,
          description: post.excerpt_text || 'Blog post from Suncoast Dive Center',
          category: 'blog'
        });
      });
    }

    // Search Product Categories (limit 5)
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('id, name, description')
      .eq('is_active', true)
      .ilike('name', `%${query}%`)
      .limit(5);

    if (!categoriesError && categories) {
      categories.forEach(cat => {
        results.push({
          title: cat.name,
          url: `/diveshop?category=${encodeURIComponent(cat.name)}`,
          description: cat.description || `Browse ${cat.name} products`,
          category: 'categories'
        });
      });
    }

    // Search Static Pages
    const matchingPages = staticPages.filter(page => {
      const searchText = `${page.title} ${page.description} ${page.keywords.join(' ')}`.toLowerCase();
      return searchText.includes(query);
    }).slice(0, 5);

    matchingPages.forEach(page => {
      results.push({
        title: page.title,
        url: page.url,
        description: page.description,
        category: 'pages'
      });
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
