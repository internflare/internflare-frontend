import { CheckIcon, ExternalLinkIcon, MessageSquareIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { CompanyLogo } from "@/polymet/components/company-logo";
import { SourceBadge, StageBadge } from "@/polymet/components/status-badges";
import type { Application } from "@/polymet/data/talent-data";

interface ApplicationDetailSheetProps {
  application: Application | null;
  onOpenChange: (open: boolean) => void;
  onWithdraw: (id: string) => void;
}

export function ApplicationDetailSheet({ application: a, onOpenChange, onWithdraw }: ApplicationDetailSheetProps) {
  const canWithdraw = a && a.managedBy === "internflare" && !["Hired", "Rejected", "Withdrawn", "Offer"].includes(a.stage);

  return (
    <Sheet open={!!a} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {a && (
          <>
            <SheetHeader className="text-left">
              <div className="flex items-center gap-3">
                <CompanyLogo initials={a.companyInitials} />
                <div>
                  <SheetTitle>{a.title}</SheetTitle>
                  <SheetDescription>{a.company} · Applied {a.dateApplied}</SheetDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <StageBadge stage={a.stage} />
                <SourceBadge source={a.managedBy} provider={a.provider} />
              </div>
            </SheetHeader>

            {a.managedBy === "external" && (
              <div className="mt-5 rounded-lg border bg-muted/50 p-3 text-sm">
                <p className="font-medium">Tracked externally</p>
                <p className="mt-1 text-muted-foreground">You opened this application on {a.provider}. Internflare only records your click and can't see its status. Update the stage manually if you hear back.</p>
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm font-semibold">Next action</p>
              <p className="mt-1 rounded-lg border bg-accent/50 p-3 text-sm">{a.nextAction}</p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold">Timeline</p>
              <ol className="mt-3 space-y-0">
                {a.history.map((h, i) => {
                  const last = i === a.history.length - 1;
                  return (
                    <li key={`${h.stage}-${h.date}`} className="relative flex gap-3 pb-5 last:pb-0">
                      {!last && <span className="absolute left-[11px] top-6 h-full w-px bg-border" aria-hidden="true" />}
                      <span className={cn("z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border", last ? "border-primary bg-primary text-primary-foreground" : "bg-card text-success")}>
                        {h.stage === "External click" ? <ExternalLinkIcon className="h-3 w-3" /> : <CheckIcon className="h-3 w-3" />}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{h.stage}</p>
                        <p className="text-xs text-muted-foreground">{h.date}{h.note ? ` · ${h.note}` : ""}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {a.message && (
              <div className="mt-6">
                <p className="text-sm font-semibold">Latest employer message</p>
                <div className="mt-2 rounded-lg border p-3">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MessageSquareIcon className="h-3.5 w-3.5" /> {a.message.from} · {a.message.date}</p>
                  <p className="mt-1.5 text-sm">{a.message.body}</p>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-2 border-t pt-4">
              <Button asChild variant="outline" className="bg-card"><Link to={`/opportunities/${a.opportunityId}`}>View listing</Link></Button>
              {a.stage === "Interview" && <Button asChild variant="outline" className="bg-card"><Link to="/app/interviews">Interview details</Link></Button>}
              {a.stage === "Offer" && <Button asChild><Link to="/app/offers">Review offer</Link></Button>}
              {canWithdraw && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive">Withdraw</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Withdraw this application?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {a.company} will be notified that you've withdrawn from {a.title}. This can't be undone, and the application slot isn't refunded.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep application</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { onWithdraw(a.id); toast("Application withdrawn"); }}>
                        Withdraw
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
