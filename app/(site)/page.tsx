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
import { getSiteConfig } from "@/lib/db/settings";
import { resolveCleaningServices } from "@/lib/services";

export default async function HomePage() {
  const [products, site] = await Promise.all([
    listProducts(),
    getSiteConfig(),
  ]);
  const services = resolveCleaningServices(site.serviceItems);

  return (
    <>
      <HomeHero />
      <WhyChoose
        title={site.homeWhyTitle}
        description={site.homeWhyDescription}
        items={site.whyChooseItems}
      />
      <FeaturedProducts
        products={products}
        title={site.homeShopTitle}
        description={site.homeShopDescription}
        ctaLabel={site.homeShopCta}
      />
      <HomeServices
        title={site.homeServicesTitle}
        description={site.homeServicesDescription}
        services={services}
      />
      <HowItWorks
        title={site.homeHowTitle}
        description={site.homeHowDescription}
        steps={site.howItWorks}
      />
      <Testimonials
        items={site.testimonials}
        title={site.testimonialsTitle}
        description={site.testimonialsDescription}
      />
      <HomeCTA
        title={site.homeCtaTitle}
        description={site.homeCtaDescription}
      />
    </>
  );
}
