'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck, Bell, Server } from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <div style={{ minHeight: '100vh', background: '#0a1628' }}>
        <Navigation />
        
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          paddingTop: '120px',
          paddingBottom: '60px',
          background: 'linear-gradient(180deg, #0a1628 0%, #1e3a5f 100%)',
          overflow: 'hidden'
        }}>
          <div className="max-w-4xl mx-auto px-4" style={{ position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
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
                Privacy Policy
              </h1>
              <p style={{
                color: 'rgba(255, 239, 191, 0.7)',
                fontSize: '1.125rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Your privacy is important to us. This policy outlines how we protect and use your information.
              </p>
              <p style={{
                color: 'rgba(255, 239, 191, 0.5)',
                fontSize: '0.875rem',
                marginTop: '1rem'
              }}>
                Last Updated: January 2024
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Introduction */}
              <div style={{
                background: 'rgba(255, 239, 191, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 239, 191, 0.1)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <Shield size={28} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Introduction
                  </h2>
                </div>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8
                }}>
                  Suncoast Dive Center ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you visit our website, purchase products from our shop, or use our diving services.
                </p>
              </div>

              {/* Information We Collect */}
              <div style={{
                background: 'rgba(140, 218, 63, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(140, 218, 63, 0.2)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <Eye size={28} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Information We Collect
                  </h2>
                </div>
                
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Personal Information
                </h3>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li>Name and contact information (email, phone number, address)</li>
                  <li>Diving certification details and experience level</li>
                  <li>Emergency contact information</li>
                  <li>Medical information relevant to diving activities</li>
                  <li>Payment and billing information</li>
                  <li>Equipment rental and purchase history</li>
                </ul>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Automatically Collected Information
                </h3>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Referring website addresses</li>
                </ul>
              </div>

              {/* How We Use Your Information */}
              <div style={{
                background: 'rgba(255, 239, 191, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 239, 191, 0.1)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck size={28} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    How We Use Your Information
                  </h2>
                </div>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  marginBottom: '1rem'
                }}>
                  We use the information we collect to:
                </p>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li>Process your purchases and equipment rentals</li>
                  <li>Schedule and manage dive charters and courses</li>
                  <li>Verify diving certifications and maintain safety standards</li>
                  <li>Communicate important safety information and updates</li>
                  <li>Send booking confirmations and dive condition updates</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Improve our services and website functionality</li>
                  <li>Comply with legal requirements and industry regulations</li>
                  <li>Send promotional offers and newsletters (with your consent)</li>
                </ul>
              </div>

              {/* Data Protection */}
              <div style={{
                background: 'rgba(140, 218, 63, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(140, 218, 63, 0.2)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <Lock size={28} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Data Protection & Security
                  </h2>
                </div>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8
                }}>
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information against accidental or unlawful destruction, loss, alteration, 
                  unauthorized disclosure, or access. These measures include:
                </p>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem',
                  marginTop: '1rem'
                }}>
                  <li>SSL encryption for all data transmissions</li>
                  <li>Secure storage of personal information</li>
                  <li>Limited access to personal data by authorized personnel only</li>
                  <li>Regular security assessments and updates</li>
                  <li>PCI compliance for payment processing</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div style={{
                background: 'rgba(255, 239, 191, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 239, 191, 0.1)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <Server size={28} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Information Sharing
                  </h2>
                </div>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  marginBottom: '1rem'
                }}>
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  your information in the following circumstances:
                </p>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li>With dive certification agencies (SSI, etc.) for certification verification</li>
                  <li>With charter boat operators when you book dive trips through us</li>
                  <li>With emergency services in case of diving incidents</li>
                  <li>With legal authorities when required by law</li>
                  <li>With service providers who assist us in operating our business (under confidentiality agreements)</li>
                </ul>
              </div>

              {/* Your Rights */}
              <div style={{
                background: 'rgba(140, 218, 63, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(140, 218, 63, 0.2)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <Bell size={28} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Your Rights & Choices
                  </h2>
                </div>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  marginBottom: '1rem'
                }}>
                  You have the following rights regarding your personal information:
                </p>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li><strong style={{ color: '#8cda3f' }}>Access:</strong> Request a copy of your personal data</li>
                  <li><strong style={{ color: '#8cda3f' }}>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong style={{ color: '#8cda3f' }}>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                  <li><strong style={{ color: '#8cda3f' }}>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                  <li><strong style={{ color: '#8cda3f' }}>Data Portability:</strong> Request your data in a portable format</li>
                </ul>
              </div>

              {/* Cookies */}
              <div style={{
                background: 'rgba(255, 239, 191, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 239, 191, 0.1)'
              }}>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: '#ffefbf',
                  marginBottom: '1rem'
                }}>
                  Cookies
                </h2>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8
                }}>
                  Our website uses cookies to enhance your browsing experience. Cookies are small files 
                  stored on your device that help us remember your preferences and understand how you use 
                  our site. You can control cookie settings through your browser preferences.
                </p>
              </div>

              {/* Children's Privacy */}
              <div style={{
                background: 'rgba(140, 218, 63, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(140, 218, 63, 0.2)'
              }}>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: '#ffefbf',
                  marginBottom: '1rem'
                }}>
                  Children's Privacy
                </h2>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8
                }}>
                  Our services are available to minors with parental consent. For divers under 18, we require 
                  parental or guardian consent and may collect parent/guardian contact information for safety 
                  and liability purposes.
                </p>
              </div>

              {/* Contact Information */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(140, 218, 63, 0.1) 0%, rgba(255, 239, 191, 0.05) 100%)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(140, 218, 63, 0.3)',
                textAlign: 'center'
              }}>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: '#ffefbf',
                  marginBottom: '1rem'
                }}>
                  Questions or Concerns?
                </h2>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  marginBottom: '1.5rem'
                }}>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  <p style={{ color: '#8cda3f', fontWeight: 600 }}>Suncoast Dive Center</p>
                  <p style={{ color: 'rgba(255, 239, 191, 0.7)' }}>5304 Seminole Blvd, St. Petersburg, FL 33708</p>
                  <p style={{ color: 'rgba(255, 239, 191, 0.7)' }}>Phone: (727) 320-0201</p>
                  <p style={{ color: 'rgba(255, 239, 191, 0.7)' }}>Email: suncoastdivecenter@yahoo.com</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}