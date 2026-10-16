import { Link } from "react-router-dom";
import { AlertCircleIcon, InboxIcon, LockIcon, RefreshCwIcon, SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Kind = "empty" | "no-results" | "error" | "permission";

const icons = { empty: InboxIcon, "no-results": SearchXIcon, error: AlertCircleIcon, permission: LockIcon };

interface StateBlockProps {
  kind: Kind;
  title: string;
  description?: string;
  action?: { label: string; to?: string; onClick?: () => void };
  className?: string;
}

export function StateBlock({ kind, title, description, action, className }: StateBlockProps) {
  const Icon = icons[kind];
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-14 text-center", className)} role={kind === "error" ? "alert" : undefined}>
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-full", kind === "error" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground")}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && (
        <div className="mt-5">
          {action.to ? (
            <Button asChild variant="outline" className="bg-card"><Link to={action.to}>{action.label}</Link></Button>
          ) : (
            <Button variant="outline" className="bg-card" onClick={action.onClick}>
              {kind === "error" && <RefreshCwIcon />}
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function CardListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <Skeleton className="mt-3 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: string; actions?: React.ReactNode; eyebrow?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
