import { BrowserRouter } from "react-router-dom";
import { NotificationsPage } from "@/polymet/pages/notifications-page";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function NotificationsPageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <NotificationsPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
