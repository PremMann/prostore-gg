# Implementation Notes - Premium Minimalist Design

## Design System Reference

### Typography Classes (Reusable)

```tsx
// Hero Headlines
className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight"

// Section Titles
className="text-2xl md:text-3xl font-light tracking-tight uppercase"

// Eyebrow/Overline
className="text-[10px] font-medium tracking-[0.2em] uppercase"

// Body Text
className="text-base md:text-lg leading-relaxed font-light"

// Brand Labels
className="text-[10px] font-medium tracking-[0.15em] uppercase"

// Tiny Uppercase Labels
className="text-xs tracking-wide uppercase"

// Legal/Footer Text
className="text-[10px] tracking-wide uppercase"
```

### Color Classes (Monochrome Palette)

```tsx
// Backgrounds - Light Mode
bg-white          // Main background
bg-zinc-50        // Subtle sections
bg-zinc-100       // Skeletons/placeholders
bg-black          // Primary CTA

// Text - Light Mode
text-black        // Headlines
text-zinc-600     // Body/secondary
text-zinc-500     // Tertiary/muted
text-white        // On dark backgrounds

// Borders - Light Mode
border-zinc-200   // Dividers
border-zinc-100   // Subtle borders

// Dark Mode Equivalents
dark:bg-black
dark:bg-zinc-950
dark:bg-zinc-900
dark:text-white
dark:text-zinc-400
dark:text-zinc-500
dark:border-zinc-800
```

### Spacing Scale

```tsx
// Container
max-w-[1400px] mx-auto px-8 lg:px-16

// Section Vertical
py-20 md:py-28

// Element Gaps
gap-8 lg:gap-10      // Product grids
gap-12 lg:gap-16     // Footer columns
mb-16                // Section title to content
mt-4                 // Small vertical spacing
```

### Button Styles

```tsx
// Primary CTA
className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:bg-zinc-800 dark:hover:bg-zinc-100"

// Secondary/Outline CTA
className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-black dark:border-white text-black dark:text-white text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"

// Text Link
className="text-xs tracking-wide uppercase text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
```

### Image Hover Effects

```tsx
// Container
className="relative w-full aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900"

// Image
className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"

// Overlay
className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-all duration-500"
```

## Component Patterns

### Section Header Pattern

```tsx
<div className="flex items-end justify-between mb-16">
  <div>
    <h2 className="text-2xl md:text-3xl font-light tracking-tight uppercase text-black dark:text-white">
      {title}
    </h2>
    <div className="h-px w-16 bg-black dark:bg-white mt-4" />
  </div>
  {/* Optional View All Link */}
</div>
```

### Feature Strip Pattern

```tsx
<section className="bg-zinc-50 dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-800">
  <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
    <div className="flex items-center justify-between gap-12 py-6">
      {/* Features */}
    </div>
  </div>
</section>
```

### Product Grid Pattern

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## Responsive Breakpoints

```tsx
// Mobile First Approach
// Base: < 640px (mobile)
sm:  // ≥ 640px (large mobile)
md:  // ≥ 768px (tablet)
lg:  // ≥ 1024px (desktop)
xl:  // ≥ 1280px (large desktop)
```

### Common Responsive Patterns

```tsx
// Hero text
"text-5xl md:text-6xl lg:text-7xl"

// Section padding
"py-20 md:py-28"

// Grid columns
"grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"

// Container padding
"px-8 lg:px-16"

// Header height
"h-16 lg:h-20"
```

## Animation Guidelines

### Duration Scale
- **Fast**: 200-300ms (hover states, color changes)
- **Medium**: 500ms (overlays, fade effects)
- **Slow**: 700ms (image transforms)

### Easing Functions
- `ease-out` - For entrances and scale
- `transition-all` - For multi-property transitions
- `transition-colors` - For color-only changes
- `transition-transform` - For movement/scale

### Common Animations

```tsx
// Hover scale (images)
transition-transform duration-700 ease-out group-hover:scale-105

// Color transition (links)
transition-colors duration-300

// Arrow slide
transition-transform group-hover:translate-x-1

// Fade overlay
transition-all duration-500
```

## Dark Mode Implementation

All components use Tailwind's `dark:` variant for dark mode support:

```tsx
// Always pair light and dark
bg-white dark:bg-black
text-black dark:text-white
border-zinc-200 dark:border-zinc-800
```

## Accessibility Notes

1. **Font Sizes**: Minimum 10px for tiny text, but used sparingly
2. **Contrast**: Ensure zinc-600 on white meets WCAG AA
3. **Touch Targets**: Buttons maintain 44px minimum height
4. **Keyboard Navigation**: All links and buttons are keyboard accessible
5. **Screen Readers**: Semantic HTML maintained (header, main, footer, section)

## Performance Optimizations

1. **Images**: 
   - Use Next.js Image component
   - Set priority on hero images
   - Proper aspect ratios prevent layout shift

2. **Fonts**:
   - Inter with display: swap
   - Preloaded via Next.js font optimization

3. **Suspense Boundaries**:
   - Maintained for each async section
   - Skeleton loaders match final layout

## Future Enhancements

### Potential Additions
1. **Horizontal Scroll Gallery**: For featured products on mobile
2. **Video Hero**: Replace static image with ambient video
3. **Micro-interactions**: Subtle animations on scroll
4. **Category Filter Bar**: Minimal pill navigation
5. **Quick View**: Modal product preview
6. **Wishlist Heart**: Subtle icon on product cards

### Design Extensions
1. Product detail page matching aesthetic
2. Checkout flow in same minimalist style
3. Account pages with clean forms
4. Editorial content pages (About, Journal)

## Brand Guidelines

### Typography Hierarchy
1. Display: 5xl-7xl, font-light
2. H1: 3xl-4xl, font-light, uppercase
3. H2: 2xl-3xl, font-light, uppercase
4. H3: xl-2xl, font-light
5. Body: base-lg, font-light
6. Small: sm-xs, font-light
7. Tiny: 10px, font-medium, uppercase

### Spacing Philosophy
- "Let it breathe" - generous whitespace
- Consistent rhythm using 4px base (spacing-4)
- Large sections: 20-28 units vertical
- Between elements: 8-16 units
- Micro spacing: 2-4 units

### Color Philosophy
- Primary: Pure black/white
- Secondary: Zinc grays
- Accent: Reserved for interactive states only
- No brand colors in the UI (products are the color)

## Testing Checklist

- [ ] All pages load without errors
- [ ] Dark mode toggles correctly
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1440px+)
- [ ] Images load with proper aspect ratios
- [ ] Hover states work smoothly
- [ ] Links navigate correctly
- [ ] Suspense boundaries show/hide properly
- [ ] Font loads and renders correctly
- [ ] No layout shift on page load
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen reader compatible

## Maintenance Notes

When adding new components:
1. Follow the monochrome color palette strictly
2. Use Inter font family
3. Apply uppercase + tracking for labels
4. Maintain generous spacing
5. Keep borders sharp or subtle rounded-sm
6. Test in both light and dark modes
7. Ensure responsive behavior
8. Add proper Suspense boundaries for async content

This design system should remain consistent across the entire application for a cohesive premium experience.
