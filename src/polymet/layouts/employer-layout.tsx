import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  BellIcon, BriefcaseIcon, Building2Icon, CalendarClockIcon, CreditCardIcon, LayoutDashboardIcon, LogOutIcon, MenuIcon, PanelLeftIcon, PlusIcon, SearchIcon, UsersIcon, UserSearchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppThemeProvider, ThemeToggle } from "@/polymet/components/theme-toggle";
import { PathwayProvider } from "@/polymet/components/pathway/pathway-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { BrandLogo } from "@/polymet/components/brand-logo";
import { employerOrg, planUsage } from "@/polymet/data/employer-data";

const nav = [
  { label: "Dashboard", to: "/employer", Icon: LayoutDashboardIcon, end: true },
  { label: "Listings", to: "/employer/listings", Icon: BriefcaseIcon },
  { label: "Candidates", to: "/employer/candidates", Icon: UsersIcon, count: 13 },
  { label: "Interviews & offers", to: "/employer/hiring", Icon: CalendarClockIcon },
  { label: "Talent pool", to: "/employer/talent-pool", Icon: UserSearchIcon },
  { label: "Company profile", to: "/companies/paystack-labs", Icon: Building2Icon },
  { label: "Plan & billing", to: "/employer/billing", Icon: CreditCardIcon },
];

function SideNav({ collapsed }: { collapsed?: boolean }) {
  const listings = planUsage[0];
  return (
    <div className="flex h-full flex-col">
      <div className="px-3 pt-4">
        <Button asChild className={cn("w-full", collapsed && "px-0")}>
          <Link to="/employer/listings/new" aria-label="New listing"><PlusIcon />{!collapsed && "New listing"}</Link>
        </Button>
      </div>
      <nav aria-label="Employer" className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {nav.map(({ label, to, Icon, end, count }) => {
          const link = (
            <NavLink key={label} to={to} end={end} className={({ isActive }) => cn("relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", collapsed && "justify-center px-0", isActive && "bg-accent text-brown hover:bg-accent hover:text-brown")}>
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-primary" />}
                  <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-primary")} />
                  {!collapsed && <span className="flex-1 truncate">{label}</span>}
                  {!collapsed && count ? <span className="rounded-md bg-muted px-1.5 text-xs tabular-nums">{count}</span> : null}
                </>
              )}
            </NavLink>
          );
          return collapsed ? (
            <Tooltip key={label}><TooltipTrigger asChild>{link}</TooltipTrigger><TooltipContent side="right">{label}</TooltipContent></Tooltip>
          ) : link;
        })}
      </nav>
      {!collapsed && (
        <Link to="/employer/billing" className="m-3 rounded-xl border bg-muted/40 p-3.5 hover:bg-muted">
          <p className="text-xs font-semibold">{employerOrg.plan} plan</p>
          <p className="mt-1 text-xs text-muted-foreground">{listings.used} of {listings.limit} listings used</p>
          <div className="mt-2 h-1.5 rounded-full bg-border"><div className="h-full rounded-full bg-primary" style={{ width: `${(listings.used / listings.limit) * 100}%` }} /></div>
        </Link>
      )}
    </div>
  );
}

export function EmployerLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setMobile(false); window.scrollTo(0, 0); }, [pathname]);

  return (
    <AppThemeProvider>
    <PathwayProvider>
    <TooltipProvider delayDuration={200}>
      <Toaster />
      <div className="min-h-screen bg-background">
        <aside className={cn("fixed inset-y-0 left-0 z-40 hidden flex-col border-r bg-sidebar transition-[width] duration-200 lg:flex", collapsed ? "w-[68px]" : "w-64")}>
          <div className={cn("flex h-16 items-center gap-2 border-b px-5", collapsed && "justify-center px-0")}>
            <BrandLogo to="/employer" compact={collapsed} />
            {!collapsed && <span className="rounded bg-ai-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase text-ai-strong">Hire</span>}
          </div>
          <SideNav collapsed={collapsed} />
        </aside>
        <Sheet open={mobile} onOpenChange={setMobile}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-16 items-center border-b px-5"><BrandLogo to="/employer" /></div>
            <SideNav />
          </SheetContent>
        </Sheet>
        <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[68px]" : "lg:pl-64")}>
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobile(true)} aria-label="Open navigation"><MenuIcon /></Button>
            <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar"><PanelLeftIcon /></Button>
            <div className="relative hidden max-w-md flex-1 md:block">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search candidates, listings…" className="h-9 bg-card pl-9" aria-label="Global search" />
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <ThemeToggle />
              <Button asChild variant="ghost" size="icon" aria-label="Notifications"><Link to="/employer/candidates" className="relative"><BellIcon /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" /></Link></Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 gap-2 px-1.5" aria-label="Account menu">
                    <Avatar className="h-7 w-7"><AvatarImage src={employerOrg.avatar} alt="" /><AvatarFallback>TA</AvatarFallback></Avatar>
                    <span className="hidden text-left text-sm leading-tight sm:block"><span className="block font-medium">{employerOrg.admin}</span><span className="text-xs text-muted-foreground">{employerOrg.name}</span></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{employerOrg.role} · Admin</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/employer/onboarding"><Building2Icon /> Company setup</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/employer/billing"><CreditCardIcon /> Plan & billing</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/app"><UsersIcon /> Switch to talent demo</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/sign-in"><LogOutIcon /> Sign out</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main id="main" className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </TooltipProvider>
    </PathwayProvider>
    </AppThemeProvider>
  );
}
