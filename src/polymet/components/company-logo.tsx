import { cn } from "@/lib/utils";
import type { LogoTone } from "@/polymet/data/opportunities-data";

const toneClass: Record<LogoTone, string> = {
  orange: "bg-accent text-brown border-primary/20",
  purple: "bg-ai-soft text-ai-strong border-ai/30",
  brown: "bg-brown text-white border-transparent dark:text-background",
  charcoal: "bg-foreground text-background border-transparent",
  sand: "bg-muted text-foreground border-border",
  green: "bg-success-soft text-success border-success/20",
};

const sizeClass = {
  sm: "h-8 w-8 text-[11px] rounded-md",
  md: "h-10 w-10 text-xs rounded-lg",
  lg: "h-14 w-14 text-base rounded-xl",
  xl: "h-20 w-20 text-xl rounded-2xl",
};

interface CompanyLogoProps {
  initials: string;
  tone?: LogoTone;
  size?: keyof typeof sizeClass;
  className?: string;
}

export function CompanyLogo({ initials, tone = "sand", size = "md", className }: CompanyLogoProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex shrink-0 items-center justify-center border font-bold tracking-tight", toneClass[tone], sizeClass[size], className)}
    >
      {initials}
    </div>
  );
}
