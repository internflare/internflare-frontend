import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CareerToolPage } from "@/polymet/pages/career-tool-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function CareerToolPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <Routes>
          <Route path="*" element={<CareerToolPage />} />
        </Routes>
      </TalentLayout>
    </BrowserRouter>
  );
}
