'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/cart/cart-context';
import { Minus, Plus, ShoppingBag, Trash, Loader2, CheckCircle2, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { trackMetaEvent } from '@/lib/meta-pixel';

export default function CartItems() {
    const { cart, updateItem, removeItem, clearCart } = useCart();
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [hasInitiatedCheckout, setHasInitiatedCheckout] = useState(false);

    useEffect(() => {
        if (cart && cart.items.length > 0 && !hasInitiatedCheckout) {
            setHasInitiatedCheckout(true);
            trackMetaEvent('InitiateCheckout', {
                content_ids: cart.items.map((i) => i.productId),
                content_type: 'product',
                value: Number(cart.itemsPrice),
                currency: 'USD',
                num_items: cart.items.reduce((acc, i) => acc + i.qty, 0),
            });
        }
    }, [cart, hasInitiatedCheckout]);

    // If no cart or empty items, show empty state
    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="p-6 rounded-full bg-muted">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <p className="text-muted-foreground">Looks like you haven&apos;t added any items to the cart yet.</p>
                <Link href="/">
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

    const handleClearCart = () => {
        clearCart();
        toast.success('Cart cleared');
    };

    const handleConfirmOrder = async () => {
        if (!phone.trim()) {
            toast.error('Please enter your phone number');
            return;
        }

        setIsSubmitting(true);
        const purchaseEventId = typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2) + Date.now().toString(36);

        try {
            const res = await fetch('/api/order-confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: phone.trim(),
                    items: items.map((i) => ({
                        name: i.name,
                        qty: i.qty,
                        price: i.price,
                        size: i.size,
                        color: i.color,
                    })),
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    purchaseEventId,
                }),
            });

            if (!res.ok) throw new Error('Failed to confirm order');

            // Trigger client-side Purchase event (coordinated CAPI call also happens on server endpoint)
            trackMetaEvent(
                'Purchase',
                {
                    content_ids: items.map((i) => i.productId),
                    content_type: 'product',
                    value: Number(totalPrice),
                    currency: 'USD',
                    num_items: items.reduce((acc, i) => acc + i.qty, 0),
                },
                {
                    phone: phone.trim(),
                },
                purchaseEventId
            );

            setIsConfirmed(true);
            clearCart();
            toast.success('Order confirmed! We will contact you shortly.');
        } catch {
            toast.error('Failed to confirm order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isConfirmed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
                <div className="p-6 rounded-full bg-green-50 dark:bg-green-950/30">
                    <CheckCircle2 className="w-14 h-14 text-green-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Order Confirmed!</h2>
                    <p className="text-muted-foreground max-w-sm">
                        Thank you! We&apos;ve received your order and will contact you at <span className="font-semibold text-foreground">{phone}</span> shortly.
                    </p>
                </div>
                <Link href="/">
                    <Button size="lg" variant="outline">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="wrapper py-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="h2-bold">Shopping Cart</h1>
                <Button variant="ghost" size="sm" onClick={handleClearCart} className="text-muted-foreground">
                    Clear Cart
                </Button>
            </div>

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

                {/* Order Summary Card */}
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

                            {/* Phone Number Input */}
                            <div className="space-y-2 pt-2">
                                <label htmlFor="phone-input" className="text-sm font-medium flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Your Phone Number
                                </label>
                                <input
                                    id="phone-input"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. 012 345 678"
                                    className="w-full px-3 py-2.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                                />
                                <p className="text-xs text-muted-foreground">
                                    We&apos;ll contact you at this number to confirm your order.
                                </p>
                            </div>

                            {/* Confirm Order Button */}
                            <Button
                                className="w-full h-12 text-sm font-semibold tracking-wide cursor-pointer"
                                onClick={handleConfirmOrder}
                                disabled={isSubmitting || !phone.trim()}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Confirming...
                                    </>
                                ) : (
                                    'Confirm Order'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
