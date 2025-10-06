'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, ChevronDown, ChevronUp, Grid, List,
  SlidersHorizontal, Package, Tag, CircleX, DollarSign
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
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(24);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [tableSortColumn, setTableSortColumn] = useState<'brand' | 'name' | 'category' | 'price'>('name');
  const [tableSortDirection, setTableSortDirection] = useState<'asc' | 'desc'>('asc');
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [brandsExpanded, setBrandsExpanded] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prods, cats, brds, bdgs, priceRng] = await Promise.all([
          getAllProducts(),
          getCategories(),
          getBrands(),
          getBadges(),
          getPriceRange()
        ]);

        setProducts(prods);
        setFilteredProducts(prods);
        setCategories(cats);
        setBrands(brds);
        setBadges(bdgs);
        const min = Math.floor(priceRng[0]);
        const max = Math.ceil(priceRng[1]);
        setMinPrice(min);
        setMaxPrice(max);
        setPriceRange([min, max]);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter products when filters change
  useEffect(() => {
    async function applyFilters() {
      if (products.length === 0) return;

      const filtered = await filterProducts({
        searchQuery,
        categories: selectedCategories,
        brands: selectedBrands,
        badges: selectedBadges,
        priceRange,
        sortBy
      });
      setFilteredProducts(filtered);
    }
    applyFilters();
  }, [searchQuery, selectedCategories, selectedBrands, selectedBadges, priceRange, sortBy, products]);

  // Pagination
  const totalPages = productsPerPage === -1 ? 1 : Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = productsPerPage === -1
    ? filteredProducts
    : filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      );

  // Table sorting handler
  const handleTableSort = (column: 'brand' | 'name' | 'category' | 'price') => {
    if (tableSortColumn === column) {
      setTableSortDirection(tableSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setTableSortColumn(column);
      setTableSortDirection('asc');
    }
  };

  // Apply table sorting to paginated products for list view
  const displayProducts = viewMode === 'list'
    ? [...paginatedProducts].sort((a, b) => {
        let aVal, bVal;
        switch (tableSortColumn) {
          case 'brand':
            aVal = a.Brand.toLowerCase();
            bVal = b.Brand.toLowerCase();
            break;
          case 'name':
            aVal = a.Product.toLowerCase();
            bVal = b.Product.toLowerCase();
            break;
          case 'category':
            aVal = (a.Category || '').toLowerCase();
            bVal = (b.Category || '').toLowerCase();
            break;
          case 'price':
            aVal = parsePrice(a.basePrice);
            bVal = parsePrice(b.basePrice);
            break;
          default:
            return 0;
        }

        if (tableSortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      })
    : paginatedProducts;

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

  const clearFilters = async () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedBadges([]);
    setSortBy('newest');

    // Reset price range to full range
    const [min, max] = await getPriceRange();
    const minVal = Math.floor(min);
    const maxVal = Math.ceil(max);
    setMinPrice(minVal);
    setMaxPrice(maxVal);
    setPriceRange([minVal, maxVal]);
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 ||
    selectedBrands.length > 0 || selectedBadges.length > 0;

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
                  {hasActiveFilters ? (
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
                  ) : (
                    <button
                      onClick={() => setShowFilters(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 239, 191, 0.6)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#8cda3f';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)';
                      }}
                    >
                      <CircleX size={20} />
                    </button>
                  )}
                </div>

                {/* Search */}
                <div style={{ marginBottom: '1.5rem' }}>
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
                  <h4
                    onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                    style={{
                      color: '#ffefbf',
                      fontSize: '0.875rem',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#ffefbf'}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Package size={16} />
                      Categories
                    </span>
                    {categoriesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </h4>
                  <AnimatePresence>
                    {categoriesExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {categories.map(category => (
                            <label
                              key={category}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                color: 'rgba(255, 239, 191, 0.8)',
                                marginBottom: '0.5rem'
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Brands */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4
                    onClick={() => setBrandsExpanded(!brandsExpanded)}
                    style={{
                      color: '#ffefbf',
                      fontSize: '0.875rem',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#ffefbf'}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Tag size={16} />
                      Brands
                    </span>
                    {brandsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </h4>
                  <AnimatePresence>
                    {brandsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Price Range */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    color: '#ffefbf',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <DollarSign size={16} />
                    Price Range
                  </h4>

                  {/* Number Inputs */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ position: 'relative', width: '50%' }}>
                      <DollarSign size={16} style={{
                        position: 'absolute',
                        left: '6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 239, 191, 0.5)'
                      }} />
                      <input
                        type="number"
                        value={Math.round(priceRange[0])}
                        onChange={(e) => setPriceRange([Math.round(Number(e.target.value)), priceRange[1]])}
                        min={Math.floor(minPrice)}
                        max={Math.ceil(priceRange[1])}
                        step="1"
                        style={{
                          width: '100%',
                          padding: '6px 6px 6px 28px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 239, 191, 0.2)',
                          borderRadius: '4px',
                          color: '#ffefbf',
                          fontSize: '0.875rem',
                          textAlign: 'right'
                        }}
                      />
                    </div>
                    <div style={{ position: 'relative', width: '50%' }}>
                      <DollarSign size={16} style={{
                        position: 'absolute',
                        left: '6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 239, 191, 0.5)'
                      }} />
                      <input
                        type="number"
                        value={Math.round(priceRange[1])}
                        onChange={(e) => setPriceRange([priceRange[0], Math.round(Number(e.target.value))])}
                        min={Math.floor(priceRange[0])}
                        max={Math.ceil(maxPrice)}
                        step="1"
                        style={{
                          width: '100%',
                          padding: '6px 6px 6px 28px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 239, 191, 0.2)',
                          borderRadius: '4px',
                          color: '#ffefbf',
                          fontSize: '0.875rem',
                          textAlign: 'right'
                        }}
                      />
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <input
                      type="range"
                      min={Math.floor(minPrice)}
                      max={Math.ceil(maxPrice)}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      style={{
                        width: '100%',
                        height: '6px',
                        background: `linear-gradient(to right,
                          rgba(255, 239, 191, 0.1) 0%,
                          #8cda3f ${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%,
                          #8cda3f ${((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%,
                          rgba(255, 239, 191, 0.1) 100%)`,
                        borderRadius: '3px',
                        outline: 'none',
                        cursor: 'pointer',
                        accentColor: '#8cda3f'
                      }}
                    />
                    <input
                      type="range"
                      min={Math.floor(minPrice)}
                      max={Math.ceil(maxPrice)}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      style={{
                        width: '100%',
                        height: '6px',
                        background: 'transparent',
                        outline: 'none',
                        cursor: 'pointer',
                        marginTop: '-6px',
                        position: 'relative',
                        accentColor: '#8cda3f'
                      }}
                    />
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

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Sort Dropdown - Only shown in grid view */}
              {viewMode === 'grid' && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  style={{
                    background: 'rgba(30, 58, 95, 0.3)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffefbf',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              )}

              {/* Items Per Page Selector */}
              <select
                value={productsPerPage}
                onChange={(e) => {
                  setProductsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  background: 'rgba(30, 58, 95, 0.3)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffefbf',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <option value={24}>24 per page</option>
                <option value={48}>48 per page</option>
                <option value={72}>72 per page</option>
                <option value={96}>96 per page</option>
                <option value={-1}>All items</option>
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

          {/* Products Grid/Table */}
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              color: '#ffefbf',
              fontSize: '1.2rem'
            }}>
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              color: 'rgba(255, 239, 191, 0.7)',
              fontSize: '1.2rem',
              textAlign: 'center'
            }}>
              No products found matching your filters.
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.ID}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div style={{
              background: 'rgba(30, 58, 95, 0.2)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    background: 'rgba(30, 58, 95, 0.5)',
                    borderBottom: '2px solid rgba(140, 218, 63, 0.3)'
                  }}>
                    <th
                      onClick={() => handleTableSort('category')}
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        color: '#ffefbf',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#ffefbf'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Category
                        {tableSortColumn === 'category' && (
                          tableSortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleTableSort('brand')}
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        color: '#ffefbf',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#ffefbf'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Brand
                        {tableSortColumn === 'brand' && (
                          tableSortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleTableSort('name')}
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        color: '#ffefbf',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#ffefbf'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Product Name
                        {tableSortColumn === 'name' && (
                          tableSortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#ffefbf',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: '80px'
                    }}>
                      Image
                    </th>
                    <th
                      onClick={() => handleTableSort('price')}
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        color: '#ffefbf',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'color 0.3s ease',
                        width: '120px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#ffefbf'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Price
                        {tableSortColumn === 'price' && (
                          tableSortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayProducts.map((product, index) => (
                    <tr
                      key={product.ID}
                      style={{
                        borderBottom: '1px solid rgba(255, 239, 191, 0.1)',
                        transition: 'background 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(140, 218, 63, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => window.location.href = `/diveshop/${product.ID}`}
                    >
                      <td style={{
                        padding: '1rem',
                        color: 'rgba(255, 239, 191, 0.7)',
                        fontSize: '0.875rem'
                      }}>
                        {product.Category || 'N/A'}
                      </td>
                      <td style={{
                        padding: '1rem',
                        color: 'rgba(255, 239, 191, 0.8)',
                        fontWeight: 500
                      }}>
                        {product.Brand || 'N/A'}
                      </td>
                      <td style={{
                        padding: '1rem',
                        color: '#ffefbf',
                        fontWeight: 500
                      }}>
                        {product.Product}
                        {product.Badge && (
                          <span style={{
                            marginLeft: '0.5rem',
                            padding: '2px 8px',
                            background: 'rgba(140, 218, 63, 0.2)',
                            color: '#8cda3f',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {product.Badge}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: 'white',
                          border: '1px solid rgba(255, 239, 191, 0.1)'
                        }}>
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.Product}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'rgba(255, 239, 191, 0.3)',
                              fontSize: '0.75rem'
                            }}>
                              No Image
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        color: '#8cda3f',
                        fontWeight: 600,
                        fontSize: '1rem'
                      }}>
                        {product.priceRange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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