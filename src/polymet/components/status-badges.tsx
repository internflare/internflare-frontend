import { cn } from "@/lib/utils";
import { BadgeCheckIcon, ClockIcon, ExternalLinkIcon, ShieldQuestionIcon, SparklesIcon, UserCheckIcon, UserIcon } from "lucide-react";
import type { ApplicationStage, EvidenceLevel } from "@/polymet/data/talent-data";
import type { VerificationStatus } from "@/polymet/data/opportunities-data";

const base = "inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium";

const stageClass: Record<ApplicationStage, string> = {
  New: "bg-muted text-foreground border-border",
  Reviewed: "bg-muted text-foreground border-border",
  Shortlisted: "bg-ai-soft text-ai-strong border-ai/30",
  Interview: "bg-accent text-brown border-primary/25",
  "Test Task": "bg-warning-soft text-warning border-warning/25",
  Offer: "bg-success-soft text-success border-success/25",
  Hired: "bg-success text-white dark:text-background border-transparent",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  Withdrawn: "bg-muted text-muted-foreground border-border",
};

export function StageBadge({ stage, className }: { stage: ApplicationStage; className?: string }) {
  return <span className={cn(base, stageClass[stage], className)}>{stage}</span>;
}

const evidenceMap: Record<EvidenceLevel, { label: string; cls: string; Icon: typeof UserIcon }> = {
  "self-reported": { label: "Self-reported", cls: "bg-muted text-muted-foreground border-border", Icon: UserIcon },
  "employer-confirmed": { label: "Employer-confirmed", cls: "bg-ai-soft text-ai-strong border-ai/30", Icon: UserCheckIcon },
  verified: { label: "Verified", cls: "bg-success-soft text-success border-success/25", Icon: BadgeCheckIcon },
};

export function EvidenceBadge({ level, className }: { level: EvidenceLevel; className?: string }) {
  const { label, cls, Icon } = evidenceMap[level];
  return (
    <span className={cn(base, cls, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}

const verificationMap: Record<VerificationStatus, { label: string; cls: string; Icon: typeof UserIcon }> = {
  verified: { label: "Verified company", cls: "bg-success-soft text-success border-success/25", Icon: BadgeCheckIcon },
  pending: { label: "Verification pending", cls: "bg-warning-soft text-warning border-warning/25", Icon: ClockIcon },
  unverified: { label: "Not verified", cls: "bg-muted text-muted-foreground border-border", Icon: ShieldQuestionIcon },
};

export function VerificationBadge({ status, compact, className }: { status: VerificationStatus; compact?: boolean; className?: string }) {
  const { label, cls, Icon } = verificationMap[status];
  if (compact) {
    return (
      <span title={label} aria-label={label} className={cn("inline-flex", status === "verified" ? "text-success" : status === "pending" ? "text-warning" : "text-muted-foreground", className)}>
        <Icon className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className={cn(base, cls, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}

export function SourceBadge({ source, provider, className }: { source: "internflare" | "external"; provider?: string; className?: string }) {
  if (source === "internflare") {
    return <span className={cn(base, "border-primary/25 bg-accent text-brown", className)}>Internflare</span>;
  }
  return (
    <span className={cn(base, "border-border bg-background text-muted-foreground", className)}>
      <ExternalLinkIcon className="h-3 w-3" aria-hidden="true" />
      External · {provider}
    </span>
  );
}

export function MatchBadge({ score, className }: { score: number; className?: string }) {
  return (
    <span className={cn(base, "border-ai/30 bg-ai-soft text-ai-strong", className)}>
      <SparklesIcon className="h-3 w-3" aria-hidden="true" />
      {score}% match
    </span>
  );
}

export function AiLabel({ children = "AI-assisted", className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span className={cn(base, "border-ai/30 bg-ai-soft text-ai-strong", className)}>
      <SparklesIcon className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  );
}

export function MetaChip({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn(base, "border-border bg-muted/60 text-muted-foreground", className)}>{children}</span>;
}
