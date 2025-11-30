'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-fuchsia-950/20">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/30 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-300/30 dark:bg-fuchsia-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-300/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <div className="wrapper relative py-20 md:py-28 lg:py-36">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 shadow-lg animate-fade-in">
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                            New Collection Available
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up">
                        <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                            Discover Premium
                        </span>
                        <br />
                        <span className="text-foreground">Products You&apos;ll Love</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                        Curated collection of high-quality products at unbeatable prices.
                        Shop with confidence and enjoy fast, free shipping on all orders.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
                        <Button
                            asChild
                            size="lg"
                            className="group bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                        >
                            <Link href="#products" className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Shop Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="group border-2 hover:border-purple-600 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-300"
                        >
                            <Link href="#featured" className="flex items-center gap-2">
                                View Collection
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 animate-fade-in-up animation-delay-600">
                        <div className="space-y-1">
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                                10K+
                            </div>
                            <div className="text-sm text-muted-foreground">Happy Customers</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                                500+
                            </div>
                            <div className="text-sm text-muted-foreground">Products</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 dark:from-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent">
                                4.9★
                            </div>
                            <div className="text-sm text-muted-foreground">Rating</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                                Free
                            </div>
                            <div className="text-sm text-muted-foreground">Shipping</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
