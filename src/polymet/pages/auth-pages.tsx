import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { useReducer, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocialAuthButtons } from "@/polymet/components/auth/social-auth-buttons";

import {
  AlertCircleIcon,
  Building2Icon,
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  MailCheckIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import authClient from "@/lib/auth-client";

// Lightweight form validation; Better Auth remains responsible for authentication.
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// Shared field layout keeps labels, hints, and validation messages consistent.
function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {hint}
      </div>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1 text-xs text-destructive"
        >
          <AlertCircleIcon className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

// Password visibility toggle is a local state for each input, so toggling one doesn't affect others.
function PasswordInput({
  id,
  value,
  onChange,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  // Visibility is local to this input so toggling it doesn't affect other passwords.
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={cn("h-10 pr-10", invalid && "border-destructive")}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <EyeOffIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

// Page headings are consistent across the auth flow, with a title and optional subtext.
function Heading({ title, sub }: { title: string; sub: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

type SignInState = {
  email: string;
  password: string;
  errors: Record<string, string>;
  failed: boolean;
  isSubmitting: boolean;
  requestError: string;
};

type SignInAction =
  | { type: "email-changed"; email: string }
  | { type: "password-changed"; password: string }
  | { type: "validation-errors-set"; errors: Record<string, string> }
  | { type: "request-started" }
  | { type: "request-failed"; message: string }
  | { type: "request-finished" };

// Keep sign-in validation and request status transitions together.
function signInReducer(state: SignInState, action: SignInAction): SignInState {
  switch (action.type) {
    case "email-changed":
      return { ...state, email: action.email };
    case "password-changed":
      return { ...state, password: action.password };
    case "validation-errors-set":
      return { ...state, errors: action.errors };
    case "request-started":
      return { ...state, failed: false, requestError: "", isSubmitting: true };
    case "request-failed":
      return { ...state, failed: true, requestError: action.message };
    case "request-finished":
      return { ...state, isSubmitting: false };
  }
}

//sign-in component
function SignInPage() {
  const [state, dispatch] = useReducer(signInReducer, {
    email: "",
    password: "",
    errors: {},
    failed: false,
    isSubmitting: false,
    requestError: "",
  });
  const { email, password, errors, failed, isSubmitting, requestError } = state;
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior.
    const next: Record<string, string> = {};
    if (!emailOk(email)) next.email = "Enter a valid email address";
    if (!password) next.password = "Enter your password";
    dispatch({ type: "validation-errors-set", errors: next });
    if (Object.keys(next).length) return;

    // Start the sign-in request and disable the form to prevent multiple submissions.
    dispatch({ type: "request-started" });

    // Attempt to sign in using the auth client.
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: `${window.location.origin}/app`,
      });
      if (result.error) {
        dispatch({
          type: "request-failed",
          message: result.error.message ?? "Email or password is incorrect.",
        });
        return;
      }
      // The dashboard reads the signed-in identity from Better Auth's session.
      navigate("/app");
    } catch {
      dispatch({
        type: "request-failed",
        message:
          "Unable to reach the authentication service. Please try again.",
      });
    } finally {
      // Re-enable the form after either a successful or failed request.
      dispatch({ type: "request-finished" });
    }
  };

  return (
    <>
      <Heading
        title="Welcome back"
        sub={
          <>
            New to internflare?{" "}
            <Link
              to="/sign-up"
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </Link>
          </>
        }
      />
      {failed && (
        <div
          role="alert"
          className="mb-4 flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm"
        >
          <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />{" "}
          {requestError}
        </div>
      )}
      <SocialAuthButtons
        mode="sign-in"
        callbackURL="/app"
        disabled={isSubmitting}
      />
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field id="si-email" label="Email" error={errors.email}>
          <Input
            id="si-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) =>
              dispatch({ type: "email-changed", email: e.target.value })
            }
            aria-invalid={!!errors.email}
            className={cn("h-10", errors.email && "border-destructive")}
          />
        </Field>
        <Field
          id="si-password"
          label="Password"
          error={errors.password}
          hint={
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          }
        >
          <PasswordInput
            id="si-password"
            value={password}
            onChange={(value) =>
              dispatch({ type: "password-changed", password: value })
            }
            invalid={!!errors.password}
          />
        </Field>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </>
  );
}

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  company: string;
};

