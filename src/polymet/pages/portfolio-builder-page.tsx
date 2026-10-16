import { useReducer } from "react";
import { Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/sonner";
import { PageHeader, StateBlock } from "@/polymet/components/page-states";
import { FileUpload } from "@/polymet/components/file-upload";
import { EvidenceBadge, MetaChip } from "@/polymet/components/status-badges";
import { currentTalent, portfolioProjects, type PortfolioProject } from "@/polymet/data/talent-data";

const roles: PortfolioProject["role"][] = ["Developer", "Designer", "Digital Marketer", "Writer", "Project Manager"];

interface PortfolioDraft {
  title: string;
  role: PortfolioProject["role"];
  context: string;
  dates: string;
  contribution: string;
  outcome: string;
  tools: string;
  link: string;
  confidential: boolean;
}

interface PortfolioBuilderState {
  projects: PortfolioProject[];
  role: PortfolioProject["role"] | "all";
  draft: PortfolioDraft;
  open: boolean;
}

type PortfolioBuilderAction =
  | { type: "set-role"; role: PortfolioBuilderState["role"] }
  | { type: "set-open"; open: boolean }
  | { type: "update-draft"; draft: Partial<PortfolioDraft> }
  | { type: "reset-draft" }
  | { type: "add-project"; project: PortfolioProject }
  | { type: "delete-project"; id: string }
  | { type: "set-project-public"; id: string; isPublic: boolean };

function portfolioBuilderReducer(
  state: PortfolioBuilderState,
  action: PortfolioBuilderAction,
): PortfolioBuilderState {
  switch (action.type) {
    case "set-role":
      return { ...state, role: action.role };
    case "set-open":
      return { ...state, open: action.open };
    case "update-draft":
      return { ...state, draft: { ...state.draft, ...action.draft } };
    case "reset-draft":
      return {
        ...state,
        draft: {
          ...state.draft,
          title: "",
          contribution: "",
          outcome: "",
          tools: "",
          link: "",
          context: "",
          dates: "",
        },
      };
    case "add-project":
      return { ...state, projects: [action.project, ...state.projects] };
    case "delete-project":
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.id),
      };
    case "set-project-public":
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.id ? { ...project, public: action.isPublic } : project,
        ),
      };
  }
}

