'use client';

import { useCart } from '@/components/cart/cart-context';
import { checkoutViaTelegram } from '@/lib/cart-storage';
import { Minus, Plus, ShoppingBag, Trash, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CartItems() {
    const { cart, updateItem, removeItem, clearCart } = useCart();

    // If no cart or empty items, show empty state
    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="p-6 rounded-full bg-muted">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <p className="text-muted-foreground">Looks like you haven&apos;t added any items to the cart yet.</p>
                <Link href="/search">
                    <Button size="lg" className="mt-4">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    const { items, itemsPrice, shippingPrice, totalPrice } = cart;

    const handleUpdateQuantity = (productId: string, newQty: number, size?: string, color?: string) => {
        const result = updateItem(productId, newQty, size, color);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    const handleRemoveItem = (productId: string, size?: string, color?: string) => {
        const result = removeItem(productId, size, color);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    const handleTelegramCheckout = () => {
        checkoutViaTelegram(cart);
        toast.success('Opening Telegram to complete your order...');
    };

    const handleClearCart = () => {
        clearCart();
        toast.success('Cart cleared');
    };

    return (
        <div className="wrapper py-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="h2-bold">Shopping Cart</h1>
                <Button variant="ghost" size="sm" onClick={handleClearCart} className="text-muted-foreground">
                    Clear Cart
                </Button>
            </div>

            {/* Guest Cart Notice */}
            {/* <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Guest Cart</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">Your cart is saved locally. Sign in to save it permanently.</p>
                    </div>
                </div>
            </div> */}

            <div className="grid md:grid-cols-12 gap-8">
                {/* Cart Items List */}
                <div className="md:col-span-8 space-y-4">
                    <Card>
                        <CardContent className="p-4 gap-4 flex flex-col">
                            {items.map((item, index) => (
                                <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="flex flex-col sm:flex-row gap-4 items-center border-b last:border-none pb-4 last:pb-0">
                                    <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-1 text-center sm:text-left">
                                        <Link
                                            href={`/product/${item.slug}`}
                                            className="font-bold hover:underline line-clamp-1"
                                        >
                                            {item.name}
                                        </Link>
                                        <div className="text-sm text-muted-foreground">
                                            {item.size && <span className="mr-2">Size: {item.size}</span>}
                                            {item.color && <span>Color: {item.color}</span>}
                                        </div>
                                        <div className="font-bold sm:hidden">
                                            ${(Number(item.price) * item.qty).toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Quantity Adjuster */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8"
                                            onClick={() => handleUpdateQuantity(item.productId, item.qty - 1, item.size, item.color)}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="w-8 text-center font-medium">{item.qty}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8"
                                            onClick={() => handleUpdateQuantity(item.productId, item.qty + 1, item.size, item.color)}
                                        >
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div>

                                    <div className="w-20 text-right hidden sm:block font-bold">
                                        ${(Number(item.price) * item.qty).toFixed(2)}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                                    >
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Card */}
                <div className="md:col-span-4">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-lg">Order Summary</h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${itemsPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>${shippingPrice}</span>
                                </div>


                                <div className="h-px bg-border my-4" />

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${totalPrice}</span>
                                </div>
                            </div>

                            {/* Primary CTA: Telegram Checkout */}
                            <Button
                                className="w-full h-12 text-lg bg-[#229ED9] hover:bg-[#1E8BBF] cursor-pointer"
                                size="lg"
                                onClick={handleTelegramCheckout}
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Checkout via Telegram
                            </Button>

                            {/* Secondary CTA: Sign In */}
                            {/* <Link href="/sign-in?callbackUrl=/cart" className="w-full inline-block">
                                <Button className="w-full" size="lg" variant="outline">
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Sign In to Save Cart
                                </Button>
                            </Link> */}

                            <p className="text-xs text-muted-foreground text-center">
                                Your order will be confirmed via Telegram chat
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
