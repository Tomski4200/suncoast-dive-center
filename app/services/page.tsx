'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Anchor, Gauge, Wrench, Star, CheckCircle, Calendar, Users, Wind, Sparkles, Package, Search, Zap, Settings } from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { supabase } from '@/lib/supabase';

// Icon mapping
const iconMap: Record<string, any> = {
  GraduationCap,
  Anchor,
  Gauge,
  Wrench,
  Wind,
  Sparkles,
  Package,
  Search,
  Zap,
  Settings
};

type ServiceCategory = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
};

type Service = {
  id: number;
  category_id: number;
  subcategory_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  price_text: string | null;
  duration: string | null;
  depth: string | null;
  includes: string[] | null;
  service_type: string | null;
  category_name: string;
  category_slug: string;
  subcategory_name: string | null;
  subcategory_slug: string | null;
};

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('certification');
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicesData();
  }, []);

  async function fetchServicesData() {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      // Fetch services with category info
      const { data: servicesData, error: servicesError } = await supabase
        .from('services_with_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (categoriesError) console.error('Error fetching categories:', categoriesError);
      if (servicesError) console.error('Error fetching services:', servicesError);

      if (categoriesData) setCategories(categoriesData);
      if (servicesData) setServices(servicesData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const activeServices = services.filter(s => s.category_slug === activeTab);

  // Group services by subcategory or service_type
  const groupedServices = activeServices.reduce((acc, service) => {
    const key = service.subcategory_slug || service.service_type || 'other';
    if (!acc[key]) {
      acc[key] = {
        name: service.subcategory_name || service.service_type || 'Other',
        description: '',
        services: []
      };
    }
    acc[key].services.push(service);
    return acc;
  }, {} as Record<string, { name: string; description: string; services: Service[] }>);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#ffefbf', fontSize: '1.5rem' }}>Loading services...</div>
      </div>
    );
  }

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#0a1628' }}>
        <Navigation />

        {/* Hero Section */}
        <section style={{
          position: 'relative',
          paddingTop: '120px',
          paddingBottom: '80px',
          background: 'linear-gradient(180deg, #0a1628 0%, #1e3a5f 100%)',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238cda3f' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div className="max-w-7xl mx-auto px-4" style={{ position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                fontFamily: 'Anton, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                background: 'linear-gradient(to right, #ffefbf 0%, #92856a 50%, #ffefbf 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem',
                filter: 'drop-shadow(0 0 30px rgba(255, 239, 191, 0.3))'
              }}>
                Our Services
              </h1>
              <p style={{
                color: 'rgba(255, 239, 191, 0.7)',
                fontSize: '1.25rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                From beginner courses to technical diving, we've got everything you need for your underwater adventure
              </p>
            </motion.div>
          </div>
        </section>

        {/* Service Tabs */}
        <section className="py-4 px-4" style={{ background: 'rgba(30, 58, 95, 0.2)' }}>
          <div className="max-w-7xl mx-auto">
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {categories.map((category) => {
                const IconComponent = iconMap[category.icon] || GraduationCap;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.slug)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: activeTab === category.slug
                        ? 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)'
                        : 'transparent',
                      color: activeTab === category.slug ? '#0a1628' : '#ffefbf',
                      border: `2px solid ${activeTab === category.slug ? '#8cda3f' : 'rgba(255, 239, 191, 0.3)'}`,
                      borderRadius: '50px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <IconComponent size={20} />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Service Content */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Certification Services */}
              {activeTab === 'certification' && (
                <>
                  <div className="text-center mb-8">
                    <h2 style={{
                      fontSize: '2.5rem',
                      fontWeight: 600,
                      color: '#ffefbf',
                      marginBottom: '0.5rem'
                    }}>
                      Certification Courses
                    </h2>
                    <p style={{
                      color: 'rgba(255, 239, 191, 0.7)',
                      fontSize: '1.125rem'
                    }}>
                      Start your diving journey or advance your skills with our comprehensive training programs
                    </p>
                  </div>

                  {Object.entries(groupedServices).map(([key, group]) => (
                    <div key={key}>
                      <h3 style={{
                        fontSize: '1.75rem',
                        color: '#8cda3f',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                      }}>
                        {group.name}
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.services.map((service, index) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            style={{
                              background: key === 'beginner' ? 'rgba(255, 239, 191, 0.05)' : 'rgba(140, 218, 63, 0.05)',
                              borderRadius: '16px',
                              padding: '1.5rem',
                              border: `1px solid ${key === 'beginner' ? 'rgba(255, 239, 191, 0.1)' : 'rgba(140, 218, 63, 0.2)'}`,
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-5px)';
                              e.currentTarget.style.borderColor = '#8cda3f';
                              e.currentTarget.style.background = 'rgba(140, 218, 63, 0.08)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.borderColor = key === 'beginner' ? 'rgba(255, 239, 191, 0.1)' : 'rgba(140, 218, 63, 0.2)';
                              e.currentTarget.style.background = key === 'beginner' ? 'rgba(255, 239, 191, 0.05)' : 'rgba(140, 218, 63, 0.05)';
                            }}
                          >
                            <h4 style={{
                              fontSize: '1.25rem',
                              color: '#ffefbf',
                              marginBottom: '0.5rem'
                            }}>
                              {service.name}
                            </h4>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '1rem'
                            }}>
                              <span style={{
                                color: '#8cda3f',
                                fontSize: '1.5rem',
                                fontWeight: 600
                              }}>
                                {service.price_text || `$${service.price}`}
                              </span>
                              {service.duration && (
                                <span style={{
                                  color: 'rgba(255, 239, 191, 0.6)',
                                  fontSize: '0.875rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <Calendar size={16} />
                                  {service.duration}
                                </span>
                              )}
                            </div>
                            <p style={{
                              color: 'rgba(255, 239, 191, 0.7)',
                              fontSize: '0.875rem',
                              marginBottom: '1rem',
                              lineHeight: 1.6
                            }}>
                              {service.description}
                            </p>
                            {service.includes && service.includes.length > 0 && (
                              <div style={{
                                borderTop: '1px solid rgba(255, 239, 191, 0.1)',
                                paddingTop: '1rem'
                              }}>
                                <p style={{
                                  color: '#8cda3f',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  marginBottom: '0.5rem'
                                }}>
                                  Includes:
                                </p>
                                <ul style={{
                                  color: 'rgba(255, 239, 191, 0.6)',
                                  fontSize: '0.75rem',
                                  paddingLeft: '1rem'
                                }}>
                                  {service.includes.map((item, i) => (
                                    <li key={i} style={{ marginBottom: '0.25rem' }}>
                                      <CheckCircle size={12} style={{ display: 'inline', marginRight: '0.25rem', color: '#8cda3f' }} />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Charter Services */}
              {activeTab === 'charters' && (
                <>
                  <div className="text-center mb-8">
                    <h2 style={{
                      fontSize: '2.5rem',
                      fontWeight: 600,
                      color: '#ffefbf',
                      marginBottom: '0.5rem'
                    }}>
                      Chartered Dive Trips
                    </h2>
                    <p style={{
                      color: 'rgba(255, 239, 191, 0.7)',
                      fontSize: '1.125rem'
                    }}>
                      Explore the best dive sites in the Gulf of Mexico with our experienced captains
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {Object.entries(groupedServices).map(([key, group], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        style={{
                          background: 'rgba(255, 239, 191, 0.05)',
                          borderRadius: '20px',
                          padding: '2rem',
                          border: '1px solid rgba(255, 239, 191, 0.1)'
                        }}
                      >
                        <h3 style={{
                          fontSize: '1.5rem',
                          color: '#8cda3f',
                          marginBottom: '0.5rem'
                        }}>
                          {group.name}
                        </h3>
                        <div className="space-y-3">
                          {group.services.map((service) => (
                            <div
                              key={service.id}
                              style={{
                                padding: '1rem',
                                background: 'rgba(10, 22, 40, 0.5)',
                                borderRadius: '12px',
                                border: '1px solid rgba(140, 218, 63, 0.2)',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#8cda3f';
                                e.currentTarget.style.background = 'rgba(140, 218, 63, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(140, 218, 63, 0.2)';
                                e.currentTarget.style.background = 'rgba(10, 22, 40, 0.5)';
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem'
                              }}>
                                <h4 style={{
                                  color: '#ffefbf',
                                  fontSize: '1rem',
                                  fontWeight: 600
                                }}>
                                  {service.name}
                                </h4>
                                <span style={{
                                  color: '#8cda3f',
                                  fontSize: '1.25rem',
                                  fontWeight: 600
                                }}>
                                  {service.price_text || `$${service.price}`}
                                </span>
                              </div>
                              <div style={{
                                display: 'flex',
                                gap: '1rem',
                                color: 'rgba(255, 239, 191, 0.5)',
                                fontSize: '0.875rem'
                              }}>
                                {service.duration && <span>⏱ {service.duration}</span>}
                                {service.depth && <span>🌊 {service.depth}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, rgba(140, 218, 63, 0.1) 0%, rgba(255, 239, 191, 0.05) 100%)',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    textAlign: 'center'
                  }}>
                    <Users size={40} color="#8cda3f" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{
                      fontSize: '1.5rem',
                      color: '#ffefbf',
                      marginBottom: '1rem'
                    }}>
                      Group Charters Available
                    </h3>
                    <p style={{
                      color: 'rgba(255, 239, 191, 0.7)',
                      marginBottom: '1rem'
                    }}>
                      Private boat charters for groups of 6+ divers. Custom itineraries available.
                    </p>
                    <p style={{
                      color: '#8cda3f',
                      fontSize: '1.25rem',
                      fontWeight: 600
                    }}>
                      Starting at $850 for full day charters
                    </p>
                  </div>
                </>
              )}

              {/* Tank Services */}
              {activeTab === 'tank' && (
                <>
                  <div className="text-center mb-8">
                    <h2 style={{
                      fontSize: '2.5rem',
                      fontWeight: 600,
                      color: '#ffefbf',
                      marginBottom: '0.5rem'
                    }}>
                      Tank & Air Services
                    </h2>
                    <p style={{
                      color: 'rgba(255, 239, 191, 0.7)',
                      fontSize: '1.125rem'
                    }}>
                      Quick fills, quality air, and professional tank services
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(groupedServices).map(([key, group], index) => {
                      const serviceTypeIconMap: Record<string, any> = {
                        'Air Fills': Wind,
                        'Nitrox Fills': Sparkles,
                        'Tank Rentals': Package,
                        'Visual Inspections': Search,
                        'Hydrostatic Testing': Zap,
                        'Valve Services': Settings
                      };
                      const IconComponent = serviceTypeIconMap[group.name] || Gauge;

                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          style={{
                            background: 'rgba(255, 239, 191, 0.05)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid rgba(255, 239, 191, 0.1)',
                            textAlign: 'center'
                          }}
                        >
                          <IconComponent size={40} color="#8cda3f" style={{ marginBottom: '1rem' }} />
                          <h3 style={{
                            fontSize: '1.25rem',
                            color: '#8cda3f',
                            marginBottom: '1rem'
                          }}>
                            {group.name}
                          </h3>
                          <div className="space-y-2">
                            {group.services.map((service) => (
                              <div
                                key={service.id}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  padding: '0.5rem',
                                  background: 'rgba(10, 22, 40, 0.3)',
                                  borderRadius: '8px'
                                }}
                              >
                                <span style={{
                                  color: 'rgba(255, 239, 191, 0.7)',
                                  fontSize: '0.875rem'
                                }}>
                                  {service.name}
                                </span>
                                <span style={{
                                  color: '#ffefbf',
                                  fontWeight: 600,
                                  fontSize: '0.875rem'
                                }}>
                                  {service.price_text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Gear Services */}
              {activeTab === 'gear' && (
                <>
                  <div className="text-center mb-8">
                    <h2 style={{
                      fontSize: '2.5rem',
                      fontWeight: 600,
                      color: '#ffefbf',
                      marginBottom: '0.5rem'
                    }}>
                      Equipment Service & Repair
                    </h2>
                    <p style={{
                      color: 'rgba(255, 239, 191, 0.7)',
                      fontSize: '1.125rem'
                    }}>
                      Factory-certified technicians for all major brands
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {Object.entries(groupedServices).map(([key, group], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        style={{
                          background: 'rgba(140, 218, 63, 0.05)',
                          borderRadius: '20px',
                          padding: '2rem',
                          border: '1px solid rgba(140, 218, 63, 0.2)'
                        }}
                      >
                        <Wrench size={32} color="#8cda3f" style={{ marginBottom: '1rem' }} />
                        <h3 style={{
                          fontSize: '1.5rem',
                          color: '#ffefbf',
                          marginBottom: '0.5rem'
                        }}>
                          {group.name}
                        </h3>
                        <div className="space-y-2">
                          {group.services.map((service) => (
                            <div
                              key={service.id}
                              style={{
                                padding: '0.75rem',
                                background: 'rgba(10, 22, 40, 0.5)',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <div>
                                <p style={{
                                  color: '#ffefbf',
                                  fontSize: '0.875rem',
                                  fontWeight: 500
                                }}>
                                  {service.name}
                                </p>
                                {service.duration && (
                                  <p style={{
                                    color: 'rgba(255, 239, 191, 0.5)',
                                    fontSize: '0.75rem'
                                  }}>
                                    {service.duration}
                                  </p>
                                )}
                              </div>
                              <span style={{
                                color: '#8cda3f',
                                fontWeight: 600,
                                fontSize: '1rem'
                              }}>
                                {service.price_text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div style={{
                    background: 'rgba(255, 239, 191, 0.05)',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    textAlign: 'center'
                  }}>
                    <Star size={40} color="#8cda3f" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{
                      fontSize: '1.5rem',
                      color: '#ffefbf',
                      marginBottom: '1rem'
                    }}>
                      Authorized Service Center
                    </h3>
                    <p style={{
                      color: 'rgba(255, 239, 191, 0.7)',
                      marginBottom: '1rem'
                    }}>
                      We are factory-authorized to service:
                    </p>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      justifyContent: 'center'
                    }}>
                      {['Aqualung', 'ScubaPro', 'Mares', 'Oceanic', 'Atomic', 'Zeagle'].map(brand => (
                        <span
                          key={brand}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(140, 218, 63, 0.1)',
                            borderRadius: '20px',
                            border: '1px solid #8cda3f',
                            color: '#8cda3f',
                            fontWeight: 600
                          }}
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4" style={{ background: 'rgba(30, 58, 95, 0.2)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 600,
                color: '#ffefbf',
                marginBottom: '1rem'
              }}>
                Ready to Get Started?
              </h2>
              <p style={{
                color: 'rgba(255, 239, 191, 0.7)',
                fontSize: '1.25rem',
                marginBottom: '2rem'
              }}>
                Contact us today to book your service or sign up for a course
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '1rem 2rem',
                    minWidth: '180px',
                    background: 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)',
                    color: '#0a1628',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(140, 218, 63, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 30px rgba(140, 218, 63, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(140, 218, 63, 0.3)';
                  }}
                >
                  Book Now
                </a>
                <a
                  href="tel:+17273200201"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '1rem 2rem',
                    minWidth: '180px',
                    background: 'transparent',
                    color: '#ffefbf',
                    border: '2px solid rgba(255, 239, 191, 0.5)',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#8cda3f';
                    e.currentTarget.style.background = 'rgba(140, 218, 63, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.5)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Call Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}