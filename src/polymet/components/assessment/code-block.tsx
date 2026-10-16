import { cn } from "@/lib/utils";

const lineCls = "font-mono text-[13px] leading-6";

export function CodeBlock({ code, lang, className }: { code: string; lang: string; className?: string }) {
  const lines = code.split("\n");
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-zinc-950 text-zinc-100", className)}>
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="flex gap-1.5" aria-hidden="true"><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /></span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{lang}</span>
      </div>
      <pre className="overflow-x-auto p-3"><code className="grid">
        {lines.map((l, i) => (
          <span key={i} className={cn("flex", lineCls)}>
            <span className="w-8 shrink-0 select-none pr-3 text-right text-zinc-500">{i + 1}</span>
            <span className="whitespace-pre">{l || " "}</span>
          </span>
        ))}
      </code></pre>
    </div>
  );
}

interface CodeEditorProps {
  value: string;
  onChange: (v: string) => void;
  lang: string;
  label: string;
  onReset?: () => void;
}

export function CodeEditor({ value, onChange, lang, label, onReset }: CodeEditorProps) {
  const lines = Math.max(value.split("\n").length, 8);
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab" || e.shiftKey) return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: end } = el;
    const next = value.slice(0, s) + "  " + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
  };
  return (
    <div className="overflow-hidden rounded-xl border bg-zinc-950 text-zinc-100 focus-within:ring-2 focus-within:ring-ring">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{lang} · editor</span>
        {onReset && <button type="button" onClick={onReset} className="rounded px-1.5 text-[11px] font-medium text-zinc-400 hover:bg-white/10 hover:text-zinc-100">Reset to starter</button>}
      </div>
      <div className="flex overflow-x-auto p-3">
        <div aria-hidden="true" className={cn("w-8 shrink-0 select-none pr-3 text-right text-zinc-500", lineCls)}>
          {Array.from({ length: lines }, (_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <textarea
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          wrap="off"
          rows={lines}
          className={cn("min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-zinc-100 caret-primary outline-none", lineCls)}
        />
      </div>
      <p className="border-t border-white/10 px-3 py-1.5 text-[11px] text-zinc-500">Tab inserts two spaces. Your code is reviewed by the AI grader against the task requirements.</p>
    </div>
  );
}
