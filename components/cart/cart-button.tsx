'use client';

import { useCart } from '@/components/cart/cart-context';
import Link from 'next/link';

export default function CartButton() {
    const { itemCount, isLoading } = useCart();

    return (
        <Link href="/cart" className="text-sm tracking-widest font-bold hover:opacity-70 transition-opacity">
            CART ({!isLoading ? itemCount : 0})
        </Link>
    );
}
