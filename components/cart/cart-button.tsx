'use client';

import { useCart } from '@/components/cart/cart-context';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartButton() {
    const { itemCount, isLoading } = useCart();

    return (
        <Link href="/cart" className="text-sm tracking-widest font-bold hover:opacity-70 transition-opacity">
            BAG ({!isLoading ? itemCount : 0})
        </Link>
    );
}
