import { useMemo, useReducer } from "react";
import { toast } from "sonner";
import { ArrowRightIcon, ClipboardCheckIcon, FilterXIcon, GaugeIcon, SearchIcon, ShieldCheckIcon, TargetIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JobsWordmark } from "@/polymet/components/brand-logo";
import { StateBlock } from "@/polymet/components/page-states";
import { TalentPoolCard } from "@/polymet/components/employer/talent-pool-card";
import { TalentPoolProfile } from "@/polymet/components/employer/talent-pool-profile";
import { employerListings } from "@/polymet/data/employer-data";
import { careerRoles, opportunityRequirements } from "@/polymet/data/pathway-data";
import { assessedTalent, type PoolArrangement, type PoolEmployment } from "@/polymet/data/talent-pool-data";
import { listingFit, poolStatus } from "@/polymet/lib/pathway-engine";

const jobListings = employerListings.filter((l) => l.status === "published" && opportunityRequirements[l.id]?.level === "job");
const employments: PoolEmployment[] = ["Full-time", "Part-time", "Contract", "Freelance"];
const arrangements: PoolArrangement[] = ["Remote", "Hybrid", "Onsite"];
const isPoolEmployment = (value: string): value is PoolEmployment => employments.some((employment) => employment === value);
const isPoolArrangement = (value: string): value is PoolArrangement => arrangements.some((arrangement) => arrangement === value);

type TalentPoolState = {
  q: string;
  role: string;
  employment: string;
  arrangement: string;
  listing: string;
  strongOnly: boolean;
  idOnly: boolean;
  sort: string;
  tab: string;
  shortlist: string[];
  invited: string[];
  viewId: string | null;
  inviteId: string | null;
  inviteListing: string;
  inviteMsg: string;
};

type TalentPoolAction =
  | { type: "set-query"; query: string }
  | { type: "set-role"; role: string }
  | { type: "set-employment"; employment: string }
  | { type: "set-arrangement"; arrangement: string }
  | { type: "set-listing"; listing: string }
  | { type: "set-strong-only"; strongOnly: boolean }
  | { type: "set-id-only"; idOnly: boolean }
  | { type: "set-sort"; sort: string }
  | { type: "set-tab"; tab: string }
  | { type: "toggle-shortlist"; id: string }
  | { type: "set-invited"; id: string }
  | { type: "set-view-id"; viewId: string | null }
  | { type: "set-invite-id"; inviteId: string | null }
  | { type: "open-invite"; id: string; listing: string; message: string }
  | { type: "set-invite-listing"; listing: string }
  | { type: "set-invite-message"; message: string }
  | { type: "clear-filters" };

function talentPoolReducer(state: TalentPoolState, action: TalentPoolAction): TalentPoolState {
  switch (action.type) {
    case "set-query":
      return { ...state, q: action.query };
    case "set-role":
      return { ...state, role: action.role };
    case "set-employment":
      return { ...state, employment: action.employment };
    case "set-arrangement":
      return { ...state, arrangement: action.arrangement };
    case "set-listing":
      return { ...state, listing: action.listing, sort: action.listing !== "none" ? "fit" : state.sort };
    case "set-strong-only":
      return { ...state, strongOnly: action.strongOnly };
    case "set-id-only":
      return { ...state, idOnly: action.idOnly };
    case "set-sort":
      return { ...state, sort: action.sort };
    case "set-tab":
      return { ...state, tab: action.tab };
    case "toggle-shortlist":
      return { ...state, shortlist: state.shortlist.includes(action.id) ? state.shortlist.filter((id) => id !== action.id) : [...state.shortlist, action.id] };
    case "set-invited":
      return { ...state, invited: [...state.invited, action.id] };
    case "set-view-id":
      return { ...state, viewId: action.viewId };
    case "set-invite-id":
      return { ...state, inviteId: action.inviteId };
    case "open-invite":
      return { ...state, inviteId: action.id, inviteListing: action.listing, inviteMsg: action.message };
    case "set-invite-listing":
      return { ...state, inviteListing: action.listing };
    case "set-invite-message":
      return { ...state, inviteMsg: action.message };
    case "clear-filters":
      return { ...state, q: "", role: "all", employment: "all", arrangement: "all", strongOnly: false, idOnly: false, listing: "none", sort: "readiness" };
  }
}

