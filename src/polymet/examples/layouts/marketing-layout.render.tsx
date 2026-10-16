import { BrowserRouter } from "react-router-dom";
import { MarketingLayout } from "@/polymet/layouts/marketing-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketingLayoutRender() {
  return (
    <BrowserRouter>
      <MarketingLayout>
        <div className="mx-auto max-w-7xl space-y-6 px-8 py-16">
          <Skeleton className="h-10 w-96" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </MarketingLayout>
    </BrowserRouter>
  );
}
