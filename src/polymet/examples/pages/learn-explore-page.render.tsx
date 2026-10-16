import { BrowserRouter } from "react-router-dom";
import { TalentLayout } from "@/polymet/layouts/talent-layout";
import { LearnExplorePage } from "@/polymet/pages/learn-explore-page";

export default function LearnExploreRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <LearnExplorePage />
      </TalentLayout>
    </BrowserRouter>
  );
}