export function EmployerTalentPoolPage() {
  const [state, dispatch] = useReducer(talentPoolReducer, {
    q: "",
    role: "all",
    employment: "all",
    arrangement: "all",
    listing: "none",
    strongOnly: false,
    idOnly: false,
    sort: "readiness",
    tab: "pool",
    shortlist: [],
    invited: [],
    viewId: null,
    inviteId: null,
    inviteListing: "general",
    inviteMsg: "",
  });
  const { q, role, employment, arrangement, listing, strongOnly, idOnly, sort, tab, shortlist, invited, viewId, inviteId, inviteListing, inviteMsg } = state;

  const evaluated = useMemo(() => assessedTalent.map((t) => ({ t, s: poolStatus(t.assessment)! })).filter((x) => x.s), []);
  const pool = evaluated.filter((x) => x.s.inPool);
  const routed = evaluated.filter((x) => !x.s.inPool);
  const rolesInPool = new Set(pool.map((x) => x.s.role.id));
  const strongShare = Math.round((pool.filter((x) => x.t.evidence.some((e) => e.kind === "verified" || e.kind === "employer-confirmed")).length / Math.max(pool.length, 1)) * 100);

  const listingRole = listing !== "none" ? opportunityRequirements[listing]?.roleId : undefined;

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = pool
      .filter(({ t }) => (tab === "shortlist" ? shortlist.includes(t.id) : true))
      .filter(({ s }) => (listingRole ? s.role.id === listingRole : role === "all" || s.role.id === role))
      .filter(({ t }) => employment === "all" || (isPoolEmployment(employment) && t.employment.includes(employment)))
      .filter(({ t }) => arrangement === "all" || (isPoolArrangement(arrangement) && t.arrangements.includes(arrangement)))
      .filter(({ t }) => !strongOnly || t.evidence.some((e) => e.kind === "verified" || e.kind === "employer-confirmed"))
      .filter(({ t }) => !idOnly || t.identityVerified)
      .filter(({ t, s }) => !term || [t.name, t.headline, t.location, s.role.title].some((v) => v.toLowerCase().includes(term)))
      .map((x) => ({ ...x, fit: listing !== "none" ? listingFit(x.t.assessment, listing) : null }));
    return list.sort((a, b) => {
      if (sort === "fit" && a.fit && b.fit) return Number(b.fit.ok) - Number(a.fit.ok) || b.fit.overall - a.fit.overall;
      if (sort === "recent") return Date.parse(b.t.joinedPool) - Date.parse(a.t.joinedPool);
      return b.s.overall - b.s.threshold - (a.s.overall - a.s.threshold);
    });
  }, [pool, q, role, employment, arrangement, strongOnly, idOnly, sort, tab, shortlist, listing, listingRole]);

  const hasFilters = q || role !== "all" || employment !== "all" || arrangement !== "all" || strongOnly || idOnly || listing !== "none";
  const clear = () => dispatch({ type: "clear-filters" });

  const viewing = evaluated.find((x) => x.t.id === viewId);
  const inviting = evaluated.find((x) => x.t.id === inviteId);
  const inviteOptions = inviting ? jobListings.filter((l) => opportunityRequirements[l.id]?.roleId === inviting.s.role.id) : [];

  const toggleShortlist = (id: string, name: string) => {
    dispatch({ type: "toggle-shortlist", id });
    toast.success(shortlist.includes(id) ? `${name} removed from shortlist` : `${name} added to shortlist`);
  };
  const openInvite = (id: string) => {
    const x = evaluated.find((e) => e.t.id === id)!;
    const match = jobListings.find((l) => opportunityRequirements[l.id]?.roleId === x.s.role.id);
    dispatch({
      type: "open-invite",
      id,
      listing: listing !== "none" && opportunityRequirements[listing]?.roleId === x.s.role.id ? listing : match?.id ?? "general",
      message: `Hi ${x.t.name.split(" ")[0]}, your assessed ${x.s.role.title} evidence stood out to our team at Paystack Labs. We'd like to invite you to apply.`,
    });
  };
  const sendInvite = () => {
    if (!inviting || !inviteMsg.trim()) return;
    dispatch({ type: "set-invited", id: inviting.t.id });
    dispatch({ type: "set-invite-id", inviteId: null });
    toast.success(`Invitation sent to ${inviting.t.name}`, { description: "They'll see it in their internflare notifications and can accept or decline." });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <JobsWordmark className="text-sm" />
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[28px]">Talent pool</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Every person here has met job-readiness on assessed evidence for their role. Candidates who aren't ready yet are routed to internships or learning — they don't appear in this pool.
          </p>
        </div>
        <Button variant="outline" className="bg-card" onClick={() => dispatch({ type: "set-tab", tab: "shortlist" })}><TargetIcon /> Shortlist ({shortlist.length})</Button>
      </div>

      <ol className="mb-6 grid gap-3 md:grid-cols-3">
        {[
          { Icon: UsersIcon, t: "Talent states a goal", d: "Internship, job or exploring — it guides what they see, nothing more." },
          { Icon: ClipboardCheckIcon, t: "Evidence is assessed", d: "Role competencies scored and labelled assessed, employer-confirmed or verified." },
          { Icon: ShieldCheckIcon, t: "Only job-ready enter the pool", d: "Overall job threshold and every core competency minimum must be met." },
        ].map(({ Icon, t, d }, i) => (
          <li key={t} className="relative flex gap-3 rounded-xl border bg-card p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary"><Icon className="h-4 w-4" /></span>
            <div><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
            {i < 2 && <ArrowRightIcon className="absolute -right-2.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 rounded-full border bg-card p-0.5 text-muted-foreground md:block" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Job-ready talent in pool", v: pool.length, n: "Updated after each assessment" },
          { l: "With confirmed or verified evidence", v: `${strongShare}%`, n: "Beyond self-reported claims" },
          { l: "Roles represented", v: rolesInPool.size, n: `of ${careerRoles.length} assessed roles` },
          { l: "Assessed, not yet job-ready", v: routed.length, n: "On internship or learning pathways — not shown" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{k.l}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{k.v}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{k.n}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => dispatch({ type: "set-query", query: e.target.value })} placeholder="Search name, role, location" className="pl-9" aria-label="Search talent pool" />
          </div>
          <Select value={listing} onValueChange={(v) => dispatch({ type: "set-listing", listing: v })}>
            <SelectTrigger aria-label="Match to listing"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Match to a listing…</SelectItem>
              {jobListings.map((l) => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={listingRole ?? role} onValueChange={(v) => dispatch({ type: "set-role", role: v })} disabled={!!listingRole}>
            <SelectTrigger aria-label="Role"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {careerRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={employment} onValueChange={(v) => dispatch({ type: "set-employment", employment: v })}>
            <SelectTrigger aria-label="Employment type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any employment type</SelectItem>
              {employments.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={arrangement} onValueChange={(v) => dispatch({ type: "set-arrangement", arrangement: v })}>
            <SelectTrigger aria-label="Work arrangement"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any arrangement</SelectItem>
              {arrangements.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Label className="flex items-center gap-2 text-sm font-normal"><Switch checked={strongOnly} onCheckedChange={(checked) => dispatch({ type: "set-strong-only", strongOnly: checked })} /> Confirmed or verified evidence only</Label>
          <Label className="flex items-center gap-2 text-sm font-normal"><Switch checked={idOnly} onCheckedChange={(checked) => dispatch({ type: "set-id-only", idOnly: checked })} /> Identity verified</Label>
          <div className="ml-auto flex items-center gap-2">
            <Select value={sort} onValueChange={(v) => dispatch({ type: "set-sort", sort: v })}>
              <SelectTrigger className="h-9 w-[190px]" aria-label="Sort"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="readiness">Most above threshold</SelectItem>
                <SelectItem value="recent">Newest to pool</SelectItem>
                <SelectItem value="fit" disabled={listing === "none"}>Best fit to listing</SelectItem>
              </SelectContent>
            </Select>
            {hasFilters && <Button variant="ghost" size="sm" onClick={clear}><FilterXIcon /> Clear</Button>}
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => dispatch({ type: "set-tab", tab: v })} className="mt-5">
        <TabsList>
          <TabsTrigger value="pool">Job-ready pool ({pool.length})</TabsTrigger>
          <TabsTrigger value="shortlist">Shortlisted ({shortlist.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {rows.length === 0 ? (
          tab === "shortlist" && shortlist.length === 0 ? (
            <StateBlock kind="empty" title="No one shortlisted yet" description="Bookmark talent from the pool to compare them here." />
          ) : (
            <StateBlock kind="no-results" title="No job-ready talent matches these filters" description="Try widening the role, arrangement or evidence filters." />
          )
        ) : (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {rows.map(({ t, s, fit }) => (
              <TalentPoolCard
                key={t.id}
                talent={t}
                status={s}
                fit={fit}
                shortlisted={shortlist.includes(t.id)}
                invited={invited.includes(t.id)}
                onShortlist={() => toggleShortlist(t.id, t.name)}
                onView={() => dispatch({ type: "set-view-id", viewId: t.id })}
                onInvite={() => openInvite(t.id)}
              />
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <GaugeIcon className="h-3.5 w-3.5" />
        Pool size, invite limits and contact access per plan are pending product configuration.
      </p>

      <Sheet open={!!viewing} onOpenChange={(o) => !o && dispatch({ type: "set-view-id", viewId: null })}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader className="mb-4">
            <SheetTitle>Candidate evidence</SheetTitle>
            <SheetDescription>Assessed role competencies and work evidence.</SheetDescription>
          </SheetHeader>
          {viewing && (
            <>
              <TalentPoolProfile talent={viewing.t} status={viewing.s} fit={listing !== "none" ? listingFit(viewing.t.assessment, listing) : null} />
              <div className="sticky bottom-0 mt-6 flex gap-2 border-t bg-background pt-4">
                <Button variant="outline" className="flex-1 bg-card" onClick={() => toggleShortlist(viewing.t.id, viewing.t.name)}>{shortlist.includes(viewing.t.id) ? "Remove from shortlist" : "Add to shortlist"}</Button>
                <Button className="flex-1" disabled={invited.includes(viewing.t.id)} onClick={() => { dispatch({ type: "set-view-id", viewId: null }); openInvite(viewing.t.id); }}>{invited.includes(viewing.t.id) ? "Invited" : "Invite to apply"}</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!inviting} onOpenChange={(o) => !o && dispatch({ type: "set-invite-id", inviteId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite {inviting?.t.name}</DialogTitle>
            <DialogDescription>The candidate decides whether to apply. Their eligibility for the listing is still checked when they do.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="invite-listing">Listing</Label>
              <Select value={inviteListing} onValueChange={(v) => dispatch({ type: "set-invite-listing", listing: v })}>
                <SelectTrigger id="invite-listing"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {inviteOptions.map((l) => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
                  <SelectItem value="general">General interest — no specific listing</SelectItem>
                </SelectContent>
              </Select>
              {inviting && inviteListing !== "general" && (() => {
                const f = listingFit(inviting.t.assessment, inviteListing);
                return f ? <p className={f.ok ? "text-xs text-success" : "text-xs text-warning"}>{f.ok ? `Meets this listing's requirements (${f.overall}/${f.req.threshold}).` : `Below this listing's requirements: ${f.unmet[0]?.label}. They can still be invited, but can't apply until they meet them.`}</p> : null;
              })()}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-msg">Message</Label>
              <Textarea id="invite-msg" rows={4} value={inviteMsg} onChange={(e) => dispatch({ type: "set-invite-message", message: e.target.value })} />
              {!inviteMsg.trim() && <p className="text-xs text-destructive">Add a short message.</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-card" onClick={() => dispatch({ type: "set-invite-id", inviteId: null })}>Cancel</Button>
            <Button onClick={sendInvite} disabled={!inviteMsg.trim()}>Send invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
