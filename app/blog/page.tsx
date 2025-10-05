import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogClient from './BlogClient';
import { getAllBlogPosts, getBlogCategories } from '@/lib/blog';

export default async function BlogPage() {
  const allPosts = await getAllBlogPosts();
  const categories = await getBlogCategories();

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />
      <BlogClient initialPosts={allPosts} categories={categories} />
      <Footer />
    </div>
  );
}
