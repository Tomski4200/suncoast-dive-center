'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Users, Heart, Anchor, Star } from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function AboutPage() {
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
                Our Story
              </h1>
              <p style={{
                color: 'rgba(255, 239, 191, 0.7)',
                fontSize: '1.25rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Two decades of dedication to the diving community
              </p>
            </motion.div>
          </div>
        </section>

        {/* Chad Campbell Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image/Visual Side */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, rgba(140, 218, 63, 0.1) 0%, rgba(255, 239, 191, 0.05) 100%)',
                  borderRadius: '20px',
                  padding: '3rem',
                  border: '1px solid rgba(140, 218, 63, 0.2)',
                  height: '500px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Placeholder for owner image */}
                  <div className="text-center">
                    <div style={{
                      width: '200px',
                      height: '200px',
                      margin: '0 auto 2rem',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(140, 218, 63, 0.2) 0%, rgba(255, 239, 191, 0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid #8cda3f'
                    }}>
                      <Anchor size={80} color="#8cda3f" />
                    </div>
                    <h3 style={{
                      fontSize: '2rem',
                      fontFamily: 'Anton, sans-serif',
                      textTransform: 'uppercase',
                      color: '#ffefbf',
                      marginBottom: '0.5rem'
                    }}>
                      Chad Campbell
                    </h3>
                    <p style={{
                      color: '#8cda3f',
                      fontSize: '1.125rem',
                      fontWeight: 600
                    }}>
                      Owner & Master Diver
                    </p>
                    <p style={{
                      color: 'rgba(255, 239, 191, 0.6)',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem'
                    }}>
                      20+ Years of Excellence
                    </p>
                  </div>

                  {/* Decorative Elements */}
                  <div style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} fill="#8cda3f" color="#8cda3f" />
                    ))}
                  </div>
                </div>

                {/* Accomplishments */}
                <div style={{
                  background: 'rgba(140, 218, 63, 0.05)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(140, 218, 63, 0.2)',
                  marginTop: '2rem'
                }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Shield size={24} color="#8cda3f" />
                      <div>
                        <p style={{ color: '#8cda3f', fontWeight: 600, fontSize: '1.125rem' }}>100+</p>
                        <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>Rescue Missions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award size={24} color="#8cda3f" />
                      <div>
                        <p style={{ color: '#8cda3f', fontWeight: 600, fontSize: '1.125rem' }}>5000+</p>
                        <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>Divers Certified</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users size={24} color="#8cda3f" />
                      <div>
                        <p style={{ color: '#8cda3f', fontWeight: 600, fontSize: '1.125rem' }}>20+</p>
                        <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>Years Experience</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Heart size={24} color="#8cda3f" />
                      <div>
                        <p style={{ color: '#8cda3f', fontWeight: 600, fontSize: '1.125rem' }}>∞</p>
                        <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>Lives Touched</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content Side */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    color: '#ffefbf',
                    marginBottom: '1.5rem',
                    lineHeight: 1.2
                  }}>
                    Meet Chad Campbell,<br />
                    <span style={{ color: '#8cda3f' }}>A Living Legend</span>
                  </h2>
                  
                  <p style={{
                    color: 'rgba(255, 239, 191, 0.8)',
                    fontSize: '1.125rem',
                    lineHeight: 1.8,
                    marginBottom: '1.5rem'
                  }}>
                    For over two decades, Chad Campbell has been the heart and soul of Suncoast Dive Center. 
                    More than just a shop owner, Chad is a pillar of the Florida diving community—a mentor, 
                    a hero, and a friend to countless divers who've had the privilege of learning from his 
                    vast experience.
                  </p>

                  <p style={{
                    color: 'rgba(255, 239, 191, 0.8)',
                    fontSize: '1.125rem',
                    lineHeight: 1.8,
                    marginBottom: '1.5rem'
                  }}>
                    Known throughout the Gulf Coast for his exceptional skill and unwavering dedication, 
                    Chad has earned a reputation that extends far beyond recreational diving. When law 
                    enforcement agencies need an expert for critical underwater operations—whether it's 
                    evidence recovery, search and rescue, or the most challenging recovery missions—Chad 
                    is their first call.
                  </p>

                  <p style={{
                    color: 'rgba(255, 239, 191, 0.8)',
                    fontSize: '1.125rem',
                    lineHeight: 1.8,
                    marginBottom: '1.5rem'
                  }}>
                    His expertise in technical diving and his calm demeanor under pressure have made him 
                    the go-to diver for missions others might consider too difficult or dangerous. From 
                    assisting families in their darkest hours to helping solve criminal cases through 
                    underwater evidence recovery, Chad's contributions to the community go far beyond 
                    the walls of his dive shop.
                  </p>

                  <p style={{
                    color: 'rgba(255, 239, 191, 0.8)',
                    fontSize: '1.125rem',
                    lineHeight: 1.8
                  }}>
                    But what truly sets Chad apart is his genuine care for every person who walks through 
                    the door. Whether you're a nervous first-timer or a seasoned diver, Chad treats everyone 
                    like family, sharing his passion for the underwater world with infectious enthusiasm 
                    and ensuring every dive is both safe and unforgettable.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 239, 191, 0.05) 0%, rgba(140, 218, 63, 0.05) 100%)',
                borderRadius: '20px',
                padding: '3rem',
                textAlign: 'center',
                border: '1px solid rgba(255, 239, 191, 0.1)',
                position: 'relative'
              }}
            >
              <svg 
                width="60" 
                height="60" 
                viewBox="0 0 24 24" 
                fill="#8cda3f" 
                style={{
                  position: 'absolute',
                  top: '2rem',
                  left: '2rem',
                  opacity: 0.3
                }}
              >
                <path d="M10 7L8 11L12 11L10 15M18 7L16 11L20 11L18 15" />
              </svg>
              
              <p style={{
                fontSize: '1.5rem',
                fontStyle: 'italic',
                color: '#ffefbf',
                lineHeight: 1.8,
                marginBottom: '2rem'
              }}>
                "The ocean doesn't just teach you how to dive—it teaches you about life, respect, 
                and the incredible world that exists beneath the waves. My mission is to share 
                that wisdom with every diver who trusts me with their journey."
              </p>
              
              <p style={{
                color: '#8cda3f',
                fontSize: '1.125rem',
                fontWeight: 600
              }}>
                — Chad Campbell
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-4" style={{ background: 'rgba(30, 58, 95, 0.3)' }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 style={{
                fontSize: '3rem',
                fontFamily: 'Anton, sans-serif',
                textTransform: 'uppercase',
                color: '#ffefbf',
                marginBottom: '1rem'
              }}>
                Why Divers Choose Us
              </h2>
              <p style={{
                color: 'rgba(255, 239, 191, 0.7)',
                fontSize: '1.25rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Experience, expertise, and a genuine passion for diving
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Unmatched Expertise",
                  description: "Learn from a master diver trusted by law enforcement and respected throughout the diving community."
                },
                {
                  icon: Heart,
                  title: "Family Atmosphere",
                  description: "Join a community where every diver is family and every visit feels like coming home."
                },
                {
                  icon: Award,
                  title: "Proven Track Record",
                  description: "20+ years of accident-free operations and thousands of satisfied divers speak for themselves."
                },
                {
                  icon: Users,
                  title: "Personal Attention",
                  description: "Whether you're buying gear or booking a charter, Chad personally ensures you get exactly what you need."
                },
                {
                  icon: Anchor,
                  title: "Local Knowledge",
                  description: "Nobody knows the Gulf Coast dive sites better. Discover hidden gems and secret spots with our guidance."
                },
                {
                  icon: Star,
                  title: "Beyond Business",
                  description: "We're not just a dive shop—we're committed to ocean conservation and community service."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    background: 'rgba(255, 239, 191, 0.05)',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid rgba(255, 239, 191, 0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.background = 'rgba(140, 218, 63, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(140, 218, 63, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255, 239, 191, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.1)';
                  }}
                >
                  <item.icon size={32} color="#8cda3f" style={{ marginBottom: '1rem' }} />
                  <h3 style={{
                    fontSize: '1.25rem',
                    color: '#ffefbf',
                    marginBottom: '0.5rem',
                    fontWeight: 600
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: 'rgba(255, 239, 191, 0.6)',
                    lineHeight: 1.6
                  }}>
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
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
                Ready to Dive In?
              </h2>
              <p style={{
                color: 'rgba(255, 239, 191, 0.7)',
                fontSize: '1.25rem',
                marginBottom: '2rem'
              }}>
                Join the Suncoast family and discover why we're Florida's most trusted dive center
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
                  Contact Us
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
                  Call Now
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