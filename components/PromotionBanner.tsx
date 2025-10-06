'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Promotion {
  id: number;
  location: string;
  heading: string;
  subheading: string | null;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
}

export default function PromotionBanner() {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner in this session
    const dismissed = sessionStorage.getItem('promotion_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      setIsVisible(false);
      return;
    }

    async function fetchPromotion() {
      try {
        const response = await fetch('/api/promotions/homepage_banner');
        if (response.ok) {
          const data = await response.json();
          if (data && data.is_active) {
            setPromotion(data);
          } else {
            setIsVisible(false);
          }
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        console.error('Error fetching promotion:', error);
        setIsVisible(false);
      }
    }

    fetchPromotion();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('promotion_dismissed', 'true');
  };

  if (!promotion || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, #8cda3f 0%, #6eb52f 100%)',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 50
          }}
        >
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
              }}
              title="Dismiss"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div style={{
              textAlign: 'center',
              color: 'white',
              flex: '1',
              maxWidth: '800px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '0.25rem',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                {promotion.heading}
              </h3>
              {promotion.subheading && (
                <p style={{
                  fontSize: '0.875rem',
                  opacity: 0.95,
                  fontWeight: 400
                }}>
                  {promotion.subheading}
                </p>
              )}
            </div>

            {/* Button */}
            {promotion.button_text && promotion.button_link && (
              <Link
                href={promotion.button_link}
                style={{
                  background: 'white',
                  color: '#6eb52f',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '50px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                }}
              >
                {promotion.button_text}
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
