'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './CategoryGrid.module.css';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  href: string;
  featured?: boolean;
}

interface DBCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  image_url: string | null;
  display_order: number;
}

// Placeholder images for categories (used when no image_url in database)
const placeholderImages: { [key: string]: string } = {
  'Regulators': 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600',
  'BCDs': 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600',
  'Wetsuits': 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=600',
  'Masks': 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600',
  'Fins': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
  'Computers': 'https://images.unsplash.com/photo-1592833159057-6cdbeb6bab10?w=600',
  'Accessories': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
  'Lights': 'https://images.unsplash.com/photo-1592833159057-6cdbeb6bab10?w=600',
  'Bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
  'default': 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600'
};

// Default descriptions for categories
const defaultDescriptions: { [key: string]: string } = {
  'Regulators': 'Professional breathing apparatus',
  'BCDs': 'Buoyancy control devices',
  'Wetsuits': 'Thermal protection',
  'Masks': 'Crystal clear visibility',
  'Fins': 'Efficient propulsion',
  'Computers': 'Advanced monitoring',
  'Accessories': 'Complete your kit',
  'Lights': 'Illuminate the depths',
  'Bags': 'Gear organization',
  'Snorkels': 'Surface breathing',
  'Gauges': 'Pressure monitoring',
  'Knives': 'Safety tools',
  'Spearguns': 'Underwater hunting',
  'Gloves': 'Hand protection',
  'Apparel': 'Dive wear',
  'Packages': 'Complete gear sets',
  'Services': 'Expert support',
  'Used': 'Quality pre-owned gear',
  'default': 'Quality diving equipment'
};

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data: DBCategory[] = await response.json();

          // Transform database categories to component format
          // Only show first 6 categories with products
          const transformedCategories = data
            .filter(cat => cat.itemCount > 0)
            .slice(0, 6)
            .map((cat, index) => ({
              id: cat.id,
              name: cat.name,
              description: cat.description || defaultDescriptions[cat.name] || defaultDescriptions['default'],
              image: cat.image_url || placeholderImages[cat.name] || placeholderImages['default'],
              itemCount: cat.itemCount,
              href: `/diveshop/category/${cat.slug}`,
              featured: index === 0 // First category is featured
            }));

          setCategories(transformedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', color: '#ffefbf', padding: '4rem' }}>
            Loading categories...
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>
            Shop by <span className={styles.titleAccent}>Category</span>
          </h2>
          <p className={styles.subtitle}>
            Find the perfect gear for your next underwater adventure
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className={styles.grid}>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={category.href} className={`${styles.categoryCard} ${category.featured ? styles.featured : ''}`}>
                {/* Image Container */}
                <div className={styles.imageWrapper}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={600}
                    height={400}
                    className={styles.categoryImage}
                  />
                  
                  {/* Overlay Gradient */}
                  <div className={styles.overlay} />
                  
                  {/* Featured Badge */}
                  {category.featured && (
                    <span className={styles.featuredBadge}>Featured</span>
                  )}
                </div>

                {/* Category Info */}
                <div className={styles.categoryInfo}>
                  <h3 className={styles.categoryName}>{category.name}</h3>
                  <p className={styles.categoryDescription}>{category.description}</p>
                  
                  <div className={styles.categoryFooter}>
                    <span className={styles.itemCount}>{category.itemCount} items</span>
                    <span className={styles.shopNow}>
                      Shop Now
                      <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Hover Effect Bubble */}
                <div className={styles.bubbleEffect} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Special Offer Banner */}
        <motion.div
          className={styles.offerBanner}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={styles.offerContent}>
            <div className={styles.offerText}>
              <h3 className={styles.offerTitle}>
                <span className={styles.offerHighlight}>20% OFF</span> Your First Purchase
              </h3>
              <p className={styles.offerDescription}>
                New customers get exclusive discounts on all diving equipment
              </p>
            </div>
            <button className={styles.offerButton}>
              Claim Offer
              <svg className={styles.sparkle} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.09 8.26L20.18 8.63L15.45 12.41L17.09 18.31L12 14.77L6.91 18.31L8.55 12.41L3.82 8.63L9.91 8.26L12 2Z" />
              </svg>
            </button>
          </div>
          
          {/* Animated Background Bubbles */}
          <div className={styles.bubbles}>
            <span className={styles.bubble} />
            <span className={styles.bubble} />
            <span className={styles.bubble} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;