type SignUpState = {
  type: "talent" | "employer";
  form: SignUpForm;
  consent: boolean;
  errors: Record<string, string>;
  isSubmitting: boolean;
  requestError: string;
};

type SignUpAction =
  | { type: "account-type-changed"; accountType: SignUpState["type"] }
  | { type: "name-changed"; value: string }
  | { type: "email-changed"; value: string }
  | { type: "password-changed"; value: string }
  | { type: "company-changed"; value: string }
  | { type: "consent-changed"; consent: boolean }
  | { type: "validation-errors-set"; errors: Record<string, string> }
  | { type: "request-started" }
  | { type: "request-failed"; message: string }
  | { type: "request-finished" };

function signUpReducer(state: SignUpState, action: SignUpAction): SignUpState {
  switch (action.type) {
    case "account-type-changed":
      return { ...state, type: action.accountType };
    case "name-changed":
      return { ...state, form: { ...state.form, name: action.value } };
    case "email-changed":
      return { ...state, form: { ...state.form, email: action.value } };
    case "password-changed":
      return { ...state, form: { ...state.form, password: action.value } };
    case "company-changed":
      return { ...state, form: { ...state.form, company: action.value } };
    case "consent-changed":
      return { ...state, consent: action.consent };
    case "validation-errors-set":
      return { ...state, errors: action.errors };
    case "request-started":
      return { ...state, requestError: "", isSubmitting: true };
    case "request-failed":
      return { ...state, requestError: action.message };
    case "request-finished":
      return { ...state, isSubmitting: false };
  }
}

