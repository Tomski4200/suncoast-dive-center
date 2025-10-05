import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verifyBlogMigration() {
  try {
    // Count total posts
    const { count: totalPosts, error: countError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting posts:', countError);
      return;
    }

    console.log(`✅ Total blog posts in database: ${totalPosts}`);

    // Get category breakdown
    const { data: categories, error: catError } = await supabase
      .from('blog_categories')
      .select('name, slug');

    if (catError) {
      console.error('Error fetching categories:', catError);
      return;
    }

    console.log('\n📊 Posts by category:');
    for (const category of categories!) {
      const { count, error } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', (await supabase
          .from('blog_categories')
          .select('id')
          .eq('slug', category.slug)
          .single()).data?.id);

      if (!error) {
        console.log(`   ${category.name}: ${count} posts`);
      }
    }

    // Show some sample posts
    const { data: samplePosts, error: sampleError } = await supabase
      .from('blog_posts_with_categories')
      .select('title, author, category_name, published_date')
      .order('published_date', { ascending: false })
      .limit(5);

    if (!sampleError) {
      console.log('\n📝 Most recent posts:');
      samplePosts?.forEach((post, index) => {
        console.log(`   ${index + 1}. "${post.title}" by ${post.author} (${post.category_name})`);
      });
    }

  } catch (error) {
    console.error('Verification failed:', error);
  }
}

verifyBlogMigration();
