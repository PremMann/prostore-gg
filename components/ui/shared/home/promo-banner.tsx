'use client';

import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoBanner = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setEmail('');
        }
    };

    return (
        <section className="py-16 md:py-20 bg-[#0A0A0F]">
            <div className="wrapper">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-white/10">
                    {/* Subtle background glow */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-fuchsia-600/15 rounded-full blur-[100px]" />
                    </div>

                    {/* Content */}
                    <div className="relative px-6 py-12 md:px-12 md:py-16">
                        <div className="max-w-xl mx-auto text-center space-y-6">
                            {/* Heading */}
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                Get 10% off your first order
                            </h2>

                            {/* Subtitle */}
                            <p className="text-zinc-400">
                                Join our newsletter for exclusive deals, new arrivals, and style tips.
                            </p>

                            {/* Newsletter Form */}
                            {submitted ? (
                                <div className="flex items-center justify-center gap-2 py-4 text-green-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Thanks! Check your inbox for your discount code.</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-500/25 transition-all duration-300 rounded-xl px-6"
                                    >
                                        Subscribe
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </form>
                            )}

                            {/* Privacy note */}
                            <p className="text-xs text-zinc-600">
                                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
