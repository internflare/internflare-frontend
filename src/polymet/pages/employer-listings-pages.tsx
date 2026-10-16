import { useMemo, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeftIcon, CopyIcon, EyeIcon, MoreHorizontalIcon, PauseIcon, PencilIcon, PlayIcon, PlusIcon, SearchIcon, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader, StateBlock } from "@/polymet/components/page-states";
import { MatchBadge, StageBadge } from "@/polymet/components/status-badges";
import { StatTile, WidgetCard } from "@/polymet/components/widget-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { candidates, employerListings, planUsage, type EmployerListing, type ListingStatus } from "@/polymet/data/employer-data";

const statusCls: Record<ListingStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  published: "bg-success-soft text-success border-success/25",
  paused: "bg-warning-soft text-warning border-warning/25",
  closed: "bg-destructive/10 text-destructive border-destructive/20",
};
export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  return <span className={cn("rounded-md border px-2 py-0.5 text-xs font-medium capitalize", statusCls[status])}>{status}</span>;
}

type ListingsTab = "all" | ListingStatus;

interface EmployerListingsState {
  items: EmployerListing[];
  tab: ListingsTab;
  query: string;
  closing: EmployerListing | null;
}

type EmployerListingsAction =
  | { type: "set-tab"; tab: ListingsTab }
  | { type: "set-query"; query: string }
  | { type: "set-closing"; listing: EmployerListing | null }
  | { type: "set-status"; id: string; status: ListingStatus }
  | { type: "duplicate"; listing: EmployerListing; copyId: string };

function employerListingsReducer(
  state: EmployerListingsState,
  action: EmployerListingsAction,
): EmployerListingsState {
  switch (action.type) {
    case "set-tab":
      return { ...state, tab: action.tab };
    case "set-query":
      return { ...state, query: action.query };
    case "set-closing":
      return { ...state, closing: action.listing };
    case "set-status":
      return {
        ...state,
        items: state.items.map((listing) =>
          listing.id === action.id ? { ...listing, status: action.status } : listing,
        ),
      };
    case "duplicate": {
      const listing = action.listing;
      return {
        ...state,
        items: [{
          ...listing,
          id: action.copyId,
          title: `${listing.title} (copy)`,
          status: "draft",
          applicants: 0,
          newApplicants: 0,
          views: 0,
          shortlisted: 0,
          posted: "—",
        }, ...state.items],
      };
    }
  }
}

