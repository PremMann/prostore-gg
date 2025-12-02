'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
    {
        name: "Men's",
        slug: 'mens-clothing',
        icon: '👔',
        color: 'from-blue-500/20 to-cyan-500/20',
        hoverColor: 'group-hover:from-blue-500/30 group-hover:to-cyan-500/30',
    },
    {
        name: "Women's",
        slug: 'womens-clothing',
        icon: '👗',
        color: 'from-pink-500/20 to-rose-500/20',
        hoverColor: 'group-hover:from-pink-500/30 group-hover:to-rose-500/30',
    },
    {
        name: 'Accessories',
        slug: 'accessories',
        icon: '⌚',
        color: 'from-violet-500/20 to-purple-500/20',
        hoverColor: 'group-hover:from-violet-500/30 group-hover:to-purple-500/30',
    },
    {
        name: 'Footwear',
        slug: 'footwear',
        icon: '👟',
        color: 'from-orange-500/20 to-amber-500/20',
        hoverColor: 'group-hover:from-orange-500/30 group-hover:to-amber-500/30',
    },
    {
        name: 'Activewear',
        slug: 'activewear',
        icon: '🏃',
        color: 'from-green-500/20 to-emerald-500/20',
        hoverColor: 'group-hover:from-green-500/30 group-hover:to-emerald-500/30',
    },
    {
        name: 'New In',
        slug: 'new',
        icon: '✨',
        color: 'from-fuchsia-500/20 to-pink-500/20',
        hoverColor: 'group-hover:from-fuchsia-500/30 group-hover:to-pink-500/30',
    },
];

const CategoriesSection = () => {
    return (
        <section className="py-16 md:py-20 bg-[#0A0A0F]">
            <div className="wrapper">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            Shop by Category
                        </h2>
                        <p className="text-zinc-500 mt-2">
                            Find exactly what you&apos;re looking for
                        </p>
                    </div>
                    <Link
                        href="/search"
                        className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
                    >
                        View all
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/search?category=${encodeURIComponent(category.slug)}`}
                            className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} ${category.hoverColor} transition-all duration-300`} />
                            
                            <div className="relative p-6 flex flex-col items-center text-center">
                                <span className="text-4xl mb-3">{category.icon}</span>
                                <span className="text-sm font-medium text-white">
                                    {category.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="sm:hidden text-center mt-8">
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        View all categories
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
