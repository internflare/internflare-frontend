import { Link, useNavigate } from "react-router-dom";
import { BellIcon, LogOutIcon, MenuIcon, PanelLeftIcon, SearchIcon, SettingsIcon, UserIcon, GlobeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/polymet/components/theme-toggle";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { currentTalent, notifications } from "@/polymet/data/talent-data";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface AppTopbarProps {
  onToggleSidebar: () => void;
  onOpenMobile: () => void;
}

export function AppTopbar({ onToggleSidebar, onOpenMobile }: AppTopbarProps) {
  const { candidate } = usePathway();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const unread = notifications.filter((n) => !n.read);
  const accountName = session?.user.name || candidate.name;
  const accountEmail = session?.user.email || currentTalent.email;

  const signOut = async () => {
    const result = await authClient.signOut();
    if (!result.error) navigate("/sign-in");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMobile} aria-label="Open navigation">
        <MenuIcon />
      </Button>
      <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <PanelLeftIcon />
      </Button>
      <div className="relative hidden max-w-md flex-1 md:block">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search opportunities, companies, skills…" className="h-9 bg-card pl-9" aria-label="Global search" />
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="mr-1 hidden rounded-md border border-primary/25 bg-accent px-2 py-0.5 text-xs font-semibold text-brown sm:inline">
          {currentTalent.plan} plan
        </span>
        <ThemeToggle />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${unread.length} unread`}>
              <BellIcon />
              {unread.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              <span className="text-xs text-muted-foreground">{unread.length} unread</span>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {notifications.slice(0, 4).map((n) => (
                <li key={n.id}>
                  <Link to={n.href} className="flex gap-3 px-4 py-3 hover:bg-muted">
                    <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")} />
                    <span>
                      <span className="block text-sm font-medium">{n.title}</span>
                      <span className="line-clamp-2 text-xs text-muted-foreground">{n.body}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/app/notifications" className="block border-t px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-muted">
              View all notifications
            </Link>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-1.5" aria-label="Account menu">
              <Avatar className="h-7 w-7">
                <AvatarImage src={candidate.avatar} alt="" />
                <AvatarFallback>{accountName.split(" ").map((p) => p[0]).join("")}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{session ? accountName : candidate.id === "new" ? "Account" : candidate.firstName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm">{accountName}</p>
              <p className="text-xs font-normal text-muted-foreground">{accountEmail}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/profile"><UserIcon /> Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/talent/${currentTalent.id}`}><GlobeIcon /> View public portfolio</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/settings"><SettingsIcon /> Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(event) => { event.preventDefault(); void signOut(); }}>
              <LogOutIcon /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
