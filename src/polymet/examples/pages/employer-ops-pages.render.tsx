import { BrowserRouter } from "react-router-dom";
import { EmployerHiringPage } from "@/polymet/pages/employer-ops-pages";
import { EmployerLayout } from "@/polymet/layouts/employer-layout";

export default function EmployerOpsPagesRender() {
  return (
    <BrowserRouter>
      <EmployerLayout>
        <EmployerHiringPage />
      </EmployerLayout>
    </BrowserRouter>
  );
}