export function PortfolioBuilderPage() {
  const [{ projects, role, draft, open }, dispatch] = useReducer(
    portfolioBuilderReducer,
    {
      projects: portfolioProjects,
      role: "all",
      draft: {
        title: "",
        role: "Developer",
        context: "",
        dates: "",
        contribution: "",
        outcome: "",
        tools: "",
        link: "",
        confidential: false,
      },
      open: false,
    },
  );
  const list = projects.filter((p) => role === "all" || p.role === role);

  const add = () => {
    if (!draft.title.trim() || !draft.contribution.trim()) { toast("Add a title and your contribution"); return; }
    dispatch({ type: "add-project", project: {
      id: `p${Date.now()}`, title: draft.title, role: draft.role, context: draft.context || "Personal project", dates: draft.dates, contribution: draft.contribution,
      outcomes: draft.outcome ? [draft.outcome] : [], tools: draft.tools.split(",").map((t) => t.trim()).filter(Boolean), evidence: "self-reported",
      links: draft.link ? [{ label: "Link", url: draft.link }] : [], public: !draft.confidential,
    } });
    dispatch({ type: "set-open", open: false });
    dispatch({ type: "reset-draft" });
    toast("Project added", { description: "Labelled self-reported until verified." });
  };

  return (
    <div>
      <Toaster />
      <PageHeader
        title="Portfolio builder"
        description="Organise projects by role. Only items you mark public appear on your shareable portfolio."
        actions={
          <>
            <Button asChild variant="outline" className="bg-card"><Link to={`/talent/${currentTalent.id}`}><EyeIcon /> View public</Link></Button>
            <Sheet open={open} onOpenChange={(isOpen) => dispatch({ type: "set-open", open: isOpen })}>
              <SheetTrigger asChild><Button><PlusIcon /> Add project</Button></SheetTrigger>
              <SheetContent className="flex w-full flex-col sm:max-w-md">
                <SheetHeader><SheetTitle>Add a project</SheetTitle></SheetHeader>
                <div className="-mx-6 flex-1 space-y-4 overflow-y-auto px-6 py-4">
                  <div className="space-y-1.5"><Label htmlFor="pj-title">Title *</Label><Input id="pj-title" value={draft.title} onChange={(e) => dispatch({ type: "update-draft", draft: { title: e.target.value } })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label htmlFor="pj-role">Role section</Label>
                      <Select value={draft.role} onValueChange={(v) => dispatch({ type: "update-draft", draft: { role: v as PortfolioProject["role"] } })}>
                        <SelectTrigger id="pj-role"><SelectValue /></SelectTrigger>
                        <SelectContent>{roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5"><Label htmlFor="pj-dates">Dates</Label><Input id="pj-dates" value={draft.dates} onChange={(e) => dispatch({ type: "update-draft", draft: { dates: e.target.value } })} placeholder="Jan – Mar 2025" /></div>
                  </div>
                  <div className="space-y-1.5"><Label htmlFor="pj-ctx">Context</Label><Input id="pj-ctx" value={draft.context} onChange={(e) => dispatch({ type: "update-draft", draft: { context: e.target.value } })} placeholder="Personal, client or employer" /></div>
                  <div className="space-y-1.5"><Label htmlFor="pj-contrib">Your contribution *</Label><Textarea id="pj-contrib" rows={3} value={draft.contribution} onChange={(e) => dispatch({ type: "update-draft", draft: { contribution: e.target.value } })} /></div>
                  <div className="space-y-1.5"><Label htmlFor="pj-out">Outcome</Label><Input id="pj-out" value={draft.outcome} onChange={(e) => dispatch({ type: "update-draft", draft: { outcome: e.target.value } })} placeholder="e.g. Reduced load time by 40%" /></div>
                  <div className="space-y-1.5"><Label htmlFor="pj-tools">Tools (comma separated)</Label><Input id="pj-tools" value={draft.tools} onChange={(e) => dispatch({ type: "update-draft", draft: { tools: e.target.value } })} /></div>
                  <div className="space-y-1.5"><Label htmlFor="pj-link">Link</Label><Input id="pj-link" value={draft.link} onChange={(e) => dispatch({ type: "update-draft", draft: { link: e.target.value } })} placeholder="https://" /></div>
                  <FileUpload label="Images, documents or video" accept=".png,.jpg,.pdf,.mp4" maxMb={20} />
                  <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
                    <div><Label htmlFor="pj-conf" className="text-sm">Contains confidential company work</Label><p className="text-xs text-muted-foreground">Kept private — never shown publicly</p></div>
                    <Switch id="pj-conf" checked={draft.confidential} onCheckedChange={(value) => dispatch({ type: "update-draft", draft: { confidential: value } })} />
                  </div>
                </div>
                <SheetFooter className="border-t pt-4"><Button onClick={add}>Add project</Button></SheetFooter>
              </SheetContent>
            </Sheet>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(["all", ...roles] as const).map((r) => (
          <button key={r} onClick={() => dispatch({ type: "set-role", role: r })} aria-pressed={role === r} className={role === r ? "rounded-md border border-foreground bg-foreground px-2.5 py-1 text-xs font-medium text-background" : "rounded-md border bg-card px-2.5 py-1 text-xs font-medium hover:bg-muted"}>
            {r === "all" ? "All sections" : r} ({r === "all" ? projects.length : projects.filter((p) => p.role === r).length})
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <StateBlock kind="empty" title={`No ${role} projects yet`} description="Add a project with your contribution and outcomes." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((p) => (
            <article key={p.id} className="flex flex-col rounded-xl border bg-card p-5">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{p.role} · {p.context}</p>
                  <h2 className="font-semibold">{p.title}</h2>
                </div>
                <EvidenceBadge level={p.evidence} />
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.contribution}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">{p.tools.map((t) => <MetaChip key={t}>{t}</MetaChip>)}</div>
              <div className="mt-auto flex items-center gap-2 border-t pt-3 mt-4">
                <Switch id={`pub-${p.id}`} checked={p.public} onCheckedChange={(value) => dispatch({ type: "set-project-public", id: p.id, isPublic: value })} />
                <Label htmlFor={`pub-${p.id}`} className="flex items-center gap-1 text-sm">{p.public ? <><EyeIcon className="h-3.5 w-3.5" /> Public</> : <><EyeOffIcon className="h-3.5 w-3.5" /> Private</>}</Label>
                {p.evidence === "self-reported" && <Button size="sm" variant="ghost" className="ml-auto" onClick={() => toast("Verification requested (demo)")}>Request verification</Button>}
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" aria-label={`Delete ${p.title}`}><Trash2Icon /></Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Delete “{p.title}”?</AlertDialogTitle><AlertDialogDescription>This removes the project and its evidence labels from your portfolio.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => dispatch({ type: "delete-project", id: p.id })}>Delete</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
