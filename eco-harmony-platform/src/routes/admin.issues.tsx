import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth-store";
import { useEffect, useMemo, useState } from "react";
import { Send, Mic, Filter } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/issues")({
  component: IssueManagement,
});

type Severity = "high" | "medium" | "low";
type Status = "pending" | "in-progress" | "resolved";

type IssueItem = {
  _id: string;
  description: string;
  issueType: string;
  severity: Severity;
  status: Status;
  createdAt: string;
  location: { latitude: number; longitude: number };
  userId?: { name?: string; city?: string };
  responses?: Array<{ sender: "admin" | "user"; text: string }>;
};

const SEV_BADGE: Record<Severity, string> = {
  high: "bg-destructive/15 text-destructive",
  medium: "bg-warning/20 text-earth-foreground",
  low: "bg-success/15 text-success",
};

const STATUS_OPTIONS: Status[] = ["pending", "in-progress", "resolved"];

function IssueManagement() {
  const [list, setList] = useState<IssueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sev, setSev] = useState<"all" | Severity>("all");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [active, setActive] = useState<IssueItem | null>(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    apiRequest<{ issues: IssueItem[] }>("/admin/issues", { token })
      .then((res) => {
        const issues = res.issues || [];
        setList(issues);
        setActive(issues[0] || null);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load issues"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => list.filter((i) =>
    (sev === "all" || i.severity === sev) &&
    (status === "all" || i.status === status)
  ), [list, sev, status]);

  const updateStatus = async (id: string, s: Status) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await apiRequest<{ issue: IssueItem }>(`/issues/${id}/status`, {
        method: "PUT",
        token,
        body: { status: s },
      });
      setList((l) => l.map((x) => x._id === id ? { ...x, status: res.issue.status } : x));
      setActive((a) => (a && a._id === id ? { ...a, status: res.issue.status } : a));
      toast.success(`Status: ${s}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !active) return;
    const token = getToken();
    if (!token) return;

    try {
      const text = reply;
      setReply("");
      const res = await apiRequest<{ responses: Array<{ sender: "admin" | "user"; text: string }> }>(`/issues/${active._id}/respond`, {
        method: "POST",
        token,
        body: { text, voice: false },
      });

      setActive({ ...active, responses: res.responses });
      setList((l) => l.map((x) => x._id === active._id ? { ...x, responses: res.responses } : x));
      toast.success("Reply sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reply");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Issue management</h1>
        <p className="text-muted-foreground mt-1">Review reports, update status, and reply to citizens.</p>
      </div>

      <Card className="p-4 shadow-card flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select className="px-3 py-1.5 rounded-lg bg-secondary text-sm" value={sev} onChange={(e) => setSev(e.target.value as any)}>
          <option value="all">All severities</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
        </select>
        <select className="px-3 py-1.5 rounded-lg bg-secondary text-sm" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} of {list.length}</span>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-2 shadow-card lg:col-span-1 max-h-[70vh] overflow-y-auto">
          {loading && <div className="p-3 text-sm text-muted-foreground">Loading issues...</div>}
          {filtered.map((i) => (
            <button
              key={i._id}
              onClick={() => setActive(i)}
              className={`w-full text-left p-3 rounded-xl mb-1 transition-colors ${active?._id === i._id ? "bg-primary-soft" : "hover:bg-secondary"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-muted-foreground">{i._id.slice(-8)}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${SEV_BADGE[i.severity]}`}>{i.severity}</span>
              </div>
              <div className="font-medium text-sm mt-1 truncate">{i.issueType}</div>
              <div className="text-xs text-muted-foreground truncate">{i.userId?.city || "Unknown city"}</div>
            </button>
          ))}
          {!loading && filtered.length === 0 && <div className="p-3 text-sm text-muted-foreground">No issues found for selected filters.</div>}
        </Card>

        <Card className="p-6 shadow-card lg:col-span-2">
          {!active && <div className="text-sm text-muted-foreground">Select an issue to view details.</div>}
          {active && (
            <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-muted-foreground">{active._id}</div>
              <h2 className="font-semibold text-xl">{active.issueType}</h2>
              <div className="text-xs text-muted-foreground mt-0.5">
                Lat {active.location.latitude.toFixed(3)}, Lng {active.location.longitude.toFixed(3)} · by {active.userId?.name || "User"}
              </div>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider ${SEV_BADGE[active.severity]}`}>{active.severity}</span>
          </div>
          <p className="mt-4 text-sm">{active.description}</p>

          <div className="mt-5">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Update status</div>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button key={s} onClick={() => updateStatus(active._id, s)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  active.status === s ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"
                }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Issue thread</div>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {(active.responses || []).map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {(!active.responses || active.responses.length === 0) && (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Reply to user</div>
            <form onSubmit={sendReply} className="flex gap-2">
              <button type="button" className="p-2.5 rounded-xl bg-secondary hover:bg-muted" aria-label="Voice reply">
                <Mic className="h-4 w-4" />
              </button>
              <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply…" className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <Button type="submit"><Send className="h-4 w-4 mr-1" /> Send</Button>
            </form>
          </div>
          </>
          )}
        </Card>
      </div>
    </div>
  );
}
