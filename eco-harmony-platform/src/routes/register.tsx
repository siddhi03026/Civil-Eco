import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { registerUser } from "@/lib/auth-store";
import { STATES, COUNTRIES, INDIA_DATA } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — EcoSetu" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const [f, setF] = useState({
    name: "", email: "", mobile: "", city: "Mumbai", state: "Maharashtra", country: "India", area: "Urban" as "Urban" | "Rural",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Update city list when state changes
  const citiesForState = INDIA_DATA[f.state] || [];

  useEffect(() => {
    // If current city is not in the new state's city list, reset it to the first city of that state
    if (citiesForState.length > 0 && !citiesForState.includes(f.city)) {
      setF(prev => ({ ...prev, city: citiesForState[0] }));
    }
  }, [f.state]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name || !f.email || !f.mobile || !password) {
      toast.error("Name, email, mobile and password are required");
      return;
    }

    try {
      setLoading(true);
      const user = await registerUser({
        name: f.name,
        email: f.email,
        mobile: f.mobile,
        city: f.city,
        state: f.state,
        country: f.country,
        areaType: f.area === "Rural" ? "rural" : "urban",
        password,
      });
      toast.success(`Welcome, ${user.name.split(" ")[0]}!`);
      nav({ to: user.role === "admin" ? "/admin" : "/app" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 bg-secondary/40">
      <Card className="w-full max-w-2xl p-6 md:p-10 shadow-card">
        <Logo />
        <h1 className="mt-6 text-2xl md:text-3xl font-bold">Join the movement</h1>
        <p className="text-sm text-muted-foreground mt-1">Create your free EcoSetu account in less than a minute.</p>
        <form onSubmit={submit} className="mt-6 grid md:grid-cols-2 gap-4">
          <Field label="Full name"><input className="auth-input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Anika Verma" /></Field>
          <Field label="Email"><input type="email" className="auth-input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="anika@example.com" /></Field>
          <Field label="Mobile number"><input className="auth-input" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value })} placeholder="+91 ..." /></Field>
          <Field label="Password"><input type="password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" /></Field>
          <Field label="Area type">
            <select className="auth-input" value={f.area} onChange={(e) => setF({ ...f, area: e.target.value as "Urban" | "Rural" })}>
              <option>Urban</option><option>Rural</option>
            </select>
          </Field>
          <Field label="State">
            <select className="auth-input" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })}>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="City">
            <select className="auth-input" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}>
              {citiesForState.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Country">
            <select className="auth-input" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <div className="md:col-span-2 flex items-center justify-between gap-3 pt-2">
            <p className="text-xs text-muted-foreground">Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></p>
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
          </div>
        </form>
      </Card>
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
