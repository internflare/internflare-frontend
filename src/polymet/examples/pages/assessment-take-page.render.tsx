import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TalentLayout } from "@/polymet/layouts/talent-layout";
import { AssessmentTakePage } from "@/polymet/pages/assessment-take-page";

export default function AssessmentTakePageRender() {
  return (
    <MemoryRouter initialEntries={["/app/assessments/data-analyst/take"]}>
      <TalentLayout>
        <Routes>
          <Route path="/app/assessments/:roleId/take" element={<AssessmentTakePage />} />
        </Routes>
      </TalentLayout>
    </MemoryRouter>
  );
}
