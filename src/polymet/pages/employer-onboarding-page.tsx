import { useReducer } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  PlusIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import authService from "@/service/auth.service";
import { ApiRequestError } from "@/service/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WizardStepper } from "@/polymet/components/wizard-stepper";
import { FileUpload } from "@/polymet/components/file-upload";
import { employerPlans, formatNaira } from "@/polymet/data/pricing-data";

const steps = [
  "Company details",
  "Authorised representative",
  "Company profile",
  "Verification",
  "Choose a plan",
  "Invite your team",
];

const industries = [
  "Agriculture",
  "Agritech",
  "Consulting",
  "Design & Media",
  "E-commerce",
  "Education",
  "Energy",
  "Financial Services",
  "Fintech",
  "Government",
  "Healthcare",
  "Healthtech",
  "Hospitality & Tourism",
  "Information Technology",
  "Logistics & Transportation",
  "Manufacturing",
  "Marketing & Advertising",
  "Non-profit",
  "Real Estate",
  "Retail",
  "Telecommunications",
  "Other",
];

const countryCodes: Record<string, string> = {
  Nigeria: "NG",
  Ghana: "GH",
  Kenya: "KE",
  "South Africa": "ZA",
};

type EmployerForm = {
  name: string;
  website: string;
  industry: string;
  country: string;
  email: string;
  phone: string;
  rep: string;
  repTitle: string;
  repAuth: boolean;
  about: string;
  culture: string;
  rc: string;
};

type EmployerOnboardingState = {
  step: number;
  done: number[];
  form: EmployerForm;
  plan: string;
  invites: { email: string; role: string }[];
  invite: { email: string; role: string };
  error: string;
  finished: boolean;
  submitting: boolean;
};

type EmployerOnboardingAction =
  | { type: "set-step"; step: number }
  | { type: "advance-step"; lastStep: number }
  | { type: "complete-step"; step: number }
  | { type: "set-form"; form: EmployerForm }
  | { type: "set-plan"; plan: string }
  | { type: "add-invite"; invite: { email: string; role: string } }
  | { type: "remove-invite"; email: string }
  | { type: "set-invite"; invite: { email: string; role: string } }
  | { type: "set-invite-email"; email: string }
  | { type: "set-invite-role"; role: string }
  | { type: "set-error"; error: string }
  | { type: "set-finished"; finished: boolean }
  | { type: "set-submitting"; submitting: boolean };

// Reducer function for managing the onboarding state
function employerOnboardingReducer(
  state: EmployerOnboardingState,
  action: EmployerOnboardingAction,
): EmployerOnboardingState {
  switch (action.type) {
    case "set-step":
      return { ...state, step: action.step };
    case "advance-step":
      return { ...state, step: Math.min(state.step + 1, action.lastStep) };
    case "complete-step":
      return {
        ...state,
        done: state.done.includes(action.step)
          ? state.done
          : [...state.done, action.step],
      };
    case "set-form":
      return { ...state, form: action.form };
    case "set-plan":
      return { ...state, plan: action.plan };
    case "add-invite":
      return { ...state, invites: [...state.invites, action.invite] };
    case "remove-invite":
      return {
        ...state,
        invites: state.invites.filter(
          (invite) => invite.email !== action.email,
        ),
      };
    case "set-invite":
      return { ...state, invite: action.invite };
    case "set-invite-email":
      return { ...state, invite: { ...state.invite, email: action.email } };
    case "set-invite-role":
      return { ...state, invite: { ...state.invite, role: action.role } };
    case "set-error":
      return { ...state, error: action.error };
    case "set-finished":
      return { ...state, finished: action.finished };
    case "set-submitting":
      return { ...state, submitting: action.submitting };
  }
}

