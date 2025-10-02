
import ProductList from "@/components/ui/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
const Homepage = async () => {
  const latestProducts = await getLatestProducts();

  return (
   <>
   <ProductList data={latestProducts} title="New Products" limit={4} />
   </>
  );
};

export default Homepage;