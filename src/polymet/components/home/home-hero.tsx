import { useReducer } from "react";
import { Link } from "react-router-dom";
import { BadgeCheckIcon, BriefcaseIcon, Building2Icon, MapPinIcon, SearchIcon, SparklesIcon, WrenchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const popular = ["Frontend", "Product design", "Data analysis", "Remote internships", "Paid internships"];

type SearchMode = "internships" | "jobs" | "learn" | "employer";

interface HomeHeroState {
  mode: SearchMode;
  title: string;
  skills: string;
  company: string;
  location: string;
}

type HomeHeroAction =
  | { type: "set-mode"; mode: SearchMode }
  | { type: "set-title"; title: string }
  | { type: "set-skills"; skills: string }
  | { type: "set-company"; company: string }
  | { type: "set-location"; location: string };

function homeHeroReducer(state: HomeHeroState, action: HomeHeroAction): HomeHeroState {
  switch (action.type) {
    case "set-mode":
      return { ...state, mode: action.mode };
    case "set-title":
      return { ...state, title: action.title };
    case "set-skills":
      return { ...state, skills: action.skills };
    case "set-company":
      return { ...state, company: action.company };
    case "set-location":
      return { ...state, location: action.location };
  }
}

export function HomeHero() {
  const [{ mode, title, skills, company, location }, dispatch] = useReducer(homeHeroReducer, {
    mode: "internships",
    title: "",
    skills: "",
    company: "",
    location: "",
  });

  return (
    <section className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_0%,hsl(var(--accent))_0%,transparent_70%),radial-gradient(40%_40%_at_95%_20%,hsl(var(--ai-soft))_0%,transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-24 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            A career pathway ecosystem — not just a job board
          </span>
          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[56px]">
            Prove what you can do. <span className="text-brown dark:text-primary">Get routed to the right next step.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Tell us your goal, then show us your skills. Your evidence places you in learning, internships or the internflareJobs pool — so you always have a practical route forward, and employers only meet talent that&apos;s ready.
          </p>

          <div className="mt-8 rounded-2xl border bg-card p-2 shadow-lg">
            <div className="flex gap-1 overflow-x-auto p-1" role="tablist" aria-label="Search mode">
              {(["internships", "jobs", "learn", "employer"] as const).map((m) => (
                <button
                  key={m}
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => dispatch({ type: "set-mode", mode: m })}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {{ internships: "Internships", jobs: "Jobs", learn: "Learn", employer: "Find talent" }[m]}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="grid gap-2 p-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr]"
            >
              {[
                { id: "q-title", Icon: BriefcaseIcon, label: mode === "learn" ? "Skill or topic" : mode === "employer" ? "Role" : "Job title", value: title, onChange: (value: string) => dispatch({ type: "set-title", title: value }), ph: mode === "jobs" ? "e.g. Junior frontend developer" : mode === "learn" ? "e.g. SQL, testing" : mode === "employer" ? "e.g. Product designer" : "e.g. Frontend intern" },
                { id: "q-skills", Icon: WrenchIcon, label: "Skills", value: skills, onChange: (value: string) => dispatch({ type: "set-skills", skills: value }), ph: "e.g. React, SQL, Figma" },
                { id: "q-company", Icon: Building2Icon, label: mode === "employer" ? "Industry" : "Company", value: company, onChange: (value: string) => dispatch({ type: "set-company", company: value }), ph: mode === "employer" ? "Any industry" : "Any company" },
                { id: "q-location", Icon: MapPinIcon, label: "Location", value: location, onChange: (value: string) => dispatch({ type: "set-location", location: value }), ph: "Lagos, Remote…" },
              ].map(({ id, Icon, label, value, onChange, ph }) => (
                <label key={id} htmlFor={id} className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
                    <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={ph} className="h-6 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" />
                  </span>
                </label>
              ))}
              <Button asChild size="lg" className="h-12 sm:col-span-2">
                <Link to={{ internships: "/internships", jobs: "/jobs", learn: "/learn", employer: "/sign-up?type=employer" }[mode]}>
                  <SearchIcon />
                  {{ internships: "Search internships", jobs: "Search jobs", learn: "Explore learning", employer: "Start discovering talent" }[mode]}
                </Link>
              </Button>
            </form>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            {popular.map((p) => (
              <Link key={p} to="/internships" className="rounded-md border bg-card px-2.5 py-1 text-xs font-medium hover:border-primary hover:text-primary">
                {p}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative h-full min-h-[520px] overflow-hidden rounded-3xl border shadow-xl">
            <img
              src="https://v3b.fal.media/files/b/0aae2917/rTdnlj4Pf7_u51DJ1wEEC_99MeKOvV.jpg"
              alt="A young developer working on a laptop in a co-working space"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="absolute -left-10 top-10 w-60 rounded-xl border bg-card p-4 shadow-lg">
            <p className="text-xs font-medium text-muted-foreground">Frontend Developer readiness</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-bold">70</span>
              <span className="pb-1 text-xs font-semibold text-success">Internship-ready</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[70%] rounded-full bg-primary" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Internship threshold 60 · job threshold 72</p>
          </div>
          <div className="absolute -left-6 bottom-12 w-64 rounded-xl border bg-card p-4 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-semibold text-ai-strong">
              <SparklesIcon className="h-3.5 w-3.5" /> Why you're eligible
            </div>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>· React & components: 82 (verified)</li>
              <li>· Accessibility: 85 (employer-confirmed)</li>
            </ul>
          </div>
          <div className="absolute -right-4 top-1/2 flex items-center gap-2 whitespace-nowrap rounded-lg border bg-card px-3 py-2 text-xs font-medium shadow-md">
            <BadgeCheckIcon className="h-4 w-4 text-success" /> Employer-confirmed
          </div>
        </div>
      </div>
    </section>
  );
}
