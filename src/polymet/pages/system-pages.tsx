import { Link } from "react-router-dom";
import { ArrowLeftIcon, CompassIcon, LockIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SystemPageProps {
  code: string;
  title: string;
  description: string;
  Icon: React.ElementType;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
}

function SystemPage({ code, title, description, Icon, primary, secondary }: SystemPageProps) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">{code}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">{description}</p>
      <div className="mt-8 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Button asChild size="lg">
          <Link to={primary.to}>{primary.label}</Link>
        </Button>
        {secondary && (
          <Button asChild size="lg" variant="outline" className="bg-card">
            <Link to={secondary.to}><ArrowLeftIcon /> {secondary.label}</Link>
          </Button>
        )}
      </div>
    </section>
  );
}

export function NotFoundPage() {
  return (
    <SystemPage
      code="404 · Page not found"
      title="We couldn't find that page"
      description="The link may be broken, or the opportunity may have been closed or removed by the employer."
      Icon={CompassIcon}
      primary={{ label: "Browse internships", to: "/internships" }}
      secondary={{ label: "Back home", to: "/" }}
    />
  );
}

export function PermissionDeniedPage() {
  return (
    <SystemPage
      code="403 · No access"
      title="You don't have access to this page"
      description="This area is limited to a different account type or plan. Sign in with the right account, or check your plan in settings."
      Icon={LockIcon}
      primary={{ label: "Sign in", to: "/sign-in" }}
      secondary={{ label: "Back home", to: "/" }}
    />
  );
}

export function NoSearchResultsPage() {
  return (
    <SystemPage
      code="No results"
      title="Nothing matches yet"
      description="Try fewer filters or a broader keyword."
      Icon={SearchIcon}
      primary={{ label: "Reset search", to: "/internships" }}
    />
  );
}