export function EmployerListingsPage() {
  const [{ items, tab, query, closing }, dispatch] = useReducer(
    employerListingsReducer,
    { items: employerListings, tab: "all", query: "", closing: null },
  );
  const list = useMemo(() => items.filter((l) => (tab === "all" || l.status === tab) && l.title.toLowerCase().includes(query.toLowerCase())), [items, tab, query]);
  const activeCount = items.filter((l) => l.status === "published" || l.status === "paused").length;
  const limit = planUsage[0].limit;

  const setStatus = (id: string, status: ListingStatus) => dispatch({ type: "set-status", id, status });
  const duplicate = (l: EmployerListing) => {
    dispatch({ type: "duplicate", listing: l, copyId: `${l.id}-copy-${Date.now()}` });
    toast("Listing duplicated as draft");
  };
  const publish = (l: EmployerListing) => {
    if (activeCount >= limit) { toast("Listing limit reached", { description: `Your plan allows ${limit} active listings. Pause one or upgrade.` }); return; }
    setStatus(l.id, "published");
    toast(l.status === "paused" ? "Listing resumed" : "Listing published");
  };

  return (
    <div>
      <PageHeader title="Listings" description={`${activeCount} of ${limit} active listings used on your plan.`} actions={<Button asChild><Link to="/employer/listings/new"><PlusIcon /> New listing</Link></Button>} />
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={tab} onValueChange={(v) => dispatch({ type: "set-tab", tab: v as ListingsTab })}>
          <TabsList className="h-auto flex-wrap justify-start">
            {(["all", "published", "draft", "paused", "closed"] as const).map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize">{t} ({t === "all" ? items.length : items.filter((l) => l.status === t).length})</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative ml-auto w-full max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => dispatch({ type: "set-query", query: e.target.value })} placeholder="Search listings" className="h-9 bg-card pl-9" aria-label="Search listings" />
        </div>
      </div>
      <div className="mt-4">
        {list.length === 0 ? (
          <StateBlock kind="empty" title={`No ${tab === "all" ? "" : tab} listings`} description="Create a listing to start receiving applications." action={{ label: "New listing", to: "/employer/listings/new" }} />
        ) : (
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Listing</TableHead><TableHead>Status</TableHead><TableHead>Applicants</TableHead><TableHead>Views</TableHead><TableHead>Deadline</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
                <TableBody>
                  {list.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        <Link to={`/employer/listings/${l.id}`} className="font-medium hover:text-primary">{l.title}</Link>
                        <p className="text-xs text-muted-foreground">{l.type} · {l.arrangement} · {l.location} · {l.compensation}</p>
                      </TableCell>
                      <TableCell><ListingStatusBadge status={l.status} /></TableCell>
                      <TableCell className="tabular-nums">{l.applicants}{l.newApplicants > 0 && <span className="ml-1.5 rounded bg-accent px-1 text-xs font-semibold text-brown">+{l.newApplicants}</span>}</TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">{l.views.toLocaleString()}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{l.deadline}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for ${l.title}`}><MoreHorizontalIcon /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link to={`/employer/listings/${l.id}`}><EyeIcon /> View & analytics</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link to={`/employer/listings/${l.id}/edit`}><PencilIcon /> Edit</Link></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => duplicate(l)}><CopyIcon /> Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {l.status === "published" && <DropdownMenuItem onClick={() => { setStatus(l.id, "paused"); toast("Listing paused — hidden from search"); }}><PauseIcon /> Pause</DropdownMenuItem>}
                            {(l.status === "paused" || l.status === "draft") && <DropdownMenuItem onClick={() => publish(l)}><PlayIcon /> {l.status === "draft" ? "Publish" : "Resume"}</DropdownMenuItem>}
                            {l.status !== "closed" && l.status !== "draft" && <DropdownMenuItem className="text-destructive" onClick={() => dispatch({ type: "set-closing", listing: l })}><XCircleIcon /> Close listing</DropdownMenuItem>}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
      <AlertDialog open={!!closing} onOpenChange={(o) => !o && dispatch({ type: "set-closing", listing: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close “{closing?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>Applications will stop. {closing?.applicants} applicants keep their current stage; those not progressed will be notified the role has closed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { if (closing) setStatus(closing.id, "closed"); toast("Listing closed"); }}>Close listing</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function EmployerListingDetailPage() {
  const { id = "frontend-engineering-intern" } = useParams();
  const l = employerListings.find((x) => x.id === id);
  if (!l) return <StateBlock kind="no-results" title="Listing not found" action={{ label: "All listings", to: "/employer/listings" }} />;
  const apps = candidates.filter((c) => c.listingId === l.id);
  const sources = [{ s: "Internflare search", v: 58 }, { s: "Recommended to talent", v: 27 }, { s: "Shared link", v: 15 }];

  return (
    <div>
      <Link to="/employer/listings" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ChevronLeftIcon className="h-4 w-4" /> Listings</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><h1 className="text-2xl font-bold tracking-tight">{l.title}</h1><ListingStatusBadge status={l.status} /></div>
          <p className="mt-1 text-sm text-muted-foreground">{l.type} · {l.arrangement} · {l.location} · {l.compensation} · Posted {l.posted} · Closes {l.deadline}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="bg-card"><Link to={`/opportunities/${l.id}`}><EyeIcon /> Public view</Link></Button>
          <Button asChild><Link to={`/employer/listings/${l.id}/edit`}><PencilIcon /> Edit</Link></Button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Views" value={l.views.toLocaleString()} />
        <StatTile label="Applicants" value={l.applicants} sub={`${l.newApplicants} new`} />
        <StatTile label="View → apply" value={l.views ? `${((l.applicants / l.views) * 100).toFixed(1)}%` : "—"} />
        <StatTile label="Shortlisted" value={l.shortlisted} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <WidgetCard title="Applicants" action={<Link to="/employer/candidates" className="text-sm font-medium text-primary hover:underline">Open inbox</Link>}>
          {apps.length === 0 ? <p className="text-sm text-muted-foreground">No applicants yet.</p> : (
            <ul className="divide-y">
              {apps.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <Avatar className="h-9 w-9"><AvatarImage src={c.avatar} alt="" /><AvatarFallback>{c.name[0]}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1"><Link to={`/employer/candidates/${c.id}`} className="text-sm font-medium hover:text-primary">{c.name}</Link><p className="truncate text-xs text-muted-foreground">{c.headline} · applied {c.applied}</p></div>
                  {c.match && <MatchBadge score={c.match.score} className="hidden sm:inline-flex" />}
                  <StageBadge stage={c.stage} />
                </li>
              ))}
            </ul>
          )}
        </WidgetCard>
        <WidgetCard title="Where applicants found this">
          <ul className="space-y-3">
            {sources.map((s) => (
              <li key={s.s}><div className="flex justify-between text-sm"><span>{s.s}</span><span className="tabular-nums">{s.v}%</span></div><div className="mt-1.5 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-ai" style={{ width: `${s.v}%` }} /></div></li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">Illustrative demo analytics.</p>
        </WidgetCard>
      </div>
    </div>
  );
}
