import { BrowserRouter } from "react-router-dom";
import { FocusLayout } from "@/polymet/layouts/focus-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function FocusLayoutRender() {
  return (
    <BrowserRouter>
      <FocusLayout>
        <Skeleton className="h-96" />
      </FocusLayout>
    </BrowserRouter>
  );
}
