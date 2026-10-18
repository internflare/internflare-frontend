import { Link } from "react-router-dom";
import { ArrowRightIcon, BookOpenIcon, BriefcaseIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WidgetCard } from "@/polymet/components/widget-card";
import authClient from "@/lib/auth-client";

export function TalentDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div role="status" className="py-12 text-center text-sm text-muted-foreground">
        Loading your account…
      </div>
    );
  }

  if (!session) {
    return (
      <section className="mx-auto max-w-xl rounded-xl border bg-card p-6 text-center">
        <h1 className="text-xl font-semibold">Sign in to view your dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account details and activity are available after you sign in.
        </p>
        <Button asChild className="mt-4">
          <Link to="/sign-in">Sign in</Link>
        </Button>
      </section>
    );
  }

  const { user } = session;
  // Better Auth is the account identity source; do not use the sample pathway profile here.
  const displayName =
    user.name?.trim() || user.email.split("@")[0] || "there";
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Your Internflare account</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
            Welcome, {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your dashboard is connected to your signed-in account.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/jobs">Explore opportunities</Link>
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <WidgetCard
          title="Account details"
          description="Your identity from Better Auth"
          icon={<UserIcon className="h-4 w-4" />}
          action={
            <Link
              to="/app/profile"
              className="text-sm font-medium text-primary hover:underline"
            >
              Edit profile
            </Link>
          }
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.image ?? undefined} alt="" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold">{user.name || displayName}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </WidgetCard>

        <WidgetCard
          title="Get started"
          description="Choose what you would like to do next"
        >
          <ul className="space-y-2">
            {[
              { label: "Complete your profile", to: "/app/profile", Icon: UserIcon },
              { label: "Browse jobs and internships", to: "/app/jobs", Icon: BriefcaseIcon },
              { label: "Explore learning resources", to: "/app/learn", Icon: BookOpenIcon },
            ].map(({ label, to, Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="flex items-center gap-3 rounded-lg border p-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent/30"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="flex-1">{label}</span>
                  <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </WidgetCard>
      </div>

      <WidgetCard
        title="Your activity"
        description="Applications, interviews, assessments and other activity"
      >
        {/* Account-scoped activity APIs are not wired yet, so avoid showing illustrative records. */}
        <p className="text-sm text-muted-foreground">
          Activity data is not connected to your account yet. No sample
          applications, interviews or assessment results are shown here.
        </p>
      </WidgetCard>
    </div>
  );
}
