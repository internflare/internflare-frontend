import { BrowserRouter } from "react-router-dom";
import { AuthLayout } from "@/polymet/layouts/auth-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLayoutRender() {
  return (
    <BrowserRouter>
      <AuthLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </AuthLayout>
    </BrowserRouter>
  );
}
