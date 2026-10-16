import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BookOpenIcon,
  CalendarCheckIcon,
  CheckIcon,
  FileSearchIcon,
  GaugeIcon,
  MessageSquareTextIcon,
  SparklesIcon,
  TargetIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EvidenceBadge } from "@/polymet/components/status-badges";

const talentSteps = [
  { Icon: FileSearchIcon, title: "Build an evidence-based profile", text: "Add skills, projects and outcomes. Every item is labelled self-reported, employer-confirmed or verified." },
  { Icon: GaugeIcon, title: "Check your readiness per role", text: "See strengths and gaps for a specific role, with a learning plan to close them." },
  { Icon: TargetIcon, title: "Apply and track in one place", text: "Apply in-platform or via approved external sources, and follow each stage." },
];
const employerSteps = [
  { Icon: BadgeCheckIcon, title: "Register and verify your company", text: "Verified status is shown on every listing so candidates know you're real." },
  { Icon: UsersIcon, title: "Publish and discover talent", text: "Post internships and jobs. The internflareJobs pool only contains candidates who met job-readiness — with explainable match factors." },
  { Icon: WorkflowIcon, title: "Hire and hand off to SquadCot", text: "Move selected talent into SquadCot by internflare for tasks, reports and supervision." },
];

function StepList({ steps }: { steps: typeof talentSteps }) {
  return (
    <ol className="mt-6 space-y-3">
      {steps.map(({ Icon, title, text }, i) => (
        <li key={title} className="flex gap-4 rounded-xl border bg-card p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold"><span className="mr-1.5 text-muted-foreground">{i + 1}.</span>{title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function HomeHowItWorks() {
  return (
    <section className="border-y bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">An ecosystem that routes talent on evidence, not hope</h2>
          <p className="mt-3 text-muted-foreground">You state your goal. Your first assessment identifies what you can currently demonstrate — and that evidence decides your recommended level. If you're not job-ready yet, you're routed to internships or learning instead of being left with a rejection.</p>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { n: "Level 1", t: "Learn", d: "Assessments, skill-gap analysis, curated courses, practical projects and optional mentors. Open to everyone.", to: "/learn", cta: "Explore Learning" },
            { n: "Level 2", t: "Internships", d: "Paid and unpaid internships with clear terms. Apply once you meet the internship-readiness threshold.", to: "/internships", cta: "Browse internships" },
            { n: "Level 3", t: "internflareJobs", d: "The job pool: full-time, part-time, contract and freelance roles. Only talent whose evidence meets job-readiness enters it.", to: "/jobs", cta: "Browse internflareJobs" },
          ].map((s, i) => (
            <li key={s.t} className="relative flex flex-col rounded-2xl border bg-background p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{s.n}</span>
              <p className="mt-1 text-xl font-semibold">{s.t}</p>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.d}</p>
              <Link to={s.to} className="mt-4 text-sm font-semibold text-primary hover:underline">{s.cta} →</Link>
              {i < 2 && <span aria-hidden="true" className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border bg-card text-xs md:flex">→</span>}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted-foreground">Not a mandatory sequence: if your evidence shows you're job-ready, you enter the internflareJobs pool straight away. Employers get a credible talent pool; candidates always get a practical next step.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-background p-6 sm:p-8">
            <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-brown">For talent</span>
            <h3 className="mt-3 text-xl font-semibold">Get evaluated on what you can do</h3>
            <StepList steps={talentSteps} />
            <Button asChild className="mt-6 w-full">
              <Link to="/sign-up">Create a talent profile</Link>
            </Button>
          </div>
          <div id="employers" className="scroll-mt-20 rounded-2xl border bg-background p-6 sm:p-8">
            <span className="rounded-md bg-ai-soft px-2 py-0.5 text-xs font-semibold text-ai-strong">For employers</span>
            <h3 className="mt-3 text-xl font-semibold">Hire early-career talent with confidence</h3>
            <StepList steps={employerSteps} />
            <Button asChild variant="secondary" className="mt-6 w-full bg-foreground text-background hover:bg-foreground/90">
              <Link to="/sign-up?type=employer">Register your company</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ eyebrow, title, text, bullets, visual, reverse, id, cta }: {
  eyebrow: string; title: string; text: string; bullets: string[]; visual: React.ReactNode; reverse?: boolean; id?: string; cta: { label: string; to: string };
}) {
  return (
    <div id={id} className="grid scroll-mt-20 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={reverse ? "lg:order-2" : ""}>
        <p className="text-sm font-semibold text-primary">{eyebrow}</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h3>
        <p className="mt-3 max-w-md text-muted-foreground">{text}</p>
        <ul className="mt-5 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}
            </li>
          ))}
        </ul>
        <Link to={cta.to} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brown hover:text-primary dark:text-primary">
          {cta.label} <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}

export function HomeFeatures() {
  return (
    <section id="career-tools" className="mx-auto max-w-7xl scroll-mt-20 space-y-24 px-4 py-24 sm:px-6 lg:px-8">
      <FeatureRow
        eyebrow="Career readiness"
        title="Know exactly what each role needs"
        text="Readiness is measured per role and opportunity — never a permanent label. Gaps come with concrete next steps."
        bullets={["Internship-ready and job-ready shown separately", "Strengths and gaps tied to evidence", "Reassess any time after learning"]}
        cta={{ label: "Explore readiness", to: "/app/assessments" }}
        visual={
          <div className="rounded-2xl border bg-card p-6 shadow-md">
            <p className="text-sm font-medium text-muted-foreground">Frontend Developer</p>
            {[{ l: "Internship readiness", v: 78, c: "bg-primary" }, { l: "Job readiness", v: 61, c: "bg-ai" }].map((r) => (
              <div key={r.l} className="mt-4">
                <div className="flex justify-between text-sm"><span>{r.l}</span><span className="font-semibold tabular-nums">{r.v}</span></div>
                <div className="mt-1.5 h-2 rounded-full bg-muted"><div className={`h-full rounded-full ${r.c}`} style={{ width: `${r.v}%` }} /></div>
              </div>
            ))}
            <div className="mt-5 rounded-lg border bg-muted/40 p-3 text-sm">
              <p className="font-medium">Gap: Testing practice</p>
              <p className="text-muted-foreground">Next step → Module 2 · Testing React apps</p>
            </div>
          </div>
        }
      />
      <FeatureRow
        reverse
        eyebrow="AI-assisted matching"
        title="Matches you can understand"
        text="When a listing has structured requirements, we show how your profile lines up — factor by factor. AI assists; people decide."
        bullets={["Match factors, not black-box scores", "Only shown when real data exists", "AI never invents experience"]}
        cta={{ label: "See an example", to: "/opportunities/frontend-engineering-intern" }}
        visual={
          <div className="rounded-2xl border border-ai/30 bg-ai-soft/50 p-6 shadow-md">
            <div className="flex items-center gap-2 font-semibold"><SparklesIcon className="h-4 w-4 text-ai-strong" /> 92% match · Frontend Engineering Intern</div>
            {[["React & TypeScript", 95], ["Accessibility practice", 88], ["Production experience", 76]].map(([l, v]) => (
              <div key={l as string} className="mt-4">
                <div className="flex justify-between text-sm"><span>{l}</span><span className="text-ai-strong">{v}%</span></div>
                <div className="mt-1.5 h-1.5 rounded-full bg-ai/20"><div className="h-full rounded-full bg-ai" style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
        }
      />
      <FeatureRow
        eyebrow="Portfolios"
        title="Proof of work, clearly labelled"
        text="Role-specific portfolio sections with projects, outcomes and evidence. You choose what's public."
        bullets={["Developer, Designer, Marketer, Writer and PM sections", "Evidence labels on every item", "Confidential work is never shown"]}
        cta={{ label: "View a sample portfolio", to: "/talent/amara-okafor" }}
        visual={
          <div className="overflow-hidden rounded-2xl border bg-card shadow-md">
            <img src="https://v3b.fal.media/files/b/0aae2918/vLG9LZni8dPncJxccnJ6F_ItXppIaa.jpg" alt="" className="h-40 w-full object-cover" />
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2"><p className="font-semibold">Clinic booking web app</p><EvidenceBadge level="verified" /></div>
              <p className="mt-1 text-sm text-muted-foreground">Used by 2 clinics during pilot · WCAG 2.1 AA audit passed</p>
              <div className="mt-3 flex flex-wrap gap-2"><EvidenceBadge level="employer-confirmed" /><EvidenceBadge level="self-reported" /></div>
            </div>
          </div>
        }
      />
      <FeatureRow
        reverse
        eyebrow="Client acquisition"
        title="Plan outreach, track leads, win clients"
        text="For freelancers: a daily action plan and lead pipeline. You do outreach yourself on LinkedIn or any channel — we help you plan, write and follow up."
        bullets={["Daily action plan and follow-up calendar", "AI-drafted pitches from your own inputs", "Activity is user-recorded, never scraped"]}
        cta={{ label: "Open lead tracker", to: "/app/leads" }}
        visual={
          <div className="rounded-2xl border bg-card p-5 shadow-md">
            <p className="text-sm font-semibold">Today's plan</p>
            {[["Follow up with Sunrise Pharmacy", "Due today"], ["Send pitch to Mobi Gym", "Mon 26 May"], ["Research 3 new prospects", "This week"]].map(([t, d]) => (
              <div key={t} className="mt-3 flex items-center gap-3 rounded-lg border p-3 text-sm">
                <MessageSquareTextIcon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{t}</span>
                <span className="text-xs text-muted-foreground">{d}</span>
              </div>
            ))}
          </div>
        }
      />
      <div id="mentorship" className="scroll-mt-20">
        <FeatureRow
          eyebrow="Mentorship & learning"
          title="A learning pathway built around your gaps"
          text="Personalised upskilling plans with practical assignments, plus optional sessions with mentors who've done the job."
          bullets={["Modules mapped to readiness gaps", "Course completion ≠ competence — evidence counts", "Free and paid mentor sessions where available"]}
          cta={{ label: "Browse mentors", to: "/app/mentors" }}
          visual={
            <div className="relative overflow-hidden rounded-2xl border shadow-md">
              <img src="https://v3b.fal.media/files/b/0aae2918/WI74JxbWda4T3jZtAUcZY_ttNczrwS.jpg" alt="A mentor working with a group of early-career professionals" className="h-72 w-full object-cover" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl border bg-card/95 p-3 backdrop-blur">
                <BookOpenIcon className="h-5 w-5 text-primary" />
                <span className="flex-1 text-sm font-medium">Module 2 · Testing React apps</span>
                <CalendarCheckIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Mentor Sat 11:00</span>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
