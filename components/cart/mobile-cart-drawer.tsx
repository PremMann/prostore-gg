'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '@/components/cart/cart-context';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { checkoutViaTelegram } from '@/lib/cart-storage';
import { useLanguage } from '@/components/catalog/language-context';

export default function MobileCartDrawer() {
    const { cart, itemCount, updateItem, removeItem, isLoading } = useCart();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if we're on mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Don't render on desktop or while loading
    if (!isMobile || isLoading) return null;

    const handleCheckout = () => {
        if (cart) {
            checkoutViaTelegram(cart);
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Floating Cart Button - Bottom Center */}
            <button
                onClick={() => setIsOpen(true)}
                className="
          fixed bottom-6 left-1/2 -translate-x-1/2 z-40
          flex items-center gap-2
          px-6 py-3.5
          bg-black/90 dark:bg-white/90
          text-white dark:text-black
          rounded-full
          shadow-2xl shadow-black/25
          backdrop-blur-xl
          transition-all duration-300
          hover:scale-105 active:scale-95
          border border-white/10 dark:border-black/10
        "
            >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium text-sm">{t('header.cart')}</span>
                {itemCount > 0 && (
                    <span className="
            flex items-center justify-center
            min-w-[22px] h-[22px] px-1.5
            bg-white dark:bg-black
            text-black dark:text-white
            text-xs font-bold
            rounded-full
          ">
                        {itemCount > 99 ? '99+' : itemCount}
                    </span>
                )}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-up Drawer */}
            <div
                className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-white dark:bg-zinc-900
          rounded-t-3xl
          shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          max-h-[85vh] overflow-hidden
          border-t border-zinc-200 dark:border-zinc-800
        `}
            >
                {/* Handle + Header */}
                <div className="sticky top-0 bg-white dark:bg-zinc-900 px-6 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    {/* Drag handle */}
                    <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full mx-auto mb-4" />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                            <h2 className="text-lg font-semibold text-black dark:text-white">
                                {t('cart.title')}
                                {itemCount > 0 && (
                                    <span className="ml-2 text-sm font-normal text-zinc-500">
                                        ({itemCount} {itemCount === 1 ? t('cart.item') : t('cart.items')})
                                    </span>
                                )}
                            </h2>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-zinc-500" />
                        </button>
                    </div>
                </div>

                {/* Cart Content */}
                <div className="overflow-y-auto max-h-[50vh] px-6 py-4">
                    {!cart || cart.items.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <ShoppingCart className="w-8 h-8 text-zinc-400" />
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-4">{t('cart.empty')}</p>
                            <Button variant="outline" onClick={() => setIsOpen(false)} asChild>
                                <Link href="/">{t('cart.continue')}</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.items.map((item, index) => (
                                <div
                                    key={`${item.productId}-${item.size}-${item.color}-${index}`}
                                    className="flex gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm text-black dark:text-white line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <div className="flex gap-2 mt-1 text-xs text-zinc-500">
                                            {item.size && <span>{t('cart.size')}: {item.size}</span>}
                                            {item.color && <span>{t('cart.color')}: {item.color}</span>}
                                        </div>
                                        <p className="font-semibold text-sm text-black dark:text-white mt-1">
                                            ${(Number(item.price) * item.qty).toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeItem(item.productId, item.size, item.color)}
                                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>

                                        <div className="flex items-center gap-2 bg-white dark:bg-zinc-700 rounded-lg p-1">
                                            <button
                                                onClick={() => updateItem(item.productId, item.qty - 1, item.size, item.color)}
                                                className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-600 rounded transition-colors"
                                                disabled={item.qty <= 1}
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                                            <button
                                                onClick={() => updateItem(item.productId, item.qty + 1, item.size, item.color)}
                                                className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-600 rounded transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer - Summary & Checkout */}
                {cart && cart.items.length > 0 && (
                    <div className="sticky bottom-0 bg-white dark:bg-zinc-900 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800">
                        {/* Order Summary */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">{t('cart.subtotal')}</span>
                                <span className="font-medium text-black dark:text-white">${cart.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">{t('cart.shipping')}</span>
                                <span className="font-medium text-black dark:text-white">${cart.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between text-base font-semibold pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <span className="text-black dark:text-white">{t('cart.total')}</span>
                                <span className="text-black dark:text-white">${cart.totalPrice}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <Button
                            onClick={handleCheckout}
                            className="w-full py-6 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            {t('cart.checkout')}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
