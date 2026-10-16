import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrandLogo } from "@/polymet/components/brand-logo";
import { TalentSidebarNav } from "@/polymet/components/talent-sidebar-nav";
import { AppTopbar } from "@/polymet/components/app-topbar";
import { AppThemeProvider } from "@/polymet/components/theme-toggle";
import { PathwayProvider } from "@/polymet/components/pathway/pathway-provider";

export function TalentLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AppThemeProvider>
    <PathwayProvider>
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden flex-col border-r bg-sidebar transition-[width] duration-200 lg:flex",
            collapsed ? "w-[68px]" : "w-64",
          )}
        >
          <div className={cn("flex h-16 items-center border-b px-5", collapsed && "justify-center px-0")}>
            <BrandLogo to="/app" compact={collapsed} />
          </div>
          <TalentSidebarNav collapsed={collapsed} />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-16 items-center border-b px-5">
              <BrandLogo to="/app" />
            </div>
            <TalentSidebarNav />
          </SheetContent>
        </Sheet>

        <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[68px]" : "lg:pl-64")}>
          <AppTopbar onToggleSidebar={() => setCollapsed((c) => !c)} onOpenMobile={() => setMobileOpen(true)} />
          <main id="main" className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
    </PathwayProvider>
    </AppThemeProvider>
  );
}
