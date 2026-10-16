import { BrowserRouter } from "react-router-dom";
import { EmployerLayout } from "@/polymet/layouts/employer-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployerLayoutRender() {
  return (
    <BrowserRouter>
      <EmployerLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64" />
        </div>
      </EmployerLayout>
    </BrowserRouter>
  );
}
