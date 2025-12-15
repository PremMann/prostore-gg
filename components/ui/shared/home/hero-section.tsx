'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-black">
            {/* Cinematic Background Image with Overlay */}
            <div className="absolute inset-0">
                <Image
                    src="/images/main.png"
                    alt="Hero Background"
                    fill
                    className="object-cover opacity-40 dark:opacity-30"
                    priority
                    quality={95}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/60 dark:to-black/80" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full">
                <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
                    <div className="max-w-2xl">
                        {/* Eyebrow - Premium Minimalist */}
                        <div className="mb-8">
                            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-600 dark:text-zinc-400">
                                New Collection 2025
                            </span>
                        </div>

                        {/* Main Heading - Bold & Tracked */}
                        <h1 className="mb-8 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] text-black dark:text-white">
                            TIMELESS
                            <br />
                            ESSENTIALS
                        </h1>

                        {/* Subtitle - Understated */}
                        <p className="mb-12 text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-lg font-light">
                            Curated pieces that transcend trends.
                            <br />
                            Quality craftsmanship. Honest pricing.
                        </p>

                        {/* CTA - Minimal & Refined */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/search?sort=newest"
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                            >
                                Shop Now
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/search"
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-black dark:border-white text-black dark:text-white text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                            >
                                Explore
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-500">Scroll</span>
                    <div className="w-px h-12 bg-zinc-300 dark:bg-zinc-700" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
