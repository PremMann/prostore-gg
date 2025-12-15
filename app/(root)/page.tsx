
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProductList from "@/components/ui/shared/product/product-list";
import ProductListSkeleton from "@/components/ui/shared/product/product-list-skeleton";
import HeroSection from "@/components/ui/shared/home/hero-section";
import FeaturesSection from "@/components/ui/shared/home/features-section";
import { 
  getLatestProducts, 
  getFeaturedProducts, 
  getBestSellers
} from "@/lib/actions/product.actions";

// Async component for Featured Products
async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts(4);
  return (
    <ProductList 
      data={featuredProducts} 
      title="Featured" 
      limit={4}
      viewAllLink="/search?sort=rating"
      viewAllText="View All"
    />
  );
}

// Async component for Best Sellers
async function BestSellersSection() {
  const bestSellers = await getBestSellers(4);
  return (
    <ProductList 
      data={bestSellers} 
      title="Best Sellers" 
      limit={4}
      viewAllLink="/search?sort=popular"
      viewAllText="View All"
    />
  );
}

// Async component for New Arrivals
async function NewArrivalsSection() {
  const latestProducts = await getLatestProducts();
  return (
    <ProductList 
      data={latestProducts} 
      title="New Arrivals" 
      limit={8}
      viewAllLink="/search?sort=newest"
      viewAllText="View All"
    />
  );
}

const Homepage = async () => {
  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section - Full Viewport */}
      <HeroSection />
      
      {/* Trust Features Strip */}
      <FeaturesSection />
      
      {/* Featured Products */}
      <Suspense fallback={<ProductListSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      
      {/* New Arrivals */}
      <Suspense fallback={<ProductListSkeleton />}>
        <NewArrivalsSection />
      </Suspense>
      
      {/* Best Sellers */}
      <Suspense fallback={<ProductListSkeleton />}>
        <BestSellersSection />
      </Suspense>
    </div>
  );
};

export default Homepage;