// Main component for the employer onboarding page
function EmployerOnboardingPage() {
  const [state, dispatch] = useReducer(employerOnboardingReducer, {
    step: 0,
    done: [],
    form: {
      name: "",
      website: "",
      industry: "",
      country: "",
      email: "",
      phone: "",
      rep: "Tolu Adebayo",
      repTitle: "Talent Partner",
      repAuth: false,
      about: "",
      culture: "",
      rc: "",
    },
    plan: "emp-free",
    invites: [],
    invite: { email: "", role: "Hiring team member" },
    error: "",
    finished: false,
    submitting: false,
  });
  // Destructure state for easier access
  const {
    step,
    done,
    form: f,
    plan,
    invites,
    invite,
    error,
    finished,
    submitting,
  } = state;

  // Helper function to update form fields
  const updateForm =
    (k: Exclude<keyof EmployerForm, "repAuth">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      dispatch({ type: "set-form", form: { ...f, [k]: e.target.value } });

  // validate function to check if the current step's required fields are filled
  const validate = () => {
    if (
      step === 0 &&
      (!f.name.trim() ||
        !/^https?:\/\//.test(f.website) ||
        !f.email.includes("@"))
    )
      return "Enter company name, a valid website (https://) and contact email.";
    if (step === 1 && (!f.rep.trim() || !f.repAuth))
      return "Enter the representative and confirm they're authorised to act for the company.";
    if (step === 3 && !f.rc.trim())
      return "Enter your business registration number to submit for verification.";
    return "";
  };

  // Function to handle moving to the next step, including validation
  const next = async () => {
    const e = validate();
    dispatch({ type: "set-error", error: e });
    if (e) return;

    if (step === steps.length - 1) {
      dispatch({ type: "set-submitting", submitting: true });
      try {
        // Submit the employer onboarding data to the backend
        await authService.postEmployerOnboardingData({
          name: f.name,
          website: f.website,
          industry: f.industry || null,
          country: countryCodes[f.country] ?? null,
          registration_number: f.rc || null,
        });

        // Mark the current step as complete and set the finished state to true
        dispatch({ type: "complete-step", step });
        dispatch({ type: "set-finished", finished: true });
        toast.success("Employer setup completed");
      } catch (error) {
        const message =
          error instanceof ApiRequestError
            ? `Could not submit employer setup (HTTP ${error.status}). Please try again.`
            : "Could not submit employer setup. Please try again.";
        dispatch({ type: "set-error", error: message });
        toast.error(message);
      } finally {
        dispatch({ type: "set-submitting", submitting: false });
      }
      return;
    }

    dispatch({ type: "complete-step", step });
    dispatch({ type: "advance-step", lastStep: steps.length - 1 });
  };
  const selectedPlan = employerPlans.find((p) => p.id === plan)!;

  // Render the onboarding form or the finished state based on the current step
  if (finished) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <CheckCircle2Icon className="mx-auto h-14 w-14 text-success" />
        <h1 className="mt-4 text-2xl font-bold">{f.name} is set up</h1>
        <p className="mt-2 text-muted-foreground">
          You can create listings now. Verification is under review — your
          listings show “Verification pending” until it's approved.
        </p>
        {selectedPlan.price > 0 && (
          <p className="mt-3 rounded-lg border border-warning/30 bg-warning-soft p-3 text-sm">
            {selectedPlan.name} activates after verified payment. Until then
            you're on Free.
          </p>
        )}
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild variant="outline" className="bg-card">
            <Link to="/employer">Go to dashboard</Link>
          </Button>
          <Button asChild>
            <Link to="/employer/listings/new">Create first listing</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Render the onboarding form with stepper and navigation buttons
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <WizardStepper
        steps={steps}
        current={step}
        completed={done}
        onStepClick={(nextStep) =>
          dispatch({ type: "set-step", step: nextStep })
        }
        title="Employer setup"
      />
      <section className="rounded-2xl border bg-card">
        <div className="border-b p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Step {step + 1} of {steps.length}
          </p>
          <h1 className="mt-1 text-xl font-bold">{steps[step]}</h1>
        </div>
        <div className="space-y-4 p-6">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="eo-name">Company name *</Label>
                <Input
                  id="eo-name"
                  value={f.name}
                  onChange={updateForm("name")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eo-web">Website *</Label>
                <Input
                  id="eo-web"
                  value={f.website}
                  onChange={updateForm("website")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eo-ind">Industry</Label>
                <Select
                  value={f.industry}
                  onValueChange={(v) =>
                    dispatch({ type: "set-form", form: { ...f, industry: v } })
                  }
                >
                  <SelectTrigger id="eo-ind">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eo-country">Country</Label>
                <Select
                  value={f.country}
                  onValueChange={(v) =>
                    dispatch({ type: "set-form", form: { ...f, country: v } })
                  }
                >
                  <SelectTrigger id="eo-country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Nigeria", "Ghana", "Kenya", "South Africa"].map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eo-email">Contact email *</Label>
                <Input
                  id="eo-email"
                  type="email"
                  value={f.email}
                  onChange={updateForm("email")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eo-phone">Phone</Label>
                <Input
                  id="eo-phone"
                  value={f.phone}
                  onChange={updateForm("phone")}
                />
              </div>
            </div>
          )}
          {step === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="eo-rep">Full name *</Label>
                  <Input
                    id="eo-rep"
                    value={f.rep}
                    onChange={updateForm("rep")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="eo-rept">Job title</Label>
                  <Input
                    id="eo-rept"
                    value={f.repTitle}
                    onChange={updateForm("repTitle")}
                  />
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg border bg-muted/40 p-3">
                <Checkbox
                  id="eo-auth"
                  checked={f.repAuth}
                  onCheckedChange={(v) =>
                    dispatch({
                      type: "set-form",
                      form: { ...f, repAuth: v === true },
                    })
                  }
                  className="mt-0.5"
                />
                <Label htmlFor="eo-auth" className="text-sm font-normal">
                  I confirm I'm authorised to register and recruit on behalf of{" "}
                  {f.name}.
                </Label>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="eo-about">About the company</Label>
                <Textarea
                  id="eo-about"
                  rows={4}
                  value={f.about}
                  onChange={updateForm("about")}
                  placeholder="What you do and who you serve"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eo-cult">Culture & ways of working</Label>
                <Textarea
                  id="eo-cult"
                  rows={3}
                  value={f.culture}
                  onChange={updateForm("culture")}
                />
              </div>
              <FileUpload
                label="Logo"
                accept=".png,.jpg,.svg"
                maxMb={2}
                hint="PNG, JPG or SVG · max 2 MB"
              />
              <p className="text-xs text-muted-foreground">
                These details are shown as self-reported on your public profile.
              </p>
            </>
          )}
          {step === 3 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="eo-rc">
                  Business registration number (e.g. CAC RC) *
                </Label>
                <Input id="eo-rc" value={f.rc} onChange={updateForm("rc")} />
              </div>
              <FileUpload
                label="Registration certificate"
                accept=".pdf,.png,.jpg"
              />
              <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft p-3 text-sm">
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-warning" />{" "}
                Reviews usually take 1–3 working days. You can publish meanwhile
                with a “Verification pending” label.
              </div>
            </>
          )}
          {step === 4 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {employerPlans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => dispatch({ type: "set-plan", plan: p.id })}
                  aria-pressed={plan === p.id}
                  className={cn(
                    "rounded-xl border p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    plan === p.id
                      ? "border-primary bg-accent/50 ring-1 ring-primary"
                      : "hover:bg-muted",
                  )}
                >
                  <div className="flex justify-between">
                    <p className="font-semibold">{p.name}</p>
                    <p className="font-semibold">
                      {formatNaira(p.price)}
                      <span className="text-xs font-normal text-muted-foreground">
                        /mo
                      </span>
                    </p>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {p.features.slice(0, 4).map((x) => (
                      <li key={x.label}>
                        · {x.label}
                        {x.status === "configurable" &&
                          " (pending configuration)"}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          )}
          {step === 5 && (
            <>
              <p className="text-sm text-muted-foreground">
                Invite hiring team members.{" "}
                {plan === "emp-free" &&
                  "The Free plan lets you add one employee."}
              </p>
              <div className="flex flex-wrap gap-2">
                <Input
                  value={invite.email}
                  onChange={(e) =>
                    dispatch({
                      type: "set-invite-email",
                      email: e.target.value,
                    })
                  }
                  placeholder="colleague@company.com"
                  className="min-w-[220px] flex-1"
                  aria-label="Invite email"
                />
                <Select
                  value={invite.role}
                  onValueChange={(v) =>
                    dispatch({ type: "set-invite-role", role: v })
                  }
                >
                  <SelectTrigger className="w-full sm:w-48" aria-label="Role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Company admin">Company admin</SelectItem>
                    <SelectItem value="Hiring team member">
                      Hiring team member
                    </SelectItem>
                    <SelectItem value="Interviewer">
                      Interviewer (view only)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="bg-card"
                  disabled={
                    !invite.email.includes("@") ||
                    (plan === "emp-free" && invites.length >= 1)
                  }
                  onClick={() => {
                    dispatch({ type: "add-invite", invite });
                    dispatch({
                      type: "set-invite",
                      invite: { ...invite, email: "" },
                    });
                    toast("Invitation queued");
                  }}
                >
                  <PlusIcon /> Invite
                </Button>
              </div>
              <ul className="space-y-2">
                {invites.map((i) => (
                  <li
                    key={i.email}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <span>
                      {i.email} ·{" "}
                      <span className="text-muted-foreground">{i.role}</span>
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      aria-label={`Remove ${i.email}`}
                      onClick={() =>
                        dispatch({ type: "remove-invite", email: i.email })
                      }
                    >
                      <XIcon />
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 border-t p-4 sm:px-6">
          <Button
            variant="ghost"
            disabled={step === 0}
            onClick={() => dispatch({ type: "set-step", step: step - 1 })}
          >
            <ArrowLeftIcon /> Back
          </Button>
          <Button
            variant="outline"
            className="ml-auto bg-card"
            onClick={() => toast("Progress saved")}
          >
            <SaveIcon /> Save
          </Button>
          <Button onClick={() => void next()} disabled={submitting}>
            {submitting
              ? "Submitting..."
              : step === steps.length - 1
                ? "Finish setup"
                : step === 3
                  ? "Submit for verification"
                  : "Continue"}{" "}
            <ArrowRightIcon />
          </Button>
        </div>
      </section>
    </div>
  );
}

export { EmployerOnboardingPage };
