'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
// import { Plus, Minus, Loader } from 'lucide-react';
import { Cart, CartItem } from '@/types';
// import { toast } from 'sonner';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { toast } from 'sonner';

const AddToCart = ({ item }: { item: CartItem }) => {
    const router = useRouter();
    const handleAddToCart = async () => {
        const res = await addItemToCart(item);
        if (!res || !res.success) {
            toast.error(res?.message || 'Failed to add item to cart');
            return;
        }

        // Handle success add to cart and when click add to cart button router.push to cart page
       toast('success', {
            description: res.message || 'Item added to cart',
            action: {
                label: 'View Cart',
                onClick: () => router.push('/cart')
            }
       })
    };

    return <Button onClick={handleAddToCart}>Add to Cart</Button>;
};

export default AddToCart;