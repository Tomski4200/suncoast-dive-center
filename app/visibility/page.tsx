'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, TrendingUp, TrendingDown, Minus, Wind, Waves, 
  Sun, Cloud, CloudRain, Thermometer, Droplets, Navigation as NavigationIcon,
  Calendar, Clock, MapPin, AlertCircle, Camera, Fish
} from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function VisibilityPage() {
  const [selectedSite, setSelectedSite] = useState('all');
  const [timeRange, setTimeRange] = useState('today');

  // Mock data for current conditions
  const currentConditions = {
    visibility: 65,
    trend: 'improving',
    waterTemp: 76,
    airTemp: 82,
    windSpeed: 8,
    windDirection: 'SE',
    swells: '2-3ft',
    current: 'Mild',
    lastUpdated: '10 minutes ago'
  };

  // Mock dive sites data
  const diveSites = [
    {
      id: 1,
      name: 'Sheridan Wreck',
      depth: '75ft',
      visibility: 70,
      temp: 76,
      current: 'Mild',
      trend: 'stable',
      conditions: 'excellent',
      marineLIfe: ['Goliath Grouper', 'Barracuda', 'Reef Sharks'],
      lastReport: '2 hours ago',
      reports: 12
    },
    {
      id: 2,
      name: 'USS Narcissus',
      depth: '85ft',
      visibility: 60,
      temp: 75,
      current: 'Moderate',
      trend: 'improving',
      conditions: 'good',
      marineLIfe: ['Bull Sharks', 'Amberjack', 'Snapper'],
      lastReport: '4 hours ago',
      reports: 8
    },
    {
      id: 3,
      name: 'Blackthorn Memorial',
      depth: '80ft',
      visibility: 55,
      temp: 75,
      current: 'Strong',
      trend: 'declining',
      conditions: 'fair',
      marineLIfe: ['Jewfish', 'Permit', 'Cobia'],
      lastReport: '1 hour ago',
      reports: 15
    },
    {
      id: 4,
      name: 'Artificial Reef #7',
      depth: '45ft',
      visibility: 75,
      temp: 77,
      current: 'None',
      trend: 'stable',
      conditions: 'excellent',
      marineLIfe: ['Sea Turtles', 'Rays', 'Tropical Fish'],
      lastReport: '30 minutes ago',
      reports: 20
    },
    {
      id: 5,
      name: 'The Ledges',
      depth: '60ft',
      visibility: 65,
      temp: 76,
      current: 'Mild',
      trend: 'improving',
      conditions: 'good',
      marineLIfe: ['Hogfish', 'Grouper', 'Moray Eels'],
      lastReport: '3 hours ago',
      reports: 10
    },
    {
      id: 6,
      name: 'Egmont Key',
      depth: '35ft',
      visibility: 80,
      temp: 78,
      current: 'Mild',
      trend: 'stable',
      conditions: 'excellent',
      marineLIfe: ['Manatees', 'Stingrays', 'Tarpon'],
      lastReport: '45 minutes ago',
      reports: 18
    }
  ];

  // Mock forecast data
  const forecast = [
    { day: 'Tomorrow', visibility: 70, conditions: 'excellent', icon: Sun },
    { day: 'Thursday', visibility: 65, conditions: 'good', icon: Cloud },
    { day: 'Friday', visibility: 50, conditions: 'fair', icon: CloudRain },
    { day: 'Saturday', visibility: 75, conditions: 'excellent', icon: Sun },
    { day: 'Sunday', visibility: 80, conditions: 'excellent', icon: Sun }
  ];

  // Mock recent reports
  const recentReports = [
    { diver: 'Chad C.', site: 'Sheridan Wreck', time: '10 min ago', visibility: 70, comment: 'Crystal clear! Saw 3 goliath groupers.' },
    { diver: 'Sarah M.', site: 'USS Narcissus', time: '2 hours ago', visibility: 60, comment: 'Good vis, moderate current at depth.' },
    { diver: 'Mike R.', site: 'Artificial Reef #7', time: '3 hours ago', visibility: 75, comment: 'Perfect conditions, lots of marine life!' },
    { diver: 'Lisa T.', site: 'The Ledges', time: '4 hours ago', visibility: 65, comment: 'Improving throughout the day.' },
    { diver: 'John D.', site: 'Blackthorn', time: '5 hours ago', visibility: 55, comment: 'Strong current, vis dropping.' }
  ];

  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'excellent': return '#4ade80';
      case 'good': return '#8cda3f';
      case 'fair': return '#fbbf24';
      case 'poor': return '#f87171';
      default: return '#8cda3f';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'improving': return TrendingUp;
      case 'declining': return TrendingDown;
      default: return Minus;
    }
  };

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#0a1628' }}>
        <Navigation />
        
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          paddingTop: '100px',
          paddingBottom: '40px',
          background: 'linear-gradient(180deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)',
          overflow: 'hidden'
        }}>
          {/* Animated Background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            background: `radial-gradient(circle at 20% 50%, rgba(140, 218, 63, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 50%, rgba(255, 239, 191, 0.2) 0%, transparent 50%)`
          }} />
          
          <div className="max-w-7xl mx-auto px-4" style={{ position: 'relative' }}>
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
                Dive Conditions
              </h1>
              <p style={{
                color: 'rgba(255, 239, 191, 0.7)',
                fontSize: '1.25rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Real-time visibility reports from local dive sites
              </p>
            </motion.div>
          </div>
        </section>

        {/* Current Conditions Overview */}
        <section className="py-8 px-4" style={{ background: 'rgba(30, 58, 95, 0.2)' }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'linear-gradient(135deg, rgba(140, 218, 63, 0.1) 0%, rgba(255, 239, 191, 0.05) 100%)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(140, 218, 63, 0.3)'
              }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Main Visibility */}
                <div style={{ gridColumn: 'span 2' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: '#ffefbf',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Eye size={28} color="#8cda3f" />
                        Area Overview
                      </h2>
                      <p style={{
                        color: 'rgba(255, 239, 191, 0.5)',
                        fontSize: '0.75rem',
                        marginTop: '0.25rem',
                        marginLeft: '2.25rem'
                      }}>
                        Gulf of Mexico • St. Petersburg Region
                      </p>
                    </div>
                    <span style={{
                      color: 'rgba(255, 239, 191, 0.5)',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Clock size={14} />
                      {currentConditions.lastUpdated}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div>
                      <div style={{
                        fontSize: '4rem',
                        fontWeight: 700,
                        color: '#8cda3f',
                        lineHeight: 1
                      }}>
                        {currentConditions.visibility}
                        <span style={{ fontSize: '2rem', color: 'rgba(140, 218, 63, 0.7)' }}>ft</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.5rem',
                        color: currentConditions.trend === 'improving' ? '#4ade80' : '#fbbf24'
                      }}>
                        {React.createElement(getTrendIcon(currentConditions.trend), { size: 20 })}
                        <span style={{ textTransform: 'capitalize' }}>{currentConditions.trend}</span>
                      </div>
                      <p style={{
                        color: 'rgba(255, 239, 191, 0.4)',
                        fontSize: '0.75rem',
                        marginTop: '0.5rem'
                      }}>
                        Average of 5 sites
                      </p>
                    </div>
                    
                    {/* Visibility Gauge */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        height: '20px',
                        background: 'rgba(10, 22, 40, 0.5)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${currentConditions.visibility}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #f87171 0%, #fbbf24 33%, #8cda3f 66%, #4ade80 100%)',
                            borderRadius: '10px'
                          }}
                        />
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '0.5rem',
                        fontSize: '0.75rem',
                        color: 'rgba(255, 239, 191, 0.5)'
                      }}>
                        <span>Poor</span>
                        <span>Fair</span>
                        <span>Good</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weather Conditions */}
                <div>
                  <h3 style={{ color: '#ffefbf', fontSize: '1rem', marginBottom: '1rem' }}>Weather</h3>
                  <div className="space-y-3">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Thermometer size={20} color="#8cda3f" />
                      <span style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.875rem' }}>
                        Air: {currentConditions.airTemp}°F
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Droplets size={20} color="#8cda3f" />
                      <span style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.875rem' }}>
                        Water: {currentConditions.waterTemp}°F
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Wind size={20} color="#8cda3f" />
                      <span style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.875rem' }}>
                        {currentConditions.windSpeed} mph {currentConditions.windDirection}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sea Conditions */}
                <div>
                  <h3 style={{ color: '#ffefbf', fontSize: '1rem', marginBottom: '1rem' }}>Sea State</h3>
                  <div className="space-y-3">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Waves size={20} color="#8cda3f" />
                      <span style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.875rem' }}>
                        Swells: {currentConditions.swells}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <NavigationIcon size={20} color="#8cda3f" />
                      <span style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.875rem' }}>
                        Current: {currentConditions.current}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <AlertCircle size={20} color="#4ade80" />
                      <span style={{ color: '#4ade80', fontSize: '0.875rem', fontWeight: 600 }}>
                        Safe to Dive
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Site Filters */}
        <section className="py-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => setSelectedSite('all')}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: selectedSite === 'all' ? 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)' : 'transparent',
                  color: selectedSite === 'all' ? '#0a1628' : '#ffefbf',
                  border: `1px solid ${selectedSite === 'all' ? '#8cda3f' : 'rgba(255, 239, 191, 0.3)'}`,
                  borderRadius: '50px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                All Sites
              </button>
              <button
                onClick={() => setSelectedSite('shallow')}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: selectedSite === 'shallow' ? 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)' : 'transparent',
                  color: selectedSite === 'shallow' ? '#0a1628' : '#ffefbf',
                  border: `1px solid ${selectedSite === 'shallow' ? '#8cda3f' : 'rgba(255, 239, 191, 0.3)'}`,
                  borderRadius: '50px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Shallow (&lt;60ft)
              </button>
              <button
                onClick={() => setSelectedSite('deep')}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: selectedSite === 'deep' ? 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)' : 'transparent',
                  color: selectedSite === 'deep' ? '#0a1628' : '#ffefbf',
                  border: `1px solid ${selectedSite === 'deep' ? '#8cda3f' : 'rgba(255, 239, 191, 0.3)'}`,
                  borderRadius: '50px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Deep (&gt;60ft)
              </button>
              <button
                onClick={() => setSelectedSite('wrecks')}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: selectedSite === 'wrecks' ? 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)' : 'transparent',
                  color: selectedSite === 'wrecks' ? '#0a1628' : '#ffefbf',
                  border: `1px solid ${selectedSite === 'wrecks' ? '#8cda3f' : 'rgba(255, 239, 191, 0.3)'}`,
                  borderRadius: '50px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Wrecks
              </button>
            </div>
          </div>
        </section>

        {/* Interactive Map Placeholder */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.3) 0%, rgba(140, 218, 63, 0.05) 100%)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(140, 218, 63, 0.2)',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Map Grid Background Pattern */}
              <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.1,
                backgroundImage: `
                  linear-gradient(rgba(140, 218, 63, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(140, 218, 63, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }} />
              
              {/* Animated Pins */}
              {[
                { x: '20%', y: '30%', delay: 0 },
                { x: '45%', y: '45%', delay: 0.2 },
                { x: '70%', y: '25%', delay: 0.4 },
                { x: '30%', y: '60%', delay: 0.6 },
                { x: '60%', y: '70%', delay: 0.8 },
                { x: '80%', y: '50%', delay: 1 }
              ].map((pin, index) => (
                <motion.div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: pin.x,
                    top: pin.y,
                    transform: 'translate(-50%, -100%)'
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pin.delay, duration: 0.5 }}
                >
                  <MapPin size={24} color="#8cda3f" fill="#8cda3f" />
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#4ade80',
                      boxShadow: '0 0 10px rgba(74, 222, 128, 0.8)'
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: pin.delay
                    }}
                  />
                </motion.div>
              ))}

              {/* Central Content */}
              <div style={{
                textAlign: 'center',
                zIndex: 10,
                background: 'rgba(10, 22, 40, 0.8)',
                padding: '2rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(140, 218, 63, 0.3)'
              }}>
                <MapPin size={48} color="#8cda3f" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{
                  fontSize: '1.75rem',
                  color: '#ffefbf',
                  marginBottom: '1rem',
                  fontWeight: 600
                }}>
                  Interactive Dive Map
                </h3>
                <p style={{
                  color: 'rgba(255, 239, 191, 0.7)',
                  marginBottom: '1.5rem',
                  maxWidth: '500px',
                  lineHeight: 1.6
                }}>
                  <strong style={{ color: '#8cda3f' }}>Coming Soon:</strong> Explore real-time visibility reports 
                  on an interactive map. Click any dive site marker to see detailed conditions, 
                  recent diver reports, and marine life sightings. Filter by depth, visibility, 
                  or site type to find your perfect dive spot.
                </p>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(140, 218, 63, 0.1)',
                    borderRadius: '20px',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    color: '#8cda3f',
                    fontSize: '0.875rem'
                  }}>
                    📍 Live GPS Tracking
                  </span>
                  <span style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 239, 191, 0.1)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 239, 191, 0.3)',
                    color: '#ffefbf',
                    fontSize: '0.875rem'
                  }}>
                    🎯 Site Details
                  </span>
                  <span style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(74, 222, 128, 0.1)',
                    borderRadius: '20px',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    color: '#4ade80',
                    fontSize: '0.875rem'
                  }}>
                    📊 Live Reports
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dive Sites Grid */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 600,
              color: '#ffefbf',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Site Conditions
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diveSites.map((site) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: 'rgba(255, 239, 191, 0.05)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 239, 191, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
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
                  {/* Site Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        color: '#ffefbf',
                        marginBottom: '0.25rem'
                      }}>
                        {site.name}
                      </h3>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        color: 'rgba(255, 239, 191, 0.5)'
                      }}>
                        <span>Depth: {site.depth}</span>
                        <span>•</span>
                        <span>{site.lastReport}</span>
                      </div>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: `${getConditionColor(site.conditions)}22`,
                      color: getConditionColor(site.conditions),
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {site.conditions}
                    </span>
                  </div>

                  {/* Visibility Bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.875rem' }}>
                        Visibility
                      </span>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ color: '#8cda3f', fontWeight: 600 }}>{site.visibility}ft</span>
                        {React.createElement(getTrendIcon(site.trend), { 
                          size: 16, 
                          color: site.trend === 'improving' ? '#4ade80' : site.trend === 'declining' ? '#f87171' : '#fbbf24'
                        })}
                      </div>
                    </div>
                    <div style={{
                      height: '8px',
                      background: 'rgba(10, 22, 40, 0.5)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${site.visibility}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #8cda3f 0%, #4ade80 100%)',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>

                  {/* Site Details */}
                  <div className="grid grid-cols-3 gap-2 mb-1rem">
                    <div>
                      <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.75rem' }}>Temp</p>
                      <p style={{ color: '#ffefbf', fontWeight: 600 }}>{site.temp}°F</p>
                    </div>
                    <div>
                      <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.75rem' }}>Current</p>
                      <p style={{ color: '#ffefbf', fontWeight: 600 }}>{site.current}</p>
                    </div>
                    <div>
                      <p style={{ color: 'rgba(255, 239, 191, 0.5)', fontSize: '0.75rem' }}>Reports</p>
                      <p style={{ color: '#ffefbf', fontWeight: 600 }}>{site.reports}</p>
                    </div>
                  </div>

                  {/* Marine Life */}
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 239, 191, 0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <Fish size={16} color="#8cda3f" />
                      <span style={{ color: 'rgba(255, 239, 191, 0.7)', fontSize: '0.875rem' }}>
                        Recent Sightings
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.25rem'
                    }}>
                      {site.marineLIfe.map((species) => (
                        <span
                          key={species}
                          style={{
                            padding: '0.125rem 0.5rem',
                            background: 'rgba(140, 218, 63, 0.1)',
                            color: '#8cda3f',
                            borderRadius: '12px',
                            fontSize: '0.75rem'
                          }}
                        >
                          {species}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Forecast Section */}
        <section className="py-8 px-4" style={{ background: 'rgba(30, 58, 95, 0.2)' }}>
          <div className="max-w-7xl mx-auto">
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 600,
              color: '#ffefbf',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              5-Day Forecast
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
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
                  <p style={{
                    color: 'rgba(255, 239, 191, 0.7)',
                    fontSize: '0.875rem',
                    marginBottom: '1rem'
                  }}>
                    {day.day}
                  </p>
                  <day.icon size={32} color="#8cda3f" style={{ margin: '0 auto 1rem' }} />
                  <p style={{
                    color: '#ffefbf',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem'
                  }}>
                    {day.visibility}ft
                  </p>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: `${getConditionColor(day.conditions)}22`,
                    color: getConditionColor(day.conditions),
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {day.conditions}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Diver Reports */}
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#ffefbf',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Camera size={24} color="#8cda3f" />
                  Recent Reports
                </h2>
                
                <div className="space-y-4">
                  {recentReports.map((report, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      style={{
                        background: 'rgba(255, 239, 191, 0.05)',
                        borderRadius: '12px',
                        padding: '1rem',
                        border: '1px solid rgba(255, 239, 191, 0.1)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem'
                      }}>
                        <div>
                          <span style={{
                            color: '#8cda3f',
                            fontWeight: 600,
                            marginRight: '0.5rem'
                          }}>
                            {report.diver}
                          </span>
                          <span style={{
                            color: 'rgba(255, 239, 191, 0.5)',
                            fontSize: '0.875rem'
                          }}>
                            @ {report.site}
                          </span>
                        </div>
                        <span style={{
                          color: 'rgba(255, 239, 191, 0.5)',
                          fontSize: '0.75rem'
                        }}>
                          {report.time}
                        </span>
                      </div>
                      <p style={{
                        color: 'rgba(255, 239, 191, 0.7)',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem'
                      }}>
                        {report.comment}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Eye size={14} color="#8cda3f" />
                        <span style={{
                          color: '#8cda3f',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}>
                          {report.visibility}ft visibility
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Submit Report CTA */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(140, 218, 63, 0.1) 0%, rgba(255, 239, 191, 0.05) 100%)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Eye size={48} color="#8cda3f" style={{ margin: '0 auto 1.5rem' }} />
                  <h3 style={{
                    fontSize: '1.5rem',
                    color: '#ffefbf',
                    marginBottom: '1rem'
                  }}>
                    Share Your Report
                  </h3>
                  <p style={{
                    color: 'rgba(255, 239, 191, 0.7)',
                    marginBottom: '1.5rem',
                    lineHeight: 1.6
                  }}>
                    Just back from a dive? Help the community by sharing current conditions.
                    Your reports help other divers plan their adventures!
                  </p>
                  <button
                    style={{
                      padding: '1rem 2rem',
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
                      boxShadow: '0 4px 20px rgba(140, 218, 63, 0.3)',
                      margin: '0 auto',
                      display: 'inline-block'
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
                    Submit Report
                  </button>
                  
                  <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'rgba(10, 22, 40, 0.5)',
                    borderRadius: '12px'
                  }}>
                    <p style={{
                      color: 'rgba(255, 239, 191, 0.6)',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}>
                      📱 Download our mobile app for instant reporting
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center'
                    }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(255, 239, 191, 0.1)',
                        borderRadius: '20px',
                        color: 'rgba(255, 239, 191, 0.5)',
                        fontSize: '0.75rem'
                      }}>
                        iOS Coming Soon
                      </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(255, 239, 191, 0.1)',
                        borderRadius: '20px',
                        color: 'rgba(255, 239, 191, 0.5)',
                        fontSize: '0.75rem'
                      }}>
                        Android Coming Soon
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}