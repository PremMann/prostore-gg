'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { TELEGRAM_SUPPORT_URL } from '@/lib/constants';
import { Product } from '@/types';

interface TelegramChatButtonProps {
    product: Product;
}

export default function TelegramChatButton({ product }: TelegramChatButtonProps) {
    const handleChatClick = () => {
        const productInfo = product.productCode
            ? `${product.name} (Code: ${product.productCode})`
            : product.name;

        const message = `Hi, I'm interested in: ${productInfo}`;
        const url = `${TELEGRAM_SUPPORT_URL}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
    };

    return (
        <Button
            variant="outline"
            className="w-full h-12 text-lg"
            onClick={handleChatClick}
        >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat to Buy
        </Button>
    );
}
