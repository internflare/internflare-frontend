import { BrowserRouter } from "react-router-dom";
import { TalentOnboardingPage } from "@/polymet/pages/talent-onboarding-page";
import { FocusLayout } from "@/polymet/layouts/focus-layout";

export default function TalentOnboardingPageRender() {
  return (
    <BrowserRouter>
      <FocusLayout>
        <TalentOnboardingPage />
      </FocusLayout>
    </BrowserRouter>
  );
}
