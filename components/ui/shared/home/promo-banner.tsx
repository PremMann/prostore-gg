'use client';

import Link from 'next/link';
import { ArrowRight, Gift, Percent, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoBanner = () => {
    return (
        <section className="py-16 md:py-20">
            <div className="wrapper">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600">
                    {/* Background decorations */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                        
                        {/* Floating icons */}
                        <div className="absolute top-10 left-10 opacity-20">
                            <Gift className="w-12 h-12 text-white animate-bounce" />
                        </div>
                        <div className="absolute bottom-10 right-10 opacity-20">
                            <Percent className="w-12 h-12 text-white animate-bounce delay-500" />
                        </div>
                        <div className="absolute top-20 right-20 opacity-20">
                            <Sparkles className="w-8 h-8 text-white animate-pulse" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative px-6 py-16 md:px-12 md:py-20 text-center">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium">
                                <Sparkles className="w-4 h-4" />
                                Limited Time Offer
                            </div>

                            {/* Heading */}
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                                Get 20% Off Your First Order
                            </h2>

                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto">
                                Sign up today and receive an exclusive discount on your first purchase. 
                                Plus, enjoy free shipping on orders over $50!
                            </p>

                            {/* Promo Code */}
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                <span className="text-white/70">Use code:</span>
                                <span className="text-xl font-bold text-white tracking-wider">WELCOME20</span>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-white text-purple-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    <Link href="/search" className="flex items-center gap-2">
                                        Shop Now
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-white/50 text-white hover:bg-white/10 transition-all duration-300"
                                >
                                    <Link href="/sign-up" className="flex items-center gap-2">
                                        Create Account
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-white/70 text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Free Shipping
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    30-Day Returns
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Secure Checkout
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
