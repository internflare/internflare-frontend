import { BrowserRouter } from "react-router-dom";
import { EmployerOnboardingPage } from "@/polymet/pages/employer-onboarding-page";
import { FocusLayout } from "@/polymet/layouts/focus-layout";

export default function EmployerOnboardingPageRender() {
  return (
    <BrowserRouter>
      <FocusLayout>
        <EmployerOnboardingPage />
      </FocusLayout>
    </BrowserRouter>
  );
}
