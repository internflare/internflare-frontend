import { BrowserRouter } from "react-router-dom";
import { SavedPage } from "@/polymet/pages/saved-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function SavedPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <SavedPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
