import { HomeHero } from "@/polymet/components/home/home-hero";
import { HomeFeatured } from "@/polymet/components/home/home-featured";
import { HomeFeatures, HomeHowItWorks } from "@/polymet/components/home/home-sections";
import { HomePricingFaq, HomeTrust } from "@/polymet/components/home/home-trust";

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeFeatured />
      <HomeHowItWorks />
      <HomeFeatures />
      <HomeTrust />
      <HomePricingFaq />
    </>
  );
}
