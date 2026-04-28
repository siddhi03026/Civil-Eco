import { Link, useLocation, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth-store";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Trophy, Bot, Camera, User, Settings, LogOut, Menu, X, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/challenges", label: "Daily Challenges", icon: Trophy },
  { to: "/app/assistant", label: "AI Assistant", icon: Bot },
  { to: "/app/report", label: "Report Issue", icon: Camera },
  { to: "/app/profile", label: "Profile", icon: User },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

function AppShell() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user === null) {
      // Auto-create a guest user instead of redirecting (mock-only)
    }
    setMobileOpen(false);
  }, [loc.pathname, user]);

  const displayName = user?.name || "Friend";

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border sticky top-0 h-screen">
        <div className="p-5 border-b border-sidebar-border"><Logo /></div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((n) => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => { logout(); nav({ to: "/" }); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border/60">
          <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4">
            <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="md:hidden"><Logo /></div>
            <div className="hidden md:block text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Hello, {displayName.split(" ")[0]}</span> — let's make today greener.
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-muted relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>
              <Link to="/app/profile" className="flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-muted">
                <div className="h-8 w-8 rounded-full bg-gradient-leaf flex items-center justify-center text-primary-foreground text-sm font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold leading-tight">{displayName}</div>
                  <div className="text-[10px] text-muted-foreground">{user?.area || "Urban"} member</div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-foreground/40" onClick={() => setMobileOpen(false)}>
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar p-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-sidebar-accent"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 space-y-1">
              {NAV.map((n) => {
                const Icon = n.icon;
                const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
                return (
                  <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}>
                    <Icon className="h-4 w-4" /> {n.label}
                  </Link>
                );
              })}
            </nav>
            <Button variant="outline" className="w-full" onClick={() => { logout(); nav({ to: "/" }); }}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
