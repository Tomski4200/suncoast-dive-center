'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Package, Calendar, CreditCard, MapPin, 
  Truck, CheckCircle, Clock, User, Mail, Phone,
  ChevronRight, Download, Print, HelpCircle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

interface OrderItem {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderDetails {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  shipping: {
    method: string;
    cost: number;
    estimatedDelivery: string;
    trackingNumber?: string;
  };
  billing: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  payment: {
    method: string;
    last4?: string;
    brand?: string;
  };
  subtotal: number;
  tax: number;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);
  
  // Mock order data - in production, this would fetch from API
  useEffect(() => {
    const mockOrders: { [key: string]: OrderDetails } = {
      'ORD-001': {
        id: 'ORD-001',
        date: '2024-12-15',
        total: 299.95,
        status: 'Delivered',
        subtotal: 269.95,
        tax: 21.60,
        shipping: {
          method: 'Standard Shipping',
          cost: 8.40,
          estimatedDelivery: '2024-12-20',
          trackingNumber: '1Z999AA10123456784'
        },
        billing: {
          name: user?.name || 'John Diver',
          email: user?.email || 'john@example.com',
          phone: '(727) 555-0123',
          address: '123 Coastal Way',
          city: 'Crystal River',
          state: 'FL',
          zip: '34429'
        },
        payment: {
          method: 'Credit Card',
          last4: '4242',
          brand: 'Visa'
        },
        items: [
          {
            id: '1',
            name: 'Dive Rite XT Fins',
            variant: 'Large',
            quantity: 1,
            price: 168.95,
            image: '/api/placeholder/100/100'
          },
          {
            id: '2',
            name: 'Scuba Diving Mask',
            variant: 'Clear',
            quantity: 1,
            price: 89.00,
            image: '/api/placeholder/100/100'
          },
          {
            id: '3',
            name: 'Dive Log Book',
            quantity: 2,
            price: 21.00,
            image: '/api/placeholder/100/100'
          }
        ]
      },
      'ORD-002': {
        id: 'ORD-002',
        date: '2024-11-28',
        total: 168.95,
        status: 'Delivered',
        subtotal: 149.95,
        tax: 12.00,
        shipping: {
          method: 'Express Shipping',
          cost: 7.00,
          estimatedDelivery: '2024-12-01',
          trackingNumber: '1Z999AA10123456785'
        },
        billing: {
          name: user?.name || 'John Diver',
          email: user?.email || 'john@example.com',
          phone: '(727) 555-0123',
          address: '123 Coastal Way',
          city: 'Crystal River',
          state: 'FL',
          zip: '34429'
        },
        payment: {
          method: 'PayPal',
        },
        items: [
          {
            id: '1',
            name: 'Wetsuit 3mm',
            variant: 'Medium',
            quantity: 1,
            price: 149.95,
            image: '/api/placeholder/100/100'
          }
        ]
      },
      'ORD-003': {
        id: 'ORD-003',
        date: '2024-10-10',
        total: 549.00,
        status: 'Delivered',
        subtotal: 499.00,
        tax: 39.92,
        shipping: {
          method: 'Standard Shipping',
          cost: 10.08,
          estimatedDelivery: '2024-10-15'
        },
        billing: {
          name: user?.name || 'John Diver',
          email: user?.email || 'john@example.com',
          phone: '(727) 555-0123',
          address: '123 Coastal Way',
          city: 'Crystal River',
          state: 'FL',
          zip: '34429'
        },
        payment: {
          method: 'Credit Card',
          last4: '5555',
          brand: 'Mastercard'
        },
        items: [
          {
            id: '1',
            name: 'BCD Vest',
            variant: 'Large',
            quantity: 1,
            price: 399.00,
            image: '/api/placeholder/100/100'
          },
          {
            id: '2',
            name: 'Regulator Set',
            quantity: 1,
            price: 100.00,
            image: '/api/placeholder/100/100'
          }
        ]
      }
    };
    
    const orderId = params.id as string;
    if (mockOrders[orderId]) {
      setOrder(mockOrders[orderId]);
    }
  }, [params.id, user]);
  
