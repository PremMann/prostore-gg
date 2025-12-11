'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 dark:from-[#0A0A0F] dark:via-[#0A0A0F] dark:to-muted/10">
            {/* Subtle gradient background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/8 dark:bg-violet-600/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/6 dark:bg-fuchsia-600/6 rounded-full blur-[100px]" />
            </div>

            <div className="wrapper relative py-16 md:py-24 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-8 text-center lg:text-left">
                        {/* Eyebrow */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 dark:bg-white/5 backdrop-blur-sm border border-border dark:border-white/10">
                            <Sparkles className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                            <span className="text-xs font-medium text-muted-foreground dark:text-zinc-300 uppercase tracking-wider">
                                New Drop
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                            Discover Quality
                            <br />
                            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                                That Speaks
                            </span>
                            <br />
                            For Itself
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg text-muted-foreground dark:text-zinc-400 max-w-md mx-auto lg:mx-0">
                            Premium essentials at fair prices. Fast, free shipping on orders $50+.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="group bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 rounded-full px-8"
                            >
                                <Link href="/search?sort=newest" className="flex items-center gap-2">
                                    Shop New Arrivals
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="ghost"
                                className="group text-foreground dark:text-zinc-300 hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-white/5 transition-all duration-300 rounded-full px-8"
                            >
                                <Link href="/search" className="flex items-center gap-2">
                                    Explore Collections
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>

                        {/* Inline Trust Strip */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-4 text-sm text-muted-foreground dark:text-zinc-500">
                            <span className="flex items-center gap-1.5">
                                <span className="text-foreground dark:text-zinc-300 font-semibold">10K+</span> customers
                            </span>
                            <span className="hidden sm:inline text-border dark:text-zinc-700">·</span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-foreground dark:text-zinc-300 font-semibold">500+</span> products
                            </span>
                            <span className="hidden sm:inline text-border dark:text-zinc-700">·</span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-yellow-500">★</span>
                                <span className="text-foreground dark:text-zinc-300 font-semibold">4.9</span> rating
                            </span>
                        </div>
                    </div>

                    {/* Right - Product Collage */}
                    <div className="relative hidden lg:block">
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            {/* Background glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl" />

                            {/* Main product card */}
                            <div className="absolute top-8 left-8 right-8 bottom-8 rounded-3xl bg-card/50 dark:bg-white/5 backdrop-blur-xl border border-border dark:border-white/10 overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/main.png"
                                    alt="Featured Product"
                                    fill
                                    className="object-cover opacity-90"
                                    priority
                                />
                                {/* Light sweep effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
                            </div>

                            {/* Floating accent cards */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">NEW</span>
                            </div>

                            <div className="absolute -bottom-2 -left-2 px-4 py-3 rounded-2xl bg-card/80 dark:bg-white/10 backdrop-blur-xl border border-border dark:border-white/20 shadow-xl">
                                <div className="text-xs text-muted-foreground dark:text-zinc-400">Starting at</div>
                                <div className="text-xl font-bold text-foreground dark:text-white">$29.99</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
