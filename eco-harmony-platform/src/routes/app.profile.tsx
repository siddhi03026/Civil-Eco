import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { getToken, useAuth } from "@/lib/auth-store";
import { Edit3, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

const STATUS_STYLES = {
  pending: "bg-warning/20 text-earth-foreground",
  "in-progress": "bg-sky/40 text-foreground",
  resolved: "bg-primary-soft text-primary",
} as const;

function ProfilePage() {
  const { user } = useAuth();
  const u = user || { name: "Guest User", email: "guest@example.com", area: "Urban" as const, mobile: "+91 99999 99999", city: "Bengaluru", state: "Karnataka", country: "India", role: "user" as const };
  const [myIssues, setMyIssues] = useState<Array<{ _id: string; issueType: string; status: "pending" | "in-progress" | "resolved"; createdAt: string; location: { latitude: number; longitude: number } }>>([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    Promise.all([
      apiRequest<{ issues: Array<{ _id: string; issueType: string; status: "pending" | "in-progress" | "resolved"; createdAt: string; location: { latitude: number; longitude: number } }> }>("/issues/user", { token }),
      apiRequest<{ dashboard: { userProgress?: { totalPoints?: number } } }>("/dashboard", { token }),
    ])
      .then(([issuesRes, dashRes]) => {
        setMyIssues(issuesRes.issues || []);
        setPoints(dashRes.dashboard?.userProgress?.totalPoints || 0);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load profile data"));
  }, []);

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-24 w-24 rounded-2xl bg-gradient-leaf flex items-center justify-center text-primary-foreground text-3xl font-bold font-display shadow-soft">
            {u.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{u.name}</h1>
            <div className="mt-1 text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {u.email}</span>
              {u.mobile && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {u.mobile}</span>}
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {u.city}, {u.state}</span>
            </div>
            <span className="mt-3 inline-block px-2.5 py-1 rounded-full text-xs bg-primary-soft text-primary font-medium">
              {u.area} member
            </span>
          </div>
          <Button variant="outline"><Edit3 className="h-4 w-4 mr-2" /> Edit profile</Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5 shadow-card"><div className="text-xs text-muted-foreground uppercase tracking-wider">Country</div><div className="mt-1 font-semibold">{u.country}</div></Card>
        <Card className="p-5 shadow-card"><div className="text-xs text-muted-foreground uppercase tracking-wider">Eco-points</div><div className="mt-1 font-semibold">{points}</div></Card>
        <Card className="p-5 shadow-card"><div className="text-xs text-muted-foreground uppercase tracking-wider">Member since</div><div className="mt-1 font-semibold">Apr 2026</div></Card>
      </div>

      <Card className="p-6 shadow-card">
        <h2 className="font-semibold text-lg mb-4">Your reported issues</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider text-left border-b border-border">
                <th className="py-2.5 pr-4">ID</th>
                <th className="py-2.5 pr-4">Title</th>
                <th className="py-2.5 pr-4 hidden md:table-cell">Location</th>
                <th className="py-2.5 pr-4">Status</th>
                <th className="py-2.5">When</th>
              </tr>
            </thead>
            <tbody>
              {myIssues.map((i) => (
                <tr key={i._id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs">{i._id.slice(-8)}</td>
                  <td className="py-3 pr-4 font-medium">{i.issueType}</td>
                  <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">Lat {i.location.latitude.toFixed(3)}, Lng {i.location.longitude.toFixed(3)}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_STYLES[i.status]}`}>{i.status}</span>
                  </td>
                  <td className="py-3 text-muted-foreground">{new Date(i.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
