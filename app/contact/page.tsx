'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
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
              Contact Us
            </h1>
            <p style={{
              color: 'rgba(255, 239, 191, 0.7)',
              fontSize: '1.25rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Ready to dive in? Get in touch with our team for all your diving needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{
                background: 'rgba(255, 239, 191, 0.05)',
                borderRadius: '20px',
                padding: '2.5rem',
                border: '1px solid rgba(255, 239, 191, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare size={32} color="#8cda3f" />
                  <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Send Us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label style={{
                        display: 'block',
                        color: 'rgba(255, 239, 191, 0.8)',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(10, 22, 40, 0.5)',
                          border: '1px solid rgba(255, 239, 191, 0.2)',
                          borderRadius: '8px',
                          color: '#ffefbf',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#8cda3f';
                          e.target.style.background = 'rgba(10, 22, 40, 0.8)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 239, 191, 0.2)';
                          e.target.style.background = 'rgba(10, 22, 40, 0.5)';
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        color: 'rgba(255, 239, 191, 0.8)',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(10, 22, 40, 0.5)',
                          border: '1px solid rgba(255, 239, 191, 0.2)',
                          borderRadius: '8px',
                          color: '#ffefbf',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#8cda3f';
                          e.target.style.background = 'rgba(10, 22, 40, 0.8)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 239, 191, 0.2)';
                          e.target.style.background = 'rgba(10, 22, 40, 0.5)';
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label style={{
                        display: 'block',
                        color: 'rgba(255, 239, 191, 0.8)',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(10, 22, 40, 0.5)',
                          border: '1px solid rgba(255, 239, 191, 0.2)',
                          borderRadius: '8px',
                          color: '#ffefbf',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#8cda3f';
                          e.target.style.background = 'rgba(10, 22, 40, 0.8)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 239, 191, 0.2)';
                          e.target.style.background = 'rgba(10, 22, 40, 0.5)';
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        color: 'rgba(255, 239, 191, 0.8)',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(10, 22, 40, 0.5)',
                          border: '1px solid rgba(255, 239, 191, 0.2)',
                          borderRadius: '8px',
                          color: '#ffefbf',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#8cda3f';
                          e.target.style.background = 'rgba(10, 22, 40, 0.8)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 239, 191, 0.2)';
                          e.target.style.background = 'rgba(10, 22, 40, 0.5)';
                        }}
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="courses">Dive Courses</option>
                        <option value="charters">Charter Bookings</option>
                        <option value="equipment">Equipment & Service</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: 'rgba(255, 239, 191, 0.8)',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(10, 22, 40, 0.5)',
                        border: '1px solid rgba(255, 239, 191, 0.2)',
                        borderRadius: '8px',
                        color: '#ffefbf',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        resize: 'vertical'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#8cda3f';
                        e.target.style.background = 'rgba(10, 22, 40, 0.8)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 239, 191, 0.2)';
                        e.target.style.background = 'rgba(10, 22, 40, 0.5)';
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: submitStatus === 'success' 
                        ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                        : 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)',
                      color: '#0a1628',
                      borderRadius: '50px',
                      border: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: isSubmitting ? 'wait' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(140, 218, 63, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 30px rgba(140, 218, 63, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(140, 218, 63, 0.3)';
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{ width: '20px', height: '20px', border: '2px solid #0a1628', borderTop: '2px solid transparent', borderRadius: '50%' }}
                        />
                        Sending...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Map Placeholder */}
              <div style={{
                background: 'rgba(255, 239, 191, 0.05)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(255, 239, 191, 0.1)',
                marginTop: '2rem',
                height: '287px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div className="text-center">
                  <MapPin size={48} color="#8cda3f" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: 'rgba(255, 239, 191, 0.6)' }}>
                    Interactive map coming soon
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Direct Contact */}
              <div style={{
                background: 'rgba(140, 218, 63, 0.05)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(140, 218, 63, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#ffefbf',
                  marginBottom: '1.5rem'
                }}>
                  Get In Touch
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin size={24} color="#8cda3f" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <p style={{ color: '#ffefbf', fontWeight: 600, marginBottom: '0.25rem' }}>Visit Our Shop</p>
                      <p style={{ color: 'rgba(255, 239, 191, 0.6)' }}>
                        5304 Seminole Blvd<br />
                        St. Petersburg, FL 33708
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone size={24} color="#8cda3f" style={{ flexShrink: 0 }} />
                    <div>
                      <p style={{ color: '#ffefbf', fontWeight: 600, marginBottom: '0.25rem' }}>Call Us</p>
                      <a 
                        href="tel:+17273200201"
                        style={{ 
                          color: 'rgba(255, 239, 191, 0.6)',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)'}
                      >
                        (727) 320-0201
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Mail size={24} color="#8cda3f" style={{ flexShrink: 0 }} />
                    <div>
                      <p style={{ color: '#ffefbf', fontWeight: 600, marginBottom: '0.25rem' }}>Email Us</p>
                      <a 
                        href="mailto:suncoastdivecenter@yahoo.com"
                        style={{ 
                          color: 'rgba(255, 239, 191, 0.6)',
                          transition: 'color 0.3s ease',
                          wordBreak: 'break-word'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#8cda3f'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)'}
                      >
                        suncoastdivecenter@yahoo.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours of Operation */}
              <div style={{
                background: 'rgba(255, 239, 191, 0.05)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(255, 239, 191, 0.1)'
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <Clock size={28} color="#8cda3f" />
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#ffefbf'
                  }}>
                    Store Hours
                  </h3>
                </div>

                <div className="space-y-2">
                  {[
                    { day: 'Sunday', hours: 'Closed', isOpen: false },
                    { day: 'Monday', hours: '9:00 AM - 6:00 PM', isOpen: true },
                    { day: 'Tuesday', hours: 'Closed', isOpen: false },
                    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM', isOpen: true },
                    { day: 'Thursday', hours: '9:00 AM - 6:00 PM', isOpen: true },
                    { day: 'Friday', hours: '9:00 AM - 6:00 PM', isOpen: true },
                    { day: 'Saturday', hours: '9:00 AM - 4:00 PM', isOpen: true }
                  ].map((schedule) => (
                    <div 
                      key={schedule.day}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        background: schedule.isOpen ? 'rgba(140, 218, 63, 0.05)' : 'transparent',
                        borderRadius: '8px',
                        transition: 'background 0.3s ease'
                      }}
                    >
                      <span style={{ 
                        color: '#ffefbf',
                        fontWeight: 500
                      }}>
                        {schedule.day}
                      </span>
                      <span style={{ 
                        color: schedule.isOpen ? '#8cda3f' : 'rgba(255, 239, 191, 0.4)',
                        fontWeight: schedule.isOpen ? 600 : 400
                      }}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(140, 218, 63, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(140, 218, 63, 0.2)'
                }}>
                  <p style={{
                    color: '#8cda3f',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    margin: 0
                  }}>
                    Walk-ins welcome! For chartered dives, please call ahead.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
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
              Ready to Dive In?
            </h2>
            <p style={{
              color: 'rgba(255, 239, 191, 0.7)',
              fontSize: '1.25rem',
              marginBottom: '2rem'
            }}>
              Visit our shop or give us a call to start your diving adventure today
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="tel:+17273200201"
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
                <Phone size={20} />
                Call Now
              </a>
              <a
                href="https://maps.google.com/?q=5304+Seminole+Blvd+St+Petersburg+FL+33708"
                target="_blank"
                rel="noopener noreferrer"
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
                <MapPin size={20} />
                Directions
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;