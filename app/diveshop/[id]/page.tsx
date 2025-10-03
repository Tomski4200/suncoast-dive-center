'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Heart, Share2, Check, ChevronLeft, 
  Package, Truck, Shield, Star, Minus, Plus 
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProductById, getRelatedProducts, parsePrice, formatPrice } from '@/lib/inventory';
import { getStaticProductImages } from '@/lib/productImages';
import { Product, ProductVariantDetail } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { PLACEHOLDER_IMAGE } from '@/lib/placeholderImage';
import styles from './ProductDetail.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const product = getProductById(id);
  const { addToCart } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.defaultVariant);
    }
  }, [product]);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(id, 4);
  const images = getStaticProductImages(id);
  const hasMultipleVariants = product.variants.length > 1;
  const currentPrice = selectedVariant ? parsePrice(selectedVariant.Price) : parsePrice(product.basePrice);
  const currentMSRP = selectedVariant ? parsePrice(selectedVariant.MSRP) : 0;
  const isOnSale = currentMSRP > currentPrice;
  const discountPercent = isOnSale ? Math.round((1 - currentPrice / currentMSRP) * 100) : 0;

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 2000);
    }
  };

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find(v => v.variantId === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />
      
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '100px 2rem 2rem'
      }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          fontSize: '0.875rem',
          color: 'rgba(255, 239, 191, 0.6)'
        }}>
          <Link href="/diveshop" style={{
            color: '#8cda3f',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <ChevronLeft size={16} />
            Back to Dive Shop
          </Link>
          <span>/</span>
          <span>{product.Category}</span>
          <span>/</span>
          <span>{product.Brand}</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          {/* Image Gallery */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '1rem',
              position: 'relative',
              paddingTop: '100%'
            }}>
              {/* Badge */}
              {product.Badge && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: product.Badge === 'Sale' || product.Badge === 'Blow Out' 
                    ? 'linear-gradient(135deg, #ff6b6b, #ff4444)'
                    : product.Badge === 'New Arrival' 
                    ? 'linear-gradient(135deg, #8cda3f, #6eb52f)'
                    : 'linear-gradient(135deg, #ffd700, #ffb700)',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  zIndex: 10,
                  textTransform: 'uppercase'
                }}>
                  {product.Badge}
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <Heart 
                  size={20} 
                  fill={isWishlisted ? '#ff6b6b' : 'none'}
                  color={isWishlisted ? '#ff6b6b' : '#0a1628'}
                />
              </button>

              <Image
                src={images[selectedImage]}
                alt={product.Product}
                fill
                style={{ objectFit: 'contain', padding: '2rem' }}
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto'
              }}>
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      background: 'white',
                      border: selectedImage === index 
                        ? '2px solid #8cda3f' 
                        : '2px solid transparent',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      width: '80px',
                      height: '80px',
                      flexShrink: 0,
                      cursor: 'pointer',
                      padding: '0.5rem'
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.Product} ${index + 1}`}
                      width={64}
                      height={64}
                      style={{ objectFit: 'contain' }}
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{
                color: '#8cda3f',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {product.Brand}
              </span>
            </div>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#ffefbf',
              marginBottom: '1rem',
              lineHeight: 1.2
            }}>
              {product.Product}
            </h1>

            {/* Rating */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star}
                  size={20}
                  fill={star <= 4 ? '#ffd700' : 'none'}
                  color="#ffd700"
                />
              ))}
              <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                (4.0) 12 reviews
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#ffefbf'
                }}>
                  {formatPrice(currentPrice)}
                </span>
                {isOnSale && (
                  <>
                    <span style={{
                      fontSize: '1.5rem',
                      color: 'rgba(255, 239, 191, 0.4)',
                      textDecoration: 'line-through'
                    }}>
                      {formatPrice(currentMSRP)}
                    </span>
                    <span style={{
                      background: 'linear-gradient(135deg, #ff6b6b, #ff4444)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}>
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Variant Selector */}
            {hasMultipleVariants && selectedVariant && (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  Select Option
                </label>
                <select
                  className={styles.variantSelect}
                  value={selectedVariant.variantId}
                  onChange={(e) => handleVariantChange(e.target.value)}
                >
                  {product.variants.map(variant => (
                    <option key={variant.variantId} value={variant.variantId}>
                      {variant.variantName} - {formatPrice(parsePrice(variant.Price))}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                color: '#ffefbf',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                Quantity
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(30, 58, 95, 0.3)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffefbf',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Minus size={18} />
                  </button>
                  <span style={{
                    padding: '8px 20px',
                    color: '#ffefbf',
                    fontWeight: 600,
                    borderLeft: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRight: '1px solid rgba(255, 239, 191, 0.2)'
                  }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffefbf',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <AnimatePresence>
                {showAddedToCart ? (
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Check size={20} />
                    Added to Cart!
                  </motion.span>
                ) : (
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Share Button */}
            <button
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '8px',
                color: '#ffefbf',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '2rem'
              }}
            >
              <Share2 size={18} />
              Share Product
            </button>

            {/* Features */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <motion.div 
                whileHover={{ 
                  boxShadow: '0 8px 20px rgba(140, 218, 63, 0.3)',
                  y: -2
                }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'rgba(30, 58, 95, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                <Truck size={20} color="#8cda3f" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 239, 191, 0.8)', lineHeight: 1.3 }}>
                  Free Shipping Over $50
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ 
                  boxShadow: '0 8px 20px rgba(140, 218, 63, 0.3)',
                  y: -2
                }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'rgba(30, 58, 95, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                <Shield size={20} color="#8cda3f" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 239, 191, 0.8)', lineHeight: 1.3 }}>
                  1 Year Warranty
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ 
                  boxShadow: '0 8px 20px rgba(140, 218, 63, 0.3)',
                  y: -2
                }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'rgba(30, 58, 95, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                <Package size={20} color="#8cda3f" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 239, 191, 0.8)', lineHeight: 1.3 }}>
                  30-Day Returns
                </div>
              </motion.div>
            </div>

            {/* Description */}
            <div style={{
              borderTop: '1px solid rgba(255, 239, 191, 0.1)',
              paddingTop: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#ffefbf',
                marginBottom: '1rem'
              }}>
                Description
              </h3>
              <p style={{
                color: 'rgba(255, 239, 191, 0.8)',
                lineHeight: 1.6,
                marginBottom: '1rem'
              }}>
                {product.Description}
              </p>
              
              {/* Specs */}
              {(product["Spec Type 1"] || product["Spec Type 2"]) && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#ffefbf',
                    marginBottom: '0.75rem'
                  }}>
                    Specifications
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0
                  }}>
                    {product["Spec Type 1"] && selectedVariant && (
                      <li style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid rgba(255, 239, 191, 0.1)',
                        color: 'rgba(255, 239, 191, 0.8)'
                      }}>
                        <span>{product["Spec Type 1"]}:</span>
                        <span style={{ fontWeight: 600 }}>{selectedVariant["Spec 1"]}</span>
                      </li>
                    )}
                    {product["Spec Type 2"] && selectedVariant && (
                      <li style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid rgba(255, 239, 191, 0.1)',
                        color: 'rgba(255, 239, 191, 0.8)'
                      }}>
                        <span>{product["Spec Type 2"]}:</span>
                        <span style={{ fontWeight: 600 }}>{selectedVariant["Spec 2"]}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#ffefbf',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              You May Also Like
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.ID} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}