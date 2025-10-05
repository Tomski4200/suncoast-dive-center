import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface BlogPost {
  id?: number;
  author: string;
  date: string;
  title: string;
  excerpt_text: string;
  short_blog_entry: string;
  slug?: string;
  category_name?: string;
  category_slug?: string;
  is_featured?: boolean;
}

// Format published_date from database to display format
function formatPublishedDate(publishedDate: string): string {
  const date = new Date(publishedDate);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts_with_categories')
    .select('*')
    .eq('is_published', true)
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data.map(post => ({
    id: post.id,
    author: post.author,
    date: formatPublishedDate(post.published_date),
    title: post.title,
    excerpt_text: post.excerpt_text,
    short_blog_entry: post.short_blog_entry,
    slug: post.slug,
    category_name: post.category_name,
    category_slug: post.category_slug,
    is_featured: post.is_featured
  }));
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await supabase
    .from('blog_posts_with_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    console.error('Error fetching blog post:', error);
    return undefined;
  }

  return {
    id: data.id,
    author: data.author,
    date: formatPublishedDate(data.published_date),
    title: data.title,
    excerpt_text: data.excerpt_text,
    short_blog_entry: data.short_blog_entry,
    slug: data.slug,
    category_name: data.category_name,
    category_slug: data.category_slug,
    is_featured: data.is_featured
  };
}

// Get recent blog posts for homepage or sidebar
export async function getRecentBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts_with_categories')
    .select('*')
    .eq('is_published', true)
    .order('published_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent blog posts:', error);
    return [];
  }

  return data.map(post => ({
    id: post.id,
    author: post.author,
    date: formatPublishedDate(post.published_date),
    title: post.title,
    excerpt_text: post.excerpt_text,
    short_blog_entry: post.short_blog_entry,
    slug: post.slug,
    category_name: post.category_name,
    category_slug: post.category_slug,
    is_featured: post.is_featured
  }));
}

// Get blog posts by author
export async function getBlogPostsByAuthor(author: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts_with_categories')
    .select('*')
    .eq('author', author)
    .eq('is_published', true)
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts by author:', error);
    return [];
  }

  return data.map(post => ({
    id: post.id,
    author: post.author,
    date: formatPublishedDate(post.published_date),
    title: post.title,
    excerpt_text: post.excerpt_text,
    short_blog_entry: post.short_blog_entry,
    slug: post.slug,
    category_name: post.category_name,
    category_slug: post.category_slug,
    is_featured: post.is_featured
  }));
}

// Format date for display
export function formatBlogDate(dateStr: string): string {
  // If it's already formatted (e.g., "Sep 13, 2025"), return as-is
  if (/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(dateStr)) {
    return dateStr;
  }

  // Otherwise, parse and format
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

// Get related blog posts (same category or similar author)
export async function getRelatedBlogPosts(currentSlug: string, limit: number = 3): Promise<BlogPost[]> {
  // First, get the current post to find its category
  const currentPost = await getBlogPostBySlug(currentSlug);
  if (!currentPost) return [];

  // Get posts from same category, excluding current post
  const { data, error } = await supabase
    .from('blog_posts_with_categories')
    .select('*')
    .eq('is_published', true)
    .neq('slug', currentSlug)
    .or(`category_slug.eq.${currentPost.category_slug},author.eq.${currentPost.author}`)
    .order('published_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related blog posts:', error);
    return [];
  }

  return data.map(post => ({
    id: post.id,
    author: post.author,
    date: formatPublishedDate(post.published_date),
    title: post.title,
    excerpt_text: post.excerpt_text,
    short_blog_entry: post.short_blog_entry,
    slug: post.slug,
    category_name: post.category_name,
    category_slug: post.category_slug,
    is_featured: post.is_featured
  }));
}

// Get blog categories based on actual data in database
export async function getBlogCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('name')
    .order('display_order');

  if (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }

  return data.map(cat => cat.name);
}
