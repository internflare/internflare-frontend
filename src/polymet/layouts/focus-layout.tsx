import { Link, useLocation } from "react-router-dom";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { BrandLogo } from "@/polymet/components/brand-logo";
import { AppThemeProvider, ThemeToggle } from "@/polymet/components/theme-toggle";
import { PathwayProvider } from "@/polymet/components/pathway/pathway-provider";

export function FocusLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const exit = pathname.startsWith("/employer") ? "/employer" : "/app";
  return (
    <AppThemeProvider>
    <PathwayProvider>
    <div className="min-h-screen bg-background">
      <Toaster />
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandLogo to={exit} />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link to={exit}><XIcon /> <span className="hidden sm:inline">Save & exit</span><span className="sm:hidden">Exit</span></Link>
            </Button>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">{children}</main>
    </div>
    </PathwayProvider>
    </AppThemeProvider>
  );
}
