export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "PROMELODY";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Modern e-commerce store";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT) || 4;

export const TELEGRAM_SUPPORT_URL = 'https://t.me/prem_mann';

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

// Simplified product categories
export const PRODUCT_CATEGORIES = [
  {
    name: 'Shirts',
    value: 'shirts',
  },
  {
    name: 'Pants',
    value: 'pants',
  },
  {
    name: 'Accessories',
    value: 'accessories',
  },
] as const;

// Category-specific size options
export const CATEGORY_SIZES: Record<string, string[]> = {
  shirts: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  pants: ['28', '30', '32', '34', '36', '38', '40', '42'],
  accessories: ['One Size', 'S', 'M', 'L'],
};

// Default sizes (used when no category is selected)
export const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Helper function to get all category values
export const getAllCategoryValues = () => {
  return PRODUCT_CATEGORIES.map(cat => cat.value);
};

// Helper function to get sizes for a category
export const getSizesForCategory = (category: string): string[] => {
  return CATEGORY_SIZES[category] || DEFAULT_SIZES;
};