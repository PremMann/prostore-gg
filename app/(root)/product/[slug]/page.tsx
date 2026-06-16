import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import { Product } from "@/types";
import ProductDetailClient from "@/components/ui/shared/product/product-detail-client";

const ProductDetailsPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug) as unknown as Product;

  if (!product) {
    return notFound();
  }

  return (
    <section className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12 lg:py-20">
      <ProductDetailClient product={product} />
    </section>
  );
};

export default ProductDetailsPage;