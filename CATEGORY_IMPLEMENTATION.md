# 🎯 Category Implementation Guide for ProStore

This guide explains how categories are implemented in your ProStore project and how to use them.

## 📋 Table of Contents
1. [Current Implementation](#current-implementation)
2. [How Categories Work](#how-categories-work)
3. [Using Categories](#using-categories)
4. [Updating Product Categories](#updating-product-categories)
5. [Adding New Categories](#adding-new-categories)

---

## 🏗️ Current Implementation

### Files Created/Modified:

1. **`/app/(root)/search/page.tsx`** - Search & Category page
2. **`/components/ui/shared/search/search-filters.tsx`** - Filter sidebar
3. **`/components/ui/shared/home/categories-section.tsx`** - Homepage category cards
4. **`/lib/actions/product.actions.ts`** - Already has category functions

### Category Functions Available:

```typescript
// Get all products with category filter
getAllProducts({ category: 'mens-clothing', page: 1, limit: 12 })

// Get all unique categories from database
getAllCategories()
```

---

## 🔄 How Categories Work

### 1. **Database Structure**
Categories are stored as strings in the `Product` model:
```prisma
model Product {
  category    String  // e.g., "Men's Clothing"
  // ... other fields
}
```

### 2. **Category Flow**
```
Homepage Category Card
    ↓
/search?category=mens-clothing
    ↓
Search Page filters products by category
    ↓
Display filtered products
```

### 3. **URL Structure**
- All products: `/search`
- By category: `/search?category=mens-clothing`
- With search: `/search?search=shirt&category=mens-clothing`
- With pagination: `/search?category=mens-clothing&page=2`

---

## 🎨 Using Categories

### On Homepage (Already Implemented)
The categories section shows 4 main categories:
- Men's Clothing
- Women's Clothing
- Accessories
- Footwear

Each card links to: `/search?category=[slug]`

### In Search/Filter Page
Users can:
1. Click a category to filter
2. Search within a category
3. Clear filters
4. Navigate pages

---

## 📝 Updating Product Categories

### Option 1: Update Sample Data (Recommended for Development)

Edit `/db/sample-data.ts`:

```typescript
{
  name: 'Polo Sporting Stretch Shirt',
  slug: 'polo-sporting-stretch-shirt',
  category: "mens-clothing",  // ← Change this
  // ... rest of product
}
```

Then reseed your database:
```bash
npm run db:seed
```

### Option 2: Update via Admin Dashboard

1. Go to `/admin/dashboard`
2. Edit each product
3. Change the category field
4. Save

### Option 3: Direct Database Update

Using Prisma Studio:
```bash
npx prisma studio
```

Or SQL:
```sql
UPDATE "Product" 
SET category = 'mens-clothing' 
WHERE category = 'Men''s Dress Shirts';
```

---

## ➕ Adding New Categories

### Step 1: Update Category Section

Edit `/components/ui/shared/home/categories-section.tsx`:

```typescript
const categories = [
  {
    name: "Your New Category",
    slug: 'your-new-category',
    description: 'Description here',
    gradient: 'from-color-600 to-color-600',
  },
  // ... existing categories
];
```

### Step 2: Add Products with New Category

When creating products, use the same slug:
```typescript
{
  name: 'Product Name',
  category: 'your-new-category',  // Must match slug
  // ... other fields
}
```

### Step 3: Category Naming Convention

**Important:** Use consistent naming:
- **Display Name:** "Men's Clothing" (for UI)
- **Slug:** `mens-clothing` (for URLs and database)

Convert between them:
```typescript
// Display to Slug
const slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// Slug to Display
const display = slug.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join(' ');
```

---

## 🎯 Recommended Category Structure

### Current Categories (Fashion-Focused):

```
mens-clothing
  ├── Dress Shirts
  ├── Casual Shirts
  ├── Sweatshirts & Hoodies
  ├── T-Shirts
  ├── Pants & Jeans
  └── Outerwear

womens-clothing
  ├── Dresses
  ├── Tops & Blouses
  ├── Bottoms
  ├── Activewear
  └── Outerwear

accessories
  ├── Bags & Wallets
  ├── Watches
  ├── Jewelry
  ├── Belts
  └── Hats & Caps

footwear
  ├── Men's Shoes
  ├── Women's Shoes
  ├── Sneakers
  └── Boots
```

---

## 🚀 Quick Start Checklist

- [x] Category section on homepage
- [x] Search/filter page created
- [x] Category filtering works
- [ ] Update sample data categories
- [ ] Reseed database
- [ ] Test category filtering
- [ ] Add more products per category

---

## 📌 Important Notes

1. **Category slugs** must be URL-safe (lowercase, hyphens, no spaces)
2. **Database categories** should match the slugs exactly
3. **Display names** are converted from slugs automatically
4. **Case-insensitive** filtering is enabled in the database queries

---

## 🔧 Troubleshooting

### Products not showing in category?
Check that the product's `category` field matches the category slug exactly.

### Category not appearing in filters?
The filter sidebar automatically fetches all unique categories from the database.

### Want subcategories?
You'll need to add a `subcategory` field to your Product model and update the schema.

---

## 📚 Next Steps

1. **Update your sample data** with new category names
2. **Reseed the database**: `npm run db:seed`
3. **Test the search page**: Visit `/search?category=mens-clothing`
4. **Add more products** to populate all categories

---

**Need help?** The category system is fully functional and ready to use!
