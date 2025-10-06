'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Save, Tag, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { createClient } from '@/lib/supabase/client';

interface Promotion {
  id: number;
  location: string;
  heading: string;
  subheading: string | null;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
}

export default function PromotionsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchPromotion();
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

  async function fetchPromotion() {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('location', 'homepage_banner')
        .single();

      if (error) throw error;
      setPromotion(data);
    } catch (error) {
      console.error('Error fetching promotion:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!promotion) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const { error } = await supabase
        .from('promotions')
        .update({
          heading: promotion.heading,
          subheading: promotion.subheading,
          button_text: promotion.button_text,
          button_link: promotion.button_link,
          is_active: promotion.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('location', 'homepage_banner');

      if (error) throw error;

      setSaveMessage('Promotion saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving promotion:', error);
      setSaveMessage('Error saving promotion. Please try again.');
    } finally {
      setSaving(false);
    }
  }

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
          Loading...
        </div>
      </div>
    );
  }

  if (!promotion) {
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
          Promotion not found
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />

      <div style={{
        maxWidth: '900px',
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
              color: 'rgba(255, 239, 191, 0.7)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 239, 191, 0.7)'}
          >
            <ArrowLeft size={16} />
            Back to Admin
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Tag size={32} color="#8cda3f" />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#ffefbf',
              margin: 0
            }}>
              Manage Promotions
            </h1>
          </div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(140, 218, 63, 0.1)',
            border: '1px solid rgba(140, 218, 63, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            gap: '0.75rem'
          }}
        >
          <AlertCircle size={20} color="#8cda3f" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ color: '#ffefbf', fontSize: '0.875rem', margin: 0, marginBottom: '0.25rem', fontWeight: 600 }}>
              Homepage Banner Promotion
            </p>
            <p style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.8125rem', margin: 0 }}>
              This promotion appears at the very top of the homepage, above the navigation bar. Toggle it on/off and customize the message to promote special offers, sales, or announcements.
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(30, 58, 95, 0.3)',
            border: '1px solid rgba(255, 239, 191, 0.1)',
            borderRadius: '16px',
            padding: '2rem'
          }}
        >
          {/* Active Toggle */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              background: 'rgba(10, 22, 40, 0.5)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(10, 22, 40, 0.7)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(10, 22, 40, 0.5)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {promotion.is_active ? <Eye size={20} color="#8cda3f" /> : <EyeOff size={20} color="rgba(255, 239, 191, 0.4)" />}
                <div>
                  <div style={{ color: '#ffefbf', fontWeight: 600, fontSize: '0.9375rem' }}>
                    Promotion Status
                  </div>
                  <div style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.8125rem' }}>
                    {promotion.is_active ? 'Currently visible on homepage' : 'Currently hidden from homepage'}
                  </div>
                </div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setPromotion({ ...promotion, is_active: !promotion.is_active });
                }}
                style={{
                  width: '60px',
                  height: '32px',
                  background: promotion.is_active ? '#8cda3f' : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: promotion.is_active ? 'calc(100% - 28px)' : '4px',
                  width: '24px',
                  height: '24px',
                  background: 'white',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }} />
              </div>
            </label>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#ffefbf',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Heading *
            </label>
            <input
              type="text"
              value={promotion.heading}
              onChange={(e) => setPromotion({ ...promotion, heading: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(10, 22, 40, 0.5)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '8px',
                color: '#ffefbf',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#8cda3f'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.2)'}
              placeholder="e.g., 20% Off Your First Purchase"
            />
          </div>

          {/* Subheading */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#ffefbf',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Subheading
            </label>
            <input
              type="text"
              value={promotion.subheading || ''}
              onChange={(e) => setPromotion({ ...promotion, subheading: e.target.value || null })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(10, 22, 40, 0.5)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '8px',
                color: '#ffefbf',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#8cda3f'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.2)'}
              placeholder="e.g., Sign up for our newsletter and receive an exclusive discount"
            />
          </div>

          {/* Button Text */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#ffefbf',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Button Text
            </label>
            <input
              type="text"
              value={promotion.button_text || ''}
              onChange={(e) => setPromotion({ ...promotion, button_text: e.target.value || null })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(10, 22, 40, 0.5)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '8px',
                color: '#ffefbf',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#8cda3f'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.2)'}
              placeholder="e.g., Shop Now"
            />
          </div>

          {/* Button Link */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              color: '#ffefbf',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Button Link
            </label>
            <input
              type="text"
              value={promotion.button_link || ''}
              onChange={(e) => setPromotion({ ...promotion, button_link: e.target.value || null })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(10, 22, 40, 0.5)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '8px',
                color: '#ffefbf',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#8cda3f'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.2)'}
              placeholder="e.g., /diveshop"
            />
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 2rem',
                background: saving ? 'rgba(140, 218, 63, 0.5)' : '#8cda3f',
                color: '#0a1628',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(140, 218, 63, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(140, 218, 63, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(140, 218, 63, 0.3)';
              }}
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            {saveMessage && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  color: saveMessage.includes('Error') ? '#ff6b6b' : '#8cda3f',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {saveMessage}
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
