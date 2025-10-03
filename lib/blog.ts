import blogsData from '../blogs.json';

export interface BlogPost {
  author: string;
  date: string;
  title: string;
  excerpt_text: string;
  short_blog_entry: string;
  slug?: string;
}

// Generate SEO-friendly slug from title
function generateSlug(title: string, index: number): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .slice(0, 60); // Limit length for URL friendliness
  
  // Add index to ensure uniqueness
  return `${baseSlug}-${index}`;
}

// Parse date string to Date object
function parseDate(dateStr: string): Date {
  // Handle various date formats
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    // Try parsing with different format
    const parts = dateStr.split(' ');
    const months: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    if (parts.length >= 3) {
      const month = months[parts[0]];
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
  }
  return date;
}

// Process and enrich blog data with slugs
const processedBlogs: BlogPost[] = blogsData.map((blog: any, index: number) => ({
  ...blog,
  slug: generateSlug(blog.title, index + 1)
}));

// Sort blogs by date (newest first)
processedBlogs.sort((a, b) => {
  const dateA = parseDate(a.date);
  const dateB = parseDate(b.date);
  return dateB.getTime() - dateA.getTime();
});

// Get all blog posts
export function getAllBlogPosts(): BlogPost[] {
  return processedBlogs;
}

// Get a single blog post by slug
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return processedBlogs.find(post => post.slug === slug);
}

// Get recent blog posts for homepage or sidebar
export function getRecentBlogPosts(limit: number = 3): BlogPost[] {
  return processedBlogs.slice(0, limit);
}

// Get blog posts by author
export function getBlogPostsByAuthor(author: string): BlogPost[] {
  return processedBlogs.filter(post => 
    post.author.toLowerCase() === author.toLowerCase()
  );
}

// Format date for display
export function formatBlogDate(dateStr: string): string {
  const date = parseDate(dateStr);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

// Get related blog posts (same author or similar title keywords)
export function getRelatedBlogPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getBlogPostBySlug(currentSlug);
  if (!currentPost) return [];
  
  // Get keywords from current post title
  const keywords = currentPost.title.toLowerCase().split(' ')
    .filter(word => word.length > 3); // Filter out short words
  
  return processedBlogs
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      let score = 0;
      
      // Same author gets higher score
      if (post.author === currentPost.author) score += 3;
      
      // Count matching keywords in title
      const postKeywords = post.title.toLowerCase().split(' ');
      keywords.forEach(keyword => {
        if (postKeywords.includes(keyword)) score += 1;
      });
      
      return { post, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

// Get blog categories based on content patterns
export function getBlogCategories(): string[] {
  const categories = new Set<string>();
  
  processedBlogs.forEach(post => {
    const title = post.title.toLowerCase();
    const content = (post.excerpt_text + ' ' + post.short_blog_entry).toLowerCase();
    
    if (title.includes('scallop') || content.includes('scallop')) {
      categories.add('Scalloping');
    }
    if (title.includes('lobster') || content.includes('lobster')) {
      categories.add('Lobstering');
    }
    if (title.includes('water') || title.includes('visibility') || title.includes('conditions')) {
      categories.add('Conditions');
    }
    if (title.includes('whale') || content.includes('whale shark')) {
      categories.add('Wildlife');
    }
    if (title.includes('sale') || title.includes('season')) {
      categories.add('Seasonal');
    }
    if (title.includes('gear') || title.includes('equipment')) {
      categories.add('Equipment');
    }
  });
  
  return Array.from(categories).sort();
}