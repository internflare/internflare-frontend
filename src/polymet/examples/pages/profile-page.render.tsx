import { BrowserRouter } from "react-router-dom";
import { ProfilePage } from "@/polymet/pages/profile-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function ProfilePageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <ProfilePage />
      </TalentLayout>
    </BrowserRouter>
  );
}
