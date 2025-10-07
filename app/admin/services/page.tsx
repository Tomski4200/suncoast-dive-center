'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Save, Plus, Edit2, Trash2, X, GripVertical,
  Eye, EyeOff, AlertCircle, CheckCircle2, Wrench, Tag, List
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { createClient } from '@/lib/supabase/client';
import {
  getAllCategories,
  getAllSubcategories,
  getAllServices,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  createService,
  updateService,
  deleteService,
  generateSlug,
  ServiceCategory,
  ServiceSubcategory,
  Service
} from '@/lib/services';

type Tab = 'categories' | 'services' | 'subcategories';

export default function ServicesManagementPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<Tab>('services');
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ServiceSubcategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<ServiceSubcategory | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: Tab; id: number; name: string } | null>(null);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'manager')) {
      router.push('/');
    }
  }

  async function fetchData() {
    try {
      const [categoriesData, subcategoriesData, servicesData] = await Promise.all([
        getAllCategories(),
        getAllSubcategories(),
        getAllServices()
      ]);

      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 3000);
  }

  async function handleSaveCategory(data: Partial<ServiceCategory>) {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        showMessage('success', 'Category updated successfully');
      } else {
        await createCategory(data);
        showMessage('success', 'Category created successfully');
      }
      await fetchData();
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      showMessage('error', 'Failed to save category');
    }
  }

  async function handleSaveSubcategory(data: Partial<ServiceSubcategory>) {
    try {
      if (editingSubcategory) {
        await updateSubcategory(editingSubcategory.id, data);
        showMessage('success', 'Subcategory updated successfully');
      } else {
        await createSubcategory(data);
        showMessage('success', 'Subcategory created successfully');
      }
      await fetchData();
      setShowSubcategoryModal(false);
      setEditingSubcategory(null);
    } catch (error) {
      console.error('Error saving subcategory:', error);
      showMessage('error', 'Failed to save subcategory');
    }
  }

  async function handleSaveService(data: Partial<Service>) {
    try {
      if (editingService) {
        await updateService(editingService.id, data);
        showMessage('success', 'Service updated successfully');
      } else {
        await createService(data);
        showMessage('success', 'Service created successfully');
      }
      await fetchData();
      setShowServiceModal(false);
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      showMessage('error', 'Failed to save service');
    }
  }

  async function handleDelete() {
    if (!deletingItem) return;

    try {
      if (deletingItem.type === 'categories') {
        await deleteCategory(deletingItem.id);
      } else if (deletingItem.type === 'subcategories') {
        await deleteSubcategory(deletingItem.id);
      } else if (deletingItem.type === 'services') {
        await deleteService(deletingItem.id);
      }

      showMessage('success', `${deletingItem.type.slice(0, -1)} deleted successfully`);
      await fetchData();
      setShowDeleteModal(false);
      setDeletingItem(null);
    } catch (error) {
      console.error('Error deleting:', error);
      showMessage('error', 'Failed to delete item');
    }
  }

  const filteredServices = services.filter(service => {
    const matchesCategory = !selectedCategoryFilter || service.category_id === selectedCategoryFilter;
    const matchesSearch = !searchTerm ||
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredSubcategories = subcategories.filter(sub => {
    return !selectedCategoryFilter || sub.category_id === selectedCategoryFilter;
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628' }}>
        <Navigation />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 80px)',
          color: '#ffefbf'
        }}>
          Loading services data...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        paddingTop: '6rem'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#8cda3f',
              textDecoration: 'none',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#ffefbf',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Wrench size={32} color="#8cda3f" />
                Services Management
              </h1>
              <p style={{ color: 'rgba(255, 239, 191, 0.7)' }}>
                Manage service categories, subcategories, and individual services
              </p>
            </div>
          </div>
        </div>

        {/* Save Message */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                background: saveMessage.type === 'success'
                  ? 'rgba(140, 218, 63, 0.2)'
                  : 'rgba(255, 107, 107, 0.2)',
                border: `1px solid ${saveMessage.type === 'success' ? '#8cda3f' : '#ff6b6b'}`,
                color: saveMessage.type === 'success' ? '#8cda3f' : '#ff6b6b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {saveMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              {saveMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255, 239, 191, 0.1)',
          paddingBottom: '0'
        }}>
          {[
            { id: 'services' as Tab, label: 'Services', icon: List },
            { id: 'categories' as Tab, label: 'Categories', icon: Tag },
            { id: 'subcategories' as Tab, label: 'Subcategories', icon: Wrench }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === tab.id ? 'rgba(140, 218, 63, 0.1)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #8cda3f' : '2px solid transparent',
                color: activeTab === tab.id ? '#8cda3f' : 'rgba(255, 239, 191, 0.6)',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'categories' && (
          <CategoriesTab
            categories={categories}
            subcategories={subcategories}
            services={services}
            onEdit={(cat) => {
              setEditingCategory(cat);
              setShowCategoryModal(true);
            }}
            onDelete={(cat) => {
              setDeletingItem({ type: 'categories', id: cat.id, name: cat.name });
              setShowDeleteModal(true);
            }}
            onAdd={() => {
              setEditingCategory(null);
              setShowCategoryModal(true);
            }}
          />
        )}

        {activeTab === 'subcategories' && (
          <SubcategoriesTab
            subcategories={filteredSubcategories}
            categories={categories}
            selectedCategoryFilter={selectedCategoryFilter}
            setSelectedCategoryFilter={setSelectedCategoryFilter}
            onEdit={(sub) => {
              setEditingSubcategory(sub);
              setShowSubcategoryModal(true);
            }}
            onDelete={(sub) => {
              setDeletingItem({ type: 'subcategories', id: sub.id, name: sub.name });
              setShowDeleteModal(true);
            }}
            onAdd={() => {
              setEditingSubcategory(null);
              setShowSubcategoryModal(true);
            }}
          />
        )}

        {activeTab === 'services' && (
          <ServicesTab
            services={filteredServices}
            categories={categories}
            subcategories={subcategories}
            selectedCategoryFilter={selectedCategoryFilter}
            setSelectedCategoryFilter={setSelectedCategoryFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onEdit={(service) => {
              setEditingService(service);
              setShowServiceModal(true);
            }}
            onDelete={(service) => {
              setDeletingItem({ type: 'services', id: service.id, name: service.name });
              setShowDeleteModal(true);
            }}
            onAdd={() => {
              setEditingService(null);
              setShowServiceModal(true);
            }}
          />
        )}

        {/* Modals */}
        {showCategoryModal && (
          <CategoryModal
            category={editingCategory}
            onSave={handleSaveCategory}
            onClose={() => {
              setShowCategoryModal(false);
              setEditingCategory(null);
            }}
          />
        )}

        {showSubcategoryModal && (
          <SubcategoryModal
            subcategory={editingSubcategory}
            categories={categories}
            onSave={handleSaveSubcategory}
            onClose={() => {
              setShowSubcategoryModal(false);
              setEditingSubcategory(null);
            }}
          />
        )}

        {showServiceModal && (
          <ServiceModal
            service={editingService}
            categories={categories}
            subcategories={subcategories}
            onSave={handleSaveService}
            onClose={() => {
              setShowServiceModal(false);
              setEditingService(null);
            }}
          />
        )}

        {showDeleteModal && deletingItem && (
          <DeleteModal
            itemName={deletingItem.name}
            onConfirm={handleDelete}
            onCancel={() => {
              setShowDeleteModal(false);
              setDeletingItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// ===== TAB COMPONENTS =====

function CategoriesTab({ categories, subcategories, services, onEdit, onDelete, onAdd }: {
  categories: ServiceCategory[];
  subcategories: ServiceSubcategory[];
  services: Service[];
  onEdit: (cat: ServiceCategory) => void;
  onDelete: (cat: ServiceCategory) => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600 }}>Service Categories</h2>
        <button
          onClick={onAdd}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)',
            color: '#0a1628',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {categories.map(category => {
          const subcategoryCount = subcategories.filter(sub => sub.category_id === category.id).length;
          const serviceCount = services.filter(service => service.category_id === category.id).length;

          return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 239, 191, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ color: '#ffefbf', fontSize: '1.25rem', fontWeight: 600 }}>{category.name}</h3>
                {!category.is_active && (
                  <span style={{
                    padding: '4px 12px',
                    background: 'rgba(255, 107, 107, 0.2)',
                    color: '#ff6b6b',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    Inactive
                  </span>
                )}
              </div>
              {category.description && (
                <p style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  {category.description}
                </p>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
                <div>
                  <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.75rem' }}>Subcategories</p>
                  <p style={{ color: '#8cda3f', fontSize: '0.875rem', fontWeight: 600 }}>{subcategoryCount}</p>
                </div>
                <div>
                  <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.75rem' }}>Services</p>
                  <p style={{ color: '#8cda3f', fontSize: '0.875rem', fontWeight: 600 }}>{serviceCount}</p>
                </div>
                <div>
                  <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.75rem' }}>Slug</p>
                  <p style={{ color: '#ffefbf', fontSize: '0.875rem' }}>{category.slug}</p>
                </div>
                <div>
                  <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.75rem' }}>Icon</p>
                  <p style={{ color: '#8cda3f', fontSize: '0.875rem' }}>{category.icon || 'None'}</p>
                </div>
                <div>
                  <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.75rem' }}>Display Order</p>
                  <p style={{ color: '#ffefbf', fontSize: '0.875rem' }}>{category.display_order}</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onEdit(category)}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(140, 218, 63, 0.2)',
                  border: '1px solid #8cda3f',
                  borderRadius: '6px',
                  color: '#8cda3f',
                  cursor: 'pointer'
                }}
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(category)}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(255, 107, 107, 0.2)',
                  border: '1px solid #ff6b6b',
                  borderRadius: '6px',
                  color: '#ff6b6b',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SubcategoriesTab({ subcategories, categories, selectedCategoryFilter, setSelectedCategoryFilter, onEdit, onDelete, onAdd }: {
  subcategories: ServiceSubcategory[];
  categories: ServiceCategory[];
  selectedCategoryFilter: number | null;
  setSelectedCategoryFilter: (id: number | null) => void;
  onEdit: (sub: ServiceSubcategory) => void;
  onDelete: (sub: ServiceSubcategory) => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600 }}>Subcategories</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={selectedCategoryFilter || ''}
            onChange={(e) => setSelectedCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(30, 58, 95, 0.5)',
              border: '1px solid rgba(255, 239, 191, 0.2)',
              borderRadius: '6px',
              color: '#ffefbf',
              cursor: 'pointer'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            onClick={onAdd}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)',
              color: '#0a1628',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus size={18} />
            Add Subcategory
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {subcategories.map(sub => {
          const category = categories.find(c => c.id === sub.category_id);
          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: 'rgba(30, 58, 95, 0.3)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 239, 191, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ color: '#ffefbf', fontSize: '1.125rem', fontWeight: 600 }}>{sub.name}</h3>
                  <span style={{
                    padding: '4px 12px',
                    background: 'rgba(140, 218, 63, 0.2)',
                    color: '#8cda3f',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {category?.name}
                  </span>
                  {!sub.is_active && (
                    <span style={{
                      padding: '4px 12px',
                      background: 'rgba(255, 107, 107, 0.2)',
                      color: '#ff6b6b',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      Inactive
                    </span>
                  )}
                </div>
                {sub.description && (
                  <p style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {sub.description}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => onEdit(sub)}
                  style={{
                    padding: '0.5rem',
                    background: 'rgba(140, 218, 63, 0.2)',
                    border: '1px solid #8cda3f',
                    borderRadius: '6px',
                    color: '#8cda3f',
                    cursor: 'pointer'
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(sub)}
                  style={{
                    padding: '0.5rem',
                    background: 'rgba(255, 107, 107, 0.2)',
                    border: '1px solid #ff6b6b',
                    borderRadius: '6px',
                    color: '#ff6b6b',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ServicesTab({ services, categories, subcategories, selectedCategoryFilter, setSelectedCategoryFilter, searchTerm, setSearchTerm, onEdit, onDelete, onAdd }: {
  services: Service[];
  categories: ServiceCategory[];
  subcategories: ServiceSubcategory[];
  selectedCategoryFilter: number | null;
  setSelectedCategoryFilter: (id: number | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600 }}>Services</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(30, 58, 95, 0.5)',
              border: '1px solid rgba(255, 239, 191, 0.2)',
              borderRadius: '6px',
              color: '#ffefbf',
              minWidth: '200px'
            }}
          />
          <select
            value={selectedCategoryFilter || ''}
            onChange={(e) => setSelectedCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(30, 58, 95, 0.5)',
              border: '1px solid rgba(255, 239, 191, 0.2)',
              borderRadius: '6px',
              color: '#ffefbf',
              cursor: 'pointer'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            onClick={onAdd}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)',
              color: '#0a1628',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
        {services.map(service => {
          const category = categories.find(c => c.id === service.category_id);
          const subcategory = subcategories.find(s => s.id === service.subcategory_id);

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(30, 58, 95, 0.3)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 239, 191, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ color: '#ffefbf', fontSize: '1.125rem', fontWeight: 600, flex: 1 }}>{service.name}</h3>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => onEdit(service)}
                      style={{
                        padding: '0.25rem',
                        background: 'rgba(140, 218, 63, 0.2)',
                        border: '1px solid #8cda3f',
                        borderRadius: '4px',
                        color: '#8cda3f',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(service)}
                      style={{
                        padding: '0.25rem',
                        background: 'rgba(255, 107, 107, 0.2)',
                        border: '1px solid #ff6b6b',
                        borderRadius: '4px',
                        color: '#ff6b6b',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: 'rgba(140, 218, 63, 0.2)',
                    color: '#8cda3f',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>
                    {category?.name}
                  </span>
                  {subcategory && (
                    <span style={{
                      padding: '4px 8px',
                      background: 'rgba(255, 239, 191, 0.2)',
                      color: '#ffefbf',
                      borderRadius: '12px',
                      fontSize: '0.7rem'
                    }}>
                      {subcategory.name}
                    </span>
                  )}
                  {!service.is_active && (
                    <span style={{
                      padding: '4px 8px',
                      background: 'rgba(255, 107, 107, 0.2)',
                      color: '#ff6b6b',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}>
                      Inactive
                    </span>
                  )}
                </div>

                {service.description && (
                  <p style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {service.description}
                  </p>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 239, 191, 0.1)' }}>
                {(service.price !== null || service.price_text) && (
                  <div>
                    <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.7rem' }}>Price</p>
                    <p style={{ color: '#8cda3f', fontSize: '1rem', fontWeight: 600 }}>
                      {service.price_text || `$${service.price}`}
                    </p>
                  </div>
                )}
                {service.duration && (
                  <div>
                    <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.7rem' }}>Duration</p>
                    <p style={{ color: '#ffefbf', fontSize: '0.875rem' }}>{service.duration}</p>
                  </div>
                )}
                {service.depth && (
                  <div>
                    <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.7rem' }}>Depth</p>
                    <p style={{ color: '#ffefbf', fontSize: '0.875rem' }}>{service.depth}</p>
                  </div>
                )}
                {service.service_type && (
                  <div>
                    <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.7rem' }}>Type</p>
                    <p style={{ color: '#ffefbf', fontSize: '0.875rem' }}>{service.service_type}</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ===== MODAL COMPONENTS =====

function CategoryModal({ category, onSave, onClose }: {
  category: ServiceCategory | null;
  onSave: (data: Partial<ServiceCategory>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    icon: category?.icon || '',
    description: category?.description || '',
    display_order: category?.display_order || 0,
    is_active: category?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{
        background: '#1e3a5f',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600 }}>
            {category ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffefbf', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) });
                }}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Status
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: formData.is_active ? 'rgba(140, 218, 63, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                  border: `2px solid ${formData.is_active ? '#8cda3f' : '#ff6b6b'}`,
                  borderRadius: '50px',
                  color: formData.is_active ? '#8cda3f' : '#ff6b6b',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '1.5rem'
                }}
              >
                {formData.is_active ? 'Active' : 'Hide'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Icon (Lucide icon name)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., Wrench, GraduationCap, Anchor"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(10, 22, 40, 0.5)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '6px',
                color: '#ffefbf',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)',
                color: '#0a1628',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Save Category
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 239, 191, 0.1)',
                color: '#ffefbf',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}

function SubcategoryModal({ subcategory, categories, onSave, onClose }: {
  subcategory: ServiceSubcategory | null;
  categories: ServiceCategory[];
  onSave: (data: Partial<ServiceSubcategory>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    category_id: subcategory?.category_id || (categories[0]?.id || 0),
    name: subcategory?.name || '',
    slug: subcategory?.slug || '',
    description: subcategory?.description || '',
    display_order: subcategory?.display_order || 0,
    is_active: subcategory?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{
        background: '#1e3a5f',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600 }}>
            {subcategory ? 'Edit Subcategory' : 'New Subcategory'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffefbf', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              Category *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(10, 22, 40, 0.5)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '6px',
                color: '#ffefbf',
                cursor: 'pointer'
              }}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) });
                }}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Status
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: formData.is_active ? 'rgba(140, 218, 63, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                  border: `2px solid ${formData.is_active ? '#8cda3f' : '#ff6b6b'}`,
                  borderRadius: '50px',
                  color: formData.is_active ? '#8cda3f' : '#ff6b6b',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '1.5rem'
                }}
              >
                {formData.is_active ? 'Active' : 'Hide'}
              </button>
            </div>
          </div>

          <div>
            <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(10, 22, 40, 0.5)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '6px',
                color: '#ffefbf',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)',
                color: '#0a1628',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Save Subcategory
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 239, 191, 0.1)',
                color: '#ffefbf',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}

function ServiceModal({ service, categories, subcategories, onSave, onClose }: {
  service: Service | null;
  categories: ServiceCategory[];
  subcategories: ServiceSubcategory[];
  onSave: (data: Partial<Service>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    category_id: service?.category_id || (categories[0]?.id || 0),
    subcategory_id: service?.subcategory_id || null,
    name: service?.name || '',
    slug: service?.slug || '',
    description: service?.description || '',
    price: service?.price || null,
    price_text: service?.price_text || '',
    duration: service?.duration || '',
    depth: service?.depth || '',
    includes: service?.includes || [],
    service_type: service?.service_type || '',
    display_order: service?.display_order || 0,
    is_active: service?.is_active ?? true,
    is_featured: service?.is_featured ?? false
  });

  const [usePriceText, setUsePriceText] = useState(!!service?.price_text);
  const [includesInput, setIncludesInput] = useState('');

  const availableSubcategories = useMemo(() => {
    return subcategories.filter(sub => sub.category_id === formData.category_id);
  }, [subcategories, formData.category_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: usePriceText ? null : formData.price,
      price_text: usePriceText ? formData.price_text : null
    });
  };

  const addIncludeItem = () => {
    if (includesInput.trim()) {
      setFormData({
        ...formData,
        includes: [...(formData.includes || []), includesInput.trim()]
      });
      setIncludesInput('');
    }
  };

  const removeIncludeItem = (index: number) => {
    setFormData({
      ...formData,
      includes: formData.includes?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{
        background: '#1e3a5f',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600 }}>
            {service ? 'Edit Service' : 'New Service'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffefbf', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Category *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value), subcategory_id: null })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf',
                  cursor: 'pointer'
                }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Subcategory
              </label>
              <select
                value={formData.subcategory_id || ''}
                onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value ? parseInt(e.target.value) : null })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf',
                  cursor: 'pointer'
                }}
              >
                <option value="">None</option>
                {availableSubcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) });
              }}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(10, 22, 40, 0.5)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '6px',
                color: '#ffefbf'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(10, 22, 40, 0.5)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '6px',
                color: '#ffefbf',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={usePriceText}
                onChange={(e) => setUsePriceText(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Use price text instead of number
            </label>

            {usePriceText ? (
              <input
                type="text"
                value={formData.price_text}
                onChange={(e) => setFormData({ ...formData, price_text: e.target.value })}
                placeholder="e.g., $85-120 or Quote"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            ) : (
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 2-3 Days"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Depth
              </label>
              <input
                type="text"
                value={formData.depth}
                onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                placeholder="e.g., 40-60 ft"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Service Type
              </label>
              <input
                type="text"
                value={formData.service_type}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                placeholder="For grouping"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              Includes (bullet points)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={includesInput}
                onChange={(e) => setIncludesInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncludeItem())}
                placeholder="Add item and press Enter"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
              <button
                type="button"
                onClick={addIncludeItem}
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(140, 218, 63, 0.2)',
                  border: '1px solid #8cda3f',
                  borderRadius: '6px',
                  color: '#8cda3f',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
              </button>
            </div>
            {formData.includes && formData.includes.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {formData.includes.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(10, 22, 40, 0.5)',
                    borderRadius: '6px'
                  }}>
                    <span style={{ flex: 1, color: '#ffefbf', fontSize: '0.875rem' }}>• {item}</span>
                    <button
                      type="button"
                      onClick={() => removeIncludeItem(index)}
                      style={{
                        padding: '0.25rem',
                        background: 'rgba(255, 107, 107, 0.2)',
                        border: '1px solid #ff6b6b',
                        borderRadius: '4px',
                        color: '#ff6b6b',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '6px',
                  color: '#ffefbf'
                }}
              />
            </div>

            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Status
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ color: '#ffefbf', fontSize: '0.875rem' }}>Active</span>
              </label>
            </div>

            <div>
              <label style={{ color: '#ffefbf', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Featured
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ color: '#ffefbf', fontSize: '0.875rem' }}>Featured</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)',
                color: '#0a1628',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Save Service
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 239, 191, 0.1)',
                color: '#ffefbf',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}

function DeleteModal({ itemName, onConfirm, onCancel }: {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <ModalOverlay onClose={onCancel}>
      <div style={{
        background: '#1e3a5f',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <AlertCircle size={48} color="#ff6b6b" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Delete Confirmation
          </h2>
          <p style={{ color: 'rgba(255, 239, 191, 0.7)' }}>
            Are you sure you want to delete <strong>{itemName}</strong>?
            <br />This action cannot be undone.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'rgba(255, 239, 191, 0.1)',
              color: '#ffefbf',
              border: '1px solid rgba(255, 239, 191, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

function ModalOverlay({ children, onClose }: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
    >
      {children}
    </motion.div>
  );
}
