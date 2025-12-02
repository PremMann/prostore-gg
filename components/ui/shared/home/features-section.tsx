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
        <section className="bg-[#0A0A0F] border-y border-white/5">
            <div className="wrapper py-4">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm">{feature.text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
