# Suncoast Dive Center - Next.js Rebuild Plan

## Executive Summary
A complete modern rebuild preserving the oceanic diving theme while implementing contemporary UX patterns, improved performance, and enhanced functionality.

---

## 1. Current Site Analysis

### Strengths to Preserve
- Strong brand identity with oceanic theme
- Clear color palette (#8cda3f lime/green, #0c172b dark navy, #4a8ace medium blue)
- Straightforward navigation structure
- Community engagement (blog/visibility reports)
- E-commerce integration

### Areas for Improvement
- Outdated visual design patterns
- Heavy page loads (large images)
- Limited interactivity
- Mobile responsiveness could be enhanced
- Chat widget intrusive
- Information hierarchy needs refinement

---

## 2. Design Direction

### Updated Color Palette
```
Primary Colors:
- Deep Navy: #0a1628 (slightly darker than current)
- Ocean Blue: #1e3a5f (mid-tone layer)
- Accent Teal: #00d4aa (modernized from #4a8ace)
- Vibrant Lime: #8cda3f (keep for CTAs)

Supporting Colors:
- Coral Accent: #ff6b6b (for urgency/sale items)
- Sand Beige: #f5f1e8 (for alternating sections)
- Deep Sea: #04080f (for text/headers)
- White/Off-white: #fafafa (clean backgrounds)
```

### Visual Theme Enhancement
**Modern Oceanic Aesthetic:**
- Subtle animated gradients (navy to deep blue)
- Glassmorphism effects for cards and overlays
- Flowing organic shapes inspired by water/waves
- High-quality underwater photography as hero backgrounds
- Smooth parallax scrolling effects
- Micro-interactions (bubbles, wave ripples on hover)

---

## 3. Technical Stack

### Core Technologies
```javascript
Framework: Next.js 15 (App Router)
Styling: Tailwind CSS + CSS Modules for complex animations
State Management: Zustand (for cart/wishlist)
Forms: React Hook Form + Zod validation
Animations: Framer Motion
Images: Next/Image with sharp optimization
```

### E-commerce Integration
```
Platform: Shopify Headless (if keeping current)
or
Build custom with: Stripe + Sanity CMS
API Routes: Next.js API routes for serverless functions
```

### Additional Tools
- TypeScript for type safety
- ESLint + Prettier for code quality
- Vercel for hosting (optimal Next.js performance)
- Cloudinary/Uploadcare for image CDN

---

## 4. Site Architecture

### Page Structure
```
/                        → Homepage (hero, featured products, blog preview)
/shop                    → Product catalog with filters
/shop/[category]         → Category pages
/shop/product/[slug]     → Product detail pages
/about                   → About the dive center + team
/services                → Training, rentals, trips, tank fills
/visibility-reports      → Current conditions (interactive)
/blog                    → Articles/news
/blog/[slug]             → Individual posts
/contact                 → Contact form + map + hours
/cart                    → Shopping cart
/checkout                → Checkout flow
/account                 → Customer dashboard
/loyalty                 → Loyalty program details
```

---

## 5. Component Breakdown

### Global Components
- **Navigation Header**: Sticky, transparent-to-solid on scroll, mega menu for shop categories
- **Footer**: Multiple columns (shop, info, contact, social), newsletter signup
- **Search**: Global product/content search with Algolia or similar
- **Cart Drawer**: Slide-out cart sidebar
- **Loading States**: Animated water/bubble loaders

### Homepage Sections
1. **Hero Section**
   - Full-screen video/animated background (underwater footage)
   - Headline overlay with subtle glassmorphism
   - Dual CTAs: "Shop Now" + "Check Visibility"
   - Scroll indicator animation

2. **Featured Products Carousel**
   - Auto-playing with manual controls
   - Product cards with hover effects
   - Quick-view modal functionality
   - "Add to Cart" animation

3. **Category Grid**
   - 4-6 main categories with imagery
   - Hover effects revealing category details
   - Direct links to filtered shop pages

4. **Social Proof Section**
   - Customer reviews/testimonials
   - Trust badges (certifications, guarantees)
   - Instagram feed integration

5. **Visibility Reports Widget**
   - Current water conditions
   - Temperature, visibility distance
   - Last updated timestamp
   - Link to full reports page

6. **Recent Blog Posts**
   - 3-column grid
   - Featured image, excerpt, read time
   - Category tags

7. **Newsletter + CTA**
   - Email capture with incentive
   - Social media links

### Shop Page Features
- **Filter Sidebar**: Brand, price range, category, ratings, in-stock
- **Product Grid**: Responsive (1-2-3-4 columns)
- **Sort Options**: Price, newest, popular, rating
- **Pagination** or infinite scroll
- **Quick View**: Modal with key details
- **Breadcrumbs**: Navigation trail

### Product Detail Page
- **Image Gallery**: Main image + thumbnails, zoom, 360° view option
- **Product Info**: Title, price, SKU, description, specs table
- **Variant Selection**: Size, color, etc.
- **Add to Cart**: Sticky on mobile
- **Related Products**: "You might also like"
- **Reviews Section**: Star rating, written reviews, photo reviews
- **Shipping Info**: Expandable accordion

### Visibility Reports Page
- **Interactive Map**: Gulf coast with dive site markers
- **Filters**: Date range, location
- **Report Cards**: Conditions, temperature, visibility, sea state
- **User-generated**: Allow customers to submit reports
- **Historical Data**: Charts showing trends

---

## 6. Modern UX Enhancements

### Performance Optimizations
- Image lazy loading with blur-up placeholders
- Route prefetching for instant navigation
- Progressive Web App (PWA) capabilities
- Skeleton screens for loading states
- Code splitting by route

### Interactive Elements
- Smooth scroll behavior
- Parallax effects on hero sections
- Hover animations on cards (lift, glow)
- Ripple effects on buttons
- Toast notifications for actions
- Micro-animations (icons, transitions)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimized
- Proper heading hierarchy
- Alt text for all images
- Focus indicators

### Mobile-First Design
- Touch-friendly tap targets (44px minimum)
- Bottom navigation for key actions
- Swipe gestures for galleries
- Optimized forms with proper input types
- Reduced motion for motion-sensitive users

---

## 7. Key Features to Implement

### Must-Have
✓ Responsive design (mobile, tablet, desktop)
✓ Product search with autocomplete
✓ Shopping cart with persistence
✓ User accounts (login/register)
✓ Wishlist functionality
✓ Email notifications
✓ Contact form
✓ Store locator/hours
✓ SSL security

### Should-Have
✓ Live chat integration (unobtrusive)
✓ Product recommendations
✓ Loyalty program integration
✓ Gift card purchase/redemption
✓ Blog with categories/tags
✓ Social media feeds
✓ Email newsletter signup
✓ Google Analytics 4

### Nice-to-Have
◯ Virtual try-on (AR for masks/fins)
◯ Dive trip booking system
◯ Training class registration
◯ Equipment rental scheduler
◯ Customer photo gallery
◯ Product comparison tool
◯ Size guide/fit finder
◯ Live visibility camera feed

---

## 8. Content Strategy

### Photography
- Professional underwater shots
- Product photography on solid backgrounds
- Lifestyle images (divers using equipment)
- Team photos for about page
- Local dive site imagery

### Copywriting Tone
- Enthusiastic but expert
- Community-focused
- Safety-conscious
- Conversational yet professional
- Include calls-to-action

### SEO Priorities
- Product schema markup
- Blog article optimization
- Local SEO (Google Business Profile)
- Meta descriptions
- Alt text strategy
- Internal linking structure

---

## 9. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- Set up Next.js project with TypeScript
- Configure Tailwind CSS
- Create design system (colors, typography, spacing)
- Build reusable component library
- Set up development workflow

### Phase 2: Core Pages (Weeks 3-4)
- Homepage with all sections
- Shop page with filtering
- Product detail template
- Navigation + Footer
- Responsive layouts

### Phase 3: E-commerce (Weeks 5-6)
- Shopping cart functionality
- Checkout flow
- Payment integration
- User authentication
- Order confirmation

### Phase 4: Content (Weeks 7-8)
- Blog functionality
- Visibility reports system
- About/Contact pages
- CMS integration
- Content migration

### Phase 5: Polish (Weeks 9-10)
- Animations and interactions
- Performance optimization
- SEO implementation
- Cross-browser testing
- Accessibility audit
- Mobile refinement

### Phase 6: Launch (Week 11)
- Staging environment review
- Client training
- Final QA testing
- DNS transition
- Post-launch monitoring

---

## 10. Design Mockup Recommendations

### Homepage Hero Concepts
**Option A: Video Background**
- Looping underwater video (fish, coral)
- Dark overlay for text readability
- Centered headline + subheading
- Two prominent CTAs side-by-side

**Option B: Animated Gradient**
- CSS/Canvas animated wave gradient
- Floating bubble particles
- Off-center content with whitespace
- Single dominant CTA

**Option C: Split Screen**
- Left: Large underwater image
- Right: Content + form (quick shop/contact)
- Diagonal divider with blur effect

### Navigation Patterns
**Sticky transparent navbar:**
- Solid on scroll with blur backdrop
- Logo left, menu center, icons right
- Mega menu for shop dropdown
- Search icon expands to full-width bar

### Card Designs
**Product Cards:**
- Image with subtle hover zoom
- Quick-view icon overlay on hover
- Price + rating below
- Add to cart button slide-up animation
- Glassmorphic border/shadow

### Color Application Example
```
Backgrounds: Deep Navy (#0a1628)
Headers/Text: Deep Sea (#04080f) or White
Primary CTAs: Vibrant Lime (#8cda3f)
Secondary CTAs: Accent Teal (#00d4aa)
Hover States: Slightly lighter/brighter versions
Links: Accent Teal (#00d4aa)
Sale/Urgent: Coral (#ff6b6b)
```

---

## 11. File & Folder Structure

```
/suncoast-dive-center
├── /app
│   ├── layout.tsx
│   ├── page.tsx
│   ├── /shop
│   │   ├── page.tsx
│   │   ├── /[category]
│   │   └── /product/[slug]
│   ├── /blog
│   ├── /visibility-reports
│   ├── /contact
│   └── /api
│       ├── /products
│       ├── /cart
│       └── /checkout
├── /components
│   ├── /layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── /ui
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── /shop
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── FilterSidebar.tsx
│   │   └── Cart.tsx
│   └── /home
│       ├── Hero.tsx
│       ├── FeaturedProducts.tsx
│       └── VisibilityWidget.tsx
├── /lib
│   ├── /utils
│   ├── /hooks
│   └── /api
├── /styles
│   └── globals.css
├── /public
│   ├── /images
│   ├── /icons
│   └── /videos
└── package.json
```

---

## 12. Success Metrics

### Performance Targets
- Lighthouse Score: 90+ (all categories)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Core Web Vitals: All "Good"

### Business Goals
- Increase conversion rate by 25%
- Improve mobile traffic engagement
- Reduce cart abandonment
- Increase average order value
- Grow email list subscribers

### User Experience
- Reduce bounce rate
- Increase pages per session
- Improve task completion rate
- Positive user feedback scores

---

## 13. Next Steps

1. **Client Approval**: Review this plan and provide feedback
2. **Design Phase**: Create detailed mockups in Figma
3. **Content Audit**: Catalog existing content to migrate
4. **Technical Setup**: Initialize repository and development environment
5. **Sprint Planning**: Break down work into 2-week sprints
6. **Kickoff Meeting**: Align on timeline and deliverables

---

## Questions for Client

- E-commerce platform preference (Shopify, WooCommerce, custom)?
- Must-have features not listed?
- Existing integrations to maintain?
- Access to current analytics data?
- Brand guidelines or style assets available?
- Target launch date?
- Budget for photography/content creation?
- Training needs for site management?

---

**Ready to dive in? Let's build something amazing!** 🌊🤿