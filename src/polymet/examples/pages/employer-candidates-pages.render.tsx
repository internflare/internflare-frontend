import { BrowserRouter } from "react-router-dom";
import { CandidatesInboxPage } from "@/polymet/pages/employer-candidates-pages";
import { EmployerLayout } from "@/polymet/layouts/employer-layout";

export default function EmployerCandidatesPagesRender() {
  return (
    <BrowserRouter>
      <EmployerLayout>
        <CandidatesInboxPage />
      </EmployerLayout>
    </BrowserRouter>
  );
}
