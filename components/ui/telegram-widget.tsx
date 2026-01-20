'use client';

import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import Link from 'next/link';
import { TELEGRAM_SUPPORT_URL } from '@/lib/constants';

const TelegramWidget = () => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
            className="fixed bottom-6 right-6 z-50"
        >
            <Link
                href={TELEGRAM_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on Telegram"
            >
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative flex items-center justify-center w-14 h-14 bg-[#229ED9] rounded-full shadow-xl text-white hover:bg-[#1E8BBF] transition-colors"
                >
                    <div className="absolute -inset-1 rounded-full bg-[#229ED9]/30 animate-pulse"></div>
                    <Send className="w-7 h-7 relative z-10 ml-[-2px] mt-[2px]" />
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default TelegramWidget;
