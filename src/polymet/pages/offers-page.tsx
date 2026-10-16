import { useReducer } from "react";
import { ArrowUpRightIcon, CheckCircle2Icon, CircleIcon, Loader2Icon, PartyPopperIcon, ShieldCheckIcon, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CompanyLogo } from "@/polymet/components/company-logo";
import { PageHeader } from "@/polymet/components/page-states";
import { offer as seed } from "@/polymet/data/talent-data";

type Workspace = "not-started" | "pending" | "provisioned";

type OfferState = {
  status: typeof seed.status;
  confirmRead: boolean;
  declineReason: string;
  checklist: typeof seed.onboarding;
  workspace: Workspace;
};

type OfferAction =
  | { type: "terms-confirmed"; confirmed: boolean }
  | { type: "decline-reason-changed"; reason: string }
  | { type: "offer-accepted" }
  | { type: "offer-declined" }
  | { type: "checklist-item-toggled"; id: string }
  | { type: "workspace-provisioned" };

function offerReducer(state: OfferState, action: OfferAction): OfferState {
  switch (action.type) {
    case "terms-confirmed":
      return { ...state, confirmRead: action.confirmed };
    case "decline-reason-changed":
      return { ...state, declineReason: action.reason };
    case "offer-accepted":
      return {
        ...state,
        status: "accepted",
        checklist: state.checklist.map((item) =>
          item.id === "ob1" ? { ...item, done: true } : item,
        ),
        workspace: "pending",
      };
    case "offer-declined":
      return { ...state, status: "declined" };
    case "checklist-item-toggled":
      return {
        ...state,
        checklist: state.checklist.map((item) =>
          item.id === action.id &&
          action.id !== "ob1" &&
          action.id !== "ob5"
            ? { ...item, done: !item.done }
            : item,
        ),
      };
    case "workspace-provisioned":
      return {
        ...state,
        workspace: "provisioned",
        checklist: state.checklist.map((item) => ({ ...item, done: true })),
      };
  }
}

