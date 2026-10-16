import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ActionProps {
  candidate: string;
  onDone: (summary: string) => void;
  trigger: React.ReactNode;
}

export function ScheduleInterviewDialog({ candidate, onDone, trigger }: ActionProps) {
  const [f, setF] = useState({ date: "", time: "10:00", tz: "WAT", format: "Video", interviewer: "Ifeoma N.", note: "" });
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request interview with {candidate}</DialogTitle>
          <DialogDescription>Uses 1 interview request on your plan. The candidate can accept, decline or request another time. A paid test task is not required.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="si-date">Date</Label><Input id="si-date" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></div>
          <div className="space-y-1.5"><Label htmlFor="si-time">Time</Label><Input id="si-time" type="time" value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} /></div>
          <div className="space-y-1.5"><Label htmlFor="si-tz">Time zone</Label><Select value={f.tz} onValueChange={(v) => setF({ ...f, tz: v })}><SelectTrigger id="si-tz"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="WAT">WAT (UTC+1)</SelectItem><SelectItem value="GMT">GMT (UTC+0)</SelectItem><SelectItem value="EAT">EAT (UTC+3)</SelectItem></SelectContent></Select></div>
          <div className="space-y-1.5"><Label htmlFor="si-fmt">Format</Label><Select value={f.format} onValueChange={(v) => setF({ ...f, format: v })}><SelectTrigger id="si-fmt"><SelectValue /></SelectTrigger><SelectContent>{["Video", "Phone", "Onsite", "AI written (human-reviewed)"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="si-int">Interviewer</Label><Input id="si-int" value={f.interviewer} onChange={(e) => setF({ ...f, interviewer: e.target.value })} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="si-note">Message to candidate</Label><Textarea id="si-note" rows={2} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></div>
        </div>
        <DialogFooter><Button disabled={!f.date} onClick={() => { onDone(`Interview requested · ${f.date} ${f.time} ${f.tz}`); toast("Interview request sent", { description: "Demo — no real notification was sent." }); }}>Send request</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TestTaskDialog({ candidate, onDone, trigger }: ActionProps) {
  const [f, setF] = useState({ title: "", output: "", criteria: "", deadline: "", amount: "", terms: "Payment released within 5 working days of accepted submission. One round of revisions included.", ack: false });
  const valid = f.title && f.output && f.criteria && f.deadline && Number(f.amount) > 0 && f.ack;
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite {candidate} to a paid test task</DialogTitle>
          <DialogDescription>Optional and independent of interviews. The candidate sees every detail below before deciding to start.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label htmlFor="tt-title">Task title *</Label><Input id="tt-title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
          <div className="space-y-1.5"><Label htmlFor="tt-out">Expected output *</Label><Textarea id="tt-out" rows={2} value={f.output} onChange={(e) => setF({ ...f, output: e.target.value })} placeholder="What exactly should be delivered?" /></div>
          <div className="space-y-1.5"><Label htmlFor="tt-crit">Evaluation criteria *</Label><Textarea id="tt-crit" rows={2} value={f.criteria} onChange={(e) => setF({ ...f, criteria: e.target.value })} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="tt-dl">Deadline *</Label><Input id="tt-dl" type="date" value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="tt-amt">Payment (NGN) *</Label><Input id="tt-amt" type="number" min={1} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="tt-terms">Terms</Label><Textarea id="tt-terms" rows={2} value={f.terms} onChange={(e) => setF({ ...f, terms: e.target.value })} /></div>
          <div className="flex items-start gap-2"><Checkbox id="tt-ack" checked={f.ack} onCheckedChange={(v) => setF({ ...f, ack: v === true })} className="mt-0.5" /><Label htmlFor="tt-ack" className="text-sm font-normal">I'll fund this task through the payment provider. Funds show as pending until the provider confirms.</Label></div>
        </div>
        <DialogFooter><Button disabled={!valid} onClick={() => { onDone(`Paid test task sent · ₦${Number(f.amount).toLocaleString()} · due ${f.deadline}`); toast("Test task invitation sent", { description: "Payment status: pending provider confirmation." }); }}>Send invitation</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OfferDialog({ candidate, onDone, trigger }: ActionProps) {
  const [f, setF] = useState({ amount: "", currency: "NGN", frequency: "Monthly", start: "", expires: "", terms: "" });
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Make an offer to {candidate}</DialogTitle><DialogDescription>The candidate reviews and explicitly accepts or declines.</DialogDescription></DialogHeader>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5"><Label htmlFor="of-amt">Amount *</Label><Input id="of-amt" type="number" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} /></div>
          <div className="space-y-1.5"><Label htmlFor="of-cur">Currency</Label><Select value={f.currency} onValueChange={(v) => setF({ ...f, currency: v })}><SelectTrigger id="of-cur"><SelectValue /></SelectTrigger><SelectContent>{["NGN", "USD", "GHS", "KES"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label htmlFor="of-freq">Frequency</Label><Select value={f.frequency} onValueChange={(v) => setF({ ...f, frequency: v })}><SelectTrigger id="of-freq"><SelectValue /></SelectTrigger><SelectContent>{["Hourly", "Monthly", "Yearly"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label htmlFor="of-start">Start date *</Label><Input id="of-start" type="date" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="of-exp">Offer expires</Label><Input id="of-exp" type="date" value={f.expires} onChange={(e) => setF({ ...f, expires: e.target.value })} /></div>
          <div className="space-y-1.5 sm:col-span-3"><Label htmlFor="of-terms">Key terms</Label><Textarea id="of-terms" rows={3} value={f.terms} onChange={(e) => setF({ ...f, terms: e.target.value })} placeholder="Hours, probation, notice period, equipment…" /></div>
        </div>
        <DialogFooter><Button disabled={!f.amount || !f.start} onClick={() => { onDone(`Offer sent · ${f.currency} ${Number(f.amount).toLocaleString()} ${f.frequency.toLowerCase()}`); toast("Offer sent to candidate"); }}>Send offer</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RejectDialog({ candidate, onDone, trigger }: ActionProps) {
  const [msg, setMsg] = useState(`Hi ${candidate.split(" ")[0]}, thank you for applying. We've decided not to move forward at this stage. We appreciate the time you invested and encourage you to apply for future roles.`);
  const [notify, setNotify] = useState(true);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Reject {candidate}?</AlertDialogTitle><AlertDialogDescription>The application moves to Rejected and is archived. You can review it later in recruitment history.</AlertDialogDescription></AlertDialogHeader>
        <Textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} aria-label="Message to candidate" />
        <div className="flex items-center gap-2"><Checkbox id="rj-notify" checked={notify} onCheckedChange={(v) => setNotify(v === true)} /><Label htmlFor="rj-notify" className="text-sm font-normal">Notify the candidate with this message</Label></div>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { onDone(notify ? "Rejected · candidate notified" : "Rejected · archived without message"); toast("Candidate rejected"); }}>Reject</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

