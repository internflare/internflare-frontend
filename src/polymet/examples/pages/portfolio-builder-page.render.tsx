import { BrowserRouter } from "react-router-dom";
import { PortfolioBuilderPage } from "@/polymet/pages/portfolio-builder-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function PortfolioBuilderPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <PortfolioBuilderPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