  if (!user || !order) {
    return null;
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#8cda3f';
      case 'Shipped':
        return '#3b82f6';
      case 'Processing':
        return '#fbbf24';
      case 'Cancelled':
        return '#ff6b6b';
      default:
        return '#ffefbf';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle size={20} />;
      case 'Shipped':
        return <Truck size={20} />;
      case 'Processing':
        return <Clock size={20} />;
      default:
        return <Package size={20} />;
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />
      
      <div style={{
        maxWidth: '1200px',
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
            href="/dashboard"
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
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#ffefbf',
                marginBottom: '0.5rem'
              }}>
                Order #{order.id}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '1rem' }}>
                  Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: `${getStatusColor(order.status)}20`,
                  padding: '6px 12px',
                  borderRadius: '20px'
                }}>
                  {getStatusIcon(order.status)}
                  <span style={{ color: getStatusColor(order.status), fontWeight: 600, fontSize: '0.875rem' }}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  color: '#ffefbf',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Download size={18} />
                Invoice
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  color: '#ffefbf',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Print size={18} />
                Print
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(30, 58, 95, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}
          >
            <h2 style={{ color: '#ffefbf', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              Order Items
            </h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr auto',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    alignItems: 'center'
                  }}
                >
                  <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Package size={40} color="rgba(255, 239, 191, 0.3)" />
                  </div>
                  
                  <div>
                    <h3 style={{ color: '#ffefbf', fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {item.name}
                    </h3>
                    {item.variant && (
                      <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        Variant: {item.variant}
                      </p>
                    )}
                    <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#8cda3f', fontSize: '1.125rem', fontWeight: 600 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.75rem' }}>
                        ${item.price.toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Shipping Information */}
            {order.shipping.trackingNumber && (
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'rgba(140, 218, 63, 0.1)',
                border: '1px solid rgba(140, 218, 63, 0.3)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Truck size={20} color="#8cda3f" />
                  <h3 style={{ color: '#8cda3f', fontSize: '1rem', fontWeight: 600 }}>
                    Shipping Information
                  </h3>
                </div>
                
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                      Method:
                    </span>
                    <span style={{ color: '#ffefbf', fontSize: '0.875rem' }}>
                      {order.shipping.method}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                      Tracking Number:
                    </span>
                    <Link
                      href={`#`}
                      style={{
                        color: '#8cda3f',
                        fontSize: '0.875rem',
                        textDecoration: 'underline'
                      }}
                    >
                      {order.shipping.trackingNumber}
                    </Link>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                      Estimated Delivery:
                    </span>
                    <span style={{ color: '#ffefbf', fontSize: '0.875rem' }}>
                      {new Date(order.shipping.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Order Summary Sidebar */}
          <div style={{ display: 'grid', gap: '1.5rem', height: 'fit-content' }}>
            {/* Price Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'rgba(30, 58, 95, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem'
              }}
            >
              <h2 style={{ color: '#ffefbf', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                Order Summary
              </h2>
              
              <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                    Subtotal
                  </span>
                  <span style={{ color: '#ffefbf', fontSize: '0.875rem' }}>
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                    Shipping
                  </span>
                  <span style={{ color: '#ffefbf', fontSize: '0.875rem' }}>
                    ${order.shipping.cost.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                    Tax
                  </span>
                  <span style={{ color: '#ffefbf', fontSize: '0.875rem' }}>
                    ${order.tax.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 239, 191, 0.1)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: '#ffefbf', fontSize: '1rem', fontWeight: 600 }}>
                  Total
                </span>
                <span style={{ color: '#8cda3f', fontSize: '1.25rem', fontWeight: 700 }}>
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </motion.div>
            
            {/* Billing Information */}
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
              <h3 style={{ color: '#ffefbf', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                Billing Information
              </h3>
              
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} color="rgba(255, 239, 191, 0.5)" />
                  <span style={{ color: '#ffefbf', fontSize: '0.875rem' }}>
                    {order.billing.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} color="rgba(255, 239, 191, 0.5)" />
                  <span style={{ color: 'rgba(255, 239, 191, 0.8)', fontSize: '0.875rem' }}>
                    {order.billing.email}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} color="rgba(255, 239, 191, 0.5)" />
                  <span style={{ color: 'rgba(255, 239, 191, 0.8)', fontSize: '0.875rem' }}>
                    {order.billing.phone}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <MapPin size={16} color="rgba(255, 239, 191, 0.5)" style={{ marginTop: '2px' }} />
                  <div style={{ color: 'rgba(255, 239, 191, 0.8)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {order.billing.address}<br />
                    {order.billing.city}, {order.billing.state} {order.billing.zip}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'rgba(30, 58, 95, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem'
              }}
            >
              <h3 style={{ color: '#ffefbf', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                Payment Method
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="rgba(255, 239, 191, 0.5)" />
                <span style={{ color: '#ffefbf', fontSize: '0.875rem' }}>
                  {order.payment.method}
                  {order.payment.brand && order.payment.last4 && (
                    <> - {order.payment.brand} ending in {order.payment.last4}</>
                  )}
                </span>
              </div>
            </motion.div>
            
            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                background: 'rgba(140, 218, 63, 0.1)',
                border: '1px solid rgba(140, 218, 63, 0.3)',
                borderRadius: '12px',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <HelpCircle size={18} color="#8cda3f" />
                <span style={{ color: '#8cda3f', fontSize: '0.875rem', fontWeight: 600 }}>
                  Need Help?
                </span>
              </div>
              <p style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.75rem', lineHeight: 1.5 }}>
                Contact our support team at support@suncoastdive.com or call (727) 123-4567
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}