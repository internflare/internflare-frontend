import { Link, NavLink } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandLogo } from "@/polymet/components/brand-logo";
import { ThemeToggle } from "@/polymet/components/theme-toggle";

const nav = [
  { label: "Learn", to: "/learn" },
  { label: "Internships", to: "/internships" },
  { label: "internflareJobs", to: "/jobs" },
  { label: "For Employers", to: "/#employers" },
  { label: "Pricing", to: "/pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <BrandLogo />
        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
          {nav.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive && !item.to.includes("#") && "text-foreground after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-primary",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <ThemeToggle className="ml-auto lg:ml-0" />
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost">
            <Link to="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/sign-up">Get started</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-4 lg:hidden" aria-label="Open menu">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
              {nav.map((item) => (
                <Link key={item.label} to={item.to} className="rounded-md px-3 py-2.5 font-medium hover:bg-muted">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 grid gap-2">
              <Button asChild variant="outline">
                <Link to="/sign-in">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/sign-up">Get started</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
