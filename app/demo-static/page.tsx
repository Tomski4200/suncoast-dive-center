import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryGrid from '@/components/CategoryGrid';

// Use the original ripple version with static image
const HeroRipple = dynamic(() => import('@/components/HeroRipple'), { 
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0a1628' }} />
});

export default function StaticDemoPage() {
  return (
    <main>
      <Navigation />
      <HeroRipple />
      <FeaturedProducts />
      <CategoryGrid />
      
      {/* More sections to come */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-[#0a1628] to-[#1e3a5f]">
        <h2 className="text-4xl font-bold mb-4">Current Dive Conditions</h2>
        <p className="text-gray-300">Visibility widget coming soon</p>
      </section>
    </main>
  );
}