import { Link } from "react-router-dom";
import { BrandLogo } from "@/polymet/components/brand-logo";

const columns = [
  {
    title: "Talent",
    links: [
      { label: "Internships", to: "/internships" },
      { label: "internflareJobs", to: "/jobs" },
      { label: "Explore Learning", to: "/learn" },
      { label: "Assessments & readiness", to: "/app/assessments" },
      { label: "AI career tools", to: "/app/tools" },
      { label: "Talent pricing", to: "/pricing" },
    ],
  },
  {
    title: "Employers",
    links: [
      { label: "Post an opportunity", to: "/sign-up" },
      { label: "Talent discovery", to: "/#employers" },
      { label: "Employer pricing", to: "/pricing" },
      { label: "SquadCot by internflare", to: "/#employers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Trust & verification", to: "/#trust" },
      { label: "Privacy policy", to: "/#trust" },
      { label: "Terms of service", to: "/#trust" },
      { label: "Help centre", to: "/#faq" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_2fr] lg:px-8">
        <div className="max-w-sm">
          <BrandLogo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            internflare is a career pathway ecosystem: learn, intern and get hired on evidence. internflareJobs is our pool of assessed, job-ready talent.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((c) => (
            <div key={c.title}>
              <h3 className="text-sm font-semibold">{c.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2025 Internflare. All rights reserved.</p>
          <p>Listings and figures shown are illustrative demo data.</p>
        </div>
      </div>
    </footer>
  );
}
