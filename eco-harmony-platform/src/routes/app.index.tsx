import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getToken, useAuth } from "@/lib/auth-store";
import { apiRequest } from "@/lib/api";
import { Camera, Trophy, Leaf, TrendingUp, Sparkles } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/")({
  component: DashboardPage,
});

const WEEK = [
  { d: "Mon", points: 30 }, { d: "Tue", points: 50 }, { d: "Wed", points: 20 },
  { d: "Thu", points: 65 }, { d: "Fri", points: 40 }, { d: "Sat", points: 80 }, { d: "Sun", points: 55 },
];

function DashboardPage() {
  const { user } = useAuth();
  const name = user?.name?.split(" ")[0] || "Friend";
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [totalIssues, setTotalIssues] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiRequest<{ dashboard: { totalIssues: number; issueStatus: { resolved: number; inProgress: number; pending: number }; userProgress?: { totalPoints?: number; streak?: number; completedChallenges?: unknown[] } } }>("/dashboard", { token })
      .then((res) => {
        setTotalIssues(res.dashboard.totalIssues || 0);
        setResolved(res.dashboard.issueStatus?.resolved || 0);
        setInProgress(res.dashboard.issueStatus?.inProgress || 0);
        setPending(res.dashboard.issueStatus?.pending || 0);
        setPoints(res.dashboard.userProgress?.totalPoints || 0);
        setStreak(res.dashboard.userProgress?.streak || 0);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load dashboard"));
  }, []);

  const PIE = useMemo(() => [
    { name: "Resolved", value: resolved, fill: "var(--color-primary)" },
    { name: "In progress", value: inProgress, fill: "var(--color-accent)" },
    { name: "Pending", value: pending, fill: "var(--color-earth)" },
  ], [resolved, inProgress, pending]);

  const monthlyGoal = 500;
  const progressValue = Math.min(100, Math.round((points / monthlyGoal) * 100));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-leaf text-primary-foreground p-6 md:p-8 shadow-soft relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-15"><Leaf className="h-56 w-56" /></div>
        <div className="relative">
          <span className="text-xs uppercase tracking-widest opacity-80">Welcome back</span>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold">Hello, {name} 🌿</h1>
          <p className="mt-2 text-primary-foreground/90 max-w-lg text-sm md:text-base">
            You're on a {streak}-day streak. One small action today keeps your community greener.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button asChild size="sm" variant="secondary">
              <Link to="/app/report"><Camera className="h-4 w-4 mr-1.5" /> Report Issue</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link to="/app/challenges"><Trophy className="h-4 w-4 mr-1.5" /> Start Challenge</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tasks completed" value={streak.toString()} sub="Current streak" tone="leaf" icon={Trophy} />
        <StatCard label="Eco-points" value={points.toString()} sub="Total earned" tone="warm" icon={Sparkles} />
        <StatCard label="Issues reported" value={totalIssues.toString()} sub={`${resolved} resolved`} tone="leaf" icon={Camera} />
        <StatCard label="Pending issues" value={pending.toString()} sub="Need attention" tone="warm" icon={Leaf} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-lg">Weekly progress</h2>
              <p className="text-xs text-muted-foreground">Eco-points earned per day</p>
            </div>
            <div className="text-xs text-success flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +18%</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEK}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Bar dataKey="points" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <h2 className="font-semibold text-lg">Issues breakdown</h2>
          <p className="text-xs text-muted-foreground">Across your reports</p>
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PIE} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {PIE.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {PIE.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.fill }} />
                  {p.name}
                </div>
                <span className="font-semibold">{p.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-lg">Monthly goal</h2>
            <p className="text-xs text-muted-foreground">Earn 500 eco-points by end of month</p>
          </div>
          <span className="text-sm font-semibold text-primary">{points} / 500</span>
        </div>
        <Progress value={progressValue} className="h-3" />
      </Card>
    </div>
  );
}

function StatCard({ label, value, sub, tone, icon: Icon }: { label: string; value: string; sub: string; tone: "leaf" | "warm"; icon: any }) {
  return (
    <Card className="p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="mt-1 text-2xl font-bold font-display">{value}</div>
          <div className="text-xs text-success mt-0.5">{sub}</div>
        </div>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tone === "leaf" ? "bg-gradient-leaf" : "bg-gradient-warm"}`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </Card>
  );
}
