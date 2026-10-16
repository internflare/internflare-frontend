import { BrowserRouter } from "react-router-dom";
import { MarketingLayout } from "@/polymet/layouts/marketing-layout";
import { NotFoundPage, PermissionDeniedPage } from "@/polymet/pages/system-pages";

export default function SystemPagesRender() {
  return (
    <BrowserRouter>
      <MarketingLayout>
        <NotFoundPage />
        <div className="border-t" />
        <PermissionDeniedPage />
      </MarketingLayout>
    </BrowserRouter>
  );
}
