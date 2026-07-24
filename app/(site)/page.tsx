import {
  FeaturedProducts,
  HomeCTA,
  HomeServices,
  HowItWorks,
  Testimonials,
  WhyChoose,
} from "@/components/home/HomeSections";
import { HomeHero } from "@/components/home/HomeHero";
import { listProducts } from "@/lib/db/products";

export default async function HomePage() {
  const products = await listProducts();

  return (
    <>
      <HomeHero />
      <WhyChoose />
      <FeaturedProducts products={products} />
      <HomeServices />
      <HowItWorks />
      <Testimonials />
      <HomeCTA />
    </>
  );
}
