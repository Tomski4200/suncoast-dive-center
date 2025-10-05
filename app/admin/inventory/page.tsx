'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Plus, Search, Filter, Edit2, Trash2, 
  Package, DollarSign, Tag, AlertCircle, Save, X,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Upload, Image, PlusCircle, MinusCircle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAllRawProducts } from '@/lib/inventory';
import { Product } from '@/lib/types';

export default function InventoryManagement() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Form state for editing/adding
  const [formData, setFormData] = useState({
    ID: '',
    Product: '',
    Brand: '',
    Category: '',
    Description: '',
    Msrp: '',
    SalePrice: '',
    Badge: '',
    UPC: '',
    Inventory: '',
    variants: [] as any[],
    images: [] as string[]
  });
  
  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else if (!isAdmin()) {
      router.push('/dashboard');
    }
  }, [user, router, isAdmin]);
  
  // Load products
  useEffect(() => {
    async function loadProducts() {
      const allProducts = await getAllRawProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    }
    loadProducts();
  }, []);
  
  // Filter and sort products
  useEffect(() => {
    let filtered = products;
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.Product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.Brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.Category === selectedCategory);
    }
    
    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' 
            ? aVal - bVal
            : bVal - aVal;
        }
        
        return 0;
      });
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory, products, sortField, sortDirection]);
  
  if (!user || !isAdmin()) {
    return null;
  }
  
  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.Category))).sort();
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      ID: product.ID ? product.ID.toString() : '',
      Product: product.Product || '',
      Brand: product.Brand || '',
      Category: product.Category || '',
      Description: product.Description || '',
      Msrp: product.Msrp ? product.Msrp.toString() : '0',
      SalePrice: product.SalePrice ? product.SalePrice.toString() : '0',
      Badge: product.Badge || '',
      UPC: product.UPC || '',
      Inventory: product.Inventory ? product.Inventory.toString() : '0',
      variants: product.variants || [],
      images: product.images || []
    });
  };
  
  const handleAdd = () => {
    setIsAddingProduct(true);
    setFormData({
      ID: '',
      Product: '',
      Brand: '',
      Category: '',
      Description: '',
      Msrp: '',
      SalePrice: '',
      Badge: '',
      UPC: '',
      Inventory: '0',
      variants: [],
      images: []
    });
  };
  
  const handleSave = () => {
    // In a real app, this would save to a database
    alert('Product saved! (In production, this would update the database)');
    setEditingProduct(null);
    setIsAddingProduct(false);
  };
  
  const handleDelete = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      // In a real app, this would delete from database
      alert('Product deleted! (In production, this would update the database)');
    }
  };
  
  const handleCancel = () => {
    setEditingProduct(null);
    setIsAddingProduct(false);
    setFormData({
      ID: '',
      Product: '',
      Brand: '',
      Category: '',
      Description: '',
      Msrp: '',
      SalePrice: '',
      Badge: '',
      UPC: '',
      Inventory: '',
      variants: [],
      images: []
    });
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, this would upload to a server
      // For demo, we'll just create object URLs
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData({ ...formData, images: [...formData.images, ...newImages] });
    }
  };
  
  // Handle variant addition
  const handleAddVariant = () => {
    const newVariant = { name: '', price: '', sku: '', inventory: '0' };
    setFormData({ ...formData, variants: [...formData.variants, newVariant] });
  };
  
  // Handle variant update
  const handleVariantChange = (index: number, field: string, value: string) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData({ ...formData, variants: updatedVariants });
  };
  
  // Handle variant removal
  const handleRemoveVariant = (index: number) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };
  
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />
      
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '120px 2rem 4rem'
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <Link
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#8cda3f',
              textDecoration: 'none',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#ffefbf',
                marginBottom: '0.5rem'
              }}>
                Inventory Management
              </h1>
              <p style={{ color: 'rgba(255, 239, 191, 0.7)' }}>
                Manage your dive shop products and pricing
              </p>
            </div>
            
            <button
              onClick={handleAdd}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                borderRadius: '8px',
                border: 'none',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </motion.div>
        
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Total Products
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  {products.length}
                </p>
              </div>
              <Package size={24} color="#8cda3f" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Categories
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  {categories.length}
                </p>
              </div>
              <Tag size={24} color="#8cda3f" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  On Sale
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  {products.filter(p => p.Badge === 'Sale').length}
                </p>
              </div>
              <DollarSign size={24} color="#8cda3f" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Avg Price
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  ${products.length > 0 
                    ? (products.reduce((acc, p) => acc + (p.SalePrice || 0), 0) / products.length).toFixed(0)
                    : '0'}
                </p>
              </div>
              <AlertCircle size={24} color="#8cda3f" />
            </div>
          </motion.div>
        </div>
        
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(30, 58, 95, 0.2)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '12px',
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
                  padding: '12px 12px 12px 44px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  color: '#ffefbf',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '12px 20px',
                background: 'rgba(30, 58, 95, 0.3)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '8px',
                color: '#ffefbf',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: '1px solid #8cda3f',
                borderRadius: '8px',
                color: '#8cda3f',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
          
          <p style={{
            color: 'rgba(255, 239, 191, 0.6)',
            fontSize: '0.875rem',
            marginTop: '1rem'
          }}>
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </motion.div>
        
        {/* Products Table or Edit Form */}
        {(editingProduct || isAddingProduct) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(30, 58, 95, 0.2)',
              borderRadius: '12px',
              padding: '2rem'
            }}
          >
            <h2 style={{ 
              color: '#ffefbf', 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              marginBottom: '1.5rem' 
            }}>
              {isAddingProduct ? 'Add New Product' : `Edit Product #${formData.ID}`}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Product ID
                </label>
                <input
                  type="text"
                  value={formData.ID}
                  onChange={(e) => setFormData({ ...formData, ID: e.target.value })}
                  disabled={!isAddingProduct}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: isAddingProduct ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem',
                    opacity: isAddingProduct ? 1 : 0.7
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  UPC/Barcode
                </label>
                <input
                  type="text"
                  value={formData.UPC}
                  onChange={(e) => setFormData({ ...formData, UPC: e.target.value })}
                  placeholder="Enter UPC or barcode"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.Product}
                  onChange={(e) => setFormData({ ...formData, Product: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.Brand}
                  onChange={(e) => setFormData({ ...formData, Brand: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Category
                </label>
                <input
                  type="text"
                  value={formData.Category}
                  onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Badge (Sale, New Arrival, etc.)
                </label>
                <input
                  type="text"
                  value={formData.Badge}
                  onChange={(e) => setFormData({ ...formData, Badge: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  MSRP
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.Msrp}
                  onChange={(e) => setFormData({ ...formData, Msrp: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Sale Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.SalePrice}
                  onChange={(e) => setFormData({ ...formData, SalePrice: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.Inventory}
                  onChange={(e) => setFormData({ ...formData, Inventory: e.target.value })}
                  placeholder="0"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            
            {/* Description Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#ffefbf',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                fontWeight: 500
              }}>
                Product Description
              </label>
              <textarea
                value={formData.Description}
                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                rows={4}
                placeholder="Enter detailed product description..."
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  color: '#ffefbf',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
            
            {/* Image Upload Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#ffefbf',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                fontWeight: 500
              }}>
                Product Images
              </label>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                {formData.images.map((image, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={image} 
                      alt={`Product ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      onClick={() => {
                        const updatedImages = formData.images.filter((_, i) => i !== index);
                        setFormData({ ...formData, images: updatedImages });
                      }}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(255, 107, 107, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={14} color="white" />
                    </button>
                  </div>
                ))}
                
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100px',
                  background: 'rgba(140, 218, 63, 0.1)',
                  border: '2px dashed rgba(140, 218, 63, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <Upload size={24} color="#8cda3f" />
                  <span style={{
                    color: '#8cda3f',
                    fontSize: '0.75rem',
                    marginTop: '0.5rem',
                    fontWeight: 600
                  }}>
                    Add Image
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
            
            {/* Variants Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <label style={{
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  Product Variants
                </label>
                <button
                  onClick={handleAddVariant}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '6px 12px',
                    background: 'rgba(140, 218, 63, 0.2)',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    borderRadius: '6px',
                    color: '#8cda3f',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <PlusCircle size={16} />
                  Add Variant
                </button>
              </div>
              
              {formData.variants.length > 0 ? (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {formData.variants.map((variant, index) => (
                    <div key={index} style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                      gap: '0.75rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      alignItems: 'center'
                    }}>
                      <input
                        type="text"
                        value={variant.name || ''}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        placeholder="Variant name (e.g., Blue, Large)"
                        style={{
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 239, 191, 0.2)',
                          borderRadius: '6px',
                          color: '#ffefbf',
                          fontSize: '0.875rem'
                        }}
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price || ''}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        placeholder="Price"
                        style={{
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 239, 191, 0.2)',
                          borderRadius: '6px',
                          color: '#ffefbf',
                          fontSize: '0.875rem'
                        }}
                      />
                      <input
                        type="text"
                        value={variant.sku || ''}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        placeholder="SKU"
                        style={{
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 239, 191, 0.2)',
                          borderRadius: '6px',
                          color: '#ffefbf',
                          fontSize: '0.875rem'
                        }}
                      />
                      <input
                        type="number"
                        value={variant.inventory || ''}
                        onChange={(e) => handleVariantChange(index, 'inventory', e.target.value)}
                        placeholder="Stock"
                        min="0"
                        style={{
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 239, 191, 0.2)',
                          borderRadius: '6px',
                          color: '#ffefbf',
                          fontSize: '0.875rem'
                        }}
                      />
                      <button
                        onClick={() => handleRemoveVariant(index)}
                        style={{
                          padding: '8px',
                          background: 'rgba(255, 107, 107, 0.1)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#ff6b6b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <MinusCircle size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '2rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: 'rgba(255, 239, 191, 0.5)'
                }}>
                  No variants added. Click "Add Variant" to create product variations.
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={handleSave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                  borderRadius: '8px',
                  border: 'none',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Save size={18} />
                Save Product
              </button>
              
              <button
                onClick={handleCancel}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  color: 'rgba(255, 239, 191, 0.8)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(30, 58, 95, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              overflowX: 'auto'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 239, 191, 0.1)' }}>
                  <th style={{ 
                    padding: '0.75rem', 
                    textAlign: 'left', 
                    color: 'rgba(255, 239, 191, 0.6)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSort('Product')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Product
                      {sortField === 'Product' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th style={{ 
                    padding: '0.75rem', 
                    textAlign: 'left', 
                    color: 'rgba(255, 239, 191, 0.6)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSort('Brand')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Brand
                      {sortField === 'Brand' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th style={{ 
                    padding: '0.75rem', 
                    textAlign: 'left', 
                    color: 'rgba(255, 239, 191, 0.6)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSort('Category')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Category
                      {sortField === 'Category' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th style={{ 
                    padding: '0.75rem', 
                    textAlign: 'left', 
                    color: 'rgba(255, 239, 191, 0.6)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSort('Msrp')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      MSRP
                      {sortField === 'Msrp' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th style={{ 
                    padding: '0.75rem', 
                    textAlign: 'left', 
                    color: 'rgba(255, 239, 191, 0.6)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSort('SalePrice')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Sale Price
                      {sortField === 'SalePrice' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th style={{ 
                    padding: '0.75rem', 
                    textAlign: 'left', 
                    color: 'rgba(255, 239, 191, 0.6)',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}>
                    Badge
                  </th>
                  <th style={{ 
                    padding: '0.75rem', 
                    textAlign: 'center', 
                    color: 'rgba(255, 239, 191, 0.6)',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map(product => (
                  <tr 
                    key={product.ID}
                    style={{ borderBottom: '1px solid rgba(255, 239, 191, 0.05)' }}
                  >
                    <td style={{ 
                      padding: '0.75rem', 
                      color: '#ffefbf', 
                      fontSize: '0.875rem',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {product.Product}
                    </td>
                    <td style={{ padding: '0.75rem', color: 'rgba(255, 239, 191, 0.8)', fontSize: '0.875rem' }}>
                      {product.Brand}
                    </td>
                    <td style={{ padding: '0.75rem', color: 'rgba(255, 239, 191, 0.8)', fontSize: '0.875rem' }}>
                      {product.Category}
                    </td>
                    <td style={{ padding: '0.75rem', color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                      ${product.Msrp ? product.Msrp.toFixed(2) : '0.00'}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#8cda3f', fontSize: '0.875rem', fontWeight: 600 }}>
                      ${product.SalePrice ? product.SalePrice.toFixed(2) : '0.00'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {product.Badge && (
                        <span style={{
                          background: product.Badge === 'Sale' 
                            ? 'rgba(255, 107, 107, 0.2)'
                            : product.Badge === 'New Arrival'
                            ? 'rgba(59, 130, 246, 0.2)'
                            : 'rgba(140, 218, 63, 0.2)',
                          color: product.Badge === 'Sale' 
                            ? '#ff6b6b'
                            : product.Badge === 'New Arrival'
                            ? '#3b82f6'
                            : '#8cda3f',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {product.Badge}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(product)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#8cda3f',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.ID)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 239, 191, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </span>
                
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(30, 58, 95, 0.3)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '6px',
                    color: '#ffefbf',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 12px',
                    background: currentPage === 1 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(140, 218, 63, 0.1)',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    borderRadius: '6px',
                    color: currentPage === 1 
                      ? 'rgba(255, 239, 191, 0.3)' 
                      : '#8cda3f',
                    fontSize: '0.875rem',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  First
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px',
                    background: currentPage === 1 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(140, 218, 63, 0.1)',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  <ChevronLeft size={16} color={currentPage === 1 ? 'rgba(255, 239, 191, 0.3)' : '#8cda3f'} />
                </button>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          padding: '8px 12px',
                          background: currentPage === pageNum
                            ? 'linear-gradient(135deg, #8cda3f, #6eb52f)'
                            : 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(140, 218, 63, 0.3)',
                          borderRadius: '6px',
                          color: currentPage === pageNum ? 'white' : '#ffefbf',
                          fontSize: '0.875rem',
                          fontWeight: currentPage === pageNum ? 600 : 400,
                          cursor: 'pointer'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px',
                    background: currentPage === totalPages 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(140, 218, 63, 0.1)',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  <ChevronRight size={16} color={currentPage === totalPages ? 'rgba(255, 239, 191, 0.3)' : '#8cda3f'} />
                </button>
                
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 12px',
                    background: currentPage === totalPages 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(140, 218, 63, 0.1)',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    borderRadius: '6px',
                    color: currentPage === totalPages 
                      ? 'rgba(255, 239, 191, 0.3)' 
                      : '#8cda3f',
                    fontSize: '0.875rem',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  Last
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}