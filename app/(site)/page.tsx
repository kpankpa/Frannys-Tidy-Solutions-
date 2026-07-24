import {
  FeaturedProducts,
  HomeCTA,
  HomeServices,
  HowItWorks,
  Testimonials,
  WhyChoose,
} from "@/components/home/HomeSections";
import { HomeHero } from "@/components/home/HomeHero";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <FeaturedProducts />
      <WhyChoose />
      <HomeServices />
      <HowItWorks />
      <Testimonials />
      <HomeCTA />
    </>
  );
}
