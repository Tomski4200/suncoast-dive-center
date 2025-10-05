'use client';

import React, { useEffect, useRef } from 'react';
import styles from './HeroSection.module.css';

const HeroRipple: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Load jQuery and ripples plugin
    const loadScripts = async () => {
      if (scriptLoadedRef.current) return;
      
      // Load jQuery if not already loaded
      if (typeof window !== 'undefined' && !(window as any).jQuery) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      // Load ripples plugin
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });

      // Load GSAP for particle animations
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });

      scriptLoadedRef.current = true;

      // Initialize ripples
      const $ = (window as any).jQuery;
      const $rippleBg = $('.ripple-bg');
      
      if ($rippleBg.length && $.fn.ripples) {
        $rippleBg.ripples({
          resolution: 200,
          dropRadius: 20,
          perturbance: 0.04,
        });

        // Initialize particles
        const TweenMax = (window as any).TweenMax;
        const TweenLite = (window as any).TweenLite;
        const Linear = (window as any).Linear;
        const Sine = (window as any).Sine;

        if (TweenMax) {
          TweenLite.set($rippleBg, { perspective: 600 });

          const total = 30;
          const container = $rippleBg[0];
          const w = window.innerWidth;
          const h = window.innerHeight;

          const R = (min: number, max: number) => {
            return min + Math.random() * (max - min);
          };

          const animm = (elm: HTMLElement) => {
            TweenMax.to(elm, R(6, 15), {
              y: h + 100,
              ease: Linear.easeNone,
              repeat: -1,
              delay: -15
            });
            TweenMax.to(elm, R(4, 8), {
              x: '+=100',
              rotationZ: R(0, 180),
              repeat: -1,
              yoyo: true,
              ease: Sine.easeInOut
            });
            TweenMax.to(elm, R(2, 8), {
              rotationX: R(0, 360),
              rotationY: R(0, 360),
              repeat: -1,
              yoyo: true,
              ease: Sine.easeInOut,
              delay: -5
            });
          };

          for (let i = 0; i < total; i++) {
            const Div = document.createElement('div');
            TweenLite.set(Div, {
              attr: { class: 'dot' },
              x: R(0, w),
              y: R(-200, -150),
              z: R(-200, 200)
            });
            container.appendChild(Div);
            animm(Div);
          }
        }
      }
    };

    loadScripts();

    // Cleanup
    return () => {
      const $ = (window as any).jQuery;
      if ($ && $.fn.ripples) {
        $('.ripple-bg').ripples('destroy');
      }
    };
  }, []);

  // Remove the auto-fitting to allow CSS to control the font size

  return (
    <div className="ripple" ref={containerRef}>
      <div
        className="ripple-bg"
        style={{
          backgroundImage: "url('/turtle.webp')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        }}
      />

      <div className="ripple-text" ref={textRef} style={{ marginTop: '-96px' }}>
        <span className="line line-1">Suncoast</span>
        <span className="line line-2" style={{ position: 'relative', zIndex: 12 }}>Dive Center</span>
      </div>

      {/* Logo Image - Centered between text and CTAs */}
      <img 
        src="/fish4.webp" 
        alt="Suncoast Dive Center Logo" 
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: '216px',
          width: 'clamp(80px, 15.4vw, 151px)',
          height: 'auto',
          filter: 'drop-shadow(0 0 30px rgba(255, 239, 191, 0.5))',
          zIndex: 10
        }}
      />

      {/* CTAs */}
      <div className={styles.ctaContainer} style={{ position: 'absolute', bottom: '108px', zIndex: 10, display: 'flex', gap: '1rem' }}>
        <button className={styles.ctaPrimary} style={{ width: '253px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem 1.5rem' }}>
          <svg className={styles.ctaIcon} style={{ width: '20px', height: '20px', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Pro Shop</span>
        </button>
        
        <button className={styles.ctaSecondary} style={{ width: '253px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem 1.5rem' }}>
          <svg className={styles.ctaIcon} style={{ width: '20px', height: '20px', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span>Dive Conditions</span>
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <svg width="30" height="50" viewBox="0 0 30 50" fill="none">
          <rect x="1" y="1" width="28" height="48" rx="14" stroke="currentColor" strokeWidth="2" />
          <circle cx="15" cy="15" r="4" fill="currentColor" />
        </svg>
      </div>

      <style jsx>{`
        .ripple {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          height: 100vh;
        }

        .ripple-bg {
          width: 100%;
          height: 100%;
          position: fixed;
          top: 0;
          left: 0;
        }

        .ripple-text {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          text-transform: uppercase;
          line-height: 1;
          text-align: center;
        }

        .ripple-text,
        .line {
          background: linear-gradient(to right, #ffefbf 0%, #92856a 50%, #ffefbf 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .line {
          display: block;
        }

        .line-1 {
          font-family: 'Anton', sans-serif;
          font-size: clamp(3.6rem, 13.2vw, 9.6rem);
          letter-spacing: 0.02em;
          filter: drop-shadow(-4px 4px 0px rgba(10, 22, 40, 0.8));
        }

        .line-2 {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: clamp(1.8rem, 4.8vw, 3.6rem);
          letter-spacing: 0.27em;
          margin-top: -0.08em;
          display: inline-block;
          transform: scaleX(0.96);
          transform-origin: center;
          filter: drop-shadow(-3px 3px 0px rgba(10, 22, 40, 0.8));
        }

        .dot {
          width: 60px;
          height: 60px;
          position: absolute;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="bubble"><stop offset="0%" stop-color="rgba(255,255,255,0.3)"/><stop offset="30%" stop-color="rgba(255,255,255,0.1)"/><stop offset="60%" stop-color="rgba(200,230,255,0.05)"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="url(%23bubble)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><ellipse cx="35" cy="30" rx="12" ry="8" fill="rgba(255,255,255,0.4)" transform="rotate(-25 35 30)"/></svg>');
          background-size: 100% 100%;
          mix-blend-mode: screen;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .dot {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroRipple;