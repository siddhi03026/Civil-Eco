import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IMG } from "@/lib/images";
import { apiRequest } from "@/lib/api";
import { STORIES } from "@/lib/mock-data";
import {
  Camera, Trophy, BarChart3, Bot, Leaf, ArrowRight, Send, Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoSetu — Clean Environment, Healthy Future" },
      {
        name: "description",
        content:
          "Sanitation awareness and management for cities and villages. Report issues, take daily challenges, and build a cleaner future together.",
      },
      { property: "og:title", content: "EcoSetu — Clean Environment, Healthy Future" },
      { property: "og:description", content: "A nature-first sanitation platform connecting urban and rural communities." },
      { property: "og:image", content: IMG.hero },
    ],
  }),
  component: HomePage,
});

const FEATURES = [
  { icon: Camera, title: "Smart Issue Detection", desc: "Snap, describe and pin a sanitation issue in seconds.", tone: "leaf" },
  { icon: Trophy, title: "Daily Challenges", desc: "Tiny eco-actions that build lasting habits and earn points.", tone: "warm" },
  { icon: BarChart3, title: "Personal Dashboard", desc: "Track your impact, streaks and contributions over time.", tone: "leaf" },
  { icon: Bot, title: "AI Assistance", desc: "Hindi or English help, with voice — for everyone, everywhere.", tone: "warm" },
];

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 overflow-hidden">
        <Hero />
        <div className="relative isolate">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <img
              src={IMG["mountain-lake"]}
              alt="Mountain lake landscape"
              className="h-full w-full object-cover saturate-125"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,255,247,0.56)_0%,rgba(248,255,245,0.4)_45%,rgba(246,255,243,0.5)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_42%)]" />
          </div>
          <Stories />
          <Features />
          <Contact />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const [stats, setStats] = useState({
    resolvedIssues: 12400,
    communities: 86,
    totalPoints: 2100000,
    activeIssues: 438,
  });

  useEffect(() => {
    apiRequest<{ stats: { resolvedIssues: number; communities: number; totalPoints: number; activeIssues: number } }>("/public/stats")
      .then((res) => {
        if (res?.stats) setStats(res.stats);
      })
      .catch(() => {
        // Keep graceful fallback numbers on public page if API is unavailable.
      });
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <img src={IMG.hero} alt="Blended view of a green city and lush mountains" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/55 via-primary/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-orb hero-orb--one animate-float-slow" />
        <div className="hero-orb hero-orb--two animate-drift-right" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 items-center">
          {/* Left: copy */}
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/85 backdrop-blur border border-border/60 shadow-card text-xs font-medium text-foreground animate-slide-in-left">
              <Leaf className="h-3.5 w-3.5 text-primary animate-sway" />
              Sanitation · Awareness · Action
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-[1.05] text-white drop-shadow-[0_2px_12px_rgba(0,40,15,0.45)]">
              Clean Environment,<br />
              <span className="text-white">Healthy Future</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/95 max-w-xl drop-shadow-[0_1px_6px_rgba(0,30,10,0.5)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Together we can build cleaner cities and greener villages. Report issues,
              take daily challenges, and inspire your community.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow transition-transform hover:scale-105">
                <Link to="/register">
                  Get Started <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-primary/30 backdrop-blur border-white/40 text-white hover:bg-primary/50 hover:text-white transition-transform hover:scale-105">
                <Link to="/app/report">Report Issue</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/90 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Stat n={`${stats.resolvedIssues.toLocaleString()}+`} l="Issues resolved" />
              <Stat n={`${stats.communities}`} l="Cities & villages" />
              <Stat n={`${(stats.totalPoints / 1000000).toFixed(1)}M`} l="Eco-points earned" />
            </div>
          </div>

          {/* Right: impact panel */}
          <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative mx-auto max-w-[440px] hover:scale-[1.02] transition-transform duration-500">
              <Card className="border-white/35 bg-white/15 backdrop-blur-md text-white shadow-glow">
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/80">Community Pulse</p>
                  <h3 className="mt-2 text-2xl font-bold">This Week's Green Impact</h3>
                  <p className="mt-2 text-sm text-white/90">Volunteers, school children and local groups are actively improving neighborhoods.</p>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-white/12 px-3 py-2">
                      <span className="flex items-center gap-2 text-sm"><Camera className="h-4 w-4" /> Reports submitted</span>
                      <span className="font-semibold">{stats.activeIssues.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/12 px-3 py-2">
                      <span className="flex items-center gap-2 text-sm"><Trophy className="h-4 w-4" /> Challenges completed</span>
                      <span className="font-semibold">{Math.max(1204, Math.floor(stats.totalPoints / 50)).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/12 px-3 py-2">
                      <span className="flex items-center gap-2 text-sm"><Bot className="h-4 w-4" /> AI guidance sessions</span>
                      <span className="font-semibold">{Math.max(3190, Math.floor(stats.activeIssues * 3.2)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="absolute -top-5 right-4 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary shadow-soft">
                +420 points today
              </div>

              <Card className="absolute -bottom-8 -left-6 border-white/35 bg-white/20 backdrop-blur text-white shadow-card">
                <div className="px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/80">Active drive</p>
                  <p className="mt-1 text-sm font-semibold">Clean Street Sunday, Ward 7</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold font-display">{n}</span>
      <span className="text-xs uppercase tracking-wider opacity-90">{l}</span>
    </div>
  );
}

function Stories() {
  return (
    <section id="stories" className="py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Stories</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold">Real change, told simply.</h2>
          </div>
          <Sparkles className="h-6 w-6 text-accent hidden md:block" />
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-hide pb-6">
        <div className="flex gap-5 px-4 md:px-8 mx-auto max-w-7xl snap-x snap-mandatory">
          {STORIES.map((s) => (
            <article
              key={s.id}
              className="snap-start shrink-0 w-[280px] md:w-[340px] rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden hover:shadow-soft transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={IMG[s.img as keyof typeof IMG]} alt={s.title} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <span className={`inline-block text-[10px] uppercase tracking-wider px-2 py-1 rounded-full mb-2 ${
                  s.tag === "Urban" ? "bg-sky/30 text-foreground" :
                  s.tag === "Rural" ? "bg-primary-soft text-primary" : "bg-accent/30 text-earth-foreground"
                }`}>{s.tag}</span>
                <h3 className="font-semibold text-lg leading-snug">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">What we offer</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">Tools for everyone, everywhere</h2>
          <p className="mt-3 text-muted-foreground">Designed for both city dwellers and village communities — clean, simple and friendly.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="p-6 hover:shadow-soft transition-shadow group border-border/60">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                  f.tone === "leaf" ? "bg-gradient-leaf" : "bg-gradient-warm"
                } shadow-soft group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  return (
    <section id="contact" className="py-20">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Contact</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">Let's talk green.</h2>
          <p className="mt-3 text-muted-foreground">Questions, ideas, partnerships — we'd love to hear from you.</p>
        </div>
        <Card className="p-6 md:p-8 shadow-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.name || !form.email || !form.message) {
                toast.error("Please fill in all fields");
                return;
              }
              toast.success("Thanks! We'll get back to you soon 🌱");
              setForm({ name: "", email: "", message: "" });
            }}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Your name">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Anika Verma" />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="anika@example.com" />
              </Field>
            </div>
            <Field label="Message">
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="input resize-none" placeholder="How can we help?" />
            </Field>
            <Button type="submit" className="w-full md:w-auto">
              Send message <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--color-border); background: var(--color-background); padding: 0.7rem 0.9rem; font-size: 0.9rem; outline: none; transition: border-color .15s, box-shadow .15s; }
        .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent); }
      `}</style>
    </section>
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
