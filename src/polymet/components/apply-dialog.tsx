import { useReducer } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2Icon, FileTextIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { eligibilityFor } from "@/polymet/lib/pathway-engine";

interface ApplyDialogProps {
  opportunityId: string;
  title: string;
  company: string;
  remaining?: number;
}

interface ApplyDialogState {
  cv: string;
  note: string;
  submitted: boolean;
  open: boolean;
}

type ApplyDialogAction =
  | { type: "set-cv"; cv: string }
  | { type: "set-note"; note: string }
  | { type: "set-open"; open: boolean }
  | { type: "submit" };

function applyDialogReducer(
  state: ApplyDialogState,
  action: ApplyDialogAction,
): ApplyDialogState {
  switch (action.type) {
    case "set-cv":
      return { ...state, cv: action.cv };
    case "set-note":
      return { ...state, note: action.note };
    case "set-open":
      return { ...state, open: action.open, submitted: action.open && state.submitted };
    case "submit":
      return { ...state, submitted: true };
  }
}

export function ApplyDialog({ opportunityId, title, company, remaining = 2 }: ApplyDialogProps) {
  const { candidate, apply } = usePathway();
  const eligible = eligibilityFor(candidate, opportunityId).state === "eligible";
  const [{ cv, note, submitted, open }, dispatch] = useReducer(applyDialogReducer, {
    cv: "cv-frontend",
    note: "",
    submitted: false,
    open: false,
  });
  if (candidate.applied.includes(opportunityId) && !open) {
    return (
      <div className="flex flex-1 flex-col gap-2 sm:flex-row">
        <Button size="lg" className="flex-1" disabled><CheckCircle2Icon /> Application submitted</Button>
        <Button asChild size="lg" variant="outline" className="bg-card"><Link to="/app/applications">Track application</Link></Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => dispatch({ type: "set-open", open: o })}>
      <DialogTrigger asChild>
        <Button size="lg" className="flex-1" disabled={!eligible}>
          <SendIcon />
          Apply with Internflare profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {submitted ? (
          <div className="py-4 text-center">
            <CheckCircle2Icon className="mx-auto h-12 w-12 text-success" />
            <DialogTitle className="mt-4">Application submitted</DialogTitle>
            <DialogDescription className="mt-2">
              {company} will review your application for {title}. You'll get a notification when the status changes.
            </DialogDescription>
            <Button asChild className="mt-6">
              <Link to="/app/applications">Go to My applications</Link>
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply to {title}</DialogTitle>
              <DialogDescription>
                {company} will see your profile, selected CV and public portfolio. Private workspace data is never shared.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">CV to include</Label>
                <RadioGroup value={cv} onValueChange={(value) => dispatch({ type: "set-cv", cv: value })} className="mt-2 gap-2">
                  {[
                    { id: "cv-frontend", label: `${candidate.name.replace(" ", "_")}_CV.pdf`, meta: "Updated 08 May" },
                    { id: "cv-general", label: `${candidate.name.replace(" ", "_")}_General.pdf`, meta: "Updated 02 Mar" },
                  ].map((c) => (
                    <Label key={c.id} htmlFor={c.id} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal has-[:checked]:border-primary has-[:checked]:bg-accent/50">
                      <RadioGroupItem value={c.id} id={c.id} />
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-sm font-medium">{c.label}</span>
                      <span className="text-xs text-muted-foreground">{c.meta}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="apply-note" className="text-sm font-medium">Note to employer (optional)</Label>
                <Textarea id="apply-note" value={note} onChange={(e) => dispatch({ type: "set-note", note: e.target.value })} className="mt-2" rows={3} placeholder="Briefly explain why you're interested…" />
              </div>
              <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                This uses 1 of your {remaining} remaining applications on the Career plan this month.
              </p>
            </div>
            <DialogFooter>
              <Button disabled={!eligible} onClick={() => { if (!eligible) return; apply(opportunityId); dispatch({ type: "submit" }); }}>Submit application</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
