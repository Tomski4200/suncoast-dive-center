import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 3;

    // Fetch latest published blog posts with category info
    const { data, error } = await supabase
      .from('blog_posts_with_categories')
      .select('id, title, slug, excerpt_text, author, published_date, category_name, featured_image_url')
      .eq('is_published', true)
      .order('published_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }

    // Transform data for frontend
    const posts = data?.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt_text || '',
      author: post.author,
      date: post.published_date,
      category: post.category_name || 'General',
      image: post.featured_image_url || null,
      readTime: '5 min read' // Default read time
    })) || [];

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in blog-posts API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
