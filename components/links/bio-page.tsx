'use client';

import { motion, Variants } from 'framer-motion';
import { useLanguage } from '@/components/catalog/language-context';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Phone, MapPin, Send, Globe, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import ModeToggle from '@/components/ui/shared/header/mode-toggle';
import LanguageToggle from '@/components/ui/shared/header/language-toggle';

const BioPage = () => {
    const { t } = useLanguage();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const socialLinks = [
        { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
        { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
        { icon: Globe, href: 'https://tiktok.com', label: 'TikTok' }, // Using Globe as placeholder for TikTok if not available in this lucide version
    ];

    const mainActions = [
        {
            icon: Send,
            label: t('links.chat'),
            href: 'https://t.me/promelodychannel',
            color: 'bg-blue-500 hover:bg-blue-600 text-white border-none'
        },
        {
            icon: Phone,
            label: t('links.call'),
            href: 'tel:+855978601549',
            color: 'bg-green-500 hover:bg-green-600 text-white border-none'
        },
        {
            icon: MapPin,
            label: t('links.directions'),
            href: 'https://www.google.com/maps/@11.5038022,104.8744175,21z?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D',
            color: 'bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 dark:hover:bg-zinc-600 text-white border-none'
        },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-950 dark:to-zinc-900 overflow-hidden relative">
            {/* Top Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
                <LanguageToggle />
                <ModeToggle />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md flex flex-col items-center gap-6 z-10"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-full blur-lg opacity-70 animate-pulse" />
                        <div className="relative w-28 h-28 rounded-full bg-white dark:bg-black p-1 shadow-2xl overflow-hidden ring-4 ring-white/50 dark:ring-white/10">
                            <Image
                                src="/images/gg.png"
                                alt="Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
                            {APP_NAME}
                        </h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium max-w-[280px]">
                            {t('links.description')}
                        </p>
                    </div>
                </motion.div>

                {/* Social Row */}
                <motion.div variants={itemVariants} className="flex gap-4">
                    {socialLinks.map((social, i) => (
                        <Link
                            key={i}
                            href={social.href}
                            target="_blank"
                            className="p-3 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-sm hover:scale-110 transition-transform text-zinc-700 dark:text-zinc-200"
                        >
                            <social.icon className="w-5 h-5" />
                        </Link>
                    ))}
                </motion.div>

                {/* Main Action Buttons */}
                <motion.div variants={itemVariants} className="w-full flex flex-col gap-3 mt-4">
                    {mainActions.map((action, i) => (
                        <Button
                            key={i}
                            asChild
                            className={`w-full h-14 rounded-2xl text-lg font-semibold shadow-lg backdrop-blur-sm transition-transform active:scale-95 ${action.color}`}
                        >
                            <Link href={action.href} target="_blank">
                                <action.icon className="mr-3 w-5 h-5" />
                                {action.label}
                            </Link>
                        </Button>
                    ))}
                    <Button
                        asChild
                        variant="outline"
                        className="w-full h-14 rounded-2xl text-lg font-semibold shadow-sm backdrop-blur-md border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-black dark:text-white"
                    >
                        <Link href="/">
                            <Globe className="mr-3 w-5 h-5" />
                            {t('header.home')}
                        </Link>
                    </Button>
                </motion.div>

                {/* Latest Drop Card */}
                <motion.div variants={itemVariants} className="w-full mt-2">
                    <Link href="/catalog" className="block relative group overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-90 transition-opacity group-hover:opacity-100" />
                        <div className="relative p-6 flex items-center justify-between text-white">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">
                                    {t('links.latest_drop')}
                                </span>
                                <span className="text-xl font-bold">
                                    {t('header.catalog')}
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Footer Copyright */}
                <motion.div variants={itemVariants} className="mt-8 text-xs text-zinc-400">
                    © 2025 {APP_NAME}
                </motion.div>

            </motion.div>
        </div>
    );
};

export default BioPage;
