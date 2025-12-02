
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProductList from "@/components/ui/shared/product/product-list";
import ProductListSkeleton from "@/components/ui/shared/product/product-list-skeleton";
import HeroSection from "@/components/ui/shared/home/hero-section";
import FeaturesSection from "@/components/ui/shared/home/features-section";
import CategoriesSection from "@/components/ui/shared/home/categories-section";
import DealOfTheDay from "@/components/ui/shared/home/deal-of-the-day";
import PromoBanner from "@/components/ui/shared/home/promo-banner";
import { 
  getLatestProducts, 
  getFeaturedProducts, 
  getBestSellers,
  getDealOfTheDay 
} from "@/lib/actions/product.actions";

// Async component for Featured Products
async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts(4);
  return (
    <ProductList 
      data={featuredProducts} 
      title="Featured Collection" 
      limit={4}
      viewAllLink="/search?sort=rating"
      viewAllText="View Featured"
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
      viewAllText="View Best Sellers"
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
      viewAllText="View All Products"
    />
  );
}

// Async component for Deal of the Day
async function DealSection() {
  const dealProduct = await getDealOfTheDay();
  return <DealOfTheDay product={dealProduct} />;
}

const Homepage = async () => {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Trust Features */}
      <FeaturesSection />
      
      {/* Featured Products */}
      <Suspense fallback={<ProductListSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      
      {/* Categories */}
      <CategoriesSection />
      
      {/* Deal of the Day */}
      <Suspense fallback={
        <div className="py-16 md:py-20 bg-[#0A0A0F]">
          <div className="wrapper">
            <div className="h-96 bg-white/5 rounded-3xl animate-pulse" />
          </div>
        </div>
      }>
        <DealSection />
      </Suspense>
      
      {/* Best Sellers */}
      <Suspense fallback={<ProductListSkeleton />}>
        <BestSellersSection />
      </Suspense>
      
      {/* New Arrivals */}
      <Suspense fallback={<ProductListSkeleton />}>
        <NewArrivalsSection />
      </Suspense>
      
      {/* Promo Banner */}
      <PromoBanner />
    </div>
  );
};

export default Homepage;