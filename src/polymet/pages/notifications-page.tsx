import { useReducer } from "react";
import { Link } from "react-router-dom";
import { BellIcon, BriefcaseIcon, CalendarIcon, CheckCheckIcon, ClipboardListIcon, CreditCardIcon, GiftIcon, UsersIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader, StateBlock } from "@/polymet/components/page-states";
import { notifications as seed, type NotificationItem } from "@/polymet/data/talent-data";

const categories: { id: NotificationItem["category"] | "all"; label: string; Icon: LucideIcon }[] = [
  { id: "all", label: "All", Icon: BellIcon },
  { id: "application", label: "Applications", Icon: BriefcaseIcon },
  { id: "interview", label: "Interviews", Icon: CalendarIcon },
  { id: "test", label: "Test tasks", Icon: ClipboardListIcon },
  { id: "offer", label: "Offers", Icon: GiftIcon },
  { id: "task", label: "Deadlines", Icon: ClipboardListIcon },
  { id: "mentor", label: "Mentors", Icon: UsersIcon },
  { id: "billing", label: "Billing", Icon: CreditCardIcon },
];
const iconFor = Object.fromEntries(categories.map((c) => [c.id, c.Icon])) as Record<string, LucideIcon>;

type NotificationState = {
  items: typeof seed;
  category: string;
  unreadOnly: boolean;
  prefs: { email: boolean; push: boolean; digest: boolean; marketing: boolean };
};

type NotificationAction =
  | { type: "category-selected"; category: string }
  | { type: "unread-filter-changed"; unreadOnly: boolean }
  | { type: "all-marked-read" }
  | { type: "notification-toggled"; id: string }
  | { type: "notification-marked-read"; id: string }
  | {
      type: "preference-toggled";
      preference: keyof NotificationState["prefs"];
      enabled: boolean;
    };

function notificationReducer(
  state: NotificationState,
  action: NotificationAction,
): NotificationState {
  switch (action.type) {
    case "category-selected":
      return { ...state, category: action.category };
    case "unread-filter-changed":
      return { ...state, unreadOnly: action.unreadOnly };
    case "all-marked-read":
      return { ...state, items: state.items.map((item) => ({ ...item, read: true })) };
    case "notification-toggled":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, read: !item.read } : item,
        ),
      };
    case "notification-marked-read":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, read: true } : item,
        ),
      };
    case "preference-toggled":
      return {
        ...state,
        prefs: {
          ...state.prefs,
          [action.preference]: action.enabled,
        },
      };
  }
}

export function NotificationsPage() {
  const [state, dispatch] = useReducer(notificationReducer, {
    items: seed,
    category: "all",
    unreadOnly: false,
    prefs: { email: true, push: true, digest: false, marketing: false },
  });
  const { items, category: cat, unreadOnly, prefs } = state;
  const list = items.filter((n) => (cat === "all" || n.category === cat) && (!unreadOnly || !n.read));
  const unread = items.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={`${unread} unread`}
        actions={<Button variant="outline" className="bg-card" disabled={!unread} onClick={() => dispatch({ type: "all-marked-read" })}><CheckCheckIcon /> Mark all read</Button>}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((c) => (
              <button key={c.id} onClick={() => dispatch({ type: "category-selected", category: c.id })} aria-pressed={cat === c.id} className={cn("rounded-md border px-2.5 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", cat === c.id ? "border-foreground bg-foreground text-background" : "bg-card hover:bg-muted")}>
                {c.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Switch id="unread-only" checked={unreadOnly} onCheckedChange={(value) => dispatch({ type: "unread-filter-changed", unreadOnly: value })} />
              <Label htmlFor="unread-only" className="text-xs">Unread only</Label>
            </div>
          </div>
          <div className="mt-4">
            {list.length === 0 ? (
              <StateBlock kind="empty" title="You're all caught up" description="New updates about applications, interviews and payments will appear here." />
            ) : (
              <ul className="divide-y overflow-hidden rounded-xl border bg-card">
                {list.map((n) => {
                  const Icon = iconFor[n.category] ?? BellIcon;
                  return (
                    <li key={n.id} className={cn("flex gap-3 p-4", !n.read && "bg-accent/30")}>
                      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", n.read ? "bg-muted text-muted-foreground" : "bg-accent text-primary")}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link to={n.href} onClick={() => dispatch({ type: "notification-marked-read", id: n.id })} className="font-medium hover:text-primary">
                            {n.title}
                          </Link>
                          <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                      </div>
                      <button
                        onClick={() => dispatch({ type: "notification-toggled", id: n.id })}
                        className="self-center rounded p-1 text-xs text-muted-foreground hover:text-foreground"
                        aria-label={n.read ? "Mark as unread" : "Mark as read"}
                      >
                        <span className={cn("block h-2.5 w-2.5 rounded-full border", n.read ? "border-muted-foreground" : "border-primary bg-primary")} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <aside className="h-fit rounded-xl border bg-card p-5">
          <p className="font-semibold">Delivery preferences</p>
          <div className="mt-4 space-y-4">
            {([
              ["email", "Email notifications", "Status changes, interviews and offers"],
              ["push", "In-app alerts", "Shown in the bell menu"],
              ["digest", "Weekly digest", "Summary of new matching opportunities"],
              ["marketing", "Product news", "Occasional feature updates"],
            ] as const).map(([k, label, sub]) => (
              <div key={k} className="flex items-start justify-between gap-3">
                <div>
                  <Label htmlFor={`pref-${k}`} className="text-sm">{label}</Label>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <Switch id={`pref-${k}`} checked={prefs[k]} onCheckedChange={(enabled) => dispatch({ type: "preference-toggled", preference: k, enabled })} />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Billing and security notices are always sent.</p>
        </aside>
      </div>
    </div>
  );
}
