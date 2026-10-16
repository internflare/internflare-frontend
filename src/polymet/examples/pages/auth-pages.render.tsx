import { BrowserRouter } from "react-router-dom";
import { SignUpPage } from "@/polymet/pages/auth-pages";
import { AuthLayout } from "@/polymet/layouts/auth-layout";

export default function AuthPagesRender() {
  return (
    <BrowserRouter>
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>
    </BrowserRouter>
  );
}
