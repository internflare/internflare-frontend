import { HomeHero } from "@/polymet/components/home/home-hero";
import { HomeFeatured } from "@/polymet/components/home/home-featured";
import {
  HomeFeatures,
  HomeHowItWorks,
} from "@/polymet/components/home/home-sections";
import {
  HomePricingFaq,
  HomeTrust,
} from "@/polymet/components/home/home-trust";

//building the home page by combining all the sections together
const HomePage = () => {
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
};

export default HomePage;
