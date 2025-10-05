'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, Shield, Users, CreditCard, Scale } from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function TermsOfService() {
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
                Terms of Service
              </h1>
              <p style={{
                color: 'rgba(255, 239, 191, 0.7)',
                fontSize: '1.125rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Please read these terms carefully before using our services
              </p>
              <p style={{
                color: 'rgba(255, 239, 191, 0.5)',
                fontSize: '0.875rem',
                marginTop: '1rem'
              }}>
                Effective Date: January 2024
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
              {/* Agreement to Terms */}
              <div style={{
                background: 'rgba(255, 239, 191, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 239, 191, 0.1)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={28} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Agreement to Terms
                  </h2>
                </div>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8
                }}>
                  By accessing our website, purchasing products from our shop, or using any of our diving services, 
                  you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these 
                  terms, you may not access our services.
                </p>
              </div>

              {/* Diving Services & Safety */}
              <div style={{
                background: 'rgba(140, 218, 63, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(140, 218, 63, 0.2)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle size={28} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Diving Services & Safety Requirements
                  </h2>
                </div>
                
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Certification Requirements
                </h3>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li>All divers must present valid certification from a recognized agency (SSI, NAUI, etc.)</li>
                  <li>Certification level must match the planned dive activities</li>
                  <li>Divers may be required to demonstrate skills before participating in advanced dives</li>
                  <li>Uncertified individuals may only participate in Discover Scuba or training programs</li>
                </ul>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Medical Requirements
                </h3>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li>All participants must complete a medical questionnaire</li>
                  <li>Physician clearance required for certain medical conditions</li>
                  <li>We reserve the right to refuse service if safety concerns exist</li>
                  <li>Participants must disclose all relevant medical conditions</li>
                </ul>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Assumption of Risk
                </h3>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  padding: '1rem',
                  background: 'rgba(255, 50, 50, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 50, 50, 0.2)'
                }}>
                  <strong>IMPORTANT:</strong> Scuba diving and snorkeling involve inherent risks including but not 
                  limited to decompression sickness, embolism, drowning, and marine life injuries. By participating 
                  in our activities, you acknowledge and assume all risks associated with diving activities.
                </p>
              </div>

              {/* Equipment Rental & Sales */}
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
                    Equipment Rental & Sales
                  </h2>
                </div>
                
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Rental Equipment
                </h3>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li>Renters are responsible for any damage or loss of equipment</li>
                  <li>Equipment must be returned in the same condition as received</li>
                  <li>Late returns subject to additional fees</li>
                  <li>Security deposit may be required for certain items</li>
                  <li>Equipment must be used only by certified divers or under professional supervision</li>
                </ul>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Product Sales
                </h3>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li>All sales are final unless product is defective</li>
                  <li>Warranty terms vary by manufacturer</li>
                  <li>Special orders require 50% deposit and are non-refundable</li>
                  <li>Prices subject to change without notice</li>
                </ul>
              </div>

              {/* Charter Services */}
              <div style={{
                background: 'rgba(140, 218, 63, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(140, 218, 63, 0.2)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <Users size={28} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Charter Services
                  </h2>
                </div>
                
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Booking & Cancellation
                </h3>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li>Full payment required 48 hours before charter date</li>
                  <li>Cancellations made 48+ hours in advance: Full refund</li>
                  <li>Cancellations made 24-48 hours in advance: 50% refund</li>
                  <li>Cancellations made less than 24 hours: No refund</li>
                  <li>We reserve the right to cancel trips due to weather or safety conditions (full refund provided)</li>
                </ul>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Charter Rules
                </h3>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li>Arrive at least 30 minutes before departure</li>
                  <li>No alcohol consumption before or during dives</li>
                  <li>Follow all crew instructions and safety briefings</li>
                  <li>Respect marine life and environment</li>
                  <li>No illegal substances permitted</li>
                </ul>
              </div>

              {/* Payment Terms */}
              <div style={{
                background: 'rgba(255, 239, 191, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 239, 191, 0.1)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard size={28} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Payment Terms
                  </h2>
                </div>
                <ul style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  paddingLeft: '1.5rem'
                }}>
                  <li>We accept cash, credit cards, and debit cards</li>
                  <li>Prices are in USD and exclude applicable taxes</li>
                  <li>Course fees must be paid in full before certification</li>
                  <li>Group discounts available for 6+ divers</li>
                  <li>Military and first responder discounts available with valid ID</li>
                </ul>
              </div>

              {/* Liability & Indemnification */}
              <div style={{
                background: 'rgba(140, 218, 63, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(140, 218, 63, 0.2)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <Scale size={28} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Liability & Indemnification
                  </h2>
                </div>
                
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Limitation of Liability
                </h3>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  marginBottom: '1rem'
                }}>
                  To the maximum extent permitted by law, Suncoast Dive Center shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether 
                  incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                </p>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Indemnification
                </h3>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8
                }}>
                  You agree to defend, indemnify, and hold harmless Suncoast Dive Center and its officers, directors, 
                  employees, and agents from any claims, damages, obligations, losses, liabilities, costs, or debt, 
                  and expenses (including attorney's fees) arising from your use of and access to the services, 
                  your violation of these Terms, or your violation of any third-party rights.
                </p>
              </div>

              {/* General Terms */}
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
                  General Terms
                </h2>
                
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Governing Law
                </h3>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  marginBottom: '1rem'
                }}>
                  These Terms shall be governed and construed in accordance with the laws of Florida, United States, 
                  without regard to its conflict of law provisions.
                </p>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Changes to Terms
                </h3>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  marginBottom: '1rem'
                }}>
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                  we will provide at least 30 days notice prior to any new terms taking effect.
                </p>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#8cda3f',
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  Severability
                </h3>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8
                }}>
                  If any provision of these Terms is held to be unenforceable or invalid, such provision will be 
                  changed and interpreted to accomplish the objectives of such provision to the greatest extent 
                  possible under applicable law, and the remaining provisions will continue in full force and effect.
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
                  Contact Us
                </h2>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  lineHeight: 1.8,
                  marginBottom: '1.5rem'
                }}>
                  If you have any questions about these Terms of Service, please contact us:
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