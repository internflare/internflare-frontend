import { ClockIcon, Code2Icon, FileTextIcon, ListChecksIcon, MessagesSquareIcon, SearchCodeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CodeBlock, CodeEditor } from "@/polymet/components/assessment/code-block";
import type { BankQuestion, QuestionResponse } from "@/polymet/data/ai-bank-types";
import { kindLabel } from "@/polymet/lib/ai-assessment";

const kindIcon: Record<BankQuestion["kind"], React.ElementType> = {
  mcq: ListChecksIcon,
  scenario: MessagesSquareIcon,
  "code-review": SearchCodeIcon,
  "code-write": Code2Icon,
  practical: FileTextIcon,
};

interface QuestionViewProps {
  q: BankQuestion;
  index: number;
  total: number;
  competency: string;
  response: QuestionResponse;
  onChange: (r: QuestionResponse) => void;
}

export function QuestionView({ q, index, total, competency, response, onChange }: QuestionViewProps) {
  const Icon = kindIcon[q.kind];
  const wc = (response.text ?? "").trim().split(/\s+/).filter(Boolean).length;
  const needsText = q.kind === "scenario" || q.kind === "practical" || q.kind === "code-review";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-md bg-ai-soft px-2 py-0.5 font-semibold text-ai-strong"><Icon className="h-3.5 w-3.5" />{kindLabel[q.kind]}</span>
        <span className="rounded-md border px-2 py-0.5 font-medium text-muted-foreground">{competency}</span>
        <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground"><ClockIcon className="h-3.5 w-3.5" />~{q.timeMins} min · Question {index + 1} of {total}</span>
      </div>
      <h2 className="mt-3 text-lg font-semibold">{q.title}</h2>
      {q.context && <p className="mt-2 rounded-lg border-l-2 border-primary bg-accent/40 px-3 py-2 text-sm">{q.context}</p>}

      {q.material && (
        <div className="mt-3 overflow-hidden rounded-xl border">
          <p className="border-b bg-muted/50 px-3 py-1.5 text-xs font-semibold">{q.material.label}</p>
          {q.material.rows ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr>{q.material.rows[0].map((h) => <th key={h} className="border-b px-3 py-1.5 text-left text-xs font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>{q.material.rows.slice(1).map((r, i) => <tr key={i} className="border-b last:border-0">{r.map((c, j) => <td key={j} className="whitespace-pre px-3 py-1.5 font-mono text-xs">{c || "—"}</td>)}</tr>)}</tbody>
              </table>
            </div>
          ) : <p className="whitespace-pre-wrap p-3 text-sm">{q.material.text}</p>}
        </div>
      )}

      {q.code && <CodeBlock code={q.code.snippet} lang={q.code.lang} className="mt-3" />}

      <p className="mt-4 font-medium">{q.prompt}</p>

      {q.options && (
        <RadioGroup value={response.choice?.toString() ?? ""} onValueChange={(v) => onChange({ ...response, choice: Number(v) })} className="mt-3 gap-2">
          {q.options.map((opt, oi) => (
            <Label key={opt} htmlFor={`${q.id}-${oi}`} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 font-normal leading-snug has-[:checked]:border-primary has-[:checked]:bg-accent/50">
              <RadioGroupItem value={oi.toString()} id={`${q.id}-${oi}`} className="mt-0.5" />
              {opt}
            </Label>
          ))}
        </RadioGroup>
      )}

      {q.kind === "code-write" && (
        <div className="mt-3">
          <CodeEditor
            value={response.code ?? q.starter ?? ""}
            onChange={(code) => onChange({ ...response, code })}
            lang={q.code?.lang ?? (q.starter?.includes("SELECT") ? "sql" : "ts")}
            label={`Code answer for ${q.title}`}
            onReset={() => onChange({ ...response, code: q.starter ?? "" })}
          />
        </div>
      )}

      {needsText && (
        <div className="mt-3">
          <Label htmlFor={`${q.id}-text`} className="text-sm font-medium">
            {q.kind === "code-review" ? "Explain the fix and anything else you'd flag in review" : q.kind === "practical" ? "Your response" : "Your answer"}
          </Label>
          <Textarea
            id={`${q.id}-text`}
            rows={q.kind === "code-review" ? 4 : 7}
            value={response.text ?? ""}
            onChange={(e) => onChange({ ...response, text: e.target.value })}
            placeholder={q.kind === "practical" ? "Write it as you would send it…" : "Be specific — name tools, steps and trade-offs, as you would in an interview."}
            className="mt-1.5"
          />
          <p className={cn("mt-1 text-xs", q.minWords && wc < q.minWords ? "text-muted-foreground" : "text-success")}>
            {wc} words{q.minWords ? ` · ${q.minWords}+ recommended at this level` : ""}
          </p>
        </div>
      )}
    </div>
  );
}

export function isAnswered(q: BankQuestion, r?: QuestionResponse) {
  if (!r) return false;
  if (q.kind === "mcq") return r.choice !== undefined;
  if (q.kind === "code-review") return r.choice !== undefined;
  if (q.kind === "code-write") return !!r.code && r.code.trim() !== (q.starter ?? "").trim();
  return !!r.text?.trim();
}
