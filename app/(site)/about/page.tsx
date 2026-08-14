import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutSections } from "@/components/about/AboutSections";
import { getCachedShopProductCount, getCachedSiteConfig } from "@/lib/db/cached-public";
import { DEFAULT_WEBSITE_GALLERY } from "@/lib/site-config";

const ESTABLISHED_YEAR = 2023;

export const metadata: Metadata = {
  title: {
    absolute:
      "About Frannys Tidy Solutions | Cleaning Company Accra & Cleaning Products Ghana",
  },
  description:
    "Frannys Tidy Solutions is a registered Ghanaian cleaning company in East Legon Hills, Accra. Shop cleaning detergents online and book professional home cleaning and office cleaning services across Accra, Ghana.",
  keywords: [
    "cleaning company Accra",
    "cleaning services Accra",
    "cleaning products Ghana",
    "cleaning detergents Ghana",
    "home cleaning Accra",
    "office cleaning Accra",
    "professional cleaning Accra",
    "East Legon Hills cleaning",
    "Frannys Tidy Solutions",
    "buy cleaning products Ghana",
  ],
  openGraph: {
    title: "About Frannys Tidy Solutions | Cleaning Products & Services Accra",
    description:
      "Registered Ghanaian cleaning company in Accra. Quality detergents, home cleaning, and office cleaning services across Ghana.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage() {
  const [site, productCount] = await Promise.all([
    getCachedSiteConfig(),
    getCachedShopProductCount().catch(() => 0),
  ]);

  const yearsGrowing = Math.max(1, new Date().getFullYear() - ESTABLISHED_YEAR);

  return (
    <div>
      <AboutHero headline={site.aboutHeadline} heroImage={site.aboutHeroImage} />
      <AboutSections
        brandName={site.name}
        shortName={site.shortName}
        story={site.aboutStory}
        mission={site.aboutMission}
        vision={site.aboutVision}
        promise={site.aboutPromise}
        promiseImage={site.aboutPromiseImage}
        storyImage={site.aboutStoryImage}
        dealerImage={site.aboutDealerImage}
        values={site.aboutValues}
        journey={site.aboutJourney}
        difference={site.aboutDifference}
        trustPoints={site.aboutTrustPoints}
        address={site.address}
        locationBlurb={site.locationBlurb}
        hours={site.hours}
        phoneDisplay={site.phoneDisplay}
        phone={site.phone}
        email={site.email}
        instagramUrl={site.instagramUrl}
        tiktokUrl={site.tiktokUrl}
        googleMapsUrl={site.googleMapsUrl}
        testimonials={site.testimonials}
        galleryImages={site.websiteGalleryImages ?? DEFAULT_WEBSITE_GALLERY}
        productCount={productCount}
        yearsGrowing={yearsGrowing}
      />
    </div>
  );
}
