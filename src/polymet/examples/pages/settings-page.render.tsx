import { BrowserRouter } from "react-router-dom";
import { SettingsPage } from "@/polymet/pages/settings-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function SettingsPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <SettingsPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
