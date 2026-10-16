import { SocialAuthButtons } from "@/polymet/components/auth/social-auth-buttons";

export default function SocialAuthButtonsRender() {
  return (
    <div className="max-w-md p-6">
      <SocialAuthButtons mode="sign-up" callbackURL="/onboarding" />
    </div>
  );
}
