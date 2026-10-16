import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompanyProfilePage } from "@/polymet/pages/company-profile-page";
import { MarketingLayout } from "@/polymet/layouts/marketing-layout";

export default function CompanyProfilePageRender() {
  return (
    <BrowserRouter>
      <MarketingLayout>
        <Routes>
          <Route path="*" element={<CompanyProfilePage />} />
        </Routes>
      </MarketingLayout>
    </BrowserRouter>
  );
}
