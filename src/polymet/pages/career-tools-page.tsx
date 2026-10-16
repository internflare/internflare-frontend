import { Link } from "react-router-dom";
import { ArrowRightIcon, FileTextIcon, MicIcon, SearchCheckIcon, SendIcon, ShieldAlertIcon } from "lucide-react";
import { PageHeader } from "@/polymet/components/page-states";
import { AiLabel } from "@/polymet/components/status-badges";
import { careerTools, type CareerTool } from "@/polymet/data/career-tools-data";

const groupIcon: Record<CareerTool["group"], typeof FileTextIcon> = { Documents: FileTextIcon, Applications: SendIcon, Analysis: SearchCheckIcon, Practice: MicIcon };
const groups: CareerTool["group"][] = ["Documents", "Applications", "Analysis", "Practice"];

export function CareerToolsPage() {
  return (
    <div>
      <PageHeader title="Career tools" eyebrow={<AiLabel>AI-assisted</AiLabel>} description="Drafts and analysis built only from information in your profile and what you enter. Always review before you use anything." />
      <div className="mb-6 flex gap-3 rounded-xl border border-ai/30 bg-ai-soft/60 p-4 text-sm">
        <ShieldAlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-ai-strong" />
        <p>AI won't invent qualifications, experience, projects or achievements. If something isn't on your profile, it's left as a placeholder for you to fill in — or left out.</p>
      </div>
      <div className="space-y-8">
        {groups.map((g) => {
          const Icon = groupIcon[g];
          return (
            <section key={g}>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"><Icon className="h-4 w-4" /> {g}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {careerTools.filter((t) => t.group === g).map((t) => (
                  <Link key={t.id} to={`/app/tools/${t.id}`} className="group rounded-xl border bg-card p-5 transition-all hover:border-ai/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <p className="font-semibold">{t.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ai-strong">Open <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
