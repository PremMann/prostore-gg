import { getMyCart, removeItemFromCart, updateCartItemQuantity } from '@/lib/actions/cart.actions';
import { calcPrice } from '@/lib/utils';
import { CartItem } from '@/types';
import { Minus, Plus, ShoppingBag, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

export const metadata = {
    title: `Shopping Cart - ${APP_NAME}`,
};

export default async function CartPage() {
    const cart = await getMyCart();

    // If no cart or empty items, show empty state
    if (!cart || (cart.items as CartItem[]).length === 0) {
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

    const items = cart.items as CartItem[];
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(items);

    return (
        <div className="wrapper py-10">
            <h1 className="h2-bold mb-6">Shopping Cart</h1>

            <div className="grid md:grid-cols-12 gap-8">
                {/* Cart Items List */}
                <div className="md:col-span-8 space-y-4">
                    <Card>
                        <CardContent className="p-4 gap-4 flex flex-col">
                            {items.map((item) => (
                                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex flex-col sm:flex-row gap-4 items-center border-b last:border-none pb-4 last:pb-0">
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
                                            {formatCurrency(item.price)}
                                        </div>
                                    </div>

                                    {/* Quantity Adjuster */}
                                    <div className="flex items-center gap-2">
                                        {/* Use Server Actions forms for interactivity without full client component overhead? 
                                    Actually the prompt implies using client components or interactive elements. 
                                    I will use a client wrapper for the quantity buttons or use form actions.
                                    Using form actions is cleanest for "server components first". 
                                    BUT to make it "instant" and "smooth", client components are better.
                                    I will embed the logic in a small client component for the row actions? 
                                    Or just standard form actions.
                                    Prompt requested: "List View: ... quantity adjuster (+/- input)".
                                    I will create a specific `CartItemCodes` component to handle the row interactivity?
                                    Or just reuse `AddToCart` component if I fix it?
                                    
                                    Let's define a small CartItemAction component inline or separately.
                                    I'll create `components/ui/shared/cart/cart-item-row.tsx`.
                                    Actually, reusing `add-to-cart` logic is good but UI is different.
                                */}
                                        <form action={async () => {
                                            'use server';
                                            await updateCartItemQuantity(item.productId, item.qty - 1);
                                        }}>
                                            <Button variant="outline" size="icon" className="w-8 h-8">
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                        </form>
                                        <span className="w-8 text-center font-medium">{item.qty}</span>
                                        <form action={async () => {
                                            'use server';
                                            await updateCartItemQuantity(item.productId, item.qty + 1);
                                        }}>
                                            <Button variant="outline" size="icon" className="w-8 h-8">
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                        </form>
                                    </div>

                                    <div className="w-20 text-right hidden sm:block font-bold">
                                        {formatCurrency(item.price)}
                                    </div>

                                    <form action={async () => {
                                        'use server';
                                        await removeItemFromCart(item.productId);
                                    }}>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </form>
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
                                    <span>{itemsPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{shippingPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{taxPrice}</span>
                                </div>

                                <div className="h-px bg-border my-4" />

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{totalPrice}</span>
                                </div>
                            </div>

                            <Link href="/shipping" className="w-full inline-block">
                                <Button className="w-full" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
