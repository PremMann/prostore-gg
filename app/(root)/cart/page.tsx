import CartItems from '@/components/cart/cart-items';
import { APP_NAME } from '@/lib/constants';

export const metadata = {
    title: `Shopping Cart - ${APP_NAME}`,
};

export default function CartPage() {
    return <CartItems />;
}
