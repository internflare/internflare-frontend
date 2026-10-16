import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  to?: string;
  compact?: boolean;
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#fd7128" />
      <path d="M10 22V13" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="10" cy="8.5" r="1.9" fill="#fff" />
      <path d="M15 22v-7.5a4 4 0 0 1 4-4h3.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M15 16.5h5.5" stroke="#591e00" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function BrandLogo({ className, to = "/", compact }: BrandLogoProps) {
  return (
    <Link to={to} className={cn("flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} aria-label="internflare home">
      <BrandMark />
      {!compact && <span className="text-[17px] font-semibold tracking-tight text-foreground">internflare</span>}
    </Link>
  );
}

/** Product wordmark for the job pool — used only on the Jobs section. */
export function JobsWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-semibold tracking-tight", className)}>
      <BrandMark className="h-5 w-5" />
      <span>
        internflare<span className="text-primary">Jobs</span>
      </span>
    </span>
  );
}
