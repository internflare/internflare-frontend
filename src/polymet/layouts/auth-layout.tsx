import { BadgeCheckIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import { BrandLogo } from "@/polymet/components/brand-logo";
import { AppThemeProvider, ThemeToggle } from "@/polymet/components/theme-toggle";
import { PathwayProvider } from "@/polymet/components/pathway/pathway-provider";

const points = [
  { Icon: BadgeCheckIcon, title: "Evidence-based profiles", text: "Show what you've actually built, labelled by how it was verified." },
  { Icon: SparklesIcon, title: "Transparent AI guidance", text: "See the factors behind every match and readiness score." },
  { Icon: ShieldCheckIcon, title: "Verified employers", text: "Company verification status is shown on every listing." },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider>
    <PathwayProvider>
    <div className="grid min-h-screen bg-background lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <BrandLogo />
          <ThemeToggle />
        </div>
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </main>
        <p className="text-xs text-muted-foreground">© 2025 Internflare · Privacy · Terms</p>
      </div>
      <aside className="relative hidden overflow-hidden border-l bg-card lg:block">
        <img
          src="https://v3b.fal.media/files/b/0aae2917/rTdnlj4Pf7_u51DJ1wEEC_99MeKOvV.jpg"
          alt="A young developer working on a laptop in a bright co-working space"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1d]/90 via-[#1d1d1d]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="max-w-md text-2xl font-semibold leading-snug">Find opportunities. Prove your skills. Build your career.</p>
          <ul className="mt-8 grid gap-4">
            {points.map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-sm text-white/75">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
    </PathwayProvider>
    </AppThemeProvider>
  );
}
