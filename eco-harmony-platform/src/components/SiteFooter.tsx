import { Logo } from "./Logo";
import { Leaf, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40 mt-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 grid md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">
            Bridging cities and villages for a cleaner, greener tomorrow.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Report an issue</li>
            <li>Daily challenges</li>
            <li>AI assistant</li>
            <li>Dashboard</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Community</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Urban initiatives</li>
            <li>Rural programs</li>
            <li>Volunteer</li>
            <li>Partner with us</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Reach us</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>hello@ecosetu.app</span></li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>Bengaluru, India</span></li>
            <li className="flex items-center gap-2"><Leaf className="h-4 w-4 text-primary" /><span>Carbon-neutral hosting</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EcoSetu — Made with care for our planet.
      </div>
    </footer>
  );
}
