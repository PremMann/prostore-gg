const ProductListSkeleton = () => {
    return (
        <section className="py-16 md:py-20">
            <div className="wrapper">
                {/* Title skeleton */}
                <div className="text-center mb-12 space-y-4">
                    <div className="h-12 w-64 mx-auto bg-muted rounded-lg animate-pulse" />
                    <div className="w-24 h-1 mx-auto bg-muted rounded-full animate-pulse" />
                </div>

                {/* Product grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
                            {/* Image skeleton */}
                            <div className="aspect-square bg-muted animate-pulse" />
                            
                            {/* Content skeleton */}
                            <div className="p-4 space-y-3">
                                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                                <div className="h-5 w-full bg-muted rounded animate-pulse" />
                                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                                    <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductListSkeleton;
