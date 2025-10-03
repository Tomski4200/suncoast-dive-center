import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryGrid from '@/components/CategoryGrid';
import VisibilityWidget from '@/components/VisibilityWidget';

// Use the video version with visual water effects
const HeroVideoSimple = dynamic(() => import('@/components/HeroVideoSimple'), { 
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0a1628' }} />
});

export default function VideoDemoPage() {
  return (
    <main>
      <Navigation />
      <HeroVideoSimple />
      <FeaturedProducts />
      <CategoryGrid />
      <VisibilityWidget />
    </main>
  );
}