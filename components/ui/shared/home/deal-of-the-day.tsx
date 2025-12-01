'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, ShoppingCart, Star } from 'lucide-react';
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
        <section className="py-16 md:py-20 bg-gradient-to-br from-violet-950/10 via-purple-950/10 to-fuchsia-950/10 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/30">
            <div className="wrapper">
                {/* Section Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                        <Flame className="w-5 h-5 animate-pulse" />
                        <span className="font-semibold">Deal of the Day</span>
                        <Flame className="w-5 h-5 animate-pulse" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                        Flash Sale
                    </h2>
                    <div className="w-24 h-1 mx-auto bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-full" />
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Product Image */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                        <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50">
                            <Link href={`/product/${product.slug}`}>
                                <div className="relative aspect-square">
                                    <Image
                                        src={product.images[0] || '/images/placeholder.jpg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </Link>
                            {/* Discount Badge */}
                            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm shadow-lg">
                                -{discountPercent}% OFF
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Countdown Timer */}
                        <div className="flex items-center gap-4">
                            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <span className="text-muted-foreground font-medium">Ends in:</span>
                            <div className="flex gap-2">
                                {[
                                    { value: timeLeft.hours, label: 'Hrs' },
                                    { value: timeLeft.minutes, label: 'Min' },
                                    { value: timeLeft.seconds, label: 'Sec' },
                                ].map((item, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white font-bold text-xl shadow-lg">
                                            {String(item.value).padStart(2, '0')}
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Name */}
                        <Link href={`/product/${product.slug}`}>
                            <h3 className="text-3xl md:text-4xl font-bold hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                {product.name}
                            </h3>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < Math.floor(Number(product.rating))
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-muted-foreground">
                                ({product.numReviews} reviews)
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground text-lg line-clamp-3">
                            {product.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                                ${product.price}
                            </span>
                            <span className="text-xl text-muted-foreground line-through">
                                ${originalPrice}
                            </span>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full"
                                    style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                                />
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {product.stock} items left
                            </span>
                        </div>

                        {/* CTA Button */}
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                        >
                            <Link href={`/product/${product.slug}`} className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5" />
                                Shop Now
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DealOfTheDay;
