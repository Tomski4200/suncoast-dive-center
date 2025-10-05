'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FeaturedProducts.module.css';

interface DisplayProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
}

const placeholderProducts: DisplayProduct[] = [
  {
    id: 1,
    name: 'AquaLung Pro BCD',
    price: 549.99,
    originalPrice: 649.99,
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=500',
    category: 'BCDs',
    badge: 'BEST SELLER'
  },
  {
    id: 2,
    name: 'Scubapro MK25 Regulator',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=500',
    category: 'Regulators',
    badge: 'NEW'
  },
  {
    id: 3,
    name: 'Cressi Full Face Mask',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=500',
    category: 'Masks'
  },
  {
    id: 4,
    name: 'Mares Avanti Fins',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
    category: 'Fins',
    badge: 'SALE'
  },
  {
    id: 5,
    name: 'Suunto Dive Computer',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1592833159057-6cdbeb6bab10?w=500',
    category: 'Computers'
  },
  {
    id: 6,
    name: 'Wetsuit 5mm Pro',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=500',
    category: 'Wetsuits'
  }
];

function convertToDisplayProduct(product: any): DisplayProduct {
  // Price is already a number from database
  const price = typeof product.price === 'number' ? product.price : 0;
  const msrp = typeof product.msrp === 'number' ? product.msrp : null;

  const originalPrice = msrp && msrp > price ? msrp : undefined;

  return {
    id: product.id,
    name: product.name || 'Unknown Product',
    price,
    originalPrice,
    image: product.image_url || 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=500',
    category: product.category || 'General',
    badge: product.badge || undefined
  };
}

const FeaturedProducts: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [products, setProducts] = useState<DisplayProduct[]>(placeholderProducts);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch('/api/featured-products');
        if (response.ok) {
          const data: any[] = await response.json();
          const displayProducts = data.map(convertToDisplayProduct);
          setProducts(displayProducts);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Keep placeholder products on error
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

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
            <span className={styles.titleAccent}>Featured</span> Products
          </h2>
          <p className={styles.subtitle}>
            Dive into our premium selection of equipment
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className={styles.carouselWrapper}>
          {/* Previous Button */}
          <button
            className={`${styles.navButton} ${styles.navPrev}`}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            aria-label="Previous products"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Products Carousel */}
          <div className={styles.carousel} ref={carouselRef}>
            <motion.div 
              className={styles.carouselTrack}
              animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className={styles.productCard}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Badge */}
                  {product.badge && (
                    <span className={`${styles.badge} ${styles[`badge${product.badge.replace(' ', '')}`]}`}>
                      {product.badge}
                    </span>
                  )}

                  {/* Product Image */}
                  <div className={styles.imageWrapper}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={300}
                      className={styles.productImage}
                    />
                    
                    {/* Quick View Overlay */}
                    <AnimatePresence>
                      {hoveredProduct === product.id && (
                        <motion.div
                          className={styles.quickView}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <button className={styles.quickViewBtn}>
                            Quick View
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Product Info */}
                  <div className={styles.productInfo}>
                    <span className={styles.category}>{product.category}</span>
                    <h3 className={styles.productName}>{product.name}</h3>

                    {/* Price */}
                    <div className={styles.priceWrapper}>
                      <span className={styles.price}>${product.price}</span>
                      {product.originalPrice && (
                        <span className={styles.originalPrice}>${product.originalPrice}</span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                      className={styles.addToCart}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Next Button */}
          <button
            className={`${styles.navButton} ${styles.navNext}`}
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            aria-label="Next products"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* View All Link */}
        <motion.div 
          className={styles.viewAllWrapper}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a href="/diveshop" className={styles.viewAllLink}>
            View All Products
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;