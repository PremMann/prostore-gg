# Homepage Simplification & Product Page Redesign Plan

## Overview
Simplify the ProStore homepage and redesign the product detail page for a cleaner, more professional user experience.

## Current State Analysis

### Homepage (`app/(root)/page.tsx`)
- ✅ Hero section already commented out
- ✅ Features section already commented out
- ❌ Featured Products section - NEEDS REMOVAL
- ❌ New Arrivals section - NEEDS REMOVAL
- ❌ Best Sellers section - NEEDS REMOVAL
- ✅ Should keep: Product listing/grid only

### Navigation (`components/ui/shared/header/`)
**Desktop Navigation (`category-nav.tsx`):**
- ❌ "Catalog" menu item - NEEDS REMOVAL
- ❌ "Men's Clothing" category - NEEDS REMOVAL
- ❌ "Women's Clothing" category - NEEDS REMOVAL
- ❌ "Accessories" category - NEEDS REMOVAL
- ❌ "Footwear" category - NEEDS REMOVAL

**Mobile Navigation (`menu.tsx`):**
- Same categories in mobile menu - NEEDS REMOVAL
- ✅ Keep: Cart, User button, Language toggle, Mode toggle

### Product Detail Page (`app/(root)/product/[slug]/page.tsx`)
- Current: 3-column layout (images, details, action card)
- Needs: Modern 2-column layout with better spacing and professional design

## Implementation Steps

### Step 1: Simplify Homepage
**File:** `app/(root)/page.tsx`

Replace the three product sections (Featured, New Arrivals, Best Sellers) with a single comprehensive product list that shows all products.

**Changes:**
- Remove `FeaturedProducts` component
- Remove `NewArrivalsSection` component
- Remove `BestSellersSection` component
- Create a single `AllProductsSection` component that displays all products in a grid
- Use existing `ProductList` component with appropriate props

### Step 2: Remove Category Navigation (Desktop)
**File:** `components/ui/shared/header/category-nav.tsx`

Remove the entire category navigation component since we're removing all category links.

**Changes:**
- Return `null` or an empty fragment instead of the navigation
- This will hide the desktop category menu entirely

### Step 3: Simplify Mobile Menu
**File:** `components/ui/shared/header/menu.tsx`

Remove category navigation from the mobile menu.

**Changes:**
- Remove the "Catalog" section heading
- Remove the catalog link
- Remove the category links loop
- Keep only: Language toggle, Mode toggle, Cart, User button

### Step 4: Redesign Product Detail Page
**File:** `app/(root)/product/[slug]/page.tsx`

Create a modern, professional 2-column layout.

**New Design:**
- **Left Column (60% width):** Product image gallery
- **Right Column (40% width):** 
  - Product name (large, bold)
  - Product code (if available)
  - Price (prominent)
  - Rating & reviews
  - Size & color selectors (if applicable)
  - Stock status
  - Quantity selector
  - Add to cart button (primary CTA)
  - Telegram "Chat to Buy" button (secondary CTA)
  - Collapsible description section
- **Mobile:** Stack vertically
- **Styling:** Clean, ample white space, modern typography

### Step 5: Create New Product Action Component (Optional)
**File:** `components/ui/shared/product/product-actions.tsx`

If needed, create a dedicated component for product actions (Add to Cart, Telegram Chat) to keep the product page clean.

### Step 6: Testing & Verification
- ✅ Run `npm run dev` and verify no errors
- ✅ Check homepage shows only product grid
- ✅ Check navigation shows only essential items
- ✅ Check product detail page has new design
- ✅ Test on mobile viewport
- ✅ Test dark/light mode
- ✅ Verify all interactive elements work

## Files to Modify

1. `app/(root)/page.tsx` - Simplify homepage
2. `components/ui/shared/header/category-nav.tsx` - Remove category nav
3. `components/ui/shared/header/menu.tsx` - Simplify mobile menu
4. `app/(root)/product/[slug]/page.tsx` - Redesign product page

## Files to Check (May Need Updates)

1. `lib/actions/product.actions.ts` - May need to add `getAllProducts` function
2. `components/ui/shared/product/product-list.tsx` - Verify it can handle larger product sets
3. Product-related components in `components/ui/shared/product/`

## Success Criteria

- [ ] Homepage loads with only product grid visible
- [ ] Navigation menu shows only essential items (no categories)
- [ ] Product detail page has modern, clean 2-column design
- [ ] All interactive elements work correctly
- [ ] No console errors or TypeScript warnings
- [ ] Application builds successfully
- [ ] Responsive on mobile and desktop
- [ ] Dark/light mode works correctly
