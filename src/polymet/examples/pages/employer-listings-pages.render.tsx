import { BrowserRouter } from "react-router-dom";
import { EmployerListingsPage } from "@/polymet/pages/employer-listings-pages";
import { EmployerLayout } from "@/polymet/layouts/employer-layout";

export default function EmployerListingsPagesRender() {
  return (
    <BrowserRouter>
      <EmployerLayout>
        <EmployerListingsPage />
      </EmployerLayout>
    </BrowserRouter>
  );
}
