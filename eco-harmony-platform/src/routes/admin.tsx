import { createFileRoute, Link, Outlet, useLocation, useNavigate, redirect } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth-store";
import { LayoutDashboard, ListChecks, Map, Users, FileText, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminShell,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/issues", label: "Issue Management", icon: ListChecks },
  { to: "/admin/map", label: "Map View", icon: Map },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/content", label: "Content", icon: FileText },
];

function AdminShell() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <div className="min-h-screen flex bg-secondary/40">
      <aside className="hidden md:flex w-64 flex-col bg-foreground text-background sticky top-0 h-screen">
        <div className="p-5 border-b border-background/10 flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          <div>
            <div className="font-display font-bold text-base">Admin Console</div>
            <div className="text-[10px] uppercase tracking-widest opacity-60">EcoSetu</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((n) => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? "bg-accent text-accent-foreground" : "hover:bg-background/10"
              }`}>
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-background/10">
          <button onClick={() => { logout(); nav({ to: "/" }); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm hover:bg-background/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border/60">
          <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4">
            <div className="md:hidden"><Logo /></div>
            <div className="hidden md:block text-sm text-muted-foreground"><span className="text-foreground font-medium">Admin</span> control panel</div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-right hidden sm:block">
                <div className="font-semibold">{user?.name || "Admin"}</div>
                <div className="text-muted-foreground">{user?.email || "admin@eco.com"}</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center font-semibold"><Shield className="h-4 w-4" /></div>
            </div>
          </div>
          {/* Mobile nav */}
          <div className="md:hidden border-t border-border/60 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 px-4 py-2">
              {NAV.map((n) => {
                const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
                return (
                  <Link key={n.to} to={n.to} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${active ? "bg-foreground text-background" : "bg-muted"}`}>
                    {n.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto"><Outlet /></main>
      </div>
    </div>
  );
}
