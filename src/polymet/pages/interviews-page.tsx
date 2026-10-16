import { useState } from "react";
import { Link } from "react-router-dom";
import { AccessibilityIcon, BotIcon, CalendarIcon, CheckIcon, ClockIcon, InfoIcon, UserIcon, VideoIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { CompanyLogo } from "@/polymet/components/company-logo";
import { AiLabel, MetaChip } from "@/polymet/components/status-badges";
import { PageHeader, StateBlock } from "@/polymet/components/page-states";
import { interviews as seed, type Interview } from "@/polymet/data/talent-data";

const statusLabel: Record<Interview["status"], { text: string; cls: string }> = {
  pending: { text: "Response needed", cls: "bg-warning-soft text-warning border-warning/25" },
  confirmed: { text: "Confirmed", cls: "bg-success-soft text-success border-success/25" },
  completed: { text: "Completed", cls: "bg-muted text-muted-foreground border-border" },
  declined: { text: "Declined", cls: "bg-destructive/10 text-destructive border-destructive/20" },
  "reschedule-requested": { text: "Reschedule requested", cls: "bg-ai-soft text-ai-strong border-ai/30" },
};

function InterviewCard({ i, onUpdate }: { i: Interview; onUpdate: (id: string, s: Interview["status"]) => void }) {
  const [reason, setReason] = useState("");
  const ai = i.format.startsWith("AI");
  const s = statusLabel[i.status];
  return (
    <article className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-start gap-3">
        <CompanyLogo initials={i.companyInitials} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{i.stage}</p>
          <p className="text-sm text-muted-foreground">{i.role} · {i.company}</p>
        </div>
        <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${s.cls}`}>{s.text}</span>
      </div>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <p className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-muted-foreground" />{i.date}</p>
        <p className="flex items-center gap-2"><ClockIcon className="h-4 w-4 text-muted-foreground" />{i.time} · {i.timezone}</p>
        <p className="flex items-center gap-2">{ai ? <BotIcon className="h-4 w-4 text-ai-strong" /> : <VideoIcon className="h-4 w-4 text-muted-foreground" />}{i.format}</p>
      </div>
      {i.interviewer && <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><UserIcon className="h-4 w-4" />{i.interviewer}</p>}

      {ai && i.status !== "completed" && (
        <div className="mt-4 rounded-lg border border-ai/30 bg-ai-soft/60 p-4 text-sm">
          <AiLabel>AI-assisted interview</AiLabel>
          <p className="mt-2">Your written answers are summarised by AI against the role's criteria. <strong>A human recruiter reviews every result</strong> and makes the decision. Scores are not shared with other employers.</p>
          <p className="mt-2 flex items-start gap-2 text-muted-foreground"><AccessibilityIcon className="mt-0.5 h-4 w-4 shrink-0" />Need an alternative format or extra time? You can request a human-led interview instead.</p>
        </div>
      )}

      {i.prep.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Preparation</p>
          <ul className="mt-2 space-y-1.5">
            {i.prep.map((p) => <li key={p} className="flex gap-2 text-sm text-muted-foreground"><CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />{p}</li>)}
          </ul>
        </div>
      )}
      {i.outcome && <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-sm">Outcome: <span className="font-medium">{i.outcome}</span></p>}

      {i.status !== "completed" && i.status !== "declined" && (
        <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
          {i.status === "pending" && (
            <Button size="sm" onClick={() => { onUpdate(i.id, "confirmed"); toast("Interview accepted", { description: "The employer has been notified." }); }}>
              <CheckIcon /> Accept
            </Button>
          )}
          {ai && i.status === "confirmed" && <Button asChild size="sm"><Link to="/app/tools/interview-practice">Practice first</Link></Button>}
          {ai && i.status === "pending" && <Button asChild size="sm" variant="outline" className="bg-card"><Link to="/app/tools/interview-practice">Try a practice round</Link></Button>}
          {!ai && i.status === "confirmed" && <Button size="sm" variant="outline" className="bg-card" onClick={() => toast("Calendar invite downloaded (.ics)")}>Add to calendar</Button>}
          <Dialog>
            <DialogTrigger asChild><Button size="sm" variant="outline" className="bg-card">Request reschedule</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request a new time</DialogTitle>
                <DialogDescription>The employer decides whether to reschedule. Your current slot stays booked until they respond.</DialogDescription>
              </DialogHeader>
              <Label htmlFor={`rs-${i.id}`}>Reason and preferred times</Label>
              <Textarea id={`rs-${i.id}`} rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. I have an exam that morning. Available Fri after 2pm WAT." />
              <DialogFooter><Button disabled={!reason.trim()} onClick={() => { onUpdate(i.id, "reschedule-requested"); toast("Reschedule request sent"); }}>Send request</Button></DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="ghost" className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { onUpdate(i.id, "declined"); toast("Interview declined"); }}>
            <XIcon /> Decline
          </Button>
        </div>
      )}
    </article>
  );
}

export function InterviewsPage() {
  const [items, setItems] = useState(seed);
  const update = (id: string, status: Interview["status"]) => setItems((p) => p.map((x) => (x.id === id ? { ...x, status } : x)));
  const upcoming = items.filter((i) => i.status !== "completed");
  const past = items.filter((i) => i.status === "completed");

  return (
    <div>
      <Toaster />
      <PageHeader title="Interviews" description="All times are shown in the interview's time zone. Your profile time zone is WAT (UTC+1)." />
      <Tabs defaultValue="upcoming">
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4 grid gap-4 xl:grid-cols-2">
          {upcoming.length ? upcoming.map((i) => <InterviewCard key={i.id} i={i} onUpdate={update} />) : <StateBlock kind="empty" title="No upcoming interviews" description="Invitations from employers will appear here." className="xl:col-span-2" />}
        </TabsContent>
        <TabsContent value="past" className="mt-4 grid gap-4 xl:grid-cols-2">
          {past.map((i) => <InterviewCard key={i.id} i={i} onUpdate={update} />)}
        </TabsContent>
      </Tabs>
      <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><InfoIcon className="h-3.5 w-3.5" /> <MetaChip>Demo</MetaChip> Responses here are not sent to real employers.</p>
    </div>
  );
}
