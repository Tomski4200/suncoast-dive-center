'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter, Grid, List, ChevronDown } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getAllProducts, getCategories } from '@/lib/inventory';
import { Product, SortOption, ViewMode } from '@/lib/types';

// Category information and descriptions
const categoryInfo: { [key: string]: { title: string; description: string } } = {
  'Masks': {
    title: 'Diving Masks',
    description: 'A quality diving mask is your window to the underwater world. Our selection of masks offers superior clarity, comfort, and seal to ensure you never miss a moment of your underwater adventure. From single-lens designs for maximum field of view to low-volume masks for easy clearing, we have the perfect mask for every diver.'
  },
  'Snorkels': {
    title: 'Snorkels',
    description: 'The right snorkel makes surface swimming effortless and conserves your air for diving. Our range includes dry-top snorkels that prevent water entry, semi-dry designs for comfort, and traditional J-tube snorkels preferred by free divers. Each snorkel features comfortable mouthpieces and efficient purge valves.'
  },
  'Fins': {
    title: 'Diving Fins',
    description: 'Fins are your propulsion system underwater, transforming leg movements into efficient forward motion. Whether you prefer the power of paddle fins, the efficiency of split fins, or the precision of force fins, our collection offers options for every diving style and condition.'
  },
  'Wetsuits': {
    title: 'Wetsuits',
    description: 'Stay warm and protected with our premium wetsuit collection. From lightweight 3mm suits for tropical waters to thick 7mm suits for cold water diving, our wetsuits provide thermal protection, buoyancy, and defense against marine life and reef scrapes.'
  },
  'BCDs': {
    title: 'Buoyancy Control Devices',
    description: 'Your BCD is the heart of your scuba system, providing buoyancy control, tank attachment, and gear integration. Our selection includes jacket-style BCDs for comfort, back-inflate BCDs for streamlined profiles, and hybrid designs that offer the best of both worlds.'
  },
  'Regulators': {
    title: 'Regulators',
    description: 'Trust your breathing to our high-performance regulators. Each regulator set is precision-engineered for smooth, effortless breathing at any depth. Our collection includes environmentally sealed first stages, adjustable second stages, and complete packages with gauges and octopuses.'
  },
  'Computers': {
    title: 'Dive Computers',
    description: 'Modern dive computers are essential for safe diving, tracking your depth, time, and decompression status in real-time. From wrist-mounted computers with air integration to console-mounted units with digital compasses, our computers help you dive safer and longer.'
  },
  'Bags': {
    title: 'Dive Bags',
    description: 'Protect and organize your gear with our durable dive bags. From mesh bags for wet gear to wheeled bags for travel, our collection ensures your equipment stays organized and protected whether you\'re heading to the local dive site or traveling the world.'
  },
  'Lights': {
    title: 'Dive Lights',
    description: 'Illuminate the underwater world with our powerful dive lights. Essential for night diving, wreck penetration, and bringing out the true colors of the reef, our lights range from compact backup lights to powerful primary lights with thousands of lumens.'
  },
  'Cameras': {
    title: 'Underwater Cameras',
    description: 'Capture your underwater adventures with our selection of cameras and housings. From action cameras for casual shooting to professional DSLR housings for serious underwater photography, we have the equipment to help you share the beauty of the underwater world.'
  },
  'Accessories': {
    title: 'Dive Accessories',
    description: 'Complete your dive kit with essential accessories. From dive knives and cutting tools to slates and signaling devices, these items enhance your diving experience and safety. Every experienced diver knows that the right accessories can make all the difference.'
  },
  'Gloves': {
    title: 'Diving Gloves',
    description: 'Protect your hands from cold water, sharp rocks, and marine life with our diving gloves. Available in various thicknesses and materials, our gloves provide the dexterity you need while offering the protection you want during your underwater explorations.'
  },
  'Boots': {
    title: 'Dive Boots',
    description: 'Dive boots protect your feet and provide traction on slippery surfaces. Whether you need thin tropical boots for warm water or thick boots for cold water diving, our selection offers comfort and protection for every diving environment.'
  },
  'Hoods': {
    title: 'Diving Hoods',
    description: 'Since you lose significant body heat through your head, a good hood is essential for cold water diving. Our hoods range from thin 2mm tropical hoods to thick 7mm cold water hoods, many with convenient flow vents and comfortable face seals.'
  },
  'Tanks': {
    title: 'Scuba Tanks',
    description: 'Your air supply is crucial to every dive. We offer aluminum and steel tanks in various sizes, from compact pony bottles for backup air to high-capacity tanks for extended dives. All our tanks meet strict safety standards and come with current visual inspections.'
  },
  'Spearguns': {
    title: 'Spearguns',
    description: 'For the underwater hunter, we offer a selection of spearguns suitable for Florida waters. From band-powered guns for reef fishing to pneumatic guns for larger game, our spearguns are designed for accuracy, power, and reliability.'
  },
  'Weights': {
    title: 'Weight Systems',
    description: 'Proper weighting is essential for comfortable diving. Our weight systems include traditional weight belts, integrated BCD weights, and ankle weights. We offer both lead and soft weights to help you achieve perfect neutral buoyancy.'
  },
  'First Aid': {
    title: 'First Aid & Safety',
    description: 'Safety is paramount in diving. Our first aid and safety equipment includes oxygen kits, first aid supplies, signaling devices, and surface marker buoys. Be prepared for any situation with proper safety equipment.'
  },
  'Maintenance': {
    title: 'Gear Maintenance',
    description: 'Keep your equipment in top condition with our maintenance supplies. From regulator service kits to wetsuit shampoo and zipper lubricant, proper maintenance extends the life of your gear and ensures it performs when you need it most.'
  },
  'Training': {
    title: 'Training Materials',
    description: 'Expand your diving knowledge with our training materials. From certification course materials to specialty diving guides, continuous learning makes you a better, safer diver. We offer materials for all certification levels.'
  },
  'default': {
    title: 'Dive Equipment',
    description: 'Explore our comprehensive selection of diving equipment. From essential gear for beginners to specialized equipment for technical divers, we have everything you need for your underwater adventures. Quality equipment is an investment in your safety and enjoyment underwater.'
  }
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Convert slug to proper category name
  const getCategoryFromSlug = (slug: string): string => {
    // Handle special cases first
    const specialCases: { [key: string]: string } = {
      'first-aid': 'First Aid',
      'fins': 'Fins',
      'bcds': 'BCDs',
      'maintenance': 'Maintenance',
      'training': 'Training'
    };
    
    if (specialCases[slug]) {
      return specialCases[slug];
    }
    
    // Default conversion
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const category = getCategoryFromSlug(categorySlug);
  const info = categoryInfo[category] || categoryInfo['default'];

  useEffect(() => {
    async function loadProducts() {
      const allProducts = await getAllProducts();
      const categoryProducts = allProducts.filter(p =>
        p.Category?.toLowerCase().replace(/\s+/g, '-') === categorySlug
      );
      setProducts(categoryProducts);
      setFilteredProducts(categoryProducts);
    
      // Set price range based on category products
      if (categoryProducts.length > 0) {
        const prices = categoryProducts.map(p => {
          const price = p.basePrice ? parseFloat(p.basePrice.replace(/[$,]/g, '')) : 0;
          return price;
        });
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange([minPrice, maxPrice]);
      }
    }
    loadProducts();
  }, [categorySlug]);

  // Get unique brands in this category
  const brands = Array.from(new Set(products.map(p => p.Brand))).sort();

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.Brand));
    }

    // Filter by price
    filtered = filtered.filter(p => {
      const price = p.basePrice ? parseFloat(p.basePrice.replace(/[$,]/g, '')) : 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.Product.localeCompare(b.Product));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.Product.localeCompare(a.Product));
        break;
      case 'price-asc':
        filtered.sort((a, b) => {
          const aPrice = parseFloat(a.basePrice.replace(/[$,]/g, ''));
          const bPrice = parseFloat(b.basePrice.replace(/[$,]/g, ''));
          return aPrice - bPrice;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          const aPrice = parseFloat(a.basePrice.replace(/[$,]/g, ''));
          const bPrice = parseFloat(b.basePrice.replace(/[$,]/g, ''));
          return bPrice - aPrice;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => {
          if (a.Badge === 'New Arrival' && b.Badge !== 'New Arrival') return -1;
          if (b.Badge === 'New Arrival' && a.Badge !== 'New Arrival') return 1;
          return b.ID - a.ID;
        });
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedBrands, priceRange, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />
      
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '100px 2rem 2rem'
      }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.3), rgba(140, 218, 63, 0.1))',
            borderRadius: '16px',
            padding: '2.5rem',
            marginBottom: '2rem',
            border: '1px solid rgba(140, 218, 63, 0.2)'
          }}
        >
          <Link
            href="/diveshop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#8cda3f',
              textDecoration: 'none',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={16} />
            Back to All Products
          </Link>
          
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: '#ffefbf',
            marginBottom: '1rem'
          }}>
            {info.title}
          </h1>
          
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 239, 191, 0.8)',
            lineHeight: 1.7,
            maxWidth: '900px'
          }}>
            {info.description}
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            marginTop: '1.5rem',
            color: 'rgba(255, 239, 191, 0.6)',
            fontSize: '0.875rem'
          }}>
            <span>{filteredProducts.length} Products</span>
            {brands.length > 0 && <span>{brands.length} Brands</span>}
          </div>
        </motion.div>
        
        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Left Controls */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '10px 20px',
                background: 'rgba(140, 218, 63, 0.1)',
                border: '1px solid rgba(140, 218, 63, 0.3)',
                borderRadius: '8px',
                color: '#8cda3f',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <Filter size={18} />
              Filters
              {selectedBrands.length > 0 && (
                <span style={{
                  background: '#8cda3f',
                  color: '#0a1628',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {selectedBrands.length}
                </span>
              )}
            </button>
            
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                padding: '10px 16px',
                background: 'rgba(30, 58, 95, 0.3)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '8px',
                color: '#ffefbf',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
          
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px',
                background: viewMode === 'grid' ? 'rgba(140, 218, 63, 0.2)' : 'transparent',
                border: '1px solid rgba(140, 218, 63, 0.3)',
                borderRadius: '6px',
                color: viewMode === 'grid' ? '#8cda3f' : 'rgba(255, 239, 191, 0.5)',
                cursor: 'pointer'
              }}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px',
                background: viewMode === 'list' ? 'rgba(140, 218, 63, 0.2)' : 'transparent',
                border: '1px solid rgba(140, 218, 63, 0.3)',
                borderRadius: '6px',
                color: viewMode === 'list' ? '#8cda3f' : 'rgba(255, 239, 191, 0.5)',
                cursor: 'pointer'
              }}
            >
              <List size={20} />
            </button>
          </div>
        </motion.div>
        
        {/* Filter Sidebar (Collapsible) */}
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(30, 58, 95, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            {/* Brand Filter */}
            {brands.length > 0 && (
              <div>
                <h3 style={{
                  color: '#ffefbf',
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '1rem'
                }}>
                  Brands
                </h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      style={{
                        padding: '6px 12px',
                        background: selectedBrands.includes(brand)
                          ? 'rgba(140, 218, 63, 0.2)'
                          : 'transparent',
                        border: `1px solid ${selectedBrands.includes(brand)
                          ? 'rgba(140, 218, 63, 0.5)'
                          : 'rgba(255, 239, 191, 0.2)'}`,
                        borderRadius: '20px',
                        color: selectedBrands.includes(brand)
                          ? '#8cda3f'
                          : 'rgba(255, 239, 191, 0.8)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
                
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => setSelectedBrands([])}
                    style={{
                      marginTop: '1rem',
                      color: '#8cda3f',
                      fontSize: '0.875rem',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
        
        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: viewMode === 'grid' ? 'grid' : 'flex',
              gridTemplateColumns: viewMode === 'grid'
                ? 'repeat(auto-fill, minmax(280px, 1fr))'
                : undefined,
              flexDirection: viewMode === 'list' ? 'column' : undefined,
              gap: '1.5rem'
            }}
          >
            {filteredProducts.map(product => (
              <ProductCard key={product.ID} product={product} />
            ))}
          </motion.div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'rgba(255, 239, 191, 0.6)'
          }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              No products found in this category
            </p>
            <Link
              href="/diveshop"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                borderRadius: '8px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Browse All Products
            </Link>
          </div>
        )}
        
        {/* Return to Shop CTA */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              textAlign: 'center',
              marginTop: '4rem',
              padding: '2rem',
              background: 'linear-gradient(135deg, rgba(140, 218, 63, 0.1), rgba(30, 58, 95, 0.2))',
              borderRadius: '12px',
              border: '1px solid rgba(140, 218, 63, 0.2)'
            }}
          >
            <p style={{
              color: 'rgba(255, 239, 191, 0.8)',
              fontSize: '1.125rem',
              marginBottom: '1.5rem'
            }}>
              Looking for something else?
            </p>
            <Link
              href="/diveshop"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                borderRadius: '8px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'transform 0.3s ease',
                boxShadow: '0 4px 15px rgba(140, 218, 63, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              View All Dive Shop Products
            </Link>
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}