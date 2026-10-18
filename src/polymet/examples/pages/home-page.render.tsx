import { BrowserRouter } from "react-router-dom";
import HomePage from "@/polymet/pages/home-page";
import { MarketingLayout } from "@/polymet/layouts/marketing-layout";

export default function HomePageRender() {
  return (
    <BrowserRouter>
      <MarketingLayout>
        <HomePage />
      </MarketingLayout>
    </BrowserRouter>
  );
}
