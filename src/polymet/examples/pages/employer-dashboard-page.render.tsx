import { BrowserRouter } from "react-router-dom";
import { EmployerDashboardPage } from "@/polymet/pages/employer-dashboard-page";
import { EmployerLayout } from "@/polymet/layouts/employer-layout";

export default function EmployerDashboardPageRender() {
  return (
    <BrowserRouter>
      <EmployerLayout>
        <EmployerDashboardPage />
      </EmployerLayout>
    </BrowserRouter>
  );
}
