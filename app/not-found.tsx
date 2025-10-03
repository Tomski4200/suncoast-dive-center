'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, Anchor, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif'
      }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        background: 'rgba(10, 22, 40, 0.8)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8cda3f, #ffefbf)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🐠</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1
            }}>
              <span style={{
                fontSize: '1.32rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: 'linear-gradient(to right, #ffefbf 0%, #92856a 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                Suncoast
              </span>
              <span style={{
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#ffefbf',
                opacity: 0.8
              }}>
                Dive Center
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '2.5rem',
            margin: 0,
            padding: 0
          }}>
            {[
              { label: 'Shop', href: '/shop' },
              { label: 'Services', href: '/services' },
              { label: 'Visibility', href: '/visibility' },
              { label: 'Blog', href: '/blog' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link-404" style={{
                  color: 'rgba(255, 239, 191, 0.9)',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <button className="nav-button-404" style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 239, 191, 0.9)',
              cursor: 'pointer',
              padding: '0.5rem',
              transition: 'color 0.3s ease'
            }}
            aria-label="Search">
              <Search size={24} />
            </button>
            <button className="nav-button-404" style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 239, 191, 0.9)',
              cursor: 'pointer',
              padding: '0.5rem',
              transition: 'color 0.3s ease'
            }}
            aria-label="Cart">
              <ShoppingBag size={24} />
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: '#8cda3f',
                color: '#0a1628',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.2rem 0.4rem',
                borderRadius: '50%',
                minWidth: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>3</span>
            </button>
          </div>
        </div>
      </nav>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        minHeight: 'calc(100vh - 80px)',
        marginTop: '80px',
        gap: '4rem'
      }}>
      {/* Animated Bubbles Background */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -1000],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            opacity: [0, 0.7, 0.7, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear'
          }}
        />
      ))}

      {/* Animated Lost Diver SVG */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '300px', height: '300px', position: 'relative', zIndex: 10 }}>
          <svg
            viewBox="0 0 400 400"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Ocean Floor */}
            <path
              d="M0 350 Q100 330 200 340 T400 350 L400 400 L0 400 Z"
              fill="rgba(140, 218, 63, 0.2)"
            />
            
            {/* Seaweed */}
            <motion.path
              d="M50 350 Q45 320 50 300 Q55 320 50 350"
              stroke="#8cda3f"
              strokeWidth="4"
              fill="none"
              animate={{
                d: [
                  "M50 350 Q45 320 50 300 Q55 320 50 350",
                  "M50 350 Q55 320 50 300 Q45 320 50 350",
                  "M50 350 Q45 320 50 300 Q55 320 50 350"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M350 350 Q345 310 350 280 Q355 310 350 350"
              stroke="#8cda3f"
              strokeWidth="4"
              fill="none"
              animate={{
                d: [
                  "M350 350 Q345 310 350 280 Q355 310 350 350",
                  "M350 350 Q355 310 350 280 Q345 310 350 350",
                  "M350 350 Q345 310 350 280 Q355 310 350 350"
                ]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Lost Diver */}
            <motion.g
              animate={{
                x: [0, 20, 0, -20, 0],
                y: [0, -10, 0, -10, 0],
                rotate: [-5, 5, -5, 5, -5]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Diver Body */}
              <ellipse cx="200" cy="200" rx="40" ry="60" fill="#ffefbf" opacity="0.9" />
              
              {/* Diver Head/Mask */}
              <circle cx="200" cy="160" r="25" fill="#1e3a5f" />
              <ellipse cx="200" cy="160" rx="20" ry="18" fill="rgba(100, 200, 255, 0.6)" />
              
              {/* Arms */}
              <motion.path
                d="M180 190 L150 210 M220 190 L250 210"
                stroke="#ffefbf"
                strokeWidth="8"
                strokeLinecap="round"
                animate={{
                  d: [
                    "M180 190 L150 210 M220 190 L250 210",
                    "M180 190 L150 200 M220 190 L250 200",
                    "M180 190 L150 210 M220 190 L250 210"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Fins */}
              <motion.g
                animate={{
                  rotate: [-10, 10, -10]
                }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: '200px 250px' }}
              >
                <path d="M185 240 L175 270 L185 265 Z" fill="#8cda3f" />
                <path d="M215 240 L225 270 L215 265 Z" fill="#8cda3f" />
              </motion.g>

              {/* Bubbles from regulator */}
              {[...Array(3)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx="200"
                  cy="150"
                  r="4"
                  fill="rgba(255, 255, 255, 0.6)"
                  animate={{
                    y: [-10, -60],
                    x: [0, (i - 1) * 10],
                    opacity: [0.8, 0],
                    scale: [0.5, 1.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.g>

            {/* Question Marks */}
            <motion.text
              x="250"
              y="150"
              fontSize="30"
              fill="#8cda3f"
              fontWeight="bold"
              animate={{
                opacity: [0, 1, 1, 0],
                y: [150, 130, 130, 110]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut"
              }}
            >
              ?
            </motion.text>
            <motion.text
              x="130"
              y="150"
              fontSize="25"
              fill="#ffefbf"
              fontWeight="bold"
              animate={{
                opacity: [0, 1, 1, 0],
                y: [150, 130, 130, 110]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 0.5,
                ease: "easeOut"
              }}
            >
              ?
            </motion.text>

            {/* Compass spinning */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: '320px 100px' }}
            >
              <circle cx="320" cy="100" r="30" fill="none" stroke="#8cda3f" strokeWidth="2" opacity="0.5" />
              <path d="M320 70 L315 95 L320 85 L325 95 Z" fill="#8cda3f" />
              <circle cx="320" cy="100" r="3" fill="#ffefbf" />
            </motion.g>
          </svg>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          zIndex: 10,
          maxWidth: '500px'
        }}
      >
        {/* 404 Text */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <h1 style={{
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            fontFamily: 'Anton, sans-serif',
            background: 'linear-gradient(to right, #ffefbf 0%, #92856a 50%, #ffefbf 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            filter: 'drop-shadow(0 0 30px rgba(255, 239, 191, 0.3))',
            letterSpacing: '0.1em'
          }}>
            404
          </h1>
        </motion.div>

        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          color: '#8cda3f',
          marginBottom: '1rem',
          fontWeight: 600
        }}>
          Looks Like You're Off Course!
        </h2>

        <p style={{
          color: 'rgba(255, 239, 191, 0.7)',
          fontSize: '1.125rem',
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>
          Even the best divers surface in the wrong spot sometimes! 
          Your compass might be spinning, but we'll help you navigate back to safety.
        </p>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/"
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
            <Anchor size={20} />
            Surface Home
          </Link>

          <Link
            href="/services"
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
            <Compass size={20} />
            Check Services
          </Link>
        </div>

        {/* Fun Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            marginTop: '3rem',
            color: 'rgba(255, 239, 191, 0.5)',
            fontSize: '0.875rem',
            fontStyle: 'italic'
          }}
        >
          Remember: When lost underwater, stop, breathe, think, and ascend slowly. 
          Same applies to website navigation! 🤿
        </motion.p>
      </motion.div>

      </div>

      {/* Fish Swimming */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '-50px',
          fontSize: '2rem',
          filter: 'drop-shadow(0 0 10px rgba(140, 218, 63, 0.5))'
        }}
        animate={{
          x: [0, 2000]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        🐠
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '-50px',
          fontSize: '1.5rem',
          filter: 'drop-shadow(0 0 10px rgba(255, 239, 191, 0.5))'
        }}
        animate={{
          x: [0, 2000]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
          delay: 3
        }}
      >
        🐟
      </motion.div>
    </div>
  );
}