'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, ChevronDown, Grid, List, 
  SlidersHorizontal, Package, Tag
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { 
  getAllProducts, getCategories, getBrands, getBadges, 
  filterProducts, getPriceRange, parsePrice 
} from '@/lib/inventory';
import { Product, SortOption, ViewMode } from '@/lib/types';

export default function ShopPage() {
  // State
  const [products] = useState<Product[]>(getAllProducts());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(getPriceRange());
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24;

  // Get filter options
  const categories = useMemo(() => getCategories(), []);
  const brands = useMemo(() => getBrands(), []);
  const badges = useMemo(() => getBadges(), []);
  const [minPrice, maxPrice] = getPriceRange();

  // Filter products
  const filteredProducts = useMemo(() => {
    return filterProducts({
      searchQuery,
      categories: selectedCategories,
      brands: selectedBrands,
      badges: selectedBadges,
      priceRange,
      sortBy
    });
  }, [searchQuery, selectedCategories, selectedBrands, selectedBadges, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedBrands, selectedBadges, priceRange, sortBy]);

  // Handlers
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges(prev =>
      prev.includes(badge)
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedBadges([]);
    setPriceRange([minPrice, maxPrice]);
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || 
    selectedBrands.length > 0 || selectedBadges.length > 0 || 
    priceRange[0] !== minPrice || priceRange[1] !== maxPrice;

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />
      
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '100px 2rem 2rem',
        display: 'flex',
        gap: '2rem'
      }}>
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              style={{
                width: '280px',
                flexShrink: 0
              }}
            >
              <div style={{
                background: 'rgba(30, 58, 95, 0.3)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 239, 191, 0.1)'
              }}>
                {/* Filter Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ 
                    color: '#ffefbf', 
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Filter size={20} />
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      style={{
                        background: 'transparent',
                        border: '1px solid #8cda3f',
                        color: '#8cda3f',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Search */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    color: '#ffefbf', 
                    fontSize: '0.875rem',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>
                    Search
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Search size={18} style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(255, 239, 191, 0.5)'
                    }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      style={{
                        width: '100%',
                        padding: '8px 8px 8px 36px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 239, 191, 0.2)',
                        borderRadius: '6px',
                        color: '#ffefbf',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    color: '#ffefbf', 
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Package size={16} />
                    Categories
                  </h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {categories.map(category => (
                      <label
                        key={category}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem',
                          cursor: 'pointer',
                          color: 'rgba(255, 239, 191, 0.8)'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          style={{ accentColor: '#8cda3f' }}
                        />
                        <span style={{ fontSize: '0.875rem' }}>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    color: '#ffefbf', 
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Tag size={16} />
                    Brands
                  </h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {brands.map(brand => (
                      <label
                        key={brand}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem',
                          cursor: 'pointer',
                          color: 'rgba(255, 239, 191, 0.8)'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          style={{ accentColor: '#8cda3f' }}
                        />
                        <span style={{ fontSize: '0.875rem' }}>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    color: '#ffefbf', 
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem'
                  }}>
                    Price Range
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      style={{
                        width: '50%',
                        padding: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 239, 191, 0.2)',
                        borderRadius: '4px',
                        color: '#ffefbf',
                        fontSize: '0.875rem'
                      }}
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      style={{
                        width: '50%',
                        padding: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 239, 191, 0.2)',
                        borderRadius: '4px',
                        color: '#ffefbf',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'rgba(255, 239, 191, 0.6)' 
                  }}>
                    ${priceRange[0]} - ${priceRange[1]}
                  </div>
                </div>

                {/* Badges */}
                {badges.length > 0 && (
                  <div>
                    <h4 style={{ 
                      color: '#ffefbf', 
                      fontSize: '0.875rem',
                      marginBottom: '0.75rem'
                    }}>
                      Special Tags
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {badges.map(badge => (
                        <button
                          key={badge}
                          onClick={() => toggleBadge(badge)}
                          style={{
                            padding: '4px 10px',
                            background: selectedBadges.includes(badge) 
                              ? '#8cda3f' 
                              : 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '20px',
                            color: selectedBadges.includes(badge) 
                              ? '#0a1628' 
                              : 'rgba(255, 239, 191, 0.8)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {badge}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  background: 'rgba(30, 58, 95, 0.3)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffefbf',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <SlidersHorizontal size={18} />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
              
              <div style={{ color: 'rgba(255, 239, 191, 0.7)' }}>
                {filteredProducts.length} products
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                style={{
                  background: 'rgba(30, 58, 95, 0.3)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffefbf',
                  cursor: 'pointer'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              {/* View Mode */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    background: viewMode === 'grid' 
                      ? 'rgba(140, 218, 63, 0.2)' 
                      : 'transparent',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '4px',
                    padding: '6px',
                    color: viewMode === 'grid' ? '#8cda3f' : '#ffefbf',
                    cursor: 'pointer'
                  }}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    background: viewMode === 'list' 
                      ? 'rgba(140, 218, 63, 0.2)' 
                      : 'transparent',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '4px',
                    padding: '6px',
                    color: viewMode === 'list' ? '#8cda3f' : '#ffefbf',
                    cursor: 'pointer'
                  }}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'grid' 
              ? 'repeat(auto-fill, minmax(250px, 1fr))' 
              : '1fr',
            gap: '1.5rem'
          }}>
            {paginatedProducts.map((product) => (
              <ProductCard 
                key={product.ID} 
                product={product}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '3rem'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  background: 'rgba(30, 58, 95, 0.3)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: currentPage === 1 
                    ? 'rgba(255, 239, 191, 0.3)' 
                    : '#ffefbf',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      background: currentPage === pageNum 
                        ? '#8cda3f' 
                        : 'rgba(30, 58, 95, 0.3)',
                      border: '1px solid rgba(255, 239, 191, 0.2)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: currentPage === pageNum 
                        ? '#0a1628' 
                        : '#ffefbf',
                      cursor: 'pointer',
                      fontWeight: currentPage === pageNum ? 600 : 400
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  background: 'rgba(30, 58, 95, 0.3)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: currentPage === totalPages 
                    ? 'rgba(255, 239, 191, 0.3)' 
                    : '#ffefbf',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}