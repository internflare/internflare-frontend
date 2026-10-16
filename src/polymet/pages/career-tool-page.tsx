import { useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeftIcon, CopyIcon, HistoryIcon, Loader2Icon, PencilIcon, RefreshCwIcon, SaveIcon, SparklesIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { AiLabel } from "@/polymet/components/status-badges";
import { StateBlock } from "@/polymet/components/page-states";
import { careerTools, getTool } from "@/polymet/data/career-tools-data";

export function CareerToolPage() {
  const { toolId = "cover-letter" } = useParams();
  return <CareerToolWorkspace key={toolId} toolId={toolId} />;
}

type CareerToolState = {
  input: string;
  context: string;
  result: string;
  editing: boolean;
  loading: boolean;
  history: { id: string; label: string; text: string }[];
};

type CareerToolAction =
  | { type: "set-input"; input: string }
  | { type: "set-context"; context: string }
  | { type: "set-result"; result: string }
  | { type: "set-editing"; editing: boolean }
  | { type: "toggle-editing" }
  | { type: "set-loading"; loading: boolean }
  | { type: "add-history"; item: { id: string; label: string; text: string } };

function careerToolReducer(state: CareerToolState, action: CareerToolAction): CareerToolState {
  switch (action.type) {
    case "set-input":
      return { ...state, input: action.input };
    case "set-context":
      return { ...state, context: action.context };
    case "set-result":
      return { ...state, result: action.result };
    case "set-editing":
      return { ...state, editing: action.editing };
    case "toggle-editing":
      return { ...state, editing: !state.editing };
    case "set-loading":
      return { ...state, loading: action.loading };
    case "add-history":
      return { ...state, history: [action.item, ...state.history] };
  }
}

function CareerToolWorkspace({ toolId }: { toolId: string }) {
  const tool = getTool(toolId);
  const [state, dispatch] = useReducer(careerToolReducer, {
    input: "",
    context: tool?.contextOptions[0] ?? "",
    result: "",
    editing: false,
    loading: false,
    history: [],
  });
  const { input, context, result, editing, loading, history } = state;

  if (!tool) {
    return <StateBlock kind="no-results" title="Tool not found" action={{ label: "All career tools", to: "/app/tools" }} />;
  }

  const generate = () => {
    dispatch({ type: "set-loading", loading: true });
    dispatch({ type: "set-editing", editing: false });
    setTimeout(() => {
      dispatch({ type: "set-result", result: tool.output(input.trim(), context) });
      dispatch({ type: "set-loading", loading: false });
    }, 700);
  };

  return (
    <div>
      <Toaster />
      <Link to="/app/tools" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ChevronLeftIcon className="h-4 w-4" /> Career tools</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{tool.name}</h1>
        <AiLabel />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="tool-context">Context</Label>
                <Select value={context} onValueChange={(value) => dispatch({ type: "set-context", context: value })}>
                  <SelectTrigger id="tool-context"><SelectValue /></SelectTrigger>
                  <SelectContent>{tool.contextOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tool-input">{tool.inputLabel}</Label>
                <Textarea id="tool-input" rows={7} value={input} onChange={(e) => dispatch({ type: "set-input", input: e.target.value })} placeholder={tool.inputPlaceholder} />
              </div>
              <p className="text-xs text-muted-foreground">Uses your profile: education, skills, portfolio evidence and labels. Nothing is sent to employers.</p>
              <Button className="w-full" onClick={generate} disabled={loading}>
                {loading ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />} {result ? "Regenerate" : "Generate"}
              </Button>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="flex items-center gap-2 text-sm font-semibold"><HistoryIcon className="h-4 w-4" /> Saved history</p>
            {history.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Saved drafts appear here.</p>
            ) : (
              <ul className="mt-2 space-y-1">
                {history.map((h) => (
                  <li key={h.id}><button onClick={() => dispatch({ type: "set-result", result: h.text })} className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted">{h.label}</button></li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm font-semibold">Other tools</p>
            <ul className="mt-2 space-y-0.5">
              {careerTools.filter((t) => t.id !== tool.id).slice(0, 5).map((t) => (
                <li key={t.id}><Link to={`/app/tools/${t.id}`} className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">{t.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex min-h-[420px] flex-col rounded-xl border bg-card">
          <div className="flex flex-wrap items-center gap-2 border-b px-5 py-3">
            <p className="flex-1 text-sm font-semibold">Result</p>
            <Button size="sm" variant="ghost" disabled={!result} onClick={() => dispatch({ type: "toggle-editing" })}><PencilIcon /> {editing ? "Done" : "Edit"}</Button>
            <Button size="sm" variant="ghost" disabled={!result || loading} onClick={generate}><RefreshCwIcon /> Regenerate</Button>
            <Button size="sm" variant="ghost" disabled={!result} onClick={() => { navigator.clipboard?.writeText(result); toast("Copied to clipboard"); }}><CopyIcon /> Copy</Button>
            <Button size="sm" variant="outline" className="bg-card" disabled={!result} onClick={() => { dispatch({ type: "add-history", item: { id: `${Date.now()}`, label: `${context} · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`, text: result } }); toast("Draft saved"); }}><SaveIcon /> Save</Button>
          </div>
          <div className="flex-1 p-5">
            {loading ? (
              <div className="space-y-3" aria-busy="true">
                {[90, 75, 85, 60, 70].map((w) => <div key={w} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />)}
              </div>
            ) : !result ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <SparklesIcon className="h-8 w-8 text-ai" />
                <p className="mt-3">Choose a context and generate a draft.</p>
              </div>
            ) : editing ? (
              <Textarea value={result} onChange={(e) => dispatch({ type: "set-result", result: e.target.value })} className="min-h-[340px] font-mono text-sm" aria-label="Edit result" />
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed">{result}</pre>
            )}
          </div>
          {result && !loading && (
            <div className="flex items-start gap-2 border-t bg-warning-soft/60 px-5 py-3 text-sm">
              <TriangleAlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              Review before use. Check every claim is accurate and fill in any [placeholders]. AI output is assistance, not a hiring decision.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
