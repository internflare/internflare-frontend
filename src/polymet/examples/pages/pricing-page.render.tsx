import { BrowserRouter } from "react-router-dom";
import { PricingPage } from "@/polymet/pages/pricing-page";
import { MarketingLayout } from "@/polymet/layouts/marketing-layout";

export default function PricingPageRender() {
  return (
    <BrowserRouter>
      <MarketingLayout>
        <PricingPage />
      </MarketingLayout>
    </BrowserRouter>
  );
}
