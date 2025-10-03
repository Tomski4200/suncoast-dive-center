'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/inventory';
import { getStaticProductImage } from '@/lib/productImages';
import { PLACEHOLDER_IMAGE } from '@/lib/placeholderImage';

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998
            }}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '400px',
              background: '#0a1628',
              borderLeft: '1px solid rgba(255, 239, 191, 0.1)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255, 239, 191, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#ffefbf',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <ShoppingCart size={24} />
                Shopping Cart ({itemCount})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffefbf',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem'
            }}>
              {items.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: 'rgba(255, 239, 191, 0.6)'
                }}>
                  <ShoppingCart size={64} style={{ 
                    marginBottom: '1rem', 
                    opacity: 0.3 
                  }} />
                  <p style={{ marginBottom: '1rem' }}>Your cart is empty</p>
                  <Link
                    href="/diveshop"
                    onClick={() => setIsCartOpen(false)}
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                      borderRadius: '6px',
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {items.map(item => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(30, 58, 95, 0.2)',
                        borderRadius: '8px'
                      }}
                    >
                      {/* Image */}
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'white',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative'
                      }}>
                        <Image
                          src={getStaticProductImage(item.productId)}
                          alt={item.product.Product}
                          fill
                          style={{ objectFit: 'contain', padding: '0.5rem' }}
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1 }}>
                        <Link
                          href={`/diveshop/${item.productId}`}
                          onClick={() => setIsCartOpen(false)}
                          style={{
                            color: '#ffefbf',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            display: 'block',
                            marginBottom: '0.25rem'
                          }}
                        >
                          {item.product.Product}
                        </Link>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'rgba(255, 239, 191, 0.6)',
                          marginBottom: '0.5rem'
                        }}>
                          {item.variant.variantName}
                        </div>
                        <div style={{
                          fontSize: '1rem',
                          color: '#8cda3f',
                          fontWeight: 600
                        }}>
                          {formatPrice(parseFloat(item.variant.Price.replace(/[$,]/g, '')))}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: 'rgba(30, 58, 95, 0.3)',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1
                            )}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ffefbf',
                              padding: '4px 8px',
                              cursor: 'pointer'
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{
                            padding: '4px 12px',
                            color: '#ffefbf',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity + 1
                            )}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ffefbf',
                              padding: '4px 8px',
                              cursor: 'pointer'
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{
                padding: '1.5rem',
                borderTop: '1px solid rgba(255, 239, 191, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <span style={{ color: '#ffefbf', fontSize: '1.125rem' }}>Subtotal</span>
                  <span style={{ 
                    color: '#ffefbf', 
                    fontSize: '1.25rem',
                    fontWeight: 700
                  }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 239, 191, 0.6)',
                  marginBottom: '1rem'
                }}>
                  Shipping and taxes calculated at checkout
                </p>
                <button
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '0.5rem'
                  }}
                >
                  Proceed to Checkout
                </button>
                <Link
                  href="/diveshop"
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    textAlign: 'center',
                    background: 'transparent',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '6px',
                    color: '#ffefbf',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}