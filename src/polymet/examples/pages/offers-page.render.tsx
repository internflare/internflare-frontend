import { BrowserRouter } from "react-router-dom";
import { OffersPage } from "@/polymet/pages/offers-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function OffersPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <OffersPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
