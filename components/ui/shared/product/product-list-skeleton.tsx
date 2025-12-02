const ProductListSkeleton = () => {
    return (
        <section className="py-16 md:py-20 bg-[#0A0A0F]">
            <div className="wrapper">
                {/* Title skeleton */}
                <div className="flex items-end justify-between mb-10">
                    <div className="space-y-3">
                        <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
                        <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse" />
                    </div>
                </div>

                {/* Product grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
                            {/* Image skeleton */}
                            <div className="aspect-square bg-white/5 animate-pulse" />
                            
                            {/* Content skeleton */}
                            <div className="p-4 space-y-3">
                                <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                                <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                                <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                                <div className="h-5 w-16 bg-white/10 rounded animate-pulse mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductListSkeleton;
