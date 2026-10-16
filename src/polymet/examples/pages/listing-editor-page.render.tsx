import { BrowserRouter } from "react-router-dom";
import { ListingEditorPage } from "@/polymet/pages/listing-editor-page";
import { EmployerLayout } from "@/polymet/layouts/employer-layout";

export default function ListingEditorPageRender() {
  return (
    <BrowserRouter>
      <EmployerLayout>
        <ListingEditorPage />
      </EmployerLayout>
    </BrowserRouter>
  );
}
