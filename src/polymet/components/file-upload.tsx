import { useRef, useState } from "react";
import { CheckCircle2Icon, FileIcon, UploadCloudIcon, XIcon, AlertCircleIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  error?: string;
}

interface FileUploadProps {
  label: string;
  accept?: string;
  maxMb?: number;
  hint?: string;
  initial?: { name: string; size: string }[];
}

export function FileUpload({ label, accept = ".pdf,.doc,.docx", maxMb = 5, hint, initial = [] }: FileUploadProps) {
  const [items, setItems] = useState<UploadItem[]>(initial.map((f, i) => ({ id: `init-${i}`, ...f, progress: 100 })));
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => {
      const id = `${f.name}-${Date.now()}`;
      const ext = "." + f.name.split(".").pop()?.toLowerCase();
      const tooBig = f.size > maxMb * 1024 * 1024;
      const badType = !accept.split(",").includes(ext);
      const item: UploadItem = { id, name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB`, progress: 0, error: tooBig ? `File is larger than ${maxMb} MB` : badType ? `Unsupported type. Use ${accept}` : undefined };
      setItems((prev) => [...prev, item]);
      if (item.error) return;
      let p = 0;
      const t = setInterval(() => {
        p += 20;
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, progress: Math.min(p, 100) } : x)));
        if (p >= 100) clearInterval(t);
      }, 180);
    });
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">{label}</p>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        className={cn("flex flex-col items-center rounded-xl border-2 border-dashed bg-muted/30 px-4 py-8 text-center transition-colors", drag && "border-primary bg-accent/50")}
      >
        <UploadCloudIcon className="h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm">
          Drag and drop, or{" "}
          <button type="button" onClick={() => inputRef.current?.click()} className="font-semibold text-primary hover:underline">browse files</button>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{hint ?? `${accept.replaceAll(",", ", ")} · max ${maxMb} MB`}</p>
        <input ref={inputRef} type="file" accept={accept} multiple className="sr-only" onChange={(e) => add(e.target.files)} aria-label={label} />
      </div>
      {items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map((it) => (
            <li key={it.id} className={cn("flex items-center gap-3 rounded-lg border bg-card p-3", it.error && "border-destructive/30")}>
              <FileIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{it.name}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{it.size}</span>
                </div>
                {it.error ? (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-destructive"><AlertCircleIcon className="h-3 w-3" />{it.error}</p>
                ) : it.progress < 100 ? (
                  <Progress value={it.progress} className="mt-1.5 h-1" aria-label={`Uploading ${it.progress}%`} />
                ) : (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-success"><CheckCircle2Icon className="h-3 w-3" />Uploaded</p>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Remove ${it.name}`} onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}>
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
