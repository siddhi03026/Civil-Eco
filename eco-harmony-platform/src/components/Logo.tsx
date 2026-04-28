import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative">
        <div className="h-9 w-9 rounded-xl bg-gradient-leaf flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
          <Leaf className="h-5 w-5 text-primary-foreground" strokeWidth={2.2} />
        </div>
      </div>
      <div className="leading-tight">
        <div className="font-display font-bold text-lg text-foreground">EcoSetu</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground -mt-0.5">Sanitation · Together</div>
      </div>
    </Link>
  );
}
