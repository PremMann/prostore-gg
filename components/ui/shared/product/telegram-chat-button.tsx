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
            className="w-full h-12 rounded-none border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black tracking-[0.25em] text-xs font-semibold uppercase cursor-pointer transition-colors"
            onClick={handleChatClick}
        >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat to Buy
        </Button>
    );
}
