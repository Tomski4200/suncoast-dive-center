'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import PromotionBanner from '@/components/PromotionBanner';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryGrid from '@/components/CategoryGrid';
import VisibilityWidget from '@/components/VisibilityWidget';
import BlogSection from '@/components/BlogSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic imports for hero components
const HeroRipple = dynamic(() => import('@/components/HeroRipple'), { 
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0a1628' }} />
});

const HeroVideoSimple = dynamic(() => import('@/components/HeroVideoSimple'), { 
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0a1628' }} />
});

export default function HomePage() {
  const [isVideoMode, setIsVideoMode] = useState(false);

  return (
    <main>
      <PromotionBanner />
      <Navigation isVideoMode={isVideoMode} setIsVideoMode={setIsVideoMode} />

      {/* Hero Section with Animation */}
      <AnimatePresence mode="wait">
        {isVideoMode ? (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroVideoSimple />
          </motion.div>
        ) : (
          <motion.div
            key="static"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroRipple />
          </motion.div>
        )}
      </AnimatePresence>
      
      <FeaturedProducts />
      <CategoryGrid />
      <VisibilityWidget />
      <BlogSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}