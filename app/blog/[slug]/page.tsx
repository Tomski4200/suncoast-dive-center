import React from 'react';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogPostClient from './BlogPostClient';
import {
  getBlogPostBySlug,
  getRelatedBlogPosts
} from '@/lib/blog';
import { getAllProducts } from '@/lib/inventory';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(slug, 3);
  const allProducts = await getAllProducts();

  // Filter products based on blog content (same logic as before)
  const postContent = (post.title + ' ' + post.excerpt_text).toLowerCase();
  let relatedProducts = allProducts;

  if (postContent.includes('scallop')) {
    relatedProducts = allProducts.filter(p =>
      p.Category.toLowerCase().includes('bag') ||
      p.Category.toLowerCase().includes('glove') ||
      p.Product.toLowerCase().includes('mesh') ||
      p.Product.toLowerCase().includes('bag')
    );
  } else if (postContent.includes('lobster')) {
    relatedProducts = allProducts.filter(p =>
      p.Product.toLowerCase().includes('lobster') ||
      p.Product.toLowerCase().includes('gauge') ||
      p.Product.toLowerCase().includes('snare') ||
      p.Category.toLowerCase().includes('glove')
    );
  } else if (postContent.includes('whale') || postContent.includes('shark')) {
    relatedProducts = allProducts.filter(p =>
      p.Category.toLowerCase().includes('camera') ||
      p.Category.toLowerCase().includes('light') ||
      p.Product.toLowerCase().includes('camera')
    );
  } else if (postContent.includes('water') || postContent.includes('visibility')) {
    relatedProducts = allProducts.filter(p =>
      p.Category.toLowerCase().includes('mask') ||
      p.Category.toLowerCase().includes('computer') ||
      p.Product.toLowerCase().includes('mask')
    );
  } else {
    // Default: show featured or popular items
    relatedProducts = allProducts.filter(p =>
      p.Badge === 'Best Seller' ||
      p.Badge === 'Sale' ||
      p.Badge === 'New Arrival'
    );
  }

  // If no specific products found, show random selection
  if (relatedProducts.length === 0) {
    relatedProducts = allProducts.slice(0, 12);
  }

  // Limit and shuffle
  const shuffledProducts = relatedProducts
    .sort(() => Math.random() - 0.5)
    .slice(0, 12);

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />
      <BlogPostClient
        post={post}
        relatedPosts={relatedPosts}
        relatedProducts={shuffledProducts}
      />
      <Footer />
    </div>
  );
}
