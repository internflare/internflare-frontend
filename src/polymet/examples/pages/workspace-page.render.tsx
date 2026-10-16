import { BrowserRouter } from "react-router-dom";
import { TalentLayout } from "@/polymet/layouts/talent-layout";
import { WorkspacePage } from "@/polymet/pages/workspace-page";

export default function WorkspacePageRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <WorkspacePage />
      </TalentLayout>
    </BrowserRouter>
  );
}
