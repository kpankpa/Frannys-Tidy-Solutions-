import { AboutHero } from "@/components/about/AboutHero";
import { AboutSections } from "@/components/about/AboutSections";
import { countProducts } from "@/lib/db/products";
import { getSiteConfig } from "@/lib/db/settings";

const ESTABLISHED_YEAR = 2023;

export const metadata = {
  title: "About",
  description:
    "Learn the story of Frannys Tidy Solutions: a proudly Ghanaian cleaning brand crafting detergents and professional services for healthier homes and workplaces.",
};

export default async function AboutPage() {
  const [site, productCount] = await Promise.all([
    getSiteConfig(),
    countProducts(),
  ]);

  const yearsGrowing = Math.max(1, new Date().getFullYear() - ESTABLISHED_YEAR);

  return (
    <div>
      <AboutHero
        brandName={site.name}
        headline={site.aboutHeadline}
        intro={site.aboutIntro}
      />
      <AboutSections
        brandName={site.name}
        shortName={site.shortName}
        story={site.aboutStory}
        mission={site.aboutMission}
        vision={site.aboutVision}
        address={site.address}
        hours={site.hours}
        productCount={productCount}
        yearsGrowing={yearsGrowing}
      />
    </div>
  );
}
