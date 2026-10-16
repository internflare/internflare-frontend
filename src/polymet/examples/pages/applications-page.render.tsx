import { BrowserRouter } from "react-router-dom";
import { ApplicationsPage } from "@/polymet/pages/applications-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function ApplicationsPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <ApplicationsPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
