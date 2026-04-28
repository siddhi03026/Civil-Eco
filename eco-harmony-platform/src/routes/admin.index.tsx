import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth-store";
import { useEffect, useMemo, useState } from "react";
import { Users as UsersIcon, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [issues, setIssues] = useState<Array<{ _id: string; issueType: string; severity: "high" | "medium" | "low"; status: "pending" | "in-progress" | "resolved"; createdAt: string; location: { latitude: number; longitude: number } }>>([]);
  const [totalIssues, setTotalIssues] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([
      apiRequest<{ dashboard: { totalIssues: number; issueStatus: { resolved: number; pending: number; inProgress: number }; totalUsers?: number } }>("/dashboard", { token }),
      apiRequest<{ issues: Array<{ _id: string; issueType: string; severity: "high" | "medium" | "low"; status: "pending" | "in-progress" | "resolved"; createdAt: string; location: { latitude: number; longitude: number } }> }>("/admin/issues", { token }),
      apiRequest<{ users: unknown[] }>("/admin/users", { token }),
    ])
      .then(([dash, issuesRes, usersRes]) => {
        setResolved(dash.dashboard.issueStatus?.resolved || 0);
        setPending(dash.dashboard.issueStatus?.pending || 0);
        setInProgress(dash.dashboard.issueStatus?.inProgress || 0);
        setTotalIssues(dash.dashboard.totalIssues || 0);
        setIssues(issuesRes.issues || []);
        setTotalUsers(usersRes.users?.length || dash.dashboard.totalUsers || 0);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load admin dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const PIE = [
    { name: "Resolved", value: resolved, fill: "var(--color-primary)" },
    { name: "In progress", value: inProgress, fill: "var(--color-accent)" },
    { name: "Pending", value: pending, fill: "var(--color-destructive)" },
  ];

  const SEV = useMemo(() => ([
    { sev: "High", count: issues.filter((i) => i.severity === "high").length },
    { sev: "Medium", count: issues.filter((i) => i.severity === "medium").length },
    { sev: "Low", count: issues.filter((i) => i.severity === "low").length },
  ]), [issues]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Admin overview</h1>
        <p className="text-muted-foreground mt-1">Live snapshot of platform activity.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={UsersIcon} label="Total users" value={totalUsers.toString()} sub="Across platform" tone="primary" />
        <Stat icon={AlertTriangle} label="Total issues" value={totalIssues.toString()} sub={`${pending} pending`} tone="destructive" />
        <Stat icon={Clock} label="In progress" value={inProgress.toString()} sub="Avg 2.3d to resolve" tone="accent" />
        <Stat icon={CheckCircle2} label="Resolved" value={resolved.toString()} sub="This month" tone="success" />
      </div>

      {loading && <Card className="p-4 text-sm text-muted-foreground">Loading admin dashboard...</Card>}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-card">
          <h2 className="font-semibold text-lg">Status distribution</h2>
          <p className="text-xs text-muted-foreground">Resolved vs Pending vs In-progress</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PIE} dataKey="value" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {PIE.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {PIE.map((p) => (
              <div key={p.name}>
                <div className="h-2 rounded-full" style={{ background: p.fill }} />
                <div className="mt-1 font-medium">{p.name}</div>
                <div className="text-muted-foreground">{p.value}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <h2 className="font-semibold text-lg">Severity</h2>
          <p className="text-xs text-muted-foreground">Distribution across all issues</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SEV}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="sev" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-card">
        <h2 className="font-semibold text-lg mb-3">Recent issues</h2>
        <div className="space-y-2">
          {issues.slice(0, 4).map((i) => (
            <div key={i._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60">
              <span className={`h-2.5 w-2.5 rounded-full ${i.severity === "high" ? "bg-destructive" : i.severity === "medium" ? "bg-warning" : "bg-success"}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{i.issueType}</div>
                <div className="text-xs text-muted-foreground">Lat {i.location.latitude.toFixed(3)}, Lng {i.location.longitude.toFixed(3)} · {new Date(i.createdAt).toLocaleDateString()}</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{i.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, tone }: { icon: any; label: string; value: string; sub: string; tone: "primary" | "destructive" | "accent" | "success" }) {
  const map = {
    primary: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    accent: "bg-accent text-accent-foreground",
    success: "bg-success text-primary-foreground",
  };
  return (
    <Card className="p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="mt-1 text-2xl font-bold font-display">{value}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
        </div>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${map[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
