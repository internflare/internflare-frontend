import { BrowserRouter } from "react-router-dom";
import { TalentLayout } from "@/polymet/layouts/talent-layout";
import { InternshipsPage } from "@/polymet/pages/opportunity-board-page";

export default function OpportunityBoardRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <InternshipsPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
