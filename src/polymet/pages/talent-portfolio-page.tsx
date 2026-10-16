import { useState } from "react";
import { ExternalLinkIcon, MapPinIcon, MailIcon, Share2Icon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { EvidenceBadge, MetaChip } from "@/polymet/components/status-badges";
import { currentTalent, portfolioProjects, type PortfolioProject } from "@/polymet/data/talent-data";

const roles: PortfolioProject["role"][] = ["Developer", "Designer", "Digital Marketer", "Writer", "Project Manager"];

export function TalentPortfolioPage() {
  const publicProjects = portfolioProjects.filter((p) => p.public);
  const available = roles.filter((r) => publicProjects.some((p) => p.role === r));
  const [role, setRole] = useState<PortfolioProject["role"]>(available[0] ?? "Developer");
  const [msg, setMsg] = useState("");
  const shown = publicProjects.filter((p) => p.role === role);
  const skills = Array.from(new Set(shown.flatMap((p) => p.tools)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Toaster />
      <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:p-8">
        <Avatar className="h-24 w-24 border">
          <AvatarImage src={currentTalent.avatar} alt={currentTalent.name} />
          <AvatarFallback>AO</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{currentTalent.name}</h1>
          <p className="mt-1 text-muted-foreground">{currentTalent.headline}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPinIcon className="h-4 w-4" /> {currentTalent.location}</span>
            <span>{currentTalent.availability}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="bg-card" aria-label="Copy share link" onClick={() => toast("Profile link copied")}><Share2Icon /></Button>
          <Dialog>
            <DialogTrigger asChild><Button><MailIcon /> Express interest</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Express interest in {currentTalent.firstName}</DialogTitle>
                <DialogDescription>Your message is delivered through Internflare. Contact details are only shared if {currentTalent.firstName} accepts.</DialogDescription>
              </DialogHeader>
              <div>
                <Label htmlFor="interest-msg">Message</Label>
                <Textarea id="interest-msg" className="mt-2" rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Tell them about the role or project…" />
                <p className="mt-2 text-xs text-muted-foreground">Requires a signed-in, verified employer account.</p>
              </div>
              <DialogFooter><Button disabled={!msg.trim()} onClick={() => toast("Interest sent for review", { description: "Delivered once your employer account is verified." })}>Send</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2" role="tablist" aria-label="Portfolio role">
        <span className="mr-1 text-sm text-muted-foreground">Viewing as:</span>
        {roles.map((r) => {
          const has = available.includes(r);
          return (
            <button
              key={r}
              role="tab"
              disabled={!has}
              aria-selected={role === r}
              onClick={() => setRole(r)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
                role === r ? "border-foreground bg-foreground text-background" : "bg-card hover:bg-muted",
              )}
            >
              {r}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {shown.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-2xl border bg-card">
              {p.image && <img src={p.image} alt={`${p.title} preview`} className="h-48 w-full object-cover" />}
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold">{p.title}</h2>
                    <p className="text-sm text-muted-foreground">{p.context} · {p.dates}</p>
                  </div>
                  <EvidenceBadge level={p.evidence} />
                </div>
                <p className="mt-3 text-[15px] leading-relaxed">{p.contribution}</p>
                <ul className="mt-3 space-y-1">
                  {p.outcomes.map((o) => <li key={o} className="flex gap-2 text-sm"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />{o}</li>)}
                </ul>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {p.tools.map((t) => <MetaChip key={t}>{t}</MetaChip>)}
                  {p.links.map((l) => (
                    <a key={l.label} href={l.url} className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline first-of-type:ml-auto">
                      {l.label} <ExternalLinkIcon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <p className="font-semibold">{role} skills & tools</p>
            <div className="mt-3 flex flex-wrap gap-1.5">{skills.map((s) => <MetaChip key={s}>{s}</MetaChip>)}</div>
          </div>
          <div className="rounded-xl border bg-card p-5 text-sm">
            <p className="font-semibold">About evidence labels</p>
            <div className="mt-3 space-y-2.5">
              <div><EvidenceBadge level="verified" /><p className="mt-1 text-muted-foreground">Checked against documents or a trusted source.</p></div>
              <div><EvidenceBadge level="employer-confirmed" /><p className="mt-1 text-muted-foreground">Confirmed by the employer involved.</p></div>
              <div><EvidenceBadge level="self-reported" /><p className="mt-1 text-muted-foreground">Provided by the talent; not yet checked.</p></div>
            </div>
          </div>
          <p className="flex gap-2 text-xs text-muted-foreground"><ShieldCheckIcon className="h-4 w-4 shrink-0" /> Only items approved for public sharing appear here. Confidential company work is never shown.</p>
        </aside>
      </div>
    </div>
  );
}
