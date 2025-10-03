'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';

const HeroVideoSimple: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize bubble particles
  const [particles, setParticles] = useState<Array<{
    id: number, 
    x: number, 
    y: number, 
    size: number,
    duration: number, 
    delay: number,
    cluster: number,
    offsetX: number,
    waveAmplitude: number,
    driftAngle: number
  }>>([]);
  
  useEffect(() => {
    const particleArray = [];
    const clusterCount = 8; // Number of bubble clusters/strings
    const bubblesPerCluster = 8; // Bubbles in each cluster
    
    let id = 0;
    for (let c = 0; c < clusterCount; c++) {
      const clusterX = 10 + Math.random() * 80; // Cluster base X position
      
      for (let b = 0; b < bubblesPerCluster; b++) {
        // Size distribution: 70% tiny, 20% small, 10% medium
        let size;
        const sizeRand = Math.random();
        if (sizeRand < 0.7) {
          size = 8 + Math.random() * 12; // Tiny bubbles (8-20px)
        } else if (sizeRand < 0.9) {
          size = 20 + Math.random() * 15; // Small bubbles (20-35px)
        } else {
          size = 35 + Math.random() * 25; // Medium bubbles (35-60px)
        }
        
        particleArray.push({
          id: id++,
          x: clusterX,
          y: 110 + Math.random() * 30, // Start below viewport
          size: size,
          duration: 10 + Math.random() * 8, // Vary speed
          delay: b * 0.3 + Math.random() * 2, // Stagger within cluster
          cluster: c,
          offsetX: -15 + Math.random() * 30, // Random horizontal offset within cluster
          waveAmplitude: 8 + Math.random() * 12, // How much to wave side to side (8-20px)
          driftAngle: 25 + Math.random() * 20 // Angle of drift (25-45 degrees from vertical)
        });
      }
    }
    
    // Add some solo bubbles
    for (let i = 0; i < 15; i++) {
      let size;
      const sizeRand = Math.random();
      if (sizeRand < 0.8) {
        size = 6 + Math.random() * 10; // Mostly tiny
      } else {
        size = 16 + Math.random() * 20; // Some larger
      }
      
      particleArray.push({
        id: id++,
        x: Math.random() * 100,
        y: 110 + Math.random() * 50,
        size: size,
        duration: 12 + Math.random() * 10,
        delay: Math.random() * 8,
        cluster: -1, // Not part of a cluster
        offsetX: 0,
        waveAmplitude: 10 + Math.random() * 15, // Slightly more wave for solo bubbles
        driftAngle: 20 + Math.random() * 25 // 20-45 degrees
      });
    }
    
    setParticles(particleArray);
  }, []);

  return (
    <div className="hero-video-container" ref={containerRef} style={{ 
      position: 'relative', 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Background Video */}
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0
        }}
      >
        <source src="/vidshort.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Water Effect Overlay - CSS animated waves */}
      <div className="water-effect" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        opacity: 0.3,
        background: `
          radial-gradient(ellipse at top, transparent 0%, rgba(0, 100, 200, 0.1) 100%),
          radial-gradient(ellipse at bottom, rgba(0, 50, 150, 0.1) 0%, transparent 100%)
        `,
        animation: 'waterWave 8s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      {/* Rising Bubble Particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            style={{
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="bubble${particle.id}"><stop offset="0%" stop-color="rgba(255,255,255,0.4)"/><stop offset="30%" stop-color="rgba(255,255,255,0.2)"/><stop offset="60%" stop-color="rgba(200,230,255,0.1)"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><circle cx="50" cy="50" r="46" fill="url(%23bubble${particle.id})" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><ellipse cx="35" cy="30" rx="${10 * (particle.size / 60)}" ry="${6 * (particle.size / 60)}" fill="rgba(255,255,255,0.5)" transform="rotate(-25 35 30)"/></svg>')`,
              backgroundSize: '100% 100%',
              mixBlendMode: 'screen',
              opacity: particle.size < 20 ? 0.5 : 0.7, // Smaller bubbles are more transparent
            }}
            initial={{
              x: `calc(${particle.x}vw + ${particle.offsetX}px)`,
              y: `${particle.y}vh`,
            }}
            animate={{
              y: '-10vh', // Float upward
              x: (() => {
                // Generate a wavy path based on particle's unique properties
                const points = [];
                const steps = 10;
                const totalDrift = particle.driftAngle; // Total left drift in vw units
                
                for (let i = 0; i <= steps; i++) {
                  const progress = i / steps;
                  // Base diagonal movement to the left
                  const baseX = particle.x - (totalDrift * progress);
                  // Add wave oscillation
                  const waveOffset = Math.sin(progress * Math.PI * 3) * particle.waveAmplitude * 
                                    (1 - progress * 0.3); // Wave amplitude decreases as bubble rises
                  
                  points.push(`calc(${baseX}vw + ${particle.offsetX + waveOffset}px)`);
                }
                return points;
              })(),
            }}
            transition={{
              y: {
                duration: particle.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: particle.delay,
              },
              x: {
                duration: particle.duration, // Same duration as Y for consistent diagonal movement
                repeat: Infinity,
                ease: 'linear', // Linear for smooth diagonal, the waypoints create the wave
                delay: particle.delay,
              },
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ marginTop: '64px' }}
        >
          <h1 style={{
            textTransform: 'uppercase',
            lineHeight: 1,
            margin: 0,
            padding: 0
          }}>
            <span style={{
              display: 'block',
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(3.6rem, 13.2vw, 9.6rem)',
              letterSpacing: '0.02em',
              background: 'linear-gradient(to right, #ffefbf 0%, #92856a 50%, #ffefbf 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(-4px 4px 0px rgba(10, 22, 40, 0.8))'
            }}>
              Suncoast
            </span>
            <span style={{
              display: 'inline-block',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 4.8vw, 3.6rem)',
              letterSpacing: '0.27em',
              marginTop: '-0.08em',
              transform: 'scaleX(0.96)',
              transformOrigin: 'center',
              background: 'linear-gradient(to right, #ffefbf 0%, #92856a 50%, #ffefbf 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(-3px 3px 0px rgba(10, 22, 40, 0.8))'
            }}>
              Dive Center
            </span>
          </h1>
        </motion.div>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '48px', transform: 'translateY(20px)' }}
        >
          <button 
            className={styles.ctaPrimary} 
            style={{ 
              width: '253px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              padding: '1rem 1.5rem',
              opacity: 0.8,
              transition: 'opacity 0.5s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Pro Shop</span>
          </button>
          
          <button 
            className={styles.ctaSecondary} 
            style={{ 
              width: '253px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              padding: '1rem 1.5rem',
              opacity: 0.8,
              transition: 'opacity 0.5s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span>Dive Conditions</span>
          </button>
        </motion.div>
      </div>

      {/* Fish Logo and Chevron Container with Bounce Animation */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ 
          zIndex: 10,
          position: 'absolute',
          bottom: 'calc(2rem + 48px)',
          left: 'calc(50% - 20px)',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        <img
          src="/fish4.webp"
          alt="Suncoast Dive Center Logo"
          style={{
            height: '50px',
            width: 'auto',
            filter: 'drop-shadow(0 0 20px rgba(255, 239, 191, 0.4))',
            opacity: 1.0
          }}
        />
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          style={{
            color: '#ffefbf',
            opacity: 0.8
          }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </motion.div>

      <style jsx>{`
        @keyframes waterWave {
          0%, 100% {
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
          50% {
            transform: translateY(-20px) scale(1.02);
            filter: blur(1px);
          }
        }

      `}</style>
    </div>
  );
};

export default HeroVideoSimple;