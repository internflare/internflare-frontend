import { Link, useNavigate } from "react-router-dom";
import {
  BellIcon,
  LogOutIcon,
  MenuIcon,
  PanelLeftIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/polymet/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import authClient from "@/lib/auth-client";

interface AppTopbarProps {
  onToggleSidebar: () => void;
  onOpenMobile: () => void;
}

export function AppTopbar({ onToggleSidebar, onOpenMobile }: AppTopbarProps) {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const accountName =
    session?.user.name?.trim() || session?.user.email || "Your account";
  const accountEmail = session?.user.email ?? "";
  const initials =
    accountName
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("") || "U";

  const signOut = async () => {
    const result = await authClient.signOut();
    if (!result.error) navigate("/sign-in");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMobile}
        aria-label="Open navigation"
      >
        <MenuIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:inline-flex"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <PanelLeftIcon />
      </Button>
      <div className="relative hidden max-w-md flex-1 md:block">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search opportunities, companies, skills…"
          className="h-9 bg-card pl-9"
          aria-label="Global search"
        />
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
            >
              <BellIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
            </div>
            <p className="px-4 py-5 text-sm text-muted-foreground">
              Notifications will appear here when they are available.
            </p>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 gap-2 px-1.5"
              aria-label="Account menu"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={session?.user.image ?? undefined} alt="" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">
                {accountName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm">{accountName}</p>
              {accountEmail && (
                <p className="text-xs font-normal text-muted-foreground">
                  {accountEmail}
                </p>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/profile">
                <UserIcon /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/settings">
                <SettingsIcon /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                void signOut();
              }}
            >
              <LogOutIcon /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
