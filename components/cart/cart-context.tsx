'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/types';
import {
    getGuestCart,
    addToGuestCart,
    updateGuestCartItem,
    removeFromGuestCart,
    clearGuestCart,
    GuestCart
} from '@/lib/cart-storage';

interface CartContextType {
    cart: GuestCart | null;
    itemCount: number;
    isLoading: boolean;
    addItem: (item: CartItem) => { success: boolean; message: string };
    updateItem: (productId: string, quantity: number, size?: string, color?: string) => { success: boolean; message: string };
    removeItem: (productId: string, size?: string, color?: string) => { success: boolean; message: string };
    clearCart: () => void;
    refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<GuestCart | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Calculate item count
    const itemCount = cart?.items.reduce((acc, item) => acc + item.qty, 0) || 0;

    // Load cart on mount
    const refreshCart = useCallback(() => {
        const guestCart = getGuestCart();
        setCart(guestCart);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refreshCart();

        // Listen for cart updates from other tabs/components
        const handleCartUpdate = (event: CustomEvent<GuestCart | null>) => {
            setCart(event.detail);
        };

        window.addEventListener('guestCartUpdated', handleCartUpdate as EventListener);

        return () => {
            window.removeEventListener('guestCartUpdated', handleCartUpdate as EventListener);
        };
    }, [refreshCart]);

    const addItem = useCallback((item: CartItem) => {
        const result = addToGuestCart(item);
        if (result.success) {
            refreshCart();
        }
        return result;
    }, [refreshCart]);

    const updateItem = useCallback((
        productId: string,
        quantity: number,
        size?: string,
        color?: string
    ) => {
        const result = updateGuestCartItem(productId, quantity, size, color);
        if (result.success) {
            refreshCart();
        }
        return result;
    }, [refreshCart]);

    const removeItem = useCallback((
        productId: string,
        size?: string,
        color?: string
    ) => {
        const result = removeFromGuestCart(productId, size, color);
        if (result.success) {
            refreshCart();
        }
        return result;
    }, [refreshCart]);

    const clearCartHandler = useCallback(() => {
        clearGuestCart();
        setCart(null);
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                itemCount,
                isLoading,
                addItem,
                updateItem,
                removeItem,
                clearCart: clearCartHandler,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
