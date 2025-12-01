'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const categories = [
    {
        name: "Men's Clothing",
        slug: 'mens-clothing',
        description: 'Shirts, pants, outerwear & more',
        gradient: 'from-blue-600 to-cyan-600',
    },
    {
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: 'Dresses, tops, bottoms & activewear',
        gradient: 'from-pink-600 to-rose-600',
    },
    {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Bags, watches, jewelry & belts',
        gradient: 'from-purple-600 to-fuchsia-600',
    },
    {
        name: 'Footwear',
        slug: 'footwear',
        description: 'Shoes, sneakers, boots & sandals',
        gradient: 'from-orange-600 to-amber-600',
    },
];

const CategoriesSection = () => {
    return (
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
            <div className="wrapper">
                {/* Section Header */}
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                        Shop by Category
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover our curated collections across different categories
                    </p>
                    <div className="w-24 h-1 mx-auto bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-full" />
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.slug}
                            href={`/search?category=${encodeURIComponent(category.slug)}`}
                            className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-purple-500/50 dark:hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                        >
                            {/* Background Image */}
                            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
                                {/* Placeholder gradient background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20`} />

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                {/* Icon or pattern overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${category.gradient} opacity-30 blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6">
                                <div className="space-y-2 transform group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl font-bold text-white">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-200 opacity-90">
                                        {category.description}
                                    </p>

                                    {/* CTA */}
                                    <div className="flex items-center gap-2 text-white font-medium pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <span>Shop Now</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            {/* Top badge */}
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${category.gradient} text-white text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                                Explore
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-12">
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        View All Products
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
