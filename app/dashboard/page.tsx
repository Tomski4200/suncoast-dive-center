'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  User, ShoppingBag, Calendar, LogOut, Settings, 
  Package, Heart, MapPin, CreditCard, Bell,
  ChevronRight, Award, TrendingUp
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);
  
  if (!user) {
    return null;
  }
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  // Mock data for user dashboard
  const orderHistory = [
    {
      id: 'ORD-001',
      date: '2024-12-15',
      total: 299.95,
      status: 'Delivered',
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2024-11-28',
      total: 168.95,
      status: 'Delivered',
      items: 1
    },
    {
      id: 'ORD-003',
      date: '2024-10-10',
      total: 549.00,
      status: 'Delivered',
      items: 5
    }
  ];
  
  const wishlistItems = [
    { name: 'Dive Rite XT Fins', price: 168.95, id: '63' },
    { name: 'Underwater Camera Housing', price: 899.00, id: '120' },
    { name: 'Premium BCD', price: 549.00, id: '85' }
  ];
  
  const diveStats = {
    totalDives: 127,
    thisYear: 42,
    favoriteSpot: 'Blue Spring',
    certification: 'Advanced Open Water'
  };
  
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />
      
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '120px 2rem 4rem'
      }}>
        {/* Welcome Header */}
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
                Welcome back, {user.name}!
              </h1>
              <p style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '1rem' }}>
                Member since {new Date(user.joinedDate || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
            </div>
            
            {user.role === 'admin' && (
              <Link
                href="/admin"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Go to Admin Panel
                <ChevronRight size={18} />
              </Link>
            )}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(140, 218, 63, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={24} color="#8cda3f" />
              </div>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Total Orders
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600 }}>
                  {orderHistory.length}
                </p>
              </div>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(140, 218, 63, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={24} color="#8cda3f" />
              </div>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Total Dives
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600 }}>
                  {diveStats.totalDives}
                </p>
              </div>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(140, 218, 63, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={24} color="#8cda3f" />
              </div>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Certification
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1rem', fontWeight: 600 }}>
                  {diveStats.certification}
                </p>
              </div>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(140, 218, 63, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart size={24} color="#8cda3f" />
              </div>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Wishlist Items
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600 }}>
                  {wishlistItems.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Main Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(30, 58, 95, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              height: 'fit-content'
            }}
          >
            <nav>
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'orders', label: 'Order History', icon: Package },
                { id: 'wishlist', label: 'Wishlist', icon: Heart },
                { id: 'addresses', label: 'Addresses', icon: MapPin },
                { id: 'payment', label: 'Payment Methods', icon: CreditCard },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: activeTab === item.id 
                      ? 'rgba(140, 218, 63, 0.1)' 
                      : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: activeTab === item.id ? '#8cda3f' : 'rgba(255, 239, 191, 0.8)',
                    fontSize: '0.875rem',
                    fontWeight: activeTab === item.id ? 600 : 400,
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    transition: 'all 0.3s ease',
                    textAlign: 'left'
                  }}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
              
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ff6b6b',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  cursor: 'pointer',
                  marginTop: '1rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(255, 239, 191, 0.1)',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </motion.div>
          
          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(30, 58, 95, 0.2)',
              borderRadius: '12px',
              padding: '2rem'
            }}
          >
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                  Account Overview
                </h2>
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '1.5rem'
                  }}>
                    <h3 style={{ color: '#8cda3f', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                      Profile Information
                    </h3>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255, 239, 191, 0.6)' }}>Name:</span>
                        <span style={{ color: '#ffefbf' }}>{user.name}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255, 239, 191, 0.6)' }}>Email:</span>
                        <span style={{ color: '#ffefbf' }}>{user.email}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255, 239, 191, 0.6)' }}>Member Since:</span>
                        <span style={{ color: '#ffefbf' }}>
                          {new Date(user.joinedDate || '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '1.5rem'
                  }}>
                    <h3 style={{ color: '#8cda3f', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                      Diving Statistics
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div>
                        <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          Total Dives
                        </p>
                        <p style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600 }}>
                          {diveStats.totalDives}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          This Year
                        </p>
                        <p style={{ color: '#ffefbf', fontSize: '1.5rem', fontWeight: 600 }}>
                          {diveStats.thisYear}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          Favorite Spot
                        </p>
                        <p style={{ color: '#ffefbf', fontSize: '1rem', fontWeight: 500 }}>
                          {diveStats.favoriteSpot}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          Certification
                        </p>
                        <p style={{ color: '#ffefbf', fontSize: '1rem', fontWeight: 500 }}>
                          {diveStats.certification}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                  Order History
                </h2>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {orderHistory.map(order => (
                    <Link
                      key={order.id}
                      href={`/dashboard/orders/${order.id}`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        border: '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.border = '1px solid rgba(140, 218, 63, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.border = '1px solid transparent';
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <p style={{ color: '#ffefbf', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Order #{order.id}
                          </p>
                          <ChevronRight size={16} color="#8cda3f" />
                        </div>
                        <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                          {new Date(order.date).toLocaleDateString()} • {order.items} items
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: '#8cda3f', fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                          ${order.total.toFixed(2)}
                        </p>
                        <span style={{
                          background: 'rgba(140, 218, 63, 0.2)',
                          color: '#8cda3f',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'wishlist' && (
              <div>
                <h2 style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                  My Wishlist
                </h2>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {wishlistItems.map(item => (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <p style={{ color: '#ffefbf', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {item.name}
                        </p>
                        <p style={{ color: '#8cda3f', fontSize: '1.125rem', fontWeight: 600 }}>
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <Link
                        href={`/diveshop/${item.id}`}
                        style={{
                          padding: '8px 20px',
                          background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                          borderRadius: '6px',
                          color: 'white',
                          textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}
                      >
                        View Product
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Placeholder for other tabs */}
            {['addresses', 'payment', 'notifications', 'settings'].includes(activeTab) && (
              <div>
                <h2 style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <p style={{ color: 'rgba(255, 239, 191, 0.7)' }}>
                  This section is coming soon. Check back later for updates!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}