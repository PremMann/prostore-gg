
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import ProductList from "@/components/ui/shared/product/product-list";
import HeroSection from "@/components/ui/shared/home/hero-section";
import FeaturesSection from "@/components/ui/shared/home/features-section";
import { getLatestProducts } from "@/lib/actions/product.actions";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductList data={latestProducts} title="New Arrivals" limit={8} />
    </>
  );
};

export default Homepage;