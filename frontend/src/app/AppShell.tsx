import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardCheck,
  FileBadge,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  QrCode,
  ShieldCheck,
  UserCog,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { LanguageSelector } from "../components/LanguageSelector";
import { useAuthStore } from "../store/authStore";
import { useLanguageStore } from "../store/languageStore";
import { cn } from "../lib/cn";
import type { Role } from "../types/domain";

const roleLabels: Record<Role, string> = {
  SYSTEM_ADMIN: "System Administrator",
  EVENT_ORGANIZER: "Event Organizer",
  ATTENDEE: "Attendee"
};

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["SYSTEM_ADMIN", "EVENT_ORGANIZER", "ATTENDEE"] },
  { to: "/users", label: "Users", icon: UserCog, roles: ["SYSTEM_ADMIN"] },
  { to: "/venues", label: "Venues", icon: Building2, roles: ["SYSTEM_ADMIN", "EVENT_ORGANIZER"] },
  { to: "/events", label: "Events", icon: CalendarDays, roles: ["SYSTEM_ADMIN", "EVENT_ORGANIZER", "ATTENDEE"] },
  { to: "/attendees", label: "Attendees", icon: Users, roles: ["SYSTEM_ADMIN", "EVENT_ORGANIZER"] },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck, roles: ["SYSTEM_ADMIN", "EVENT_ORGANIZER"] },
  { to: "/scanner", label: "QR Scanner", icon: QrCode, roles: ["SYSTEM_ADMIN", "EVENT_ORGANIZER"] },
  { to: "/reports", label: "Reports", icon: BarChart3, roles: ["SYSTEM_ADMIN", "EVENT_ORGANIZER"] },
  { to: "/certificates", label: "Certificates", icon: FileBadge, roles: ["SYSTEM_ADMIN", "EVENT_ORGANIZER", "ATTENDEE"] },
  { to: "/audit", label: "Audit Trail", icon: ShieldCheck, roles: ["SYSTEM_ADMIN"] }
] satisfies Array<{ to: string; label: string; icon: typeof LayoutDashboard; roles: Role[] }>;

export function AppShell() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, logout } = useAuthStore();
  const applyUserPreference = useLanguageStore((state) => state.applyUserPreference);

  useEffect(() => {
    if (user) applyUserPreference(user.id);
  }, [applyUserPreference, user]);

  if (!user) return null;

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    setDark((value) => !value);
  }

  return (
    <div className="min-h-screen bg-background">
      {open && <button className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation" />}
      <aside className={cn("fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-border bg-white transition-transform dark:bg-background lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center border-b border-border px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <p className="font-semibold">EventFlow</p>
            <p className="text-xs text-slate-500">Attendance Command</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main navigation">
          {nav.filter((item) => item.roles.includes(user.role)).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-muted dark:text-slate-200",
                  isActive && "bg-primary/10 text-primary"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
          <p className="mt-2 text-xs font-semibold uppercase text-primary">{roleLabels[user.role]}</p>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white/90 px-4 backdrop-blur dark:bg-background/90 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 sm:text-sm">Welcome back</p>
              <h1 className="truncate text-base font-semibold sm:text-lg">{user.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-md border border-border bg-muted px-3 py-2 text-xs font-medium sm:inline-flex">
              {roleLabels[user.role]}
            </span>
            <LanguageSelector className="max-w-28 sm:max-w-none" />
            <Button variant="secondary" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              <Moon className={cn("h-4 w-4", dark && "fill-current")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
