'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { parsePrice, formatPrice, hasInventory } from '@/lib/inventory';
import { getStaticProductImage } from '@/lib/productImages';
import { useCart } from '@/contexts/CartContext';
import { PLACEHOLDER_IMAGE } from '@/lib/placeholderImage';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart();
  // Prioritize database image URL, fallback to static image
  const imageUrl = product.imageUrl || getStaticProductImage(product.ID);
  const inStock = hasInventory(product);
  const hasMultipleVariants = product.variants.length > 1;
  const isOnSale = product.variants.some(v => v.MSRP !== v.Price);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      // Add default variant to cart
      addToCart(product, product.defaultVariant, 1);
    }
  };

  // Badge colors
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Sale':
      case 'Blow Out':
        return 'linear-gradient(135deg, #ff6b6b, #ff4444)';
      case 'New Arrival':
        return 'linear-gradient(135deg, #8cda3f, #6eb52f)';
      case 'Best Seller':
        return 'linear-gradient(135deg, #ffd700, #ffb700)';
      case 'Online Only':
        return 'linear-gradient(135deg, #00d4aa, #00a88a)';
      default:
        return 'linear-gradient(135deg, #1e3a5f, #0a1628)';
    }
  };

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 239, 191, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <Link href={`/diveshop/${product.ID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image Container with White Background */}
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%', // 1:1 aspect ratio
          backgroundColor: 'white', // White background for transparent images
          overflow: 'hidden'
        }}>
          {/* Badge */}
          {product.Badge && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: getBadgeColor(product.Badge),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              zIndex: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}>
              {product.Badge}
            </div>
          )}

          {/* Quick Actions */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 10
          }}>
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                title="Quick View"
              >
                <Eye size={18} color="#0a1628" />
              </button>
            )}
            {inStock && (
              <button
                onClick={handleAddToCart}
                style={{
                  background: 'rgba(140, 218, 63, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                title="Add to Cart"
              >
                <ShoppingCart size={18} color="white" />
              </button>
            )}
          </div>

          {/* Product Image */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: '1rem'
          }}>
            <Image
              src={imageUrl}
              alt={product.Product}
              fill
              style={{ 
                objectFit: 'contain',
                padding: '1rem'
              }}
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5
            }}>
              <span style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{
          padding: '1rem',
          background: 'rgba(10, 22, 40, 0.5)'
        }}>
          {/* Brand */}
          <div style={{
            fontSize: '0.75rem',
            color: '#8cda3f',
            marginBottom: '0.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {product.Brand || 'N/A'}
          </div>

          {/* Product Name */}
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#ffefbf',
            marginBottom: '0.5rem',
            lineHeight: 1.3,
            height: '2.6rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.Product}
          </h3>

          {/* Price */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffefbf'
            }}>
              {product.priceRange}
            </span>
            {isOnSale && (
              <span style={{
                fontSize: '0.75rem',
                color: '#ff6b6b',
                textTransform: 'uppercase',
                fontWeight: 600
              }}>
                Sale
              </span>
            )}
          </div>

          {/* Variants Indicator */}
          {hasMultipleVariants && (
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: 'rgba(255, 239, 191, 0.7)'
            }}>
              {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}