'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useFavorites } from './favorites-context';
import { useLanguage } from './language-context';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TELEGRAM_SUPPORT_URL } from '@/lib/constants';

export default function CatalogFloatingButton() {
    const { favorites } = useFavorites();
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    // Check visibility based on likes
    useEffect(() => {
        setIsVisible(favorites.length > 0);
    }, [favorites]);

    const handleSendToTelegram = () => {
        if (favorites.length === 0) return;

        // Create a readable list of products
        // Note: favorites contains slugs. Ideally we would map to names if available, 
        // but for now slugs will serve as identifiers.
        const productList = favorites.map(slug => {
            const name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            return `${name} (Code: ${slug})`;
        }).join(', ');
        const message = `Hi, I am interested in purchasing the following items: ${productList}`;

        const url = `${TELEGRAM_SUPPORT_URL}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');

        toast.success(t('chat.opening'));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <Button
                onClick={handleSendToTelegram}
                className={cn(
                    "pointer-events-auto shadow-lg hover:shadow-xl transition-all duration-300 transform translate-y-0",
                    "bg-[#229ED9] hover:bg-[#1E8BBF] text-white rounded-full h-14 px-8 text-base font-semibold tracking-wide flex items-center gap-3"
                )}
            >
                <div className="relative">
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#229ED9]">
                        {favorites.length}
                    </span>
                </div>
                {t('chat.send')}
            </Button>
        </div>
    );
}
