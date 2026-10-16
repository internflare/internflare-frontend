import { useState } from "react";
import { NavLink } from "react-router-dom";
import { InfoIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { leadStages, type LeadStage, type Prospect } from "@/polymet/data/leads-data";

const tabs = [
  { to: "/app/leads", label: "Daily plan", end: true },
  { to: "/app/leads/pipeline", label: "Pipeline" },
  { to: "/app/leads/prospects", label: "Prospects" },
  { to: "/app/leads/calendar", label: "Follow-ups" },
  { to: "/app/leads/outreach", label: "Outreach assistant" },
  { to: "/app/leads/analytics", label: "Analytics" },
  { to: "/app/leads/settings", label: "Service & ideal client" },
];

export function LeadsHeader({ title, description, actions }: { title: string; description: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Client acquisition</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <nav aria-label="Client acquisition" className="mt-5 flex gap-1 overflow-x-auto border-b">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              cn("-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", isActive ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
      <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        You do outreach yourself on LinkedIn or any channel. Internflare never sends messages, connection requests or reads your conversations. All metrics are user-recorded activity.
      </p>
    </div>
  );
}

const stageCls: Record<LeadStage, string> = {
  Identified: "bg-muted text-foreground border-border",
  Contacted: "bg-muted text-foreground border-border",
  Connected: "bg-ai-soft text-ai-strong border-ai/30",
  "In Conversation": "bg-ai-soft text-ai-strong border-ai/30",
  "Pitch Sent": "bg-accent text-brown border-primary/25",
  Negotiation: "bg-warning-soft text-warning border-warning/25",
  Won: "bg-success-soft text-success border-success/25",
  Lost: "bg-destructive/10 text-destructive border-destructive/20",
  "Not Interested": "bg-muted text-muted-foreground border-border",
};

export function LeadStageBadge({ stage }: { stage: LeadStage }) {
  return <span className={cn("inline-flex whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium", stageCls[stage])}>{stage}</span>;
}

export function AddProspectDialog({ onAdd, trigger }: { onAdd: (p: Prospect) => void; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", business: "", url: "", service: "", channel: "LinkedIn" as Prospect["channel"], stage: "Identified" as LeadStage, followUp: "", nextAction: "", note: "" });
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const save = () => {
    if (!f.business.trim() || !f.service.trim()) { setError("Business name and target service are required."); return; }
    if (f.url && !/^https?:\/\//.test(f.url)) { setError("URL should start with http:// or https://"); return; }
    onAdd({
      id: `pr${Date.now()}`, name: f.name || "—", business: f.business, url: f.url, service: f.service, stage: f.stage, channel: f.channel,
      lastAction: "Added prospect", lastActionDate: "2025-05-15", nextAction: f.nextAction || "Plan first outreach", followUp: f.followUp, value: 0,
      awaitingReply: false, meetingBooked: false, notes: f.note ? [{ id: `n${Date.now()}`, date: "15 May", text: f.note, kind: "note" }] : [],
    });
    toast("Prospect added");
    setOpen(false);
    setError("");
    setF({ ...f, name: "", business: "", url: "", service: "", note: "", nextAction: "", followUp: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button><PlusIcon /> Add prospect</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a prospect</DialogTitle>
          <DialogDescription>Enter details you found yourself from public sources. Only add publicly available business information.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="ap-name">Contact name</Label><Input id="ap-name" value={f.name} onChange={set("name")} /></div>
          <div className="space-y-1.5"><Label htmlFor="ap-biz">Business name *</Label><Input id="ap-biz" value={f.business} onChange={set("business")} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="ap-url">Public profile or business URL</Label><Input id="ap-url" value={f.url} onChange={set("url")} placeholder="https://" /></div>
          <div className="space-y-1.5"><Label htmlFor="ap-svc">Target service *</Label><Input id="ap-svc" value={f.service} onChange={set("service")} placeholder="e.g. Booking website" /></div>
          <div className="space-y-1.5"><Label htmlFor="ap-ch">Channel</Label>
            <Select value={f.channel} onValueChange={(v) => setF({ ...f, channel: v as Prospect["channel"] })}>
              <SelectTrigger id="ap-ch"><SelectValue /></SelectTrigger>
              <SelectContent>{["LinkedIn", "Email", "WhatsApp", "Instagram", "In person"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label htmlFor="ap-stage">Stage</Label>
            <Select value={f.stage} onValueChange={(v) => setF({ ...f, stage: v as LeadStage })}>
              <SelectTrigger id="ap-stage"><SelectValue /></SelectTrigger>
              <SelectContent>{leadStages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label htmlFor="ap-fu">Follow-up date</Label><Input id="ap-fu" type="date" value={f.followUp} onChange={set("followUp")} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="ap-next">Next action</Label><Input id="ap-next" value={f.nextAction} onChange={set("nextAction")} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="ap-note">Notes</Label><Textarea id="ap-note" rows={2} value={f.note} onChange={set("note")} /></div>
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter><Button onClick={save}>Save prospect</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UserRecordedNote({ className }: { className?: string }) {
  return <p className={cn("text-[11px] text-muted-foreground", className)}>User-recorded · not verified external activity</p>;
}
