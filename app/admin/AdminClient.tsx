'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, FileText, Users, Settings,
  LogOut, TrendingUp, DollarSign, Eye, Plus,
  ChevronRight, ChevronLeft, Menu, Tag, Wrench
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { createClient } from '@/lib/supabase/client';
import { BlogPost } from '@/lib/blog';
import { Product } from '@/lib/types';

interface AdminClientProps {
  userEmail: string;
  userRole: string;
  blogs: BlogPost[];
  products: Product[];
}

export default function AdminClient({ userEmail, userRole, blogs, products }: AdminClientProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.Badge).length,
    totalBlogs: blogs.length,
    recentBlogs: blogs.slice(0, 3),
    totalRevenue: '$12,483.00',
    monthlyOrders: 47,
    conversionRate: '3.2%',
    avgOrderValue: '$265.74'
  };
  
  const recentOrders = [
    { id: 'ORD-2024-001', customer: 'John Smith', total: 299.95, status: 'Processing', date: '2024-12-18' },
    { id: 'ORD-2024-002', customer: 'Sarah Davis', total: 549.00, status: 'Shipped', date: '2024-12-17' },
    { id: 'ORD-2024-003', customer: 'Mike Johnson', total: 168.95, status: 'Delivered', date: '2024-12-15' }
  ];
  
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/admin' },
    { id: 'inventory', label: 'Inventory', icon: Package, href: '/admin/inventory' },
    { id: 'blogs', label: 'Blogs', icon: FileText, href: '/admin/blogs' },
    { id: 'promotions', label: 'Promotions', icon: Tag, href: '/admin/promotions' },
    { id: 'services', label: 'Services', icon: Wrench, href: '/admin/services' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />

      {/* Sidebar and Content Container */}
      <div style={{ display: 'flex' }}>
        {/* Fixed Sidebar */}
        <motion.div
        initial={{ width: sidebarCollapsed ? '80px' : '280px' }}
        animate={{ width: sidebarCollapsed ? '80px' : '280px' }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          left: 0,
          top: '80px',
          bottom: 0,
          background: 'rgba(10, 22, 40, 0.95)',
          borderRight: '1px solid rgba(255, 239, 191, 0.1)',
          zIndex: 100,
          overflow: 'hidden'
        }}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: sidebarCollapsed ? '50%' : '1rem',
            transform: sidebarCollapsed ? 'translateX(50%)' : 'none',
            background: 'rgba(140, 218, 63, 0.1)',
            border: '1px solid rgba(140, 218, 63, 0.3)',
            borderRadius: '6px',
            padding: '6px',
            cursor: 'pointer',
            color: '#8cda3f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Menu Items */}
        <nav style={{ marginTop: '4rem', padding: sidebarCollapsed ? '0.5rem' : '1.5rem' }}>
          {menuItems.map(item => (
            <div
              key={item.id}
              style={{ position: 'relative', marginBottom: '0.5rem' }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: sidebarCollapsed ? '0.75rem' : '0.75rem 1rem',
                  background: activeSection === item.id
                    ? 'rgba(140, 218, 63, 0.1)'
                    : hoveredItem === item.id && !sidebarCollapsed
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'transparent',
                  borderRadius: '8px',
                  color: activeSection === item.id ? '#8cda3f' : 'rgba(255, 239, 191, 0.8)',
                  fontSize: '0.875rem',
                  fontWeight: activeSection === item.id ? 600 : 400,
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  position: 'relative'
                }}
                onClick={(e) => {
                  if (item.id === 'overview') {
                    e.preventDefault();
                    setActiveSection('overview');
                  }
                }}
              >
                <item.icon size={20} />
                {!sidebarCollapsed && (
                  <>
                    <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                    {item.id !== 'overview' && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                  </>
                )}
              </Link>

              {/* Tooltip for collapsed state */}
              <AnimatePresence>
                {sidebarCollapsed && hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      left: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      marginLeft: '0.5rem',
                      background: 'rgba(30, 58, 95, 0.98)',
                      border: '1px solid rgba(140, 218, 63, 0.4)',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      color: '#ffefbf',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      zIndex: 1000,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      pointerEvents: 'none'
                    }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarCollapsed ? '80px' : '280px',
        flex: 1,
        padding: '100px 2rem 2rem',
        transition: 'margin-left 0.3s ease',
        maxWidth: '1600px',
        width: '100%'
      }}>
        {/* Admin Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.3), rgba(140, 218, 63, 0.1))',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid rgba(140, 218, 63, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#ffefbf',
                marginBottom: '0.5rem'
              }}>
                Admin Dashboard
              </h1>
              <p style={{ color: 'rgba(255, 239, 191, 0.7)' }}>
                Welcome back, {userEmail} • Role: {userRole}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link
                href="/"
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  color: '#ffefbf',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}
              >
                View Store
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #ff6b6b',
                  borderRadius: '8px',
                  color: '#ff6b6b',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Monthly Revenue
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  {stats.totalRevenue}
                </p>
                <p style={{ color: '#8cda3f', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  +12.5% from last month
                </p>
              </div>
              <DollarSign size={24} color="#8cda3f" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Total Products
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  {stats.totalProducts}
                </p>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {stats.activeProducts} with badges
                </p>
              </div>
              <Package size={24} color="#8cda3f" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Monthly Orders
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  {stats.monthlyOrders}
                </p>
                <p style={{ color: '#8cda3f', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {stats.avgOrderValue} avg
                </p>
              </div>
              <TrendingUp size={24} color="#8cda3f" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Blog Posts
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  {stats.totalBlogs}
                </p>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  3 this week
                </p>
              </div>
              <FileText size={24} color="#8cda3f" />
            </div>
          </motion.div>
        </div>


        {/* Content Area */}
        <div>
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}
            >
              <Link
                href="/admin/inventory"
                style={{
                  background: 'rgba(140, 218, 63, 0.2)',
                  border: '1px solid rgba(140, 218, 63, 0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  color: '#8cda3f',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'transform 0.3s ease'
                }}
              >
                <Plus size={20} />
                <span style={{ fontWeight: 600 }}>Add Product</span>
              </Link>

              <Link
                href="/admin/blogs"
                style={{
                  background: 'rgba(140, 218, 63, 0.2)',
                  border: '1px solid rgba(140, 218, 63, 0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  color: '#8cda3f',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'transform 0.3s ease'
                }}
              >
                <FileText size={20} />
                <span style={{ fontWeight: 600 }}>New Blog Post</span>
              </Link>

              <Link
                href="/diveshop"
                style={{
                  background: 'rgba(140, 218, 63, 0.2)',
                  border: '1px solid rgba(140, 218, 63, 0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  color: '#8cda3f',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'transform 0.3s ease'
                }}
              >
                <Eye size={20} />
                <span style={{ fontWeight: 600 }}>View Store</span>
              </Link>
            </motion.div>
            
            {/* Recent Orders */}
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
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem' 
              }}>
                <h2 style={{ color: '#ffefbf', fontSize: '1.25rem', fontWeight: 600 }}>
                  Recent Orders
                </h2>
                <Link
                  href="/admin/orders"
                  style={{
                    color: '#8cda3f',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  View All
                  <ChevronRight size={16} />
                </Link>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 239, 191, 0.1)' }}>
                      <th style={{ 
                        padding: '0.75rem', 
                        textAlign: 'left', 
                        color: 'rgba(255, 239, 191, 0.6)',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}>
                        Order ID
                      </th>
                      <th style={{ 
                        padding: '0.75rem', 
                        textAlign: 'left', 
                        color: 'rgba(255, 239, 191, 0.6)',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}>
                        Customer
                      </th>
                      <th style={{ 
                        padding: '0.75rem', 
                        textAlign: 'left', 
                        color: 'rgba(255, 239, 191, 0.6)',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}>
                        Total
                      </th>
                      <th style={{ 
                        padding: '0.75rem', 
                        textAlign: 'left', 
                        color: 'rgba(255, 239, 191, 0.6)',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}>
                        Status
                      </th>
                      <th style={{ 
                        padding: '0.75rem', 
                        textAlign: 'left', 
                        color: 'rgba(255, 239, 191, 0.6)',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr 
                        key={order.id}
                        style={{ borderBottom: '1px solid rgba(255, 239, 191, 0.05)' }}
                      >
                        <td style={{ padding: '0.75rem', color: '#ffefbf', fontSize: '0.875rem' }}>
                          {order.id}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'rgba(255, 239, 191, 0.8)', fontSize: '0.875rem' }}>
                          {order.customer}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#8cda3f', fontSize: '0.875rem', fontWeight: 600 }}>
                          ${order.total.toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            background: order.status === 'Delivered' 
                              ? 'rgba(140, 218, 63, 0.2)'
                              : order.status === 'Shipped'
                              ? 'rgba(59, 130, 246, 0.2)'
                              : 'rgba(251, 191, 36, 0.2)',
                            color: order.status === 'Delivered' 
                              ? '#8cda3f'
                              : order.status === 'Shipped'
                              ? '#3b82f6'
                              : '#fbbf24',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
            
            {/* Recent Blog Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'rgba(30, 58, 95, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem' 
              }}>
                <h2 style={{ color: '#ffefbf', fontSize: '1.25rem', fontWeight: 600 }}>
                  Recent Blog Posts
                </h2>
                <Link
                  href="/admin/blogs"
                  style={{
                    color: '#8cda3f',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  Manage All
                  <ChevronRight size={16} />
                </Link>
              </div>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {stats.recentBlogs.map(blog => (
                  <div
                    key={blog.slug}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{ color: '#ffefbf', fontWeight: 500, marginBottom: '0.25rem' }}>
                        {blog.title}
                      </p>
                      <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                        By {blog.author} • {new Date(blog.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/admin/blogs/edit/${blog.slug}`}
                      style={{
                        color: '#8cda3f',
                        fontSize: '0.875rem',
                        textDecoration: 'none'
                      }}
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}