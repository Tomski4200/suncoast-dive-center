'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube, Twitter, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] to-[#050d1a]" />
      
      {/* Decorative Wave */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8cda3f] to-transparent opacity-30" />

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontFamily: 'Anton, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                background: 'linear-gradient(to right, #ffefbf 0%, #92856a 50%, #ffefbf 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                Suncoast
              </h3>
              <p style={{
                color: 'rgba(255, 239, 191, 0.6)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                marginBottom: '1.5rem'
              }}>
                Your premier dive center on Florida's Gulf Coast. Explore the underwater world with confidence and expertise.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-3">
                {[
                  { name: 'facebook', Icon: Facebook, url: 'https://www.facebook.com/suncoastdivecenter' },
                  { name: 'instagram', Icon: Instagram, url: 'https://www.instagram.com/suncoastdivecenter/' },
                  { name: 'youtube', Icon: Youtube, url: 'https://youtube.com' },
                  { name: 'twitter', Icon: Twitter, url: 'https://twitter.com/DiveSuncoast' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255, 239, 191, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255, 239, 191, 0.6)',
                      transition: 'all 0.3s ease',
                      background: 'rgba(10, 22, 40, 0.5)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#8cda3f';
                      e.currentTarget.style.color = '#8cda3f';
                      e.currentTarget.style.background = 'rgba(140, 218, 63, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.2)';
                      e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)';
                      e.currentTarget.style.background = 'rgba(10, 22, 40, 0.5)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <social.Icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 style={{
                color: '#ffefbf',
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { name: 'About Us', href: '#about-us' },
                  { name: 'Courses', href: '#courses' },
                  { name: 'Pro Shop', href: '/diveshop' },
                  { name: 'Charters', href: '#charters' },
                  { name: 'Gallery', href: '#gallery' },
                  { name: 'Legal', href: '/legal' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      style={{
                        color: 'rgba(255, 239, 191, 0.6)',
                        fontSize: '0.875rem',
                        transition: 'all 0.3s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#8cda3f';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ChevronRight size={14} style={{ opacity: 0.5 }} />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 style={{
                color: '#ffefbf',
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Services
              </h4>
              <ul className="space-y-2">
                {[
                  { name: 'Dive Certification', tab: 'certification' },
                  { name: 'Equipment Rental', tab: 'gear' },
                  { name: 'Tank Fills', tab: 'tank' },
                  { name: 'Equipment Service', tab: 'gear' },
                  { name: 'Group Charters', tab: 'charters' },
                  { name: 'Private Lessons', tab: 'certification' }
                ].map((service) => (
                  <li key={service.name}>
                    <a
                      href={`/services?tab=${service.tab}`}
                      style={{
                        color: 'rgba(255, 239, 191, 0.6)',
                        fontSize: '0.875rem',
                        transition: 'all 0.3s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#8cda3f';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ChevronRight size={14} style={{ opacity: 0.5 }} />
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 style={{
                color: '#ffefbf',
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Contact Info
              </h4>
              
              <div className="space-y-3">
                {/* Address */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  color: 'rgba(255, 239, 191, 0.6)',
                  fontSize: '0.875rem'
                }}>
                  <MapPin 
                    size={18} 
                    style={{ 
                      flexShrink: 0, 
                      marginTop: '2px',
                      color: 'rgba(255, 239, 191, 0.6)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#8cda3f';
                      e.currentTarget.style.filter = 'drop-shadow(0 0 8px #8cda3f)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)';
                      e.currentTarget.style.filter = 'none';
                    }}
                  />
                  <div>
                    <p>5304 Seminole Blvd</p>
                    <p>St. Petersburg, FL 33708</p>
                  </div>
                </div>

                {/* Phone */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  color: 'rgba(255, 239, 191, 0.6)',
                  fontSize: '0.875rem'
                }}>
                  <Phone 
                    size={18} 
                    style={{ 
                      flexShrink: 0,
                      color: 'rgba(255, 239, 191, 0.6)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#8cda3f';
                      e.currentTarget.style.filter = 'drop-shadow(0 0 8px #8cda3f)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)';
                      e.currentTarget.style.filter = 'none';
                    }}
                  />
                  <a 
                    href="tel:+17273200201"
                    style={{
                      color: 'inherit',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)'}
                  >
                    (727) 320-0201
                  </a>
                </div>

                {/* Email */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  color: 'rgba(255, 239, 191, 0.6)',
                  fontSize: '0.875rem'
                }}>
                  <Mail 
                    size={18} 
                    style={{ 
                      flexShrink: 0,
                      color: 'rgba(255, 239, 191, 0.6)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#8cda3f';
                      e.currentTarget.style.filter = 'drop-shadow(0 0 8px #8cda3f)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)';
                      e.currentTarget.style.filter = 'none';
                    }}
                  />
                  <a 
                    href="mailto:suncoastdivecenter@yahoo.com"
                    style={{
                      color: 'inherit',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)'}
                  >
                    suncoastdivecenter@yahoo.com
                  </a>
                </div>

                {/* Hours */}
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'rgba(140, 218, 63, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(140, 218, 63, 0.1)'
                }}>
                  <p style={{
                    color: '#8cda3f',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Store Hours
                  </p>
                  <p style={{
                    color: 'rgba(255, 239, 191, 0.6)',
                    fontSize: '0.875rem',
                    lineHeight: 1.5
                  }}>
                    Sunday: Closed<br />
                    Monday: 9AM - 6PM<br />
                    Tuesday: Closed<br />
                    Wednesday: 9AM - 6PM<br />
                    Thursday: 9AM - 6PM<br />
                    Friday: 9AM - 6PM<br />
                    Saturday: 9AM - 4PM
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 239, 191, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
          className="md:flex-row md:justify-between"
          >
            <p style={{
              color: 'rgba(255, 239, 191, 0.4)',
              fontSize: '0.875rem'
            }}>
              © {currentYear} Suncoast Dive Center. All rights reserved.
            </p>
            
            <div className="flex gap-4">
              {[
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Sitemap', href: '#sitemap' }
              ].map((link, index) => (
                <React.Fragment key={link.name}>
                  <a
                    href={link.href}
                    style={{
                      color: 'rgba(255, 239, 191, 0.4)',
                      fontSize: '0.875rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 239, 191, 0.4)'}
                  >
                    {link.name}
                  </a>
                  {index < 2 && (
                    <span style={{ color: 'rgba(255, 239, 191, 0.2)' }}>|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;