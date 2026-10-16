import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OpportunityDetailPage } from "@/polymet/pages/opportunity-detail-page";
import { MarketingLayout } from "@/polymet/layouts/marketing-layout";

export default function OpportunityDetailPageRender() {
  return (
    <BrowserRouter>
      <MarketingLayout>
        <Routes>
          <Route path="*" element={<OpportunityDetailPage />} />
        </Routes>
      </MarketingLayout>
    </BrowserRouter>
  );
}
