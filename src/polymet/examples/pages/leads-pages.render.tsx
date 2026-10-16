import { BrowserRouter } from "react-router-dom";
import { LeadsPlanPage } from "@/polymet/pages/leads-pages";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function LeadsPagesRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <LeadsPlanPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
