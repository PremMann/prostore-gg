'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
// import { Plus, Minus, Loader } from 'lucide-react';
import { Cart, CartItem } from '@/types';
// import { toast } from 'sonner';
// import { addItemToCart } from '@/lib/actions/cart.actions';

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
    const router = useRouter();
    const handleAddToCart = async () => {
        return true; // Temporary return to avoid errors while editing
    //     const res = await addItemToCart({ item });
    //     if (!res.success) {
    //         toast.error(res.message); 
    //         return;
    //     }
    //     // Handle success add to cart and when click add to cart button router.push to cart page
    //    toast('success', {
    //         description: `${item.name} added to cart`,
    //         action: {
    //             label: 'View Cart',
    //             onClick: () => router.push('/cart')
    //         }
    //    })
    };

    return <Button onClick={handleAddToCart}>Add to Cart</Button>;
};

export default AddToCart;