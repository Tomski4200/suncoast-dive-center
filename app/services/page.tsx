'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Anchor, Gauge, Wrench, Star, CheckCircle, Calendar, Users, Wind, Sparkles, Package, Search, Zap, Settings } from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('certification');

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
              {[
                { id: 'certification', label: 'PADI Certification', icon: GraduationCap },
                { id: 'charters', label: 'Chartered Dives', icon: Anchor },
                { id: 'tank', label: 'Tank Services', icon: Gauge },
                { id: 'gear', label: 'Gear Service', icon: Wrench }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: activeTab === tab.id
                      ? 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)'
                      : 'transparent',
                    color: activeTab === tab.id ? '#0a1628' : '#ffefbf',
                    border: `2px solid ${activeTab === tab.id ? '#8cda3f' : 'rgba(255, 239, 191, 0.3)'}`,
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
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Service Content */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Certification Courses */}
            {activeTab === 'certification' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    color: '#ffefbf',
                    marginBottom: '0.5rem'
                  }}>
                    PADI Certification Courses
                  </h2>
                  <p style={{
                    color: 'rgba(255, 239, 191, 0.7)',
                    fontSize: '1.125rem'
                  }}>
                    Start your diving journey or advance your skills with our comprehensive training programs
                  </p>
                </div>

                {/* Beginner Courses */}
                <div>
                  <h3 style={{
                    fontSize: '1.75rem',
                    color: '#8cda3f',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    Beginner Courses
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Discover Scuba Diving',
                        price: '$149',
                        duration: '1 Day',
                        description: 'No certification required. Experience breathing underwater for the first time!',
                        includes: ['Pool session', 'Basic equipment', 'Professional instruction']
                      },
                      {
                        title: 'PADI Open Water Diver',
                        price: '$499',
                        duration: '3-4 Days',
                        description: 'Your first certification! Learn the basics and explore to 60 feet.',
                        includes: ['E-learning materials', 'Pool sessions', '4 open water dives', 'Equipment rental', 'Certification card']
                      },
                      {
                        title: 'PADI Scuba Diver',
                        price: '$349',
                        duration: '2 Days',
                        description: 'Limited certification for those short on time. Dive to 40 feet with a professional.',
                        includes: ['E-learning', 'Pool sessions', '2 open water dives', 'Certification']
                      }
                    ].map((course, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        style={{
                          background: 'rgba(255, 239, 191, 0.05)',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          border: '1px solid rgba(255, 239, 191, 0.1)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.borderColor = '#8cda3f';
                          e.currentTarget.style.background = 'rgba(140, 218, 63, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.1)';
                          e.currentTarget.style.background = 'rgba(255, 239, 191, 0.05)';
                        }}
                      >
                        <h4 style={{
                          fontSize: '1.25rem',
                          color: '#ffefbf',
                          marginBottom: '0.5rem'
                        }}>
                          {course.title}
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
                            {course.price}
                          </span>
                          <span style={{
                            color: 'rgba(255, 239, 191, 0.6)',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <Calendar size={16} />
                            {course.duration}
                          </span>
                        </div>
                        <p style={{
                          color: 'rgba(255, 239, 191, 0.7)',
                          fontSize: '0.875rem',
                          marginBottom: '1rem',
                          lineHeight: 1.6
                        }}>
                          {course.description}
                        </p>
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
                            {course.includes.map((item, i) => (
                              <li key={i} style={{ marginBottom: '0.25rem' }}>
                                <CheckCircle size={12} style={{ display: 'inline', marginRight: '0.25rem', color: '#8cda3f' }} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Advanced Courses */}
                <div>
                  <h3 style={{
                    fontSize: '1.75rem',
                    color: '#8cda3f',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    Advanced & Specialty Courses
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Advanced Open Water',
                        price: '$399',
                        duration: '2 Days',
                        description: 'Expand your skills with 5 adventure dives including deep and navigation.',
                        includes: ['5 adventure dives', 'Deep dive to 100ft', 'Navigation training', 'Certification']
                      },
                      {
                        title: 'Rescue Diver',
                        price: '$449',
                        duration: '3 Days',
                        description: 'Learn to prevent and manage diving emergencies. Be a better dive buddy!',
                        includes: ['Emergency scenarios', 'First aid training', 'Rescue techniques', 'Certification']
                      },
                      {
                        title: 'Divemaster',
                        price: '$899',
                        duration: '4-6 Weeks',
                        description: 'First professional level. Lead dives and assist instructors.',
                        includes: ['Professional training', 'Leadership skills', 'Dive theory', 'Internship opportunity']
                      },
                      {
                        title: 'Nitrox Specialty',
                        price: '$199',
                        duration: '1 Day',
                        description: 'Dive longer with enriched air. Most popular specialty course!',
                        includes: ['Theory & analysis', '2 nitrox dives', 'Certification']
                      },
                      {
                        title: 'Deep Diver Specialty',
                        price: '$349',
                        duration: '2 Days',
                        description: 'Explore depths to 130 feet safely. Learn deep dive planning.',
                        includes: ['4 deep dives', 'Narcosis management', 'Deep dive planning']
                      },
                      {
                        title: 'Wreck Diver Specialty',
                        price: '$379',
                        duration: '2 Days',
                        description: 'Explore sunken vessels safely. Popular Florida specialty!',
                        includes: ['4 wreck dives', 'Penetration basics', 'Mapping & navigation']
                      }
                    ].map((course, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        style={{
                          background: 'rgba(140, 218, 63, 0.05)',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          border: '1px solid rgba(140, 218, 63, 0.2)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.borderColor = '#8cda3f';
                          e.currentTarget.style.background = 'rgba(140, 218, 63, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = 'rgba(140, 218, 63, 0.2)';
                          e.currentTarget.style.background = 'rgba(140, 218, 63, 0.05)';
                        }}
                      >
                        <h4 style={{
                          fontSize: '1.25rem',
                          color: '#ffefbf',
                          marginBottom: '0.5rem'
                        }}>
                          {course.title}
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
                            {course.price}
                          </span>
                          <span style={{
                            color: 'rgba(255, 239, 191, 0.6)',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <Calendar size={16} />
                            {course.duration}
                          </span>
                        </div>
                        <p style={{
                          color: 'rgba(255, 239, 191, 0.7)',
                          fontSize: '0.875rem',
                          marginBottom: '1rem',
                          lineHeight: 1.6
                        }}>
                          {course.description}
                        </p>
                        <div style={{
                          borderTop: '1px solid rgba(140, 218, 63, 0.1)',
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
                            {course.includes.map((item, i) => (
                              <li key={i} style={{ marginBottom: '0.25rem' }}>
                                <CheckCircle size={12} style={{ display: 'inline', marginRight: '0.25rem', color: '#8cda3f' }} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Chartered Dives */}
            {activeTab === 'charters' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
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
                  {[
                    {
                      category: 'Local Reef Dives',
                      description: 'Explore vibrant artificial reefs teeming with marine life',
                      trips: [
                        { name: 'Morning 2-Tank Reef Dive', price: '$95', duration: '4 hours', depth: '40-60 ft' },
                        { name: 'Afternoon 2-Tank Dive', price: '$85', duration: '4 hours', depth: '40-60 ft' },
                        { name: 'Twilight/Night Dive', price: '$75', duration: '3 hours', depth: '30-50 ft' }
                      ]
                    },
                    {
                      category: 'Wreck Dives',
                      description: 'Visit historic shipwrecks and artificial reef structures',
                      trips: [
                        { name: 'USS Narcissus Wreck', price: '$125', duration: '5 hours', depth: '80-90 ft' },
                        { name: 'Sheridan Wreck Complex', price: '$115', duration: '5 hours', depth: '70-80 ft' },
                        { name: 'Blackthorn Memorial', price: '$135', duration: '5 hours', depth: '80 ft' }
                      ]
                    },
                    {
                      category: 'Deep & Technical',
                      description: 'Advanced dives for experienced divers',
                      trips: [
                        { name: 'Deep Ledge Exploration', price: '$165', duration: '6 hours', depth: '100-130 ft' },
                        { name: 'Technical Wreck Penetration', price: '$225', duration: '6 hours', depth: '90-130 ft' },
                        { name: 'Trimix Deep Dive', price: '$295', duration: '6 hours', depth: '130+ ft' }
                      ]
                    },
                    {
                      category: 'Special Trips',
                      description: 'Unique diving experiences',
                      trips: [
                        { name: 'Shark Tooth Dive', price: '$89', duration: '4 hours', depth: '20-40 ft' },
                        { name: 'Spearfishing Charter', price: '$145', duration: '5 hours', depth: 'Varies' },
                        { name: 'Photography Workshop Dive', price: '$135', duration: '5 hours', depth: '40-60 ft' }
                      ]
                    }
                  ].map((category, index) => (
                    <motion.div
                      key={index}
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
                        {category.category}
                      </h3>
                      <p style={{
                        color: 'rgba(255, 239, 191, 0.6)',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem'
                      }}>
                        {category.description}
                      </p>
                      <div className="space-y-3">
                        {category.trips.map((trip, i) => (
                          <div
                            key={i}
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
                                {trip.name}
                              </h4>
                              <span style={{
                                color: '#8cda3f',
                                fontSize: '1.25rem',
                                fontWeight: 600
                              }}>
                                {trip.price}
                              </span>
                            </div>
                            <div style={{
                              display: 'flex',
                              gap: '1rem',
                              color: 'rgba(255, 239, 191, 0.5)',
                              fontSize: '0.875rem'
                            }}>
                              <span>⏱ {trip.duration}</span>
                              <span>🌊 {trip.depth}</span>
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
              </motion.div>
            )}

            {/* Tank Services */}
            {activeTab === 'tank' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
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
                  {[
                    {
                      service: 'Air Fills',
                      icon: Wind,
                      prices: [
                        { item: 'Standard Air Fill', price: '$8' },
                        { item: '10-Fill Card', price: '$70' },
                        { item: 'Monthly Unlimited', price: '$99' }
                      ]
                    },
                    {
                      service: 'Nitrox Fills',
                      icon: Sparkles,
                      prices: [
                        { item: '32% Nitrox', price: '$12' },
                        { item: '36% Nitrox', price: '$14' },
                        { item: 'Custom Mix', price: '$16' }
                      ]
                    },
                    {
                      service: 'Tank Rentals',
                      icon: Package,
                      prices: [
                        { item: 'Aluminum 80', price: '$15/day' },
                        { item: 'Steel 100', price: '$20/day' },
                        { item: 'Pony Bottle', price: '$10/day' }
                      ]
                    },
                    {
                      service: 'Visual Inspections',
                      icon: Search,
                      prices: [
                        { item: 'Annual VIP', price: '$25' },
                        { item: 'VIP + Fill', price: '$30' },
                        { item: 'O2 Clean VIP', price: '$35' }
                      ]
                    },
                    {
                      service: 'Hydrostatic Testing',
                      icon: Zap,
                      prices: [
                        { item: 'Aluminum Tank', price: '$45' },
                        { item: 'Steel Tank', price: '$50' },
                        { item: 'Rush Service', price: '+$15' }
                      ]
                    },
                    {
                      service: 'Valve Services',
                      icon: Settings,
                      prices: [
                        { item: 'Valve Service', price: '$20' },
                        { item: 'Valve Replacement', price: '$75' },
                        { item: 'DIN/Yoke Convert', price: '$30' }
                      ]
                    }
                  ].map((service, index) => (
                    <motion.div
                      key={index}
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
                      <service.icon size={40} color="#8cda3f" style={{ marginBottom: '1rem' }} />
                      <h3 style={{
                        fontSize: '1.25rem',
                        color: '#8cda3f',
                        marginBottom: '1rem'
                      }}>
                        {service.service}
                      </h3>
                      <div className="space-y-2">
                        {service.prices.map((price, i) => (
                          <div
                            key={i}
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
                              {price.item}
                            </span>
                            <span style={{
                              color: '#ffefbf',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}>
                              {price.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gear Service */}
            {activeTab === 'gear' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
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
                  {[
                    {
                      category: 'Regulator Service',
                      description: 'Annual service keeps you breathing easy',
                      services: [
                        { name: 'Annual Regulator Service', price: '$85', time: '3-5 days' },
                        { name: 'First & Second Stage', price: '$125', time: '3-5 days' },
                        { name: 'Octopus Service', price: '$45', time: '2-3 days' },
                        { name: 'Rush Service Available', price: '+$25', time: '24 hours' }
                      ]
                    },
                    {
                      category: 'BCD Service',
                      description: 'Keep your buoyancy control in check',
                      services: [
                        { name: 'Annual BCD Service', price: '$65', time: '2-3 days' },
                        { name: 'Inflator Service', price: '$35', time: '1-2 days' },
                        { name: 'Bladder Repair', price: '$45-95', time: '3-5 days' },
                        { name: 'Dump Valve Replace', price: '$40', time: '2-3 days' }
                      ]
                    },
                    {
                      category: 'Computer Service',
                      description: 'Battery replacement and diagnostics',
                      services: [
                        { name: 'Battery Replacement', price: '$25-45', time: 'Same day' },
                        { name: 'Pressure Test', price: '$35', time: '1 day' },
                        { name: 'Software Update', price: '$20', time: 'Same day' },
                        { name: 'Screen Replacement', price: 'Quote', time: '1-2 weeks' }
                      ]
                    },
                    {
                      category: 'Wetsuit Repair',
                      description: 'Extend the life of your exposure protection',
                      services: [
                        { name: 'Seam Repair', price: '$25-45', time: '2-3 days' },
                        { name: 'Zipper Replacement', price: '$85-120', time: '1 week' },
                        { name: 'Knee Pad Install', price: '$35', time: '3-4 days' },
                        { name: 'Minor Tears', price: '$20-40', time: '2-3 days' }
                      ]
                    }
                  ].map((category, index) => (
                    <motion.div
                      key={index}
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
                        {category.category}
                      </h3>
                      <p style={{
                        color: 'rgba(255, 239, 191, 0.6)',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem'
                      }}>
                        {category.description}
                      </p>
                      <div className="space-y-2">
                        {category.services.map((service, i) => (
                          <div
                            key={i}
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
                              <p style={{
                                color: 'rgba(255, 239, 191, 0.5)',
                                fontSize: '0.75rem'
                              }}>
                                {service.time}
                              </p>
                            </div>
                            <span style={{
                              color: '#8cda3f',
                              fontWeight: 600,
                              fontSize: '1rem'
                            }}>
                              {service.price}
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
              </motion.div>
            )}
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
                    gap: '0.5rem',
                    padding: '1rem 2rem',
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
                    gap: '0.5rem',
                    padding: '1rem 2rem',
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