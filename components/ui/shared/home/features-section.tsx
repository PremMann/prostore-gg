'use client';

import { Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const features = [
    {
        icon: Truck,
        title: 'Free Shipping',
        description: 'On all orders over $50',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Shield,
        title: 'Secure Payment',
        description: '100% secure transactions',
        gradient: 'from-green-500 to-emerald-500',
    },
    {
        icon: Headphones,
        title: '24/7 Support',
        description: 'Dedicated customer service',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        icon: CreditCard,
        title: 'Easy Returns',
        description: '30-day return policy',
        gradient: 'from-orange-500 to-red-500',
    },
];

const FeaturesSection = () => {
    return (
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
            <div className="wrapper">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-purple-500/50 dark:hover:border-purple-400/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                            >
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative space-y-4">
                                    {/* Icon */}
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
