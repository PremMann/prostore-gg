import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SHIPPING_PRICE, FREE_SHIPPING_MIN_PRICE, TAX_RATE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert prisma object into a regular js object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// Format numnber with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === 'ZodError') {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );

    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    // Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // Handle other errors
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}

// Round number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not a number or string');
  }
}


export function calcPrice(items: { price: string; qty: number;[key: string]: unknown }[]) {
  // Calculate items price
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );

  // Calculate shipping price
  const shippingPrice = itemsPrice > FREE_SHIPPING_MIN_PRICE ? 0 : SHIPPING_PRICE;

  // Calculate tax price
  const taxPrice = round2(itemsPrice * TAX_RATE);

  // Calculate total price
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: formatNumberWithDecimal(itemsPrice),
    shippingPrice: formatNumberWithDecimal(shippingPrice),
    taxPrice: formatNumberWithDecimal(taxPrice),
    totalPrice: formatNumberWithDecimal(totalPrice),
  };
}


export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  } else if (typeof amount === 'string') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(amount));
  } else {
    return 'NaN';
  }
}