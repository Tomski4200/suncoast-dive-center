'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import styles from './HeroSection.module.css';

// Dynamically import WaterRipple to avoid SSR issues
const WaterRipple = dynamic(() => import('./WaterRipple'), { ssr: false });

interface ParticleProps {
  id: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
}

const HeroSection: React.FC = () => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Initialize particles
  useEffect(() => {
    const particleArray: ParticleProps[] = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      particleArray.push({
        id: i,
        initialX: Math.random() * 100,
        initialY: -10 - Math.random() * 20,
        duration: 6 + Math.random() * 9,
        delay: Math.random() * 5,
      });
    }
    
    setParticles(particleArray);
  }, []);


  // Fit text on resize
  useEffect(() => {
    const fitText = () => {
      if (!textRef.current) return;
      
      const line1 = textRef.current.querySelector('.line-1') as HTMLElement;
      const line2 = textRef.current.querySelector('.line-2') as HTMLElement;
      
      if (!line1 || !line2) return;
      
      const containerWidth = textRef.current.offsetWidth;
      const maxWidth = Math.min(containerWidth * 0.9, 1200); // 90% of container or 1200px max
      
      // Reset to measure natural widths
      line1.style.fontSize = '';
      line2.style.fontSize = '';
      
      const ratio = maxWidth / Math.max(line1.offsetWidth, line2.offsetWidth * 1.1);
      
      if (ratio < 1) {
        const currentSize1 = parseFloat(getComputedStyle(line1).fontSize);
        const currentSize2 = parseFloat(getComputedStyle(line2).fontSize);
        line1.style.fontSize = `${currentSize1 * ratio}px`;
        line2.style.fontSize = `${currentSize2 * ratio}px`;
      }
    };

    fitText();
    window.addEventListener('resize', fitText);
    return () => window.removeEventListener('resize', fitText);
  }, []);

  return (
    <section className={styles.hero} ref={containerRef}>
      {/* Background with Water Ripple Effect */}
      <div className={styles.heroBg}>
        <WaterRipple imageUrl="https://thumbs.dreamstime.com/b/diver-engages-gracefully-sea-turtle-clear-ocean-waters-under-shimmering-sunlight-vitiligo-points-toward-majestic-gliding-391755573.jpg" />
        
        {/* Gradient Overlay */}
        <div className={styles.overlay} />
      </div>

      {/* Falling Particles */}
      <div className={styles.particleContainer}>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className={styles.particle}
            initial={{
              x: `${particle.initialX}vw`,
              y: `${particle.initialY}vh`,
            }}
            animate={{
              y: '110vh',
              x: [
                `${particle.initialX}vw`,
                `${particle.initialX + 10}vw`,
                `${particle.initialX - 10}vw`,
                `${particle.initialX}vw`,
              ],
              rotate: [0, 180, 360],
            }}
            transition={{
              y: {
                duration: particle.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: particle.delay,
              },
              x: {
                duration: particle.duration / 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: particle.delay,
              },
              rotate: {
                duration: particle.duration / 3,
                repeat: Infinity,
                ease: 'linear',
                delay: particle.delay,
              },
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className={styles.heroContent}>
        <motion.div
          ref={textRef}
          className={styles.heroText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span className={`${styles.line} ${styles.line1} line-1`}>
            Suncoast
          </span>
          <span className={`${styles.line} ${styles.line2} line-2`}>
            Dive Center
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className={styles.ctaContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <button className={styles.ctaPrimary}>
            <span>Explore Our Gear</span>
            <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button className={styles.ctaSecondary}>
            <span>Check Dive Conditions</span>
            <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="30" height="50" viewBox="0 0 30 50" fill="none">
            <rect x="1" y="1" width="28" height="48" rx="14" stroke="currentColor" strokeWidth="2" />
            <circle cx="15" cy="15" r="4" fill="currentColor" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;