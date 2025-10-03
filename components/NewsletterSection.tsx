'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, GraduationCap, CalendarCheck } from 'lucide-react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail('');
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Ocean Wave Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#1e3a5f] to-[#0a1628]" />
      
      {/* Animated Wave Pattern */}
      <div className="absolute inset-0">
        <svg 
          className="absolute bottom-0 w-full h-64 opacity-20"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
        >
          <motion.path
            d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,181.3C672,149,768,107,864,112C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="#8cda3f"
            initial={{ d: "M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,181.3C672,149,768,107,864,112C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
            animate={{ 
              d: [
                "M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,181.3C672,149,768,107,864,112C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,165.3C96,139,192,85,288,90.7C384,96,480,160,576,165.3C672,171,768,117,864,122.7C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,181.3C672,149,768,107,864,112C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: `${15 + Math.random() * 25}px`,
              height: `${15 + Math.random() * 25}px`,
              left: `${Math.random() * 100}%`,
              background: 'radial-gradient(circle, rgba(140, 218, 63, 0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(1px)',
            }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ 
              y: '-100vh',
              opacity: [0, 0.6, 0.6, 0],
              x: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, 0]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 2rem auto',
              background: 'linear-gradient(135deg, rgba(140, 218, 63, 0.2) 0%, rgba(255, 239, 191, 0.1) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(140, 218, 63, 0.3)',
              boxShadow: '0 0 40px rgba(140, 218, 63, 0.2)'
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8cda3f" strokeWidth="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.div>

          {/* Heading */}
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
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
            Dive Into Our Newsletter
          </h2>

          {/* Subheading */}
          <p style={{
            color: 'rgba(255, 239, 191, 0.7)',
            fontSize: '1.125rem',
            fontWeight: 300,
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem auto'
          }}>
            Get exclusive deals, diving tips, and be the first to know about our underwater adventures
          </p>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} style={{
            maxWidth: '500px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '4px',
              alignItems: 'stretch'
            }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  background: 'rgba(10, 22, 40, 0.8)',
                  border: '2px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '50px 0 0 50px',
                  borderRight: '2px solid rgba(255, 239, 191, 0.2)',
                  color: '#ffefbf',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(140, 218, 63, 0.5)';
                  e.target.style.borderRightColor = 'rgba(140, 218, 63, 0.5)';
                  e.target.style.background = 'rgba(10, 22, 40, 0.9)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 239, 191, 0.2)';
                  e.target.style.borderRightColor = 'rgba(255, 239, 191, 0.2)';
                  e.target.style.background = 'rgba(10, 22, 40, 0.8)';
                }}
              />
              
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                style={{
                  padding: '1rem 2rem',
                  background: isSubmitted 
                    ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                    : 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)',
                  color: '#0a1628',
                  border: 'none',
                  borderRadius: '0 50px 50px 0',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(140, 218, 63, 0.3)',
                  minWidth: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && !isSubmitted) {
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
                      style={{ width: '16px', height: '16px', border: '2px solid #0a1628', borderTop: '2px solid transparent', borderRadius: '50%' }}
                    />
                    Subscribing...
                  </>
                ) : isSubmitted ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Success!
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          </form>

          {/* Privacy Note */}
          <p style={{
            marginTop: '1.5rem',
            fontSize: '0.875rem',
            color: 'rgba(255, 239, 191, 0.4)'
          }}>
            We respect your privacy. Unsubscribe at any time.
          </p>

          {/* Benefits */}
          <div className="grid sm:grid-cols-3 gap-4 mt-12">
            {[
              { Icon: Target, title: 'Exclusive Deals', desc: 'Member discounts' },
              { Icon: GraduationCap, title: 'Expert Tips', desc: 'Pro advice' },
              { Icon: CalendarCheck, title: 'Event Updates', desc: 'First to know' }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  padding: '1.5rem',
                  background: 'rgba(255, 239, 191, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 239, 191, 0.1)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
              >
                <benefit.Icon size={29} color="#8cda3f" strokeWidth={2} style={{ flexShrink: 0 }} />
                <div style={{ textAlign: 'left', flexShrink: 0 }}>
                  <h3 style={{
                    color: '#ffefbf',
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                    lineHeight: 1.2,
                    textAlign: 'left'
                  }}>
                    {benefit.title}
                  </h3>
                  <p style={{
                    color: 'rgba(255, 239, 191, 0.5)',
                    fontSize: '0.875rem',
                    lineHeight: 1.2,
                    textAlign: 'left'
                  }}>
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;