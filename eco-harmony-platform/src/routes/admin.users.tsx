import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const [users, setUsers] = useState<Array<{
    _id: string;
    name: string;
    email: string;
    city?: string;
    areaType?: "urban" | "rural";
    role?: "admin" | "user";
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    apiRequest<{ users: Array<{ _id: string; name: string; email: string; city?: string; areaType?: "urban" | "rural"; role?: "admin" | "user" }> }>("/admin/users", { token })
      .then((res) => setUsers((res.users || []).filter((u) => u.role !== "admin")))
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const onDelete = async (id: string, name: string) => {
    const ok = window.confirm(`Delete ${name}? This cannot be undone.`);
    if (!ok) return;

    const token = getToken();
    if (!token) return;

    try {
      await apiRequest("/admin/users/" + id, { method: "DELETE", token });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">Community members across cities and villages.</p>
      </div>
      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60">
              <tr className="text-xs text-muted-foreground uppercase tracking-wider text-left">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4 hidden md:table-cell">Email</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="border-t border-border/60"><td className="py-3 px-4" colSpan={5}>Loading users...</td></tr>
              )}
              {!loading && users.length === 0 && (
                <tr className="border-t border-border/60"><td className="py-3 px-4" colSpan={5}>No users found.</td></tr>
              )}
              {!loading && users.map((u) => (
                <tr key={u._id} className="border-t border-border/60">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-leaf flex items-center justify-center text-primary-foreground text-xs font-semibold">{u.name.charAt(0)}</div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{u._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{u.email}</td>
                  <td className="py-3 px-4">{u.city || "-"}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.areaType === "urban" ? "bg-sky/40" : "bg-primary-soft text-primary"}`}>{u.areaType === "urban" ? "Urban" : "Rural"}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(u._id, u.name)}
                      className="text-xs font-semibold text-destructive hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
