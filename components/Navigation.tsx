'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navigation.module.css';

interface NavigationProps {
  isVideoMode?: boolean;
  setIsVideoMode?: (value: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isVideoMode = false, setIsVideoMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Shop', href: '/shop' },
    { label: 'Services', href: '/services' },
    { label: 'Visibility', href: '/visibility' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link 
          href="/" 
          className={styles.logo}
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <div style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            overflow: 'hidden',
            transition: 'filter 1s ease',
            filter: isLogoHovered ? 'drop-shadow(0 4px 20px #8cda3f) drop-shadow(0 2px 10px #8cda3f)' : 'drop-shadow(0 0 0 transparent)'
          }}>
            <img 
              src="/fish.webp" 
              alt="Suncoast Logo"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 1s ease',
                opacity: isLogoHovered ? 0 : 1
              }}
            />
            <img 
              src="/fish-green.webp" 
              alt="Suncoast Logo Hover"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 1s ease',
                opacity: isLogoHovered ? 1 : 0
              }}
            />
          </div>
          <span className={styles.logoText}>
            <span className={styles.logoLine1}>Suncoast</span>
            <span className={styles.logoLine2}>Dive Center</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className={styles.desktopMenu}>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* Toggle Switch - Only show when not scrolled and setIsVideoMode is provided */}
          {setIsVideoMode && !isScrolled && (
            <li style={{ marginLeft: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  color: !isVideoMode ? '#8cda3f' : 'rgba(255, 239, 191, 0.5)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease'
                }}>
                  Static
                </span>
                
                <button
                  onClick={() => setIsVideoMode(!isVideoMode)}
                  style={{
                    position: 'relative',
                    width: '40px',
                    height: '20px',
                    background: isVideoMode 
                      ? 'linear-gradient(135deg, #8cda3f 0%, #b8e563 100%)' 
                      : 'rgba(255, 239, 191, 0.2)',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0
                  }}
                  aria-label="Toggle between static and video hero"
                >
                  <motion.div
                    animate={{ x: isVideoMode ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      width: '16px',
                      height: '16px',
                      background: 'linear-gradient(135deg, #ffefbf 0%, #92856a 100%)',
                      borderRadius: '50%',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                    }}
                  />
                </button>
                
                <span style={{
                  color: isVideoMode ? '#8cda3f' : 'rgba(255, 239, 191, 0.5)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease'
                }}>
                  Video
                </span>
              </div>
            </li>
          )}
        </ul>

        {/* Right Section */}
        <div className={styles.navRight}>
          {/* Search Icon */}
          <button className={styles.iconBtn} aria-label="Search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Cart Icon */}
          <button className={styles.iconBtn} aria-label="Cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M9 2L6 9H2l3 7 1 7h12l1-7 3-7h-4l-3-7H9z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.cartBadge}>3</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburger}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ul className={styles.mobileMenuList}>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.mobileMenuLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;