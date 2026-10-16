import { useReducer } from "react";
import { Link, useLocation } from "react-router-dom";
import { BadgeCheckIcon, ClockIcon, EyeIcon, FileTextIcon, PlusIcon, ShieldIcon, UploadIcon, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import { PageHeader } from "@/polymet/components/page-states";
import { FileUpload } from "@/polymet/components/file-upload";
import { EvidenceBadge, MetaChip } from "@/polymet/components/status-badges";
import { currentTalent } from "@/polymet/data/talent-data";

const verifications = [
  { id: "identity", title: "Identity", status: "verified", detail: "Government ID checked · 02 Apr 2025" },
  { id: "qualification", title: "Qualifications", status: "pending", detail: "Degree certificate under review · submitted 10 May" },
  { id: "employment", title: "Employment & engagements", status: "verified", detail: "Brightwave Studio confirmed freelance engagement" },
  { id: "evidence", title: "Work evidence", status: "not-started", detail: "Submit project evidence for review" },
] as const;

const statusUi = {
  verified: { Icon: BadgeCheckIcon, cls: "text-success", label: "Verified" },
  pending: { Icon: ClockIcon, cls: "text-warning", label: "Under review" },
  "not-started": { Icon: XCircleIcon, cls: "text-muted-foreground", label: "Not submitted" },
};

const experience = [
  { id: "e1", title: "Freelance Frontend Developer", org: "Brightwave Studio", dates: "Oct – Dec 2024", evidence: "employer-confirmed" as const },
  { id: "e2", title: "Tech Lead (volunteer)", org: "UNILAG Tech Society", dates: "2023 – 2024", evidence: "self-reported" as const },
];

interface ProfileSkill {
  n: string;
  l: string;
}

interface PrivacySettings {
  public: boolean;
  searchable: boolean;
  showSalary: boolean;
  showReadiness: boolean;
  showContact: boolean;
}

interface ProfileState {
  headline: string;
  bio: string;
  skills: ProfileSkill[];
  privacy: PrivacySettings;
}

type ProfileAction =
  | { type: "set-headline"; headline: string }
  | { type: "set-bio"; bio: string }
  | { type: "set-skill-level"; skillIndex: number; level: string }
  | { type: "set-privacy"; key: keyof PrivacySettings; value: boolean };

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case "set-headline":
      return { ...state, headline: action.headline };
    case "set-bio":
      return { ...state, bio: action.bio };
    case "set-skill-level":
      return {
        ...state,
        skills: state.skills.map((skill, index) =>
          index === action.skillIndex ? { ...skill, l: action.level } : skill,
        ),
      };
    case "set-privacy":
      return {
        ...state,
        privacy: { ...state.privacy, [action.key]: action.value },
      };
  }
}

export function ProfilePage() {
  const { search } = useLocation();
  const initialTab = new URLSearchParams(search).get("tab") ?? "profile";
  const [{ headline, bio, skills, privacy }, dispatch] = useReducer(profileReducer, {
    headline: currentTalent.headline,
    bio: "I build accessible, fast interfaces with React and TypeScript. Looking for an internship or junior role on a product team.",
    skills: [
      { n: "React", l: "Advanced" },
      { n: "TypeScript", l: "Intermediate" },
      { n: "Accessibility", l: "Intermediate" },
      { n: "Git", l: "Intermediate" },
    ],
    privacy: { public: true, searchable: true, showSalary: false, showReadiness: true, showContact: false },
  });

  return (
    <div>
      <Toaster />
      <PageHeader
        title="Profile & CV"
        description="What employers see when you apply. Verification is handled separately for identity, qualifications, employment and work evidence."
        actions={<Button asChild variant="outline" className="bg-card"><Link to={`/talent/${currentTalent.id}`}><EyeIcon /> Preview public profile</Link></Button>}
      />
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
        <span className="text-sm font-medium">Profile completeness</span>
        <Progress value={currentTalent.profileCompleteness} className="h-2 max-w-xs flex-1" aria-label="Profile completeness" />
        <span className="text-sm font-semibold tabular-nums">{currentTalent.profileCompleteness}%</span>
        <span className="text-xs text-muted-foreground">Next: {currentTalent.missingProfileItems[0].label}</span>
      </div>

      <Tabs defaultValue={initialTab}>
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="documents">CV & documents</TabsTrigger>
          <TabsTrigger value="skills">Skills & experience</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="privacy">Preferences & privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-5">
          <div className="max-w-3xl space-y-5 rounded-xl border bg-card p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16"><AvatarImage src={currentTalent.avatar} alt="" /><AvatarFallback>AO</AvatarFallback></Avatar>
              <Button variant="outline" size="sm" className="bg-card" onClick={() => toast("Photo upload (demo)")}><UploadIcon /> Change photo</Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label htmlFor="pf-name">Full name</Label><Input id="pf-name" defaultValue={currentTalent.name} /></div>
              <div className="space-y-1.5"><Label htmlFor="pf-loc">Location</Label><Input id="pf-loc" defaultValue={currentTalent.location} /></div>
            </div>
            <div className="space-y-1.5"><Label htmlFor="pf-headline">Headline</Label><Input id="pf-headline" value={headline} onChange={(e) => dispatch({ type: "set-headline", headline: e.target.value })} maxLength={80} /><p className="text-right text-xs text-muted-foreground">{headline.length}/80</p></div>
            <div className="space-y-1.5"><Label htmlFor="pf-bio">About</Label><Textarea id="pf-bio" rows={4} value={bio} onChange={(e) => dispatch({ type: "set-bio", bio: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="pf-edu">Education</Label><Input id="pf-edu" defaultValue={currentTalent.education} /></div>
            <div className="flex justify-end"><Button onClick={() => toast("Profile saved")}>Save changes</Button></div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-5">
          <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <p className="font-semibold">Your CVs</p>
              <ul className="mt-3 space-y-2">
                {[["Amara_Okafor_Frontend.pdf", "Default · used in 5 applications"], ["Amara_Okafor_General.pdf", "Used in 2 applications"]].map(([n, m]) => (
                  <li key={n} className="flex items-center gap-3 rounded-lg border p-3">
                    <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1"><p className="text-sm font-medium">{n}</p><p className="text-xs text-muted-foreground">{m}</p></div>
                    <Button size="sm" variant="ghost" onClick={() => toast(`Opening ${n} preview`)}>Preview</Button>
                  </li>
                ))}
              </ul>
              <Button asChild variant="link" className="mt-2 px-0"><Link to="/app/tools/cv-review">Review a CV with AI →</Link></Button>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <FileUpload label="Upload a new CV or document" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="mt-5">
          <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <p className="font-semibold">Skills</p>
              <ul className="mt-3 space-y-2">
                {skills.map((s, i) => (
                  <li key={s.n} className="flex items-center gap-3">
                    <span className="flex-1 text-sm font-medium">{s.n}</span>
                    <Select value={s.l} onValueChange={(value) => dispatch({ type: "set-skill-level", skillIndex: i, level: value })}>
                      <SelectTrigger className="h-8 w-36" aria-label={`${s.n} level`}><SelectValue /></SelectTrigger>
                      <SelectContent>{["Beginner", "Intermediate", "Advanced"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Levels are self-reported until confirmed by an assessment.</p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between"><p className="font-semibold">Experience</p><Button size="sm" variant="outline" className="bg-card" onClick={() => toast("Add experience form (demo)")}><PlusIcon /> Add</Button></div>
              <ul className="mt-3 space-y-2">
                {experience.map((e) => (
                  <li key={e.id} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">{e.title}</p><EvidenceBadge level={e.evidence} /></div>
                    <p className="text-xs text-muted-foreground">{e.org} · {e.dates}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="mt-5">
          <div className="grid max-w-4xl gap-3 sm:grid-cols-2">
            {verifications.map((v) => {
              const ui = statusUi[v.status];
              return (
                <div key={v.id} className="rounded-xl border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{v.title}</p>
                    <span className={cn("flex items-center gap-1 text-xs font-medium", ui.cls)}><ui.Icon className="h-4 w-4" />{ui.label}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{v.detail}</p>
                  {v.status === "not-started" && <Button size="sm" className="mt-3" onClick={() => toast("Verification request started (demo)")}>Start verification</Button>}
                </div>
              );
            })}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><ShieldIcon className="h-4 w-4" /> Verified documents are visible only to Internflare reviewers. Employers see the result label, not the document.</p>
        </TabsContent>

        <TabsContent value="privacy" className="mt-5">
          <div className="max-w-2xl space-y-1 rounded-xl border bg-card p-2">
            {([
              ["public", "Public portfolio", "Anyone with the link can see items you've approved for public sharing"],
              ["searchable", "Discoverable by employers", "Verified employers can find you in talent search"],
              ["showReadiness", "Share readiness results", "Show role readiness on applications"],
              ["showSalary", "Show salary expectation", "Visible to employers you apply to"],
              ["showContact", "Show contact details", "Otherwise employers contact you via Internflare"],
            ] as const).map(([k, l, d]) => (
              <div key={k} className="flex items-start justify-between gap-4 rounded-lg p-4 hover:bg-muted/40">
                <div><Label htmlFor={`pv-${k}`} className="text-sm">{l}</Label><p className="text-xs text-muted-foreground">{d}</p></div>
                <Switch id={`pv-${k}`} checked={privacy[k]} onCheckedChange={(value) => dispatch({ type: "set-privacy", key: k, value })} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="text-sm text-muted-foreground">Preferred arrangements:</span>
            {["Remote", "Hybrid"].map((a) => <MetaChip key={a}>{a}</MetaChip>)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
