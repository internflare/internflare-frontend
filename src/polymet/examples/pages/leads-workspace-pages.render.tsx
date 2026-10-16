import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProspectDetailPage } from "@/polymet/pages/leads-workspace-pages";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function LeadsWorkspacePagesRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <Routes>
          <Route path="*" element={<ProspectDetailPage />} />
        </Routes>
      </TalentLayout>
    </BrowserRouter>
  );
}
