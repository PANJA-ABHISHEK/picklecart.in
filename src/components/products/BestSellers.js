import { getBestSellingProducts } from "@/services/products";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/ui/Button";

export default async function BestSellers() {
  let bestSellers = [];
  try {
    const bestSellersFull = await getBestSellingProducts();
    bestSellers = (bestSellersFull || []).slice(0, 8);
  } catch (error) {
    console.error("Failed to load best sellers:", error);
  }

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-cream" aria-label="Best selling products">
      <div className="container-main">
        <SectionHeading
          eyebrow="Customer Favourites"
          title="Our Best Sellers"
          description="The most loved products from our collection — tried, tested, and adored by our customers."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {bestSellers.map((product, i) => (
            <div key={product.id} data-aos="fade-up" data-aos-delay={i * 50}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center" data-aos="fade-up">
          <Button href="/south-indian" variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
