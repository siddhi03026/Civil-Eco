import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth-store";
import { Check, Flame, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/challenges")({
  component: ChallengesPage,
});

function ChallengesPage() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Array<{ _id: string; title: string; description: string; points: number }>>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const doneCount = useMemo(() => done.size, [done]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([
      apiRequest<{ challenges: Array<{ _id: string; title: string; description: string; points: number }> }>("/challenges", { token }),
      apiRequest<{ dashboard: { userProgress?: { completedChallenges?: Array<{ _id: string }>; totalPoints?: number; streak?: number } } }>("/dashboard", { token }),
    ])
      .then(([cRes, dRes]) => {
        setList(cRes.challenges || []);
        const completed = dRes.dashboard?.userProgress?.completedChallenges || [];
        setDone(new Set(completed.map((c) => c._id)));
        setPoints(dRes.dashboard?.userProgress?.totalPoints || 0);
        setStreak(dRes.dashboard?.userProgress?.streak || 0);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load challenges");
      })
      .finally(() => setLoading(false));
  }, []);

  const complete = async (id: string) => {
    const token = getToken();
    if (!token) {
      toast.error("Please sign in first");
      return;
    }
    try {
      const res = await apiRequest<{
        message: string;
        earnedPoints?: number;
        progress: { completedChallenges: string[]; totalPoints: number; streak: number };
      }>("/challenges/complete", {
        method: "POST",
        token,
        body: { challengeId: id },
      });

      setDone(new Set((res.progress.completedChallenges || []).map(String)));
      setPoints(res.progress.totalPoints || 0);
      setStreak(res.progress.streak || 0);
      toast.success(res.earnedPoints ? `Nice work! +${res.earnedPoints} points` : res.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to complete challenge");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-leaf text-primary-foreground border-0 shadow-soft">
          <Flame className="h-6 w-6 mb-2" />
          <div className="text-3xl font-bold font-display">{streak} days</div>
          <div className="text-sm opacity-90">Current streak</div>
        </Card>
        <Card className="p-5 shadow-card">
          <Trophy className="h-6 w-6 mb-2 text-accent" />
          <div className="text-3xl font-bold font-display">{points}</div>
          <div className="text-sm text-muted-foreground">Total points earned</div>
        </Card>
        <Card className="p-5 shadow-card">
          <Check className="h-6 w-6 mb-2 text-success" />
          <div className="text-3xl font-bold font-display">{doneCount}/{list.length}</div>
          <div className="text-sm text-muted-foreground">Challenges complete</div>
        </Card>
      </div>

      <div>
        <h2 className="font-semibold text-xl mb-4">Today's challenges</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {loading && <Card className="p-5">Loading challenges...</Card>}
          {!loading && list.map((c) => {
            const isDone = done.has(c._id);
            return (
              <Card key={c._id} className={`p-5 shadow-card transition-all ${isDone ? "bg-primary-soft border-primary/30" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">Daily</span>
                    <h3 className={`mt-2 font-semibold ${isDone ? "line-through opacity-70" : ""}`}>{c.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
                    <div className="text-xs text-muted-foreground mt-1">+{c.points} eco-points</div>
                  </div>
                  <Button size="sm" variant={isDone ? "secondary" : "default"} disabled={isDone} onClick={() => complete(c._id)}>
                    {isDone ? <><Check className="h-4 w-4 mr-1" /> Done</> : "Mark done"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
