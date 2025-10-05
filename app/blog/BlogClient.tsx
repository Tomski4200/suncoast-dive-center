'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, User } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import { BlogPost } from '@/lib/blog';

interface BlogClientProps {
  initialPosts: BlogPost[];
  categories: string[];
}

export default function BlogClient({ initialPosts, categories }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  // Get unique authors
  const authors = useMemo(() => {
    const authorSet = new Set(initialPosts.map(post => post.author));
    return Array.from(authorSet).sort();
  }, [initialPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return initialPosts.filter(post => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!post.title.toLowerCase().includes(query) &&
            !post.excerpt_text.toLowerCase().includes(query) &&
            !post.short_blog_entry.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter - now using category_name from database
      if (selectedCategory && post.category_name !== selectedCategory) {
        return false;
      }

      // Author filter
      if (selectedAuthor && post.author !== selectedAuthor) {
        return false;
      }

      return true;
    });
  }, [initialPosts, searchQuery, selectedCategory, selectedAuthor]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedAuthor(null);
  };

  const hasFilters = searchQuery || selectedCategory || selectedAuthor;

  return (
    <>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(30, 58, 95, 0.3) 0%, transparent 100%)',
        padding: '120px 2rem 3rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: '#ffefbf',
              marginBottom: '1rem',
              textAlign: 'center'
            }}
          >
            Dive Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 239, 191, 0.8)',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Stay updated with the latest diving conditions, seasonal reports, and underwater adventures
          </motion.p>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem 2rem'
      }}>
        <div style={{
          background: 'rgba(30, 58, 95, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Search Bar */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: 1,
              minWidth: '300px',
              position: 'relative'
            }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 239, 191, 0.5)'
              }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blog posts..."
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  color: '#ffefbf',
                  fontSize: '1rem'
                }}
              />
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid #8cda3f',
                  borderRadius: '8px',
                  color: '#8cda3f',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* Categories */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={16} color="#8cda3f" />
              <span style={{ color: '#8cda3f', fontSize: '0.875rem', fontWeight: 600 }}>
                Categories:
              </span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category ? null : category
                  )}
                  style={{
                    padding: '6px 12px',
                    background: selectedCategory === category
                      ? '#8cda3f'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '20px',
                    color: selectedCategory === category
                      ? '#0a1628'
                      : 'rgba(255, 239, 191, 0.8)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Authors */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="#8cda3f" />
              <span style={{ color: '#8cda3f', fontSize: '0.875rem', fontWeight: 600 }}>
                Author:
              </span>
              <select
                value={selectedAuthor || ''}
                onChange={(e) => setSelectedAuthor(e.target.value || null)}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(30, 58, 95, 0.3)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <option value="">All Authors</option>
                {authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{
          marginBottom: '1rem',
          color: 'rgba(255, 239, 191, 0.7)',
          fontSize: '0.875rem'
        }}>
          Showing {filteredPosts.length} of {initialPosts.length} posts
        </div>

        {/* Blog Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {filteredPosts.map((post, index) => (
            <BlogCard
              key={post.slug}
              post={post}
              featured={index === 0 && !hasFilters && post.is_featured}
            />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'rgba(255, 239, 191, 0.6)'
          }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              No blog posts found
            </p>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </>
  );
}
