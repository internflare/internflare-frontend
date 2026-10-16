import { BrowserRouter } from "react-router-dom";
import { TalentLayout } from "@/polymet/layouts/talent-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function TalentLayoutRender() {
  return (
    <BrowserRouter>
      <TalentLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </TalentLayout>
    </BrowserRouter>
  );
}
