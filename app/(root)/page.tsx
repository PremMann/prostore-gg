
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProductList from "@/components/ui/shared/product/product-list";
import ProductListSkeleton from "@/components/ui/shared/product/product-list-skeleton";
import { getAllProducts } from "@/lib/actions/product.actions";

// Async component for All Products
async function AllProductsSection() {
  const result = await getAllProducts({
    limit: 100, // Show many products on homepage
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const products = result.success && result.data ? result.data.products : [];

  return (
    <ProductList
      data={products}
      limit={100}
    />
  );
}

const Homepage = async () => {
  return (
    <div className="bg-white dark:bg-black">
      {/* All Products */}
      <Suspense fallback={<ProductListSkeleton />}>
        <AllProductsSection />
      </Suspense>
    </div>
  );
};

export default Homepage;