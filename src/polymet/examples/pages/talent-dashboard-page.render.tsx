import { BrowserRouter } from "react-router-dom";
import { TalentDashboardPage } from "@/polymet/pages/talent-dashboard-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function TalentDashboardPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <TalentDashboardPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
