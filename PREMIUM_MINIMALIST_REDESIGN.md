# Premium Minimalist Homepage Redesign

## Overview
Complete transformation of the ProStore homepage to embody a "Premium Minimalist" aesthetic inspired by luxury brands like Aesop, Apple, and Ssense.

## Design Philosophy
- **Invisible Design**: UI recedes to let product imagery take center stage
- **Strict Monochrome**: Black (#000), White (#FFF), and various zinc grays
- **Premium Typography**: Inter font with uppercase tracked headings
- **Generous Whitespace**: Wide margins and spacing between sections
- **Sharp Aesthetics**: Minimal rounded corners (sharp edges or subtle rounded-sm)
- **Refined Interactions**: Subtle hover effects with smooth transitions

## Key Changes

### 1. Typography & Fonts
**File**: `app/layout.tsx`
- Changed from Outfit to **Inter** font family
- Added font display swap for optimal loading
- Applied antialiasing for crisp rendering

**Global Styles**: `assets/styles/globals.css`
- Premium font stack with Inter as primary
- Added custom tracking classes for luxury feel
- Font smoothing for both WebKit and Gecko

### 2. Hero Section
**File**: `components/ui/shared/home/hero-section.tsx`

**Before**: Gradient backgrounds, colorful badges, two-column layout
**After**: 
- Full-viewport height (min-h-[90vh])
- Cinematic background image with elegant overlay
- Single-column centered content
- Uppercase tracked headings
- Minimal CTAs with sharp corners
- Subtle scroll indicator
- Removed colorful gradients in favor of pure black/white

### 3. Features Section
**File**: `components/ui/shared/home/features-section.tsx`

**Before**: Muted background with rounded elements
**After**:
- Clean horizontal strip with zinc-50/zinc-950 background
- Icons and text in monochrome
- Uppercase text with wide tracking
- Minimal hover states
- Single-line layout

### 4. Product List
**File**: `components/ui/shared/product/product-list.tsx`

**Before**: 3-4 column grid, rounded cards, colorful accents
**After**:
- Strict 4-column grid on desktop
- Removed colorful subtitle ("Handpicked just for you")
- Uppercase section titles with underline accent
- Increased vertical spacing (py-20 to py-28)
- Minimalist "View All" links
- Generous gaps between products (gap-8 to gap-10)

### 5. Product Cards
**File**: `components/ui/shared/product/product-card.tsx`

**Before**: Rounded cards, gradient badges, quick-add buttons, star ratings
**After**:
- Borderless, transparent background
- Portrait aspect ratio (3:4) for product images
- Removed Quick Add button overlay
- Removed star ratings
- Minimal brand labels (uppercase, tracked, tiny)
- Light font weight for product names
- Simple hover effect (subtle scale and opacity)
- Clean stock badges in monochrome

### 6. Product List Skeleton
**File**: `components/ui/shared/product/product-list-skeleton.tsx`

**Before**: Rounded elements with colorful placeholders
**After**:
- Sharp-cornered skeleton elements
- Monochrome placeholders (zinc-200/zinc-800)
- Matches new grid layout (4 columns)
- Portrait aspect ratio

### 7. Header
**File**: `components/ui/shared/header/index.tsx`

**Before**: Gradient logo text, standard spacing
**After**:
- Lighter font weight for logo
- Uppercase with wider tracking
- Increased height (h-16 to h-20)
- Monochrome border
- Consistent max-width container (1400px)

### 8. Footer
**File**: `components/ui/footer.tsx`

**Before**: Gradient brand name, payment icons, rounded elements
**After**:
- Removed payment icons
- Uppercase section headings with tracking
- Tiny text for legal links (10px)
- Monochrome color scheme
- Clean zinc background
- Generous spacing

### 9. Homepage Layout
**File**: `app/(root)/page.tsx`

**Before**: Multiple sections including Deal of Day, Categories, Promo Banner
**After**:
- Streamlined to essential sections only
- Removed: Categories, Deal of the Day, Promo Banner
- Kept: Hero, Features, Featured Products, New Arrivals, Best Sellers
- Pure white/black background
- Cleaner section order

**File**: `app/(root)/layout.tsx`
- Changed from h-screen to min-h-screen
- Removed wrapper padding from main
- Added explicit bg-white/bg-black

## Color Palette

### Light Mode
- Background: White (#FFF / oklch(0.99 0 0))
- Text: Black (#000 / oklch(0.145 0 0))
- Borders: zinc-200
- Subtle backgrounds: zinc-50
- Muted text: zinc-600

### Dark Mode
- Background: Black (#000 / oklch(0.145 0 0))
- Text: White (#FFF / oklch(0.985 0 0))
- Borders: zinc-800
- Subtle backgrounds: zinc-950
- Muted text: zinc-400

## Typography Scale

- **Hero Heading**: 5xl-7xl, font-light, tracking-tight
- **Section Titles**: 2xl-3xl, font-light, uppercase, tracking-tight
- **Eyebrow Text**: 10px, uppercase, tracking-[0.2em]
- **Body Text**: base-lg, font-light, leading-relaxed
- **Product Names**: sm, font-light
- **Brand Labels**: 10px, uppercase, tracking-[0.15em]
- **Footer Links**: xs, tracking-wide, uppercase
- **Legal Text**: 10px, tracking-wide, uppercase

## Spacing System

- Container max-width: 1400px
- Horizontal padding: px-8 lg:px-16
- Section vertical spacing: py-20 md:py-28
- Product grid gaps: gap-8 lg:gap-10
- Between sections: mb-16
- Header height: h-16 lg:h-20

## Hover Effects

- Product images: scale-105 (700ms ease-out)
- Links: color transition (300ms)
- CTAs: background color fade (300ms)
- Images: subtle black/white overlay

## Files Modified

1. `app/layout.tsx` - Font change to Inter
2. `app/(root)/layout.tsx` - Layout cleanup
3. `app/(root)/page.tsx` - Section reorganization
4. `components/ui/shared/home/hero-section.tsx` - Full redesign
5. `components/ui/shared/home/features-section.tsx` - Minimal strip
6. `components/ui/shared/product/product-list.tsx` - Grid update
7. `components/ui/shared/product/product-card.tsx` - Minimal card
8. `components/ui/shared/product/product-list-skeleton.tsx` - Skeleton update
9. `components/ui/shared/header/index.tsx` - Header refinement
10. `components/ui/footer.tsx` - Footer simplification
11. `assets/styles/globals.css` - Typography base

## Technical Specifications

- Preserved all Suspense boundaries for optimal loading
- Maintained async data fetching patterns
- Kept all existing functionality intact
- Used only Tailwind CSS classes
- No new dependencies required
- Fully responsive design
- Dark mode compatible

## Result

The homepage now presents a sophisticated, editorial-quality experience that:
- Reduces visual noise
- Emphasizes product photography
- Creates breathing room with generous spacing
- Uses restraint in typography and color
- Feels premium and trustworthy
- Matches luxury e-commerce standards

The design achieves "Invisible UI" where the interface disappears and products become the hero.
