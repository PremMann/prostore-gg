'use client';

import { useCart } from '@/components/cart/cart-context';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartButton() {
    const { itemCount, isLoading } = useCart();

    return (
        <Button asChild variant="ghost" size="icon" className="relative">
            <Link href="/cart">
                <ShoppingCart className="w-5 h-5" />
                {!isLoading && itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount > 99 ? '99+' : itemCount}
                    </span>
                )}
                <span className="sr-only">Cart</span>
            </Link>
        </Button>
    );
}
