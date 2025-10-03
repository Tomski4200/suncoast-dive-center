# Suncoast Dive Center - Next.js Site

Modern rebuild of Suncoast Dive Center website with oceanic theme and interactive hero section.

## Features

- 🌊 Interactive water ripple hero section with falling bubble particles
- 🎨 Gold gradient text with lime green CTAs
- 📱 Fully responsive design
- ⚡ Optimized performance with Next.js 14
- 🎬 Smooth animations with Framer Motion
- 🔍 Accessibility-focused development

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Color Scheme

- **Primary**: Lime Green (#8cda3f) - Main CTAs and active states
- **Accent**: Gold Gradient (#ffefbf to #92856a) - Hero text and premium elements  
- **Background**: Deep Navy (#0a1628) - Primary background
- **Text**: Gold Light (#ffefbf) - Main text color

## Project Structure

```
/suncoast-dive-center
├── /app              # Next.js app directory
├── /components       # React components
│   ├── HeroSection   # Interactive hero with ripple effect
│   └── Navigation    # Sticky navigation header
└── /public          # Static assets
```

## Technologies

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- CSS Modules