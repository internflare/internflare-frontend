import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TalentPortfolioPage } from "@/polymet/pages/talent-portfolio-page";
import { MarketingLayout } from "@/polymet/layouts/marketing-layout";

export default function TalentPortfolioPageRender() {
  return (
    <BrowserRouter>
      <MarketingLayout>
        <Routes>
          <Route path="*" element={<TalentPortfolioPage />} />
        </Routes>
      </MarketingLayout>
    </BrowserRouter>
  );
}
