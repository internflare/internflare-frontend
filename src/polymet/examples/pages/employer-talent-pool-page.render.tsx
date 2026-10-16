import { BrowserRouter } from "react-router-dom";
import { EmployerTalentPoolPage } from "@/polymet/pages/employer-talent-pool-page";
import { EmployerLayout } from "@/polymet/layouts/employer-layout";

export default function EmployerTalentPoolPageRender() {
  return (
    <BrowserRouter>
      <EmployerLayout>
        <EmployerTalentPoolPage />
      </EmployerLayout>
    </BrowserRouter>
  );
}
