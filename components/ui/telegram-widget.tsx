'use client';

import { Send } from 'lucide-react';
import Link from 'next/link';
import { TELEGRAM_SUPPORT_URL } from '@/lib/constants';

const TelegramWidget = () => {
    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in duration-500 delay-1000">
            <Link
                href={TELEGRAM_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on Telegram"
            >
                <div className="relative flex items-center justify-center w-14 h-14 bg-[#229ED9] rounded-full shadow-xl text-white hover:bg-[#1E8BBF] hover:scale-110 active:scale-90 transition-all">
                    <div className="absolute -inset-1 rounded-full bg-[#229ED9]/30 animate-pulse"></div>
                    <Send className="w-7 h-7 relative z-10 ml-[-2px] mt-[2px]" />
                </div>
            </Link>
        </div>
    );
};

export default TelegramWidget;
