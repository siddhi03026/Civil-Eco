import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getToken, useAuth } from "@/lib/auth-store";
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Globe, Bell, Mic, Palette } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const nav = useNavigate();
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [notif, setNotif] = useState<boolean>(true);
  const [voiceIn, setVoiceIn] = useState<boolean>(true);
  const [voiceOut, setVoiceOut] = useState<boolean>(true);
  const [theme, setTheme] = useState<"light" | "nature">("nature");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.settings) return;
    setLang(user.settings.language === "Hindi" ? "hi" : "en");
    setNotif(Boolean(user.settings.notifications));
    setVoiceIn(Boolean(user.settings.voiceEnabled));
    setVoiceOut(Boolean(user.settings.voiceEnabled));
  }, [user]);

  const saveSettings = async () => {
    const token = getToken();
    if (!token || !user) {
      toast.error("Please sign in first");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        settings: {
          language: lang === "hi" ? "Hindi" : "English",
          voiceEnabled: voiceIn || voiceOut,
          notifications: notif,
        },
      };

      const res = await apiRequest<{ user: typeof user }>("/user/update", {
        method: "PUT",
        token,
        body: payload,
      });

      setUser(res.user, token);
      toast.success("Settings updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Personalize your EcoSetu experience.</p>
      </div>

      <Card className="p-6 shadow-card divide-y divide-border">
        <Row icon={Globe} title="Language" desc="Choose your preferred language">
          <div className="flex gap-2">
            <Pill on={lang === "en"} onClick={() => setLang("en")}>English</Pill>
            <Pill on={lang === "hi"} onClick={() => setLang("hi")}>हिंदी</Pill>
          </div>
        </Row>
        <Row icon={Bell} title="Notifications" desc="Get reminders and admin replies">
          <Switch checked={notif} onCheckedChange={setNotif} />
        </Row>
        <Row icon={Mic} title="Voice input" desc="Use microphone to type">
          <Switch checked={voiceIn} onCheckedChange={setVoiceIn} />
        </Row>
        <Row icon={Mic} title="Voice output" desc="Let assistant speak replies">
          <Switch checked={voiceOut} onCheckedChange={setVoiceOut} />
        </Row>
        <Row icon={Palette} title="Theme" desc="Choose your visual mode">
          <div className="flex gap-2">
            <Pill on={theme === "light"} onClick={() => setTheme("light")}>Light</Pill>
            <Pill on={theme === "nature"} onClick={() => setTheme("nature")}>Nature</Pill>
          </div>
        </Row>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving}>{saving ? "Saving..." : "Save settings"}</Button>
      </div>

      <Card className="p-6 shadow-card flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Sign out</h3>
          <p className="text-sm text-muted-foreground">You can come back anytime.</p>
        </div>
        <Button variant="outline" onClick={() => { logout(); toast.success("Signed out"); nav({ to: "/" }); }}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </Card>
    </div>
  );
}

function Row({ icon: Icon, title, desc, children }: { icon: any; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center"><Icon className="h-4 w-4 text-primary" /></div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
      on ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
    }`}>{children}</button>
  );
}
