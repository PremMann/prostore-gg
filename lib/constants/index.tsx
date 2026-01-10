export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "PROMELODY";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Modern e-commerce store";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT) || 4;
export const signInDefaultValues = {
  email: '',
  password: '',
};
export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};
export const shippingAddressDefaultValues = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ')
  : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const SHIPPING_PRICE = Number(process.env.NEXT_PUBLIC_SHIPPING_PRICE) || 10;
export const FREE_SHIPPING_MIN_PRICE = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_MIN_PRICE) || 50;
export const TAX_RATE = Number(process.env.NEXT_PUBLIC_TAX_RATE) || 0.15;

// Category hierarchy with subcategories
export const PRODUCT_CATEGORIES = [
  {
    name: "Men's Clothing",
    value: 'mens-clothing',
    subcategories: [
      { name: 'T-Shirts & Polos', value: 'mens-tshirts' },
      { name: 'Shirts', value: 'mens-shirts' },
      { name: 'Jeans & Pants', value: 'mens-pants' },
      { name: 'Jackets & Coats', value: 'mens-jackets' },
      { name: 'Activewear', value: 'mens-activewear' },
      { name: 'Suits & Blazers', value: 'mens-suits' },
    ]
  },
  {
    name: "Women's Clothing",
    value: 'womens-clothing',
    subcategories: [
      { name: 'Dresses', value: 'womens-dresses' },
      { name: 'Tops & Blouses', value: 'womens-tops' },
      { name: 'Jeans & Pants', value: 'womens-pants' },
      { name: 'Skirts', value: 'womens-skirts' },
      { name: 'Jackets & Coats', value: 'womens-jackets' },
      { name: 'Activewear', value: 'womens-activewear' },
    ]
  },
  {
    name: 'Accessories',
    value: 'accessories',
    subcategories: [
      { name: 'Bags & Wallets', value: 'bags-wallets' },
      { name: 'Watches', value: 'watches' },
      { name: 'Jewelry', value: 'jewelry' },
      { name: 'Sunglasses', value: 'sunglasses' },
      { name: 'Belts', value: 'belts' },
      { name: 'Hats & Caps', value: 'hats-caps' },
    ]
  },
  {
    name: 'Footwear',
    value: 'footwear',
    subcategories: [
      { name: 'Sneakers', value: 'sneakers' },
      { name: 'Boots', value: 'boots' },
      { name: 'Sandals', value: 'sandals' },
      { name: 'Formal Shoes', value: 'formal-shoes' },
      { name: 'Sports Shoes', value: 'sports-shoes' },
      { name: 'Slippers', value: 'slippers' },
    ]
  },
] as const;

// Helper function to get all category values (main + subcategories)
export const getAllCategoryValues = () => {
  const allCategories: string[] = [];
  PRODUCT_CATEGORIES.forEach(mainCat => {
    allCategories.push(mainCat.value);
    if (mainCat.subcategories) {
      mainCat.subcategories.forEach(subCat => {
        allCategories.push(subCat.value);
      });
    }
  });
  return allCategories;
};

// Helper function to get subcategories for a main category
export const getSubcategories = (mainCategory: string) => {
  const category = PRODUCT_CATEGORIES.find(cat => cat.value === mainCategory);
  return category?.subcategories || [];
};

// Helper function to find parent category
export const getParentCategory = (categoryValue: string) => {
  for (const mainCat of PRODUCT_CATEGORIES) {
    if (mainCat.value === categoryValue) {
      return null; // It's a main category
    }
    if (mainCat.subcategories?.some(sub => sub.value === categoryValue)) {
      return mainCat;
    }
  }
  return null;
};

// Helper function to check if a category is a main category
export const isMainCategory = (categoryValue: string) => {
  return PRODUCT_CATEGORIES.some(cat => cat.value === categoryValue);
};