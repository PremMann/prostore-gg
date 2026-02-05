'use client';

import { CartItem } from '@/types';
import { TELEGRAM_SUPPORT_URL, SHIPPING_PRICE, FREE_SHIPPING_MIN_PRICE, TAX_RATE } from '@/lib/constants/index';


const GUEST_CART_KEY = 'prostore_guest_cart';

export interface GuestCart {
    items: CartItem[];
    itemsPrice: string;
    shippingPrice: string;
    taxPrice: string;
    totalPrice: string;
}

// Round number to 2 decimal places
function round2(value: number | string): number {
    if (typeof value === 'number') {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    } else if (typeof value === 'string') {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    }
    throw new Error('Value is not a number or string');
}

// Format number with decimal places
function formatNumberWithDecimal(num: number): string {
    const [int, decimal] = num.toString().split('.');
    return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

// Calculate cart prices
function calcGuestCartPrices(items: CartItem[]) {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    );
    const shippingPrice = itemsPrice > FREE_SHIPPING_MIN_PRICE ? 0 : SHIPPING_PRICE;
    const taxPrice = round2(itemsPrice * TAX_RATE);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    return {
        itemsPrice: formatNumberWithDecimal(itemsPrice),
        shippingPrice: formatNumberWithDecimal(shippingPrice),
        taxPrice: formatNumberWithDecimal(taxPrice),
        totalPrice: formatNumberWithDecimal(totalPrice),
    };
}

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}

// Get guest cart from localStorage
export function getGuestCart(): GuestCart | null {
    if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
        return null;
    }

    try {
        const cartData = localStorage.getItem(GUEST_CART_KEY);
        if (!cartData) {
            return null;
        }
        return JSON.parse(cartData) as GuestCart;
    } catch {
        return null;
    }
}

// Save guest cart to localStorage
function saveGuestCart(cart: GuestCart): void {
    if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
        return;
    }

    try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
        // Dispatch custom event for cart updates
        window.dispatchEvent(new CustomEvent('guestCartUpdated', { detail: cart }));
    } catch (error) {
        console.error('Failed to save guest cart:', error);
    }
}

// Add item to guest cart
export function addToGuestCart(item: CartItem): { success: boolean; message: string } {
    try {
        const cart = getGuestCart();
        const items: CartItem[] = cart?.items || [];

        // Check if item already exists (same product, size, color)
        const existingIndex = items.findIndex(
            (i) => i.productId === item.productId &&
                i.size === item.size &&
                i.color === item.color
        );

        if (existingIndex >= 0) {
            // Increase quantity
            items[existingIndex].qty += item.qty;
        } else {
            // Add new item
            items.push(item);
        }

        const prices = calcGuestCartPrices(items);
        saveGuestCart({ items, ...prices });

        return {
            success: true,
            message: existingIndex >= 0
                ? `${item.name} quantity updated in cart`
                : `${item.name} added to cart`,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to add item to cart',
        };
    }
}

// Update guest cart item quantity
export function updateGuestCartItem(
    productId: string,
    quantity: number,
    size?: string,
    color?: string
): { success: boolean; message: string } {
    try {
        const cart = getGuestCart();
        if (!cart) {
            return { success: false, message: 'Cart not found' };
        }

        let items = cart.items;
        const itemIndex = items.findIndex(
            (i) => i.productId === productId &&
                i.size === size &&
                i.color === color
        );

        if (itemIndex < 0) {
            return { success: false, message: 'Item not found in cart' };
        }

        const itemName = items[itemIndex].name;

        if (quantity < 1) {
            // Remove item
            items = items.filter((_, index) => index !== itemIndex);
        } else {
            // Update quantity
            items[itemIndex].qty = quantity;
        }

        const prices = calcGuestCartPrices(items);
        saveGuestCart({ items, ...prices });

        return {
            success: true,
            message: quantity < 1
                ? `${itemName} removed from cart`
                : `${itemName} quantity updated`,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update cart',
        };
    }
}

// Remove item from guest cart
export function removeFromGuestCart(
    productId: string,
    size?: string,
    color?: string
): { success: boolean; message: string } {
    try {
        const cart = getGuestCart();
        if (!cart) {
            return { success: false, message: 'Cart not found' };
        }

        const itemToRemove = cart.items.find(
            (i) => i.productId === productId &&
                i.size === size &&
                i.color === color
        );

        if (!itemToRemove) {
            return { success: false, message: 'Item not found in cart' };
        }

        const items = cart.items.filter(
            (i) => !(i.productId === productId &&
                i.size === size &&
                i.color === color)
        );

        const prices = calcGuestCartPrices(items);
        saveGuestCart({ items, ...prices });

        return {
            success: true,
            message: `${itemToRemove.name} removed from cart`,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to remove item',
        };
    }
}

// Clear guest cart
export function clearGuestCart(): void {
    if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
        return;
    }

    try {
        localStorage.removeItem(GUEST_CART_KEY);
        window.dispatchEvent(new CustomEvent('guestCartUpdated', { detail: null }));
    } catch (error) {
        console.error('Failed to clear guest cart:', error);
    }
}

// Get guest cart item count
export function getGuestCartItemCount(): number {
    const cart = getGuestCart();
    if (!cart) return 0;
    return cart.items.reduce((acc, item) => acc + item.qty, 0);
}

// Generate Telegram checkout message
export function generateTelegramCheckoutMessage(cart: GuestCart): string {
    const itemsList = cart.items
        .map((item, index) => {
            let itemLine = `${index + 1}. ${item.name}`;
            if (item.size) itemLine += ` (Size: ${item.size})`;
            if (item.color) itemLine += ` (Color: ${item.color})`;
            itemLine += ` x${item.qty} - $${(Number(item.price) * item.qty).toFixed(2)}`;
            return itemLine;
        })
        .join('\n');

    const message = `🛒 New Order Request

📦 Items:
${itemsList}

💰 Order Summary:
Subtotal: $${cart.itemsPrice}
Shipping: $${cart.shippingPrice}
Tax: $${cart.taxPrice}
━━━━━━━━━━━━━━
Total: $${cart.totalPrice}

📍 Please confirm this order and provide your delivery address.`;

    return message;
}

// Open Telegram with checkout message
export function checkoutViaTelegram(cart: GuestCart): void {
    const message = generateTelegramCheckoutMessage(cart);
    const url = `${TELEGRAM_SUPPORT_URL}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Format currency for display
export function formatCurrency(amount: number | string | null): string {
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
    }
    return 'NaN';
}
