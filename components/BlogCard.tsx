'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost, formatBlogDate } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = formatBlogDate(post.date);
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      style={{
        background: featured 
          ? 'linear-gradient(135deg, rgba(30, 58, 95, 0.5), rgba(140, 218, 63, 0.1))'
          : 'rgba(30, 58, 95, 0.3)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: featured 
          ? '2px solid rgba(140, 218, 63, 0.3)'
          : '1px solid rgba(255, 239, 191, 0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Image placeholder with gradient */}
      <div style={{
        height: featured ? '250px' : '200px',
        background: 'linear-gradient(135deg, #0a1628, #1e3a5f)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Wave pattern overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(180deg, transparent, rgba(140, 218, 63, 0.1))',
          clipPath: 'polygon(0 40%, 100% 20%, 100% 100%, 0 100%)'
        }} />
        
        {/* Category/Topic Badge */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'rgba(140, 218, 63, 0.9)',
          color: '#0a1628',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase'
        }}>
          {post.title.toLowerCase().includes('scallop') ? 'Scalloping' :
           post.title.toLowerCase().includes('lobster') ? 'Lobstering' :
           post.title.toLowerCase().includes('whale') ? 'Wildlife' :
           post.title.toLowerCase().includes('water') ? 'Conditions' :
           'Diving'}
        </div>
        
        {/* Date overlay */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          background: 'rgba(10, 22, 40, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '6px 12px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Calendar size={14} color="#ffefbf" />
          <span style={{ 
            color: '#ffefbf', 
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            {formattedDate}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div style={{
        padding: featured ? '1.5rem' : '1.25rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Author */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '0.75rem'
        }}>
          <User size={14} color="#8cda3f" />
          <span style={{
            color: '#8cda3f',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            {post.author}
          </span>
        </div>
        
        {/* Title */}
        <h3 style={{
          fontSize: featured ? '1.25rem' : '1.1rem',
          fontWeight: 600,
          color: '#ffefbf',
          marginBottom: '0.75rem',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {post.title}
        </h3>
        
        {/* Excerpt */}
        <p style={{
          color: 'rgba(255, 239, 191, 0.7)',
          fontSize: featured ? '0.95rem' : '0.875rem',
          lineHeight: 1.6,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: featured ? 4 : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {post.excerpt_text}
        </p>
        
        {/* Read More Link */}
        <Link 
          href={`/blog/${post.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#8cda3f',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            marginTop: 'auto'
          }}
        >
          Read More
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: 'easeInOut'
            }}
          >
            <ArrowRight size={16} />
          </motion.span>
        </Link>
      </div>
    </motion.article>
  );
}