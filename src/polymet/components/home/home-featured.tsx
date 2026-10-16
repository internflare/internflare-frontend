import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, Building2Icon, GlobeIcon, HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { OpportunityCard } from "@/polymet/components/opportunity-card";
import { opportunities, type WorkArrangement } from "@/polymet/data/opportunities-data";

const tabs = [
  { id: "all", label: "All" },
  { id: "internship", label: "Internships" },
  { id: "job", label: "Jobs" },
] as const;

const arrangements: { id: WorkArrangement; label: string; Icon: typeof GlobeIcon; text: string }[] = [
  { id: "remote", label: "Remote", Icon: GlobeIcon, text: "Work from anywhere across listed countries and time zones." },
  { id: "hybrid", label: "Hybrid", Icon: HomeIcon, text: "A mix of office days and home — the split is shown on every listing." },
  { id: "onsite", label: "Onsite", Icon: Building2Icon, text: "Full-time in the office, with the exact city and area listed." },
];

export function HomeFeatured() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const open = opportunities.filter((o) => o.status === "open");
  const list = open.filter((o) => tab === "all" || (tab === "job" ? o.type !== "internship" : o.type === tab)).slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Featured opportunities</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Internships and early-career jobs</h2>
          <p className="mt-2 max-w-lg text-muted-foreground">Every listing shows compensation where provided, company verification and where the application happens.</p>
        </div>
        <Link to="/internships" className="inline-flex items-center gap-1 text-sm font-semibold text-brown hover:text-primary dark:text-primary">
          View all opportunities <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6 flex gap-1.5" role="tablist" aria-label="Opportunity type">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              tab === t.id ? "border-foreground bg-foreground text-background" : "bg-card hover:bg-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((o) => (
          <OpportunityCard key={o.id} opportunity={o} />
        ))}
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {arrangements.map(({ id, label, Icon, text }) => {
          const count = open.filter((o) => o.arrangement === id).length;
          return (
            <Link key={id} to="/internships" className="group flex gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-primary/40">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground group-hover:bg-accent group-hover:text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-2 font-semibold">
                  {label} <span className="text-xs font-medium text-muted-foreground">{count} open</span>
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{text}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
