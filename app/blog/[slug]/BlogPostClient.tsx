'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar, User, ArrowLeft, ChevronLeft, ChevronRight,
  Facebook, Twitter, Mail, Clock
} from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import ProductCard from '@/components/ProductCard';
import { BlogPost, formatBlogDate } from '@/lib/blog';
import { Product } from '@/lib/types';

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  relatedProducts: Product[];
}

export default function BlogPostClient({ post, relatedPosts, relatedProducts }: BlogPostClientProps) {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const productsPerView = 3;

  const formattedDate = formatBlogDate(post.date);

  // Calculate reading time (rough estimate)
  const wordCount = (post.excerpt_text + ' ' + post.short_blog_entry).split(' ').length;
  const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

  const nextProducts = () => {
    const maxIndex = Math.max(0, relatedProducts.length - productsPerView);
    setCurrentProductIndex(prev => Math.min(prev + productsPerView, maxIndex));
  };

  const prevProducts = () => {
    setCurrentProductIndex(prev => Math.max(0, prev - productsPerView));
  };

  const canGoNext = currentProductIndex + productsPerView < relatedProducts.length;
  const canGoPrev = currentProductIndex > 0;

  return (
    <article style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '100px 2rem 2rem'
    }}>
      {/* Back to Blog */}
      <Link
        href="/blog"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#8cda3f',
          textDecoration: 'none',
          marginBottom: '2rem',
          fontSize: '0.875rem',
          fontWeight: 500
        }}
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        {/* Category Badge */}
        <span style={{
          background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
          color: '#0a1628',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          display: 'inline-block',
          marginBottom: '1rem'
        }}>
          {post.category_name || 'Diving'}
        </span>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#ffefbf',
          marginBottom: '1rem',
          lineHeight: 1.2
        }}>
          {post.title}
        </h1>

        {/* Meta Information */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          color: 'rgba(255, 239, 191, 0.7)',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={16} color="#8cda3f" />
            <span>{post.author}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} color="#8cda3f" />
            <span>{formattedDate}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="#8cda3f" />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </motion.header>

      {/* Featured Image Placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          height: '400px',
          background: 'linear-gradient(135deg, #0a1628, #1e3a5f)',
          borderRadius: '12px',
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Wave overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, transparent, rgba(140, 218, 63, 0.1))',
          clipPath: 'polygon(0 50%, 100% 30%, 100% 100%, 0 100%)'
        }} />
      </motion.div>

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: '1.125rem',
          lineHeight: 1.8,
          color: 'rgba(255, 239, 191, 0.9)',
          marginBottom: '2rem'
        }}
      >
        <p style={{ marginBottom: '1.5rem' }}>
          {post.excerpt_text}
        </p>

        <p style={{ marginBottom: '1.5rem' }}>
          {post.short_blog_entry}
        </p>

        {/* Add more content paragraphs for a fuller article */}
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 600,
          color: '#ffefbf',
          marginTop: '2rem',
          marginBottom: '1rem'
        }}>
          Current Conditions
        </h2>

        <p style={{ marginBottom: '1.5rem' }}>
          The diving conditions continue to evolve with the changing seasons.
          Water temperatures and visibility are key factors that every diver should
          monitor before planning their underwater adventures. Our team regularly
          updates these reports to keep you informed about the best diving opportunities
          in the area.
        </p>

        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 600,
          color: '#ffefbf',
          marginTop: '2rem',
          marginBottom: '1rem'
        }}>
          Safety Reminders
        </h2>

        <p style={{ marginBottom: '1.5rem' }}>
          Always remember to check your equipment before each dive, dive with a buddy,
          and respect marine life and local regulations. The ocean is a beautiful but
          powerful environment that requires our constant attention and respect.
        </p>
      </motion.div>

      {/* Share Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.5rem 0',
        borderTop: '1px solid rgba(255, 239, 191, 0.1)',
        borderBottom: '1px solid rgba(255, 239, 191, 0.1)',
        marginBottom: '3rem'
      }}>
        <span style={{
          color: '#ffefbf',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginRight: '1rem'
        }}>
          Share this article:
        </span>
        <button style={{
          background: '#1877f2',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Facebook size={18} color="white" />
        </button>
        <button style={{
          background: '#1da1f2',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Twitter size={18} color="white" />
        </button>
        <button style={{
          background: '#ea4335',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Mail size={18} color="white" />
        </button>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 600,
            color: '#ffefbf',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Recommended Dive Gear
          </h2>

          <div style={{ position: 'relative' }}>
            {/* Products Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${productsPerView}, 1fr)`,
              gap: '1.5rem',
              marginBottom: '1rem'
            }}>
              {relatedProducts
                .slice(currentProductIndex, currentProductIndex + productsPerView)
                .map(product => (
                  <ProductCard key={product.ID} product={product} />
                ))}
            </div>

            {/* Navigation Buttons */}
            {relatedProducts.length > productsPerView && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                <button
                  onClick={prevProducts}
                  disabled={!canGoPrev}
                  style={{
                    background: canGoPrev
                      ? 'rgba(140, 218, 63, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: canGoPrev ? 'pointer' : 'not-allowed',
                    opacity: canGoPrev ? 1 : 0.3
                  }}
                >
                  <ChevronLeft size={20} color="#8cda3f" />
                </button>

                <button
                  onClick={nextProducts}
                  disabled={!canGoNext}
                  style={{
                    background: canGoNext
                      ? 'rgba(140, 218, 63, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: canGoNext ? 'pointer' : 'not-allowed',
                    opacity: canGoNext ? 1 : 0.3
                  }}
                >
                  <ChevronRight size={20} color="#8cda3f" />
                </button>
              </div>
            )}
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '2rem'
          }}>
            <Link
              href="/diveshop"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                borderRadius: '8px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Browse All Products
            </Link>
          </div>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 600,
            color: '#ffefbf',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Related Articles
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {relatedPosts.map(relatedPost => (
              <BlogCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
