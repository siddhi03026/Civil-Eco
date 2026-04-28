import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth-store";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/#stories", label: "Stories" },
  { to: "/#features", label: "Features" },
  { to: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const { user } = useAuth();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <a
              key={n.to}
              href={n.to}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button asChild variant="default">
              <Link to={user.role === "admin" ? "/admin" : "/app"}>Open dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="px-4 py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <a key={n.to} href={n.to} onClick={() => setOpen(false)} className="text-sm font-medium py-2">
                {n.label}
              </a>
            ))}
            {user ? (
              <Button asChild>
                <Link to={user.role === "admin" ? "/admin" : "/app"}>Dashboard</Link>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/register">Get started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