function SignUpPage() {
  const { search } = useLocation();
  const [state, dispatch] = useReducer(signUpReducer, {
    // Signup links can preselect the employer flow with ?type=employer.
    type: search.includes("employer") ? "employer" : "talent",
    form: { name: "", email: "", password: "", company: "" },
    consent: false,
    errors: {},
    isSubmitting: false,
    requestError: "",
  });
  const { type, form, consent, errors, isSubmitting, requestError } = state;
  const { switchCandidate } = usePathway();
  const navigate = useNavigate();
  const set =
    (field: keyof SignUpForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const actionByField = {
        name: { type: "name-changed", value: e.target.value },
        email: { type: "email-changed", value: e.target.value },
        password: { type: "password-changed", value: e.target.value },
        company: { type: "company-changed", value: e.target.value },
      } as const;
      dispatch(actionByField[field]);
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n: Record<string, string> = {};
    if (!form.name.trim()) n.name = "Enter your full name";
    if (!emailOk(form.email)) n.email = "Enter a valid email address";
    if (form.password.length < 8) n.password = "Use at least 8 characters";
    if (type === "employer" && !form.company.trim())
      n.company = "Enter your company name";
    if (!consent) n.consent = "You need to accept the terms to continue";
    dispatch({ type: "validation-errors-set", errors: n });
    if (Object.keys(n).length) return;

    dispatch({ type: "request-started" });
    try {
      // Account type and company currently select the next screen; Better Auth stores name, email, and password.
      const result = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
        callbackURL: `${window.location.origin}${type === "employer" ? "/employer/onboarding" : "/onboarding"}`,
      });
      console.log("Sign-up result:", result);
      if (result.error) {
        dispatch({
          type: "request-failed",
          message: result.error.message ?? "Unable to create your account.",
        });
        return;
      }
      if (type === "talent") switchCandidate("new");
      //navigate to the next step in the onboarding flow based on account type
      navigate(type === "employer" ? "/employer/onboarding" : "/onboarding");
    } catch {
      dispatch({
        type: "request-failed",
        message:
          "Unable to reach the authentication service. Please try again.",
      });
    } finally {
      dispatch({ type: "request-finished" });
    }
  };

  return (
    <>
      <Heading
        title="Create your account"
        sub={
          <>
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </>
        }
      />
      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-medium">I want to</legend>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              id: "talent" as const,
              Icon: UserIcon,
              title: "Find opportunities",
              sub: "Talent, intern, freelancer",
            },
            {
              id: "employer" as const,
              Icon: Building2Icon,
              title: "Hire talent",
              sub: "Company or team",
            },
          ].map(({ id, Icon, title, sub }) => (
            <button
              key={id}
              type="button"
              onClick={() =>
                dispatch({ type: "account-type-changed", accountType: id })
              }
              aria-pressed={type === id}
              className={cn(
                "rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                type === id
                  ? "border-primary bg-accent/60 ring-1 ring-primary"
                  : "bg-card hover:bg-muted",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  type === id ? "text-primary" : "text-muted-foreground",
                )}
              />
              <p className="mt-2 text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </button>
          ))}
        </div>
      </fieldset>
      <SocialAuthButtons
        mode="sign-up"
        callbackURL={
          type === "employer" ? "/employer/onboarding" : "/onboarding"
        }
        disabled={isSubmitting}
        footnote={
          <>
            By continuing with a social account you agree to our{" "}
            <a href="#" className="font-medium text-foreground underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-foreground underline">
              Privacy Policy
            </a>
            . Your provider confirms your email, so there's no verification
            step.
          </>
        }
      />
      {requestError && (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {requestError}
        </p>
      )}
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field id="su-name" label="Full name" error={errors.name}>
          <Input
            id="su-name"
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            className={cn("h-10", errors.name && "border-destructive")}
          />
        </Field>
        {type === "employer" && (
          <Field id="su-company" label="Company name" error={errors.company}>
            <Input
              id="su-company"
              value={form.company}
              onChange={set("company")}
              aria-invalid={!!errors.company}
              className={cn("h-10", errors.company && "border-destructive")}
            />
          </Field>
        )}
        <Field
          id="su-email"
          label={type === "employer" ? "Work email" : "Email"}
          error={errors.email}
        >
          <Input
            id="su-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            className={cn("h-10", errors.email && "border-destructive")}
          />
        </Field>
        <Field id="su-password" label="Password" error={errors.password}>
          <PasswordInput
            id="su-password"
            value={form.password}
            onChange={(value) => dispatch({ type: "password-changed", value })}
            invalid={!!errors.password}
          />
          {!errors.password && (
            <p className="text-xs text-muted-foreground">
              At least 8 characters.
            </p>
          )}
        </Field>
        <div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="su-consent"
              checked={consent}
              onCheckedChange={(v) =>
                dispatch({ type: "consent-changed", consent: v === true })
              }
              className="mt-0.5"
              aria-invalid={!!errors.consent}
            />
            <Label
              htmlFor="su-consent"
              className="text-sm font-normal leading-snug text-muted-foreground"
            >
              I agree to the{" "}
              <a href="#" className="font-medium text-foreground underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-foreground underline">
                Privacy Policy
              </a>
              , including how my profile data is shared with employers.
            </Label>
          </div>
          {errors.consent && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircleIcon className="h-3.5 w-3.5" />
              {errors.consent}
            </p>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating account…"
            : type === "employer"
              ? "Create employer account"
              : "Create talent account"}
        </Button>
      </form>
    </>
  );
}

// This screen currently demonstrates the reset flow; it does not send an email yet.
export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <div className="text-center">
        <MailCheckIcon className="mx-auto h-12 w-12 text-primary" />
        <Heading
          title="Check your email"
          sub={
            <>
              If an account exists for{" "}
              <span className="font-medium text-foreground">{email}</span>,
              we've sent a reset link. It expires in 30 minutes.
            </>
          }
        />
        <Button asChild variant="outline" className="w-full bg-card">
          <Link to="/sign-in">Back to sign in</Link>
        </Button>
        <Button asChild variant="link" className="mt-2 text-muted-foreground">
          <Link to="/reset-password">Open demo reset link</Link>
        </Button>
      </div>
    );
  return (
    <>
      <Heading
        title="Reset your password"
        sub="Enter the email you signed up with and we'll send a reset link."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!emailOk(email)) setError("Enter a valid email address");
          else setSent(true);
        }}
        className="space-y-4"
        noValidate
      >
        <Field id="fp-email" label="Email" error={error}>
          <Input
            id="fp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
            className={cn("h-10", error && "border-destructive")}
          />
        </Field>
        <Button type="submit" size="lg" className="w-full">
          Send reset link
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link to="/sign-in">Back to sign in</Link>
        </Button>
      </form>
    </>
  );
}

