'use client';

import { Truck, Shield, Headphones, RotateCcw } from 'lucide-react';

const features = [
    {
        icon: Truck,
        text: 'Free shipping $50+',
    },
    {
        icon: Shield,
        text: 'Secure checkout',
    },
    {
        icon: RotateCcw,
        text: '30-day returns',
    },
    {
        icon: Headphones,
        text: '24/7 support',
    },
];

const FeaturesSection = () => {
    return (
        <section className="bg-zinc-50 dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-800">
            <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
                <div className="flex flex-wrap items-center justify-center lg:justify-between gap-x-12 gap-y-6 py-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 group"
                            >
                                <Icon className="w-4 h-4 text-zinc-400 dark:text-zinc-600 group-hover:text-black dark:group-hover:text-white transition-colors duration-300" />
                                <span className="text-xs tracking-wide uppercase text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                                    {feature.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
