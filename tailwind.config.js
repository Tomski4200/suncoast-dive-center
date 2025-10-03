/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#0a1628',
        'ocean-blue': '#1e3a5f',
        'accent-teal': '#00d4aa',
        'vibrant-lime': '#8cda3f',
        'coral': '#ff6b6b',
        'sand': '#f5f1e8',
        'deep-sea': '#04080f',
        'gold-light': '#ffefbf',
        'gold-mid': '#ffd700',
        'gold-dark': '#92856a',
      },
      fontFamily: {
        'anton': ['var(--font-anton)'],
        'montserrat': ['var(--font-montserrat)'],
      },
      animation: {
        'shimmer': 'shimmer 8s ease-in-out infinite',
        'ripple': 'ripple 2s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% center' },
          '50%': { backgroundPosition: '100% center' },
        },
        ripple: {
          'to': {
            width: '400px',
            height: '400px',
            opacity: '0',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}