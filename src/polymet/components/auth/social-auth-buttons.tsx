import { useState, type ComponentType } from "react";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import authClient from "@/lib/auth-client";

export type SocialProvider = "google" | "apple" | "twitter" | "linkedin";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.02c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.28a12 12 0 0 0 0 10.78l4.01-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.28 6.61l4.01 3.11C6.23 6.88 8.88 4.77 12 4.77Z"
      />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] fill-current"
      aria-hidden="true"
    >
      <path d="M16.37 12.73c-.02-2.33 1.9-3.45 1.99-3.5-1.08-1.59-2.77-1.8-3.37-1.83-1.43-.15-2.8.84-3.53.84-.73 0-1.85-.82-3.04-.8-1.56.02-3 .91-3.81 2.31-1.62 2.82-.41 7 1.17 9.29.77 1.12 1.69 2.38 2.89 2.33 1.16-.05 1.6-.75 3-.75s1.8.75 3.03.73c1.25-.02 2.04-1.14 2.81-2.27.88-1.3 1.25-2.56 1.27-2.62-.03-.01-2.43-.93-2.41-3.73ZM14.06 5.88c.64-.78 1.07-1.85.95-2.92-.92.04-2.04.61-2.7 1.39-.59.69-1.11 1.79-.97 2.84 1.03.08 2.07-.52 2.72-1.31Z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <span
      className="flex h-[18px] w-[18px] items-center justify-center rounded-sm bg-[#0A66C2] text-[11px] font-bold text-white"
      aria-hidden="true"
    >
      in
    </span>
  );
}

function XLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
      aria-hidden="true"
    >
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  );
}

const providers: {
  id: SocialProvider;
  label: string;
  Logo: ComponentType;
}[] = [
  { id: "google", label: "Google", Logo: GoogleLogo },
  { id: "apple", label: "Apple", Logo: AppleLogo },
  { id: "twitter", label: "X (Twitter)", Logo: XLogo },
  { id: "linkedin", label: "LinkedIn", Logo: LinkedInLogo },
];

interface SocialAuthButtonsProps {
  mode: "sign-in" | "sign-up";
  callbackURL: string;
  disabled?: boolean;
  className?: string;
  /** Shown under the buttons, above the email divider (e.g. consent note). */
  footnote?: React.ReactNode;
}

/** Starts the configured provider's OAuth flow through Better Auth. */
function SocialAuthButtons({
  mode,
  callbackURL,
  disabled,
  className,
  footnote,
}: SocialAuthButtonsProps) {
  const [pending, setPending] = useState<SocialProvider | null>(null);
  const [error, setError] = useState("");

  const connect = async (p: SocialProvider) => {
    setPending(p);
    setError("");
    try {
      const result = await authClient.signIn.social({
        provider: p,
        callbackURL: new URL(callbackURL, window.location.origin).toString(),
      });
      if (result.error) {
        setError(result.error.message ?? `Unable to sign in with ${p}.`);
        setPending(null);
      }
    } catch {
      setError(`Unable to connect to ${p}. Please try again.`);
      setPending(null);
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {providers.map(({ id, label, Logo }) => (
          <Button
            key={id}
            type="button"
            variant="outline"
            size="lg"
            disabled={disabled || pending !== null}
            onClick={() => connect(id)}
            aria-label={`Continue with ${label}`}
            className={cn(
              "h-10 justify-center gap-2.5 bg-card font-medium",
              pending === id && "opacity-100",
            )}
          >
            {pending === id ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <Logo />
            )}
            <span className="truncate">
              {pending === id ? `Connecting…` : label}
            </span>
          </Button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {pending
          ? `Connecting to ${providers.find((p) => p.id === pending)?.label}`
          : ""}
      </p>
      {error && (
        <p className="mt-3 text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {footnote && (
        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
          {footnote}
        </p>
      )}
      <div className="relative my-6 flex items-center" role="separator">
        <span className="h-px flex-1 bg-border" />
        <span className="px-3 text-xs font-medium text-muted-foreground">
          or {mode === "sign-up" ? "sign up" : "sign in"} with email
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}

export { providers, SocialAuthButtons };