export function OffersPage() {
  const [state, dispatch] = useReducer(offerReducer, {
    status: seed.status,
    confirmRead: false,
    declineReason: "",
    checklist: seed.onboarding,
    workspace: "not-started",
  });
  const { status, confirmRead, declineReason, checklist, workspace } = state;

  const accept = () => {
    dispatch({ type: "offer-accepted" });
    toast("Offer accepted", { description: "Brightwave Studio has been notified." });
  };
  const toggle = (id: string) =>
    dispatch({ type: "checklist-item-toggled", id });
  const prereqsDone = checklist.filter((x) => x.id !== "ob5").every((x) => x.done);
  const pct = Math.round((checklist.filter((x) => x.done).length / checklist.length) * 100);

  return (
    <div>
      <Toaster />
      <PageHeader title="Offers" description="Review terms carefully before accepting. Accepting is a commitment to the employer." />

      {status === "accepted" && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-success/25 bg-success-soft/70 p-5">
          <PartyPopperIcon className="h-6 w-6 shrink-0 text-success" />
          <div>
            <p className="font-semibold">You've been selected — congratulations!</p>
            <p className="text-sm text-muted-foreground">Complete onboarding so {seed.company} can grant your SquadCot workspace access. Your application records are preserved.</p>
          </div>
        </div>
      )}
      {status === "declined" && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border bg-muted/50 p-5">
          <XCircleIcon className="h-6 w-6 shrink-0 text-muted-foreground" />
          <p className="text-sm">You declined this offer. {seed.company} has been notified.</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <article className="rounded-2xl border bg-card">
          <div className="flex flex-wrap items-center gap-4 border-b p-6">
            <CompanyLogo initials={seed.companyInitials} tone="purple" size="lg" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{seed.company}</p>
              <h2 className="text-xl font-bold">{seed.role}</h2>
            </div>
            <span className={cn("rounded-md border px-2 py-0.5 text-xs font-medium capitalize", status === "pending" ? "border-warning/25 bg-warning-soft text-warning" : status === "accepted" ? "border-success/25 bg-success-soft text-success" : "bg-muted")}>
              {status === "pending" ? `Expires ${seed.expires}` : status}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {[
              ["Compensation", `${seed.compensation} ${seed.currency}`],
              ["Paid", seed.frequency],
              ["Start date", seed.startDate],
              ["Arrangement", seed.arrangement],
            ].map(([k, v]) => (
              <div key={k} className="bg-card p-4"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-semibold">{v}</dd></div>
            ))}
          </dl>
          <div className="p-6">
            <p className="text-sm font-semibold">Duration</p>
            <p className="text-sm text-muted-foreground">{seed.duration}</p>
            <p className="mt-5 text-sm font-semibold">Terms</p>
            <ul className="mt-2 space-y-2">
              {seed.terms.map((t) => <li key={t} className="flex gap-2 text-sm"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{t}</li>)}
            </ul>
            {status === "pending" && (
              <div className="mt-6 space-y-4 border-t pt-5">
                <div className="flex items-start gap-2">
                  <Checkbox id="read-terms" checked={confirmRead} onCheckedChange={(v) => dispatch({ type: "terms-confirmed", confirmed: v === true })} className="mt-0.5" />
                  <Label htmlFor="read-terms" className="text-sm font-normal leading-snug">I've read the offer terms, including compensation, start date and notice period.</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button disabled={!confirmRead}>Accept offer</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Accept this offer?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You're accepting {seed.role} at {seed.company} for {seed.compensation}/{seed.frequency.toLowerCase()}, starting {seed.startDate}. Other employers in active processes won't be notified automatically.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Not yet</AlertDialogCancel>
                        <AlertDialogAction onClick={accept}>Yes, accept offer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="outline" className="bg-card">Decline</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Decline this offer?</AlertDialogTitle>
                        <AlertDialogDescription>This can't be undone. Sharing a reason is optional but helps the employer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <Textarea value={declineReason} onChange={(e) => dispatch({ type: "decline-reason-changed", reason: e.target.value })} rows={3} placeholder="Optional reason" aria-label="Decline reason" />
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => dispatch({ type: "offer-declined" })}>Decline offer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button variant="ghost" onClick={() => toast("Question sent to employer")}>Ask a question</Button>
                </div>
              </div>
            )}
          </div>
        </article>

        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Onboarding checklist</p>
              <span className="text-sm tabular-nums text-muted-foreground">{pct}%</span>
            </div>
            <Progress value={pct} className="mt-2 h-1.5" aria-label="Onboarding progress" />
            <ul className="mt-4 space-y-1">
              {checklist.map((c) => {
                const locked = status !== "accepted" || c.id === "ob1" || c.id === "ob5";
                return (
                  <li key={c.id}>
                    <button disabled={locked} onClick={() => toggle(c.id)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-muted disabled:cursor-default disabled:hover:bg-transparent">
                      {c.done ? <CheckCircle2Icon className="h-5 w-5 text-success" /> : <CircleIcon className="h-5 w-5 text-muted-foreground" />}
                      <span className={cn(c.done && "text-muted-foreground line-through")}>{c.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <p className="flex items-center gap-2 font-semibold"><ShieldCheckIcon className="h-4 w-4 text-primary" /> SquadCot by internflare</p>
            <p className="mt-1 text-sm text-muted-foreground">Your workspace for ongoing projects, communication, tasks, reports and team management once your engagement starts.</p>
            <div className="mt-4 rounded-lg border bg-muted/40 p-3 text-sm">
              {workspace === "not-started" && <p className="text-muted-foreground">Available after you accept the offer.</p>}
              {workspace === "pending" && (
                <div className="flex gap-2">
                  <Loader2Icon className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-warning" />
                  <div>
                    <p className="font-medium">Access pending</p>
                    <p className="text-muted-foreground">{prereqsDone ? `Waiting for ${seed.company} to provision your workspace.` : "Complete the checklist items above first."}</p>
                  </div>
                </div>
              )}
              {workspace === "provisioned" && <p className="flex items-center gap-2 font-medium text-success"><CheckCircle2Icon className="h-4 w-4" /> Workspace ready</p>}
            </div>
            {workspace === "provisioned" ? (
              <Button asChild className="mt-4 w-full"><a href="https://squadcot.example" target="_blank" rel="noopener noreferrer">Open SquadCot <ArrowUpRightIcon /></a></Button>
            ) : (
              <Button disabled className="mt-4 w-full">Open SquadCot</Button>
            )}
            {workspace === "pending" && prereqsDone && (
              <button className="mt-2 w-full text-center text-xs text-muted-foreground underline underline-offset-2" onClick={() => dispatch({ type: "workspace-provisioned" })}>
                Demo only: simulate employer granting access
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
