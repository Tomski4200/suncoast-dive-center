'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DiveCondition {
  location: string;
  visibility: number;
  waterTemp: number;
  currentStrength: 'None' | 'Light' | 'Moderate' | 'Strong';
  lastUpdated: string;
  conditions: string;
}

const VisibilityWidget: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [conditions, setConditions] = useState<DiveCondition[]>([
    {
      location: 'Crystal River',
      visibility: 85,
      waterTemp: 72,
      currentStrength: 'Light',
      lastUpdated: '2 hours ago',
      conditions: 'Excellent'
    },
    {
      location: 'Hudson Beach',
      visibility: 65,
      waterTemp: 74,
      currentStrength: 'Moderate',
      lastUpdated: '1 hour ago',
      conditions: 'Good'
    },
    {
      location: 'Anclote Key',
      visibility: 70,
      waterTemp: 73,
      currentStrength: 'Light',
      lastUpdated: '3 hours ago',
      conditions: 'Good'
    },
    {
      location: 'Tarpon Springs',
      visibility: 60,
      waterTemp: 75,
      currentStrength: 'None',
      lastUpdated: '30 minutes ago',
      conditions: 'Fair'
    }
  ]);

  const getVisibilityColor = (visibility: number) => {
    if (visibility >= 80) return '#8cda3f';
    if (visibility >= 60) return '#ffefbf';
    return '#ff6b6b';
  };

  const getCurrentIcon = (strength: string) => {
    switch(strength) {
      case 'None':
        return '○';
      case 'Light':
        return '◐';
      case 'Moderate':
        return '◑';
      case 'Strong':
        return '●';
      default:
        return '○';
    }
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#1e3a5f] to-[#0a1628]" />
      
      {/* Animated Bubbles Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ 
              y: '-100vh',
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontFamily: 'Anton, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            background: 'linear-gradient(to right, #ffefbf 0%, #92856a 50%, #ffefbf 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            filter: 'drop-shadow(0 0 30px rgba(255, 239, 191, 0.3))'
          }}>
            Current Dive Conditions
          </h2>
          <p style={{
            color: 'rgba(255, 239, 191, 0.7)',
            fontSize: '1.125rem',
            fontWeight: 300
          }}>
            Real-time visibility and water conditions at popular dive sites
          </p>
        </motion.div>

        {/* Location Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {conditions.map((condition, index) => (
            <button
              key={index}
              onClick={() => setSelectedLocation(index)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                border: selectedLocation === index 
                  ? '2px solid #8cda3f' 
                  : '2px solid rgba(255, 239, 191, 0.2)',
                background: selectedLocation === index
                  ? 'rgba(140, 218, 63, 0.1)'
                  : 'rgba(10, 22, 40, 0.5)',
                color: selectedLocation === index
                  ? '#8cda3f'
                  : 'rgba(255, 239, 191, 0.6)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                if (selectedLocation !== index) {
                  e.currentTarget.style.borderColor = 'rgba(140, 218, 63, 0.5)';
                  e.currentTarget.style.color = 'rgba(255, 239, 191, 0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLocation !== index) {
                  e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.2)';
                  e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)';
                }
              }}
            >
              {condition.location}
            </button>
          ))}
        </motion.div>

        {/* Condition Display */}
        <motion.div
          key={selectedLocation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'rgba(10, 22, 40, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 239, 191, 0.1)',
            padding: '2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Side - Visibility Gauge */}
            <div className="flex flex-col items-center justify-center">
              <div style={{
                position: 'relative',
                width: '200px',
                height: '200px',
                margin: '0 auto'
              }}>
                {/* Circular Progress */}
                <svg
                  width="200"
                  height="200"
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  {/* Background Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke="rgba(255, 239, 191, 0.1)"
                    strokeWidth="20"
                    fill="none"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke={getVisibilityColor(conditions[selectedLocation].visibility)}
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${(conditions[selectedLocation].visibility / 100) * 565.48} 565.48`}
                    strokeLinecap="round"
                    style={{
                      filter: `drop-shadow(0 0 20px ${getVisibilityColor(conditions[selectedLocation].visibility)})`,
                      transition: 'all 0.5s ease'
                    }}
                  />
                </svg>
                
                {/* Center Text */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: getVisibilityColor(conditions[selectedLocation].visibility),
                    lineHeight: 1,
                    filter: `drop-shadow(0 0 10px ${getVisibilityColor(conditions[selectedLocation].visibility)})`
                  }}>
                    {conditions[selectedLocation].visibility}%
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 239, 191, 0.6)',
                    marginTop: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    Visibility
                  </div>
                </div>
              </div>
              
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: getVisibilityColor(conditions[selectedLocation].visibility),
                marginTop: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {conditions[selectedLocation].conditions}
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="space-y-4">
              {/* Water Temperature */}
              <div style={{
                background: 'rgba(255, 239, 191, 0.05)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(255, 239, 191, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    color: 'rgba(255, 239, 191, 0.6)',
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Water Temperature
                  </span>
                  <span style={{
                    color: '#ffefbf',
                    fontSize: '1.5rem',
                    fontWeight: 600
                  }}>
                    {conditions[selectedLocation].waterTemp}°F
                  </span>
                </div>
              </div>

              {/* Current Strength */}
              <div style={{
                background: 'rgba(255, 239, 191, 0.05)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(255, 239, 191, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    color: 'rgba(255, 239, 191, 0.6)',
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Current
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '1.5rem',
                      color: '#8cda3f'
                    }}>
                      {getCurrentIcon(conditions[selectedLocation].currentStrength)}
                    </span>
                    <span style={{
                      color: '#ffefbf',
                      fontSize: '1.125rem',
                      fontWeight: 500
                    }}>
                      {conditions[selectedLocation].currentStrength}
                    </span>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(140, 218, 63, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(140, 218, 63, 0.2)'
              }}>
                <div style={{
                  color: 'rgba(255, 239, 191, 0.5)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.25rem'
                }}>
                  Last Updated
                </div>
                <div style={{
                  color: '#8cda3f',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  {conditions[selectedLocation].lastUpdated}
                </div>
              </div>

              {/* CTA Button */}
              <button
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)',
                  color: '#0a1628',
                  borderRadius: '50px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
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
                View Full Report
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VisibilityWidget;