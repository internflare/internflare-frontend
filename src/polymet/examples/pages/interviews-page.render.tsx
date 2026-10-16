import { BrowserRouter } from "react-router-dom";
import { InterviewsPage } from "@/polymet/pages/interviews-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function InterviewsPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <InterviewsPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
