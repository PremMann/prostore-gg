'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useFavorites } from './favorites-context';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CatalogFloatingButton() {
    const { favorites } = useFavorites();
    const [isVisible, setIsVisible] = useState(false);
    const [pageId, setPageId] = useState<string | null>(null);

    // Check visibility based on likes
    useEffect(() => {
        setIsVisible(favorites.length > 0);
    }, [favorites]);

    // Load Page ID from env
    useEffect(() => {
        // In a real app, this should be in .env.local
        // Using a fallback for demo if not set.
        const id = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;
        if (id) {
            setPageId(id);
        } else {
            console.warn("NEXT_PUBLIC_FACEBOOK_PAGE_ID is not set in .env");
        }
    }, []);

    const handleSendToMessenger = () => {
        if (favorites.length === 0) return;

        // Construct the m.me link
        // Format: https://m.me/<PAGE_ID>?ref=interested_<slug1>,<slug2>

        // NOTE: Facebook requires the Page ID to be numeric usually, or the username.
        // The Ref param is passed to the bot.
        const refParam = `interested_${favorites.join(',')}`;

        // If no page ID, we can't really link deep. Let's assume a placeholder or error.
        // Using a generic page or prompting setup if missing.
        const targetId = pageId || '925459360650971';

        // If we don't have a real ID, we might just open messenger.com but the ref won't attach well 
        // without a specific user/page target.
        // For now, we direct to the m.me link.

        const url = `https://m.me/${targetId}?ref=${encodeURIComponent(refParam)}`;

        window.open(url, '_blank');

        toast.success('Opening Messenger...');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <Button
                onClick={handleSendToMessenger}
                className={cn(
                    "pointer-events-auto shadow-lg hover:shadow-xl transition-all duration-300 transform translate-y-0",
                    "bg-blue-600 hover:bg-blue-700 text-white rounded-full h-14 px-8 text-base font-semibold tracking-wide flex items-center gap-3"
                )}
            >
                <div className="relative">
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600">
                        {favorites.length}
                    </span>
                </div>
                Send to Chat
            </Button>
        </div>
    );
}