type ResetPasswordState = {
  password: string;
  confirmPassword: string;
  error: string;
  done: boolean;
};

type ResetPasswordAction =
  | { type: "password-changed"; password: string }
  | { type: "confirm-password-changed"; password: string }
  | { type: "validation-failed"; message: string }
  | { type: "password-updated" };

function resetPasswordReducer(
  state: ResetPasswordState,
  action: ResetPasswordAction,
): ResetPasswordState {
  switch (action.type) {
    case "password-changed":
      return { ...state, password: action.password };
    case "confirm-password-changed":
      return { ...state, confirmPassword: action.password };
    case "validation-failed":
      return { ...state, error: action.message };
    case "password-updated":
      return { ...state, done: true };
  }
}

// The reset form validates locally until a reset-token API flow is connected.
function ResetPasswordPage() {
  const [state, dispatch] = useReducer(resetPasswordReducer, {
    password: "",
    confirmPassword: "",
    error: "",
    done: false,
  });
  const { password: pw, confirmPassword: confirm, error, done } = state;
  if (done)
    return (
      <div className="text-center">
        <CheckCircle2Icon className="mx-auto h-12 w-12 text-success" />
        <Heading
          title="Password updated"
          sub="You can now sign in with your new password."
        />
        <Button asChild className="w-full">
          <Link to="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  return (
    <>
      <Heading
        title="Choose a new password"
        sub="Use at least 8 characters, ideally a mix of letters, numbers and symbols."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pw.length < 8)
            dispatch({
              type: "validation-failed",
              message: "Use at least 8 characters",
            });
          else if (pw !== confirm)
            dispatch({
              type: "validation-failed",
              message: "Passwords don't match",
            });
          else dispatch({ type: "password-updated" });
        }}
        className="space-y-4"
        noValidate
      >
        <Field id="rp-pw" label="New password">
          <PasswordInput
            id="rp-pw"
            value={pw}
            onChange={(value) =>
              dispatch({ type: "password-changed", password: value })
            }
            invalid={!!error}
          />
        </Field>
        <Field id="rp-confirm" label="Confirm password" error={error}>
          <PasswordInput
            id="rp-confirm"
            value={confirm}
            onChange={(value) =>
              dispatch({ type: "confirm-password-changed", password: value })
            }
            invalid={!!error}
          />
        </Field>
        <Button type="submit" size="lg" className="w-full">
          Update password
        </Button>
      </form>
    </>
  );
}

function VerifyEmailPage({
  email = "you@example.com",
  next = "/onboarding",
}: {
  email?: string;
  next?: string;
}) {
  const [resent, setResent] = useState(false);
  return (
    <div className="text-center">
      <MailCheckIcon className="mx-auto h-12 w-12 text-primary" />
      <Heading
        title="Verify your email"
        sub={
          <>
            We sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>. Click
            it to activate your account.
          </>
        }
      />
      <div className="space-y-2">
        <Button asChild className="w-full">
          <Link to={next}>I've verified — continue</Link>
        </Button>
        {/* This demo action updates the UI but does not resend a real email. */}
        <Button
          variant="outline"
          className="w-full bg-card"
          disabled={resent}
          onClick={() => setResent(true)}
        >
          {resent ? "Link resent — check your inbox" : "Resend link"}
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Can't find it? Check your spam folder or{" "}
        <Link to="/sign-up" className="underline">
          use a different email
        </Link>
        .
      </p>
    </div>
  );
}

export { SignInPage, SignUpPage, ResetPasswordPage, VerifyEmailPage };
