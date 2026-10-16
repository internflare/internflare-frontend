import { BrowserRouter } from "react-router-dom";
import { MentorDirectoryPage } from "@/polymet/pages/mentors-pages";
import { TalentLayout } from "@/polymet/layouts/talent-layout";

export default function MentorsPagesRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <MentorDirectoryPage />
      </TalentLayout>
    </BrowserRouter>
  );
}
