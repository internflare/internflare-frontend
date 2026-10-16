import { Link, NavLink } from "react-router-dom";
import {
  BellIcon,
  BookmarkIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CalendarClockIcon,
  FileCheck2Icon,
  GaugeIcon,
  LayoutDashboardIcon,
  LayersIcon,
  SettingsIcon,
  SparklesIcon,
  UserIcon,
  GiftIcon,
  TargetIcon,
  UsersIcon,
  CompassIcon,
  GraduationCapIcon,
  FolderKanbanIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CandidateSwitcher } from "@/polymet/components/pathway/candidate-switcher";

const talentNav: { group: string; items: { label: string; to: string; Icon: React.ElementType; count?: number; end?: boolean }[] }[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", to: "/app", Icon: LayoutDashboardIcon, end: true },
      { label: "Notifications", to: "/app/notifications", Icon: BellIcon, count: 3 },
    ],
  },
  {
    group: "Pathway",
    items: [
      { label: "Learn", to: "/app/learn", Icon: CompassIcon },
      { label: "My learning path", to: "/app/learning", Icon: BookOpenIcon },
      { label: "Internships", to: "/app/internships", Icon: GraduationCapIcon },
      { label: "internflareJobs", to: "/app/jobs", Icon: BriefcaseIcon },
      { label: "Assessments & readiness", to: "/app/assessments", Icon: GaugeIcon },
      { label: "Mentorship", to: "/app/mentors", Icon: UsersIcon },
    ],
  },
  {
    group: "Applications",
    items: [
      { label: "My applications", to: "/app/applications", Icon: FileCheck2Icon },
      { label: "Interviews", to: "/app/interviews", Icon: CalendarClockIcon },
      { label: "Offers", to: "/app/offers", Icon: GiftIcon },
      { label: "Saved", to: "/app/saved", Icon: BookmarkIcon },
      { label: "Career tools", to: "/app/tools", Icon: SparklesIcon },
    ],
  },
  {
    group: "Build",
    items: [
      { label: "Portfolio", to: "/app/portfolio", Icon: LayersIcon },
      { label: "Client acquisition", to: "/app/leads", Icon: TargetIcon },
      { label: "Workspace & projects", to: "/app/workspace", Icon: FolderKanbanIcon },
    ],
  },
  {
    group: "Account",
    items: [
      { label: "Profile & CV", to: "/app/profile", Icon: UserIcon },
      { label: "Account settings", to: "/app/settings", Icon: SettingsIcon },
    ],
  },
];

interface TalentSidebarNavProps {
  collapsed?: boolean;
}

export function TalentSidebarNav({ collapsed }: TalentSidebarNavProps) {
  return (
    <div className="flex h-full flex-col">
      <nav aria-label="Talent" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {talentNav.map((g) => (
          <div key={g.group}>
            {!collapsed && <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</p>}
            <ul className="space-y-0.5">
              {g.items.map(({ label, to, Icon, count, end }) => {
                const link = (
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        "relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        collapsed && "justify-center px-0",
                        isActive && "bg-accent text-brown hover:bg-accent hover:text-brown",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-primary" aria-hidden="true" />}
                        <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-primary")} />
                        {!collapsed && <span className="flex-1 truncate">{label}</span>}
                        {!collapsed && count ? (
                          <span className="rounded-md bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">{count}</span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                );
                return (
                  <li key={label}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      {!collapsed && <CandidateSwitcher />}
    </div>
  );
}
