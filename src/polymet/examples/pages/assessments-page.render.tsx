import { BrowserRouter } from "react-router-dom";
import { TalentLayout } from "@/polymet/layouts/talent-layout";
import { AssessmentsPage } from "@/polymet/pages/assessments-page";

export default function AssessmentsPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <AssessmentsPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
