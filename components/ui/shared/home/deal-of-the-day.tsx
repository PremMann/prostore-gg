'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ShoppingCart, Star, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface DealOfTheDayProps {
    product: Product | null;
}

const DealOfTheDay = ({ product }: DealOfTheDayProps) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const difference = endOfDay.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / (1000 * 60)) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!product) return null;

    // Calculate a fake "original price" for display (20% higher)
    const originalPrice = (Number(product.price) * 1.2).toFixed(2);
    const discountPercent = 20;

    return (
        <section className="py-16 md:py-20 bg-muted/30 dark:bg-[#0A0A0F] relative overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="wrapper relative">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-orange-500 dark:text-orange-400">Deal of the Day</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground dark:text-zinc-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Ends in {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
                    </div>
                </div>

                {/* Deal Card */}
                <div className="rounded-3xl bg-card dark:bg-white/5 backdrop-blur-xl border border-border dark:border-white/10 overflow-hidden">
                    <div className="grid lg:grid-cols-2">
                        {/* Product Image */}
                        <div className="relative group">
                            <Link href={`/product/${product.slug}`}>
                                <div className="relative aspect-square lg:aspect-auto lg:h-full min-h-[400px]">
                                    <Image
                                        src={product.images[0] || '/images/placeholder.jpg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-[#0A0A0F] via-transparent to-transparent lg:bg-gradient-to-r" />
                                </div>
                            </Link>
                            {/* Discount Badge */}
                            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-orange-500 text-white font-bold text-sm shadow-lg">
                                -{discountPercent}% OFF
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                            {/* Countdown Timer */}
                            <div className="flex gap-3">
                                {[
                                    { value: timeLeft.hours, label: 'Hours' },
                                    { value: timeLeft.minutes, label: 'Min' },
                                    { value: timeLeft.seconds, label: 'Sec' },
                                ].map((item, index) => (
                                    <div key={index} className="text-center">
                                        <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-muted dark:bg-white/5 border border-border dark:border-white/10 text-foreground dark:text-white font-bold text-2xl">
                                            {String(item.value).padStart(2, '0')}
                                        </div>
                                        <span className="text-xs text-muted-foreground dark:text-zinc-500 mt-1.5 block">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Product Name */}
                            <Link href={`/product/${product.slug}`}>
                                <h3 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                    {product.name}
                                </h3>
                            </Link>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(Number(product.rating))
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-zinc-300 dark:text-zinc-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground dark:text-zinc-500">
                                    ({product.numReviews} reviews)
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground dark:text-zinc-400 line-clamp-2">
                                {product.description}
                            </p>

                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-foreground dark:text-white">
                                    ${product.price}
                                </span>
                                <span className="text-lg text-muted-foreground dark:text-zinc-500 line-through">
                                    ${originalPrice}
                                </span>
                            </div>

                            {/* Stock Progress */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground dark:text-zinc-500">Available</span>
                                    <span className="text-muted-foreground dark:text-zinc-400">{product.stock} items left</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-muted dark:bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    asChild
                                    size="lg"
                                    className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-500/25 transition-all duration-300 rounded-xl"
                                >
                                    <Link href={`/product/${product.slug}`} className="flex items-center justify-center gap-2">
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="ghost"
                                    className="text-foreground dark:text-zinc-300 hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-white/5 transition-all duration-300 rounded-xl"
                                >
                                    <Link href={`/product/${product.slug}`}>
                                        View Details
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DealOfTheDay;
