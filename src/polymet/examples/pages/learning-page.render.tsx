import { BrowserRouter } from "react-router-dom";
import { LearningPage } from "@/polymet/pages/learning-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function LearningPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <LearningPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
