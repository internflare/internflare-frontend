import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SiteHeader } from "@/polymet/components/site-header";
import { SiteFooter } from "@/polymet/components/site-footer";
import { AppThemeProvider } from "@/polymet/components/theme-toggle";
import { PathwayProvider } from "@/polymet/components/pathway/pathway-provider";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <AppThemeProvider>
    <PathwayProvider>
    <div className="flex min-h-screen flex-col bg-background">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:shadow">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
    </PathwayProvider>
    </AppThemeProvider>
  );
}
