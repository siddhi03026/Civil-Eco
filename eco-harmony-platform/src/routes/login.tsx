import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loginUser } from "@/lib/auth-store";
import { useState } from "react";
import { toast } from "sonner";
import { Leaf } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — EcoSetu" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }

    try {
      setLoading(true);
      const user = await loginUser(email, password);
      toast.success(`Welcome, ${user.name.split(" ")[0]}`);
      nav({ to: user.role === "admin" ? "/admin" : "/app" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-leaf text-primary-foreground relative overflow-hidden">
        <Logo className="text-primary-foreground [&_*]:text-primary-foreground" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-tight max-w-sm">A cleaner tomorrow starts with a small action today.</h2>
          <p className="mt-4 text-primary-foreground/85 max-w-sm">Sign in to continue your eco-journey.</p>
        </div>
        <Leaf className="absolute -bottom-10 -right-10 h-72 w-72 opacity-20 animate-sway" />
        <p className="text-xs opacity-80 relative z-10">© EcoSetu — bridging cities & villages</p>
      </div>
      <div className="flex items-center justify-center p-6 md:p-10">
        <Card className="w-full max-w-md p-8 shadow-card">
          <div className="lg:hidden mb-6"><Logo /></div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your EcoSetu account.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Email">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="auth-input" placeholder="you@example.com" />
            </Field>
            <Field label="Password">
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="auth-input" placeholder="••••••••" />
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
          </form>
          <p className="mt-6 text-sm text-center text-muted-foreground">
            New here? <Link to="/register" className="text-primary font-medium hover:underline">Create an account</Link>
          </p>
          <div className="mt-4 text-[11px] text-center text-muted-foreground bg-muted rounded-lg py-2 px-3">
            First registered account becomes admin automatically.
          </div>
        </Card>
      </div>
      <style>{`
        .auth-input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--color-border); background: var(--color-background); padding: 0.7rem 0.9rem; font-size: 0.9rem; outline: none; transition: border-color .15s, box-shadow .15s; }
        .auth-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
