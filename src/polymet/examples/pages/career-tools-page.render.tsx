import { BrowserRouter } from "react-router-dom";
import { CareerToolsPage } from "@/polymet/pages/career-tools-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function CareerToolsPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <CareerToolsPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
