'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}

const BlogSection: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Top 5 Dive Sites in Crystal River',
      excerpt: 'Discover the most breathtaking underwater locations Crystal River has to offer, from manatee encounters to pristine springs.',
      author: 'Mike Johnson',
      date: 'Dec 15, 2024',
      readTime: '5 min read',
      image: '/api/placeholder/400/250',
      category: 'Destinations'
    },
    {
      id: 2,
      title: 'Essential Gear for Night Diving',
      excerpt: 'Everything you need to know about equipment selection and safety considerations for your next night dive adventure.',
      author: 'Sarah Chen',
      date: 'Dec 12, 2024',
      readTime: '8 min read',
      image: '/api/placeholder/400/250',
      category: 'Equipment'
    },
    {
      id: 3,
      title: 'Underwater Photography Tips',
      excerpt: 'Master the art of capturing stunning underwater images with these pro techniques and camera settings.',
      author: 'Tom Williams',
      date: 'Dec 10, 2024',
      readTime: '6 min read',
      image: '/api/placeholder/400/250',
      category: 'Photography'
    }
  ];

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a5f] to-[#0a1628]" />
      
      {/* Wave Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='wave' x='0' y='0' width='100' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 10 Q25 0 50 10 T100 10 L100 20 L0 20 Z' fill='%238cda3f' fill-opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='20' fill='url(%23wave)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontFamily: 'Anton, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            background: 'linear-gradient(to right, #ffefbf 0%, #92856a 50%, #ffefbf 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            filter: 'drop-shadow(0 0 30px rgba(255, 239, 191, 0.3))'
          }}>
            From the Deep
          </h2>
          <p style={{
            color: 'rgba(255, 239, 191, 0.7)',
            fontSize: '1.125rem',
            fontWeight: 300
          }}>
            Latest news, tips, and stories from our diving community
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post, index) => (
            <Link href="/blog" key={post.id} style={{ textDecoration: 'none' }}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
                style={{
                  background: 'rgba(10, 22, 40, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 239, 191, 0.1)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(140, 218, 63, 0.3)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
              {/* Image Container */}
              <div style={{
                position: 'relative',
                height: '200px',
                background: 'linear-gradient(135deg, #1e3a5f 0%, #0a1628 100%)',
                overflow: 'hidden'
              }}>
                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  padding: '0.25rem 0.75rem',
                  background: 'rgba(140, 218, 63, 0.9)',
                  color: '#0a1628',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  zIndex: 1
                }}>
                  {post.category}
                </div>
                
                {/* Placeholder for image */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 239, 191, 0.2)',
                  fontSize: '3rem'
                }}>
                  🐠
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem' }}>
                {/* Meta Info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 239, 191, 0.5)'
                }}>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#ffefbf',
                  marginBottom: '0.75rem',
                  lineHeight: 1.3,
                  transition: 'color 0.3s ease'
                }}
                className="group-hover:text-[#8cda3f]"
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 239, 191, 0.6)',
                  lineHeight: 1.6,
                  marginBottom: '1rem'
                }}>
                  {post.excerpt}
                </p>

                {/* Author and Read More */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 239, 191, 0.5)'
                  }}>
                    By {post.author}
                  </span>
                  
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    color: '#8cda3f',
                    fontWeight: 500,
                    transition: 'gap 0.3s ease'
                  }}
                  className="group-hover:gap-2"
                  >
                    Read More
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>
              </motion.article>
            </Link>
          ))}
        </div>

        {/* View All Posts Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/blog"
            style={{
              padding: '1rem 2.5rem',
              background: 'transparent',
              border: '2px solid rgba(255, 239, 191, 0.3)',
              borderRadius: '50px',
              color: '#ffefbf',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#8cda3f';
              e.currentTarget.style.background = 'rgba(140, 218, 63, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(140, 218, 63, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.3)';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            View All Articles
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;