'use client';

import React, { useEffect, useRef } from 'react';

interface RippleConfig {
  resolution: number;
  dropRadius: number;
  perturbance: number;
  interactive: boolean;
}

const WaterRipple: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const rippleRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    
    // Set canvas size
    const updateSize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    updateSize();

    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    // Ripple effect simulation
    const ripples: Array<{
      x: number;
      y: number;
      radius: number;
      strength: number;
      speed: number;
    }> = [];

    // Add automatic ripples
    const addRandomRipple = () => {
      ripples.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        strength: 0.04 + Math.random() * 0.04,
        speed: 1.5 + Math.random() * 1.5,
      });
    };

    // Add ripple on click/touch
    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      ripples.push({
        x,
        y,
        radius: 0,
        strength: 0.08,
        speed: 3,
      });
    };

    container.addEventListener('click', handleInteraction);
    container.addEventListener('touchstart', handleInteraction);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw base image
      if (img.complete) {
        // Calculate image dimensions to cover canvas
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2 - 200; // Adjust for background-position

        ctx.save();
        
        // Apply ripple distortion
        ripples.forEach((ripple, index) => {
          ripple.radius += ripple.speed;
          
          // Remove old ripples
          if (ripple.radius > Math.max(canvas.width, canvas.height)) {
            ripples.splice(index, 1);
            return;
          }

          // Create distortion effect
          const gradient = ctx.createRadialGradient(
            ripple.x, ripple.y, ripple.radius * 0.5,
            ripple.x, ripple.y, ripple.radius
          );
          
          const alpha = Math.max(0, 1 - ripple.radius / 500);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.1})`);
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.05})`);
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        // Draw distorted image
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(img, x, y, w, h);
        
        // Apply wave effect
        if (ripples.length > 0) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < ripples.length; i++) {
            const ripple = ripples[i];
            const waveRadius = ripple.radius;
            
            for (let y = 0; y < canvas.height; y += 2) {
              for (let x = 0; x < canvas.width; x += 2) {
                const dx = x - ripple.x;
                const dy = y - ripple.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < waveRadius && distance > waveRadius - 40) {
                  const offset = Math.sin(distance * 0.1) * ripple.strength * (1 - distance / waveRadius) * 10;
                  const sourceX = Math.floor(x + dx * offset / distance);
                  const sourceY = Math.floor(y + dy * offset / distance);
                  
                  if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
                    const targetIndex = (y * canvas.width + x) * 4;
                    const sourceIndex = (sourceY * canvas.width + sourceX) * 4;
                    
                    data[targetIndex] = data[sourceIndex];
                    data[targetIndex + 1] = data[sourceIndex + 1];
                    data[targetIndex + 2] = data[sourceIndex + 2];
                  }
                }
              }
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
        }
        
        ctx.restore();
      }

      // Add random ripples occasionally
      if (Math.random() < 0.01) {
        addRandomRipple();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    img.onload = () => {
      animate();
    };

    // Add initial ripples
    for (let i = 0; i < 3; i++) {
      setTimeout(addRandomRipple, i * 1000);
    }

    // Resize handler
    window.addEventListener('resize', updateSize);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', updateSize);
      container.removeEventListener('click', handleInteraction);
      container.removeEventListener('touchstart', handleInteraction);
    };
  }, [imageUrl]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default WaterRipple;