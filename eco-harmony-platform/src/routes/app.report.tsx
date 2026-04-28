import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ISSUE_TYPES } from "@/lib/mock-data";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth-store";
import { Mic, MapPin, Send, Upload, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const Route = createFileRoute("/app/report")({
  component: ReportPage,
});

function ReportPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const [type, setType] = useState(ISSUE_TYPES[0]);
  const [location, setLocation] = useState("");
  const [pin, setPin] = useState({ lat: 12.9716, lng: 77.5946 });
  const [L, setL] = useState<any>(null);
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [submitted, setSubmitted] = useState(false);
  const [issueId, setIssueId] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<{ from: "admin" | "user"; text: string }[]>([
    { from: "admin", text: "Thanks for the report! A team is being assigned." },
  ]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      // @ts-ignore
      delete leaflet.Icon.Default.prototype._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setL(leaflet);
    });
  }, []);

  const onUpload = (f: File | null) => {
    if (!f) return;
    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImage(url);
  };

  const startVoice = () => {
    const SR = (typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) || null;
    if (!SR) { alert("Voice not supported in this browser."); return; }
    const rec = new SR(); rec.lang = "en-US";
    rec.onresult = (e: any) => setDesc((d) => (d ? d + " " : "") + e.results[0][0].transcript);
    rec.start();
  };

  const detect = () => {
    if (!navigator.geolocation) { setLocation("MG Road, Bengaluru"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setLocation(`Lat ${p.coords.latitude.toFixed(3)}, Lng ${p.coords.longitude.toFixed(3)}`),
      () => setLocation("MG Road, Bengaluru")
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc) { toast.error("Please describe the issue"); return; }
    const token = getToken();
    if (!token) {
      toast.error("Please sign in first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("description", desc);
      formData.append("issueType", type);
      formData.append("severity", severity);
      formData.append("latitude", String(pin.lat));
      formData.append("longitude", String(pin.lng));
      if (imageFile) formData.append("image", imageFile);

      const data = await apiRequest<{ issue: { _id: string; responses?: Array<{ sender: "admin" | "user"; text: string }> } }>("/issues", {
        method: "POST",
        token,
        body: formData,
      });

      setIssueId(data.issue._id);
      setResponses(
        data.issue.responses?.map((m) => ({ from: m.sender, text: m.text })) || [
          { from: "admin", text: "Thanks for the report! A team is being assigned." },
        ]
      );
      setSubmitted(true);
      toast.success("Report sent to admin! 🌱");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <Card className="p-8 shadow-card text-center">
          <div className="h-16 w-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold">Report submitted!</h1>
          <p className="mt-2 text-muted-foreground">Issue ID: <code className="bg-muted px-2 py-0.5 rounded">{issueId}</code> — Track admin responses below.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSubmitted(false); setDesc(""); setImage(null); setImageFile(null); setLocation(""); setReply(""); setResponses([{ from: "admin", text: "Thanks for the report! A team is being assigned." }]); }}>Report another</Button>
        </Card>

        <Card className="p-6 shadow-card">
          <h2 className="font-semibold text-lg mb-4">Conversation with admin</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {responses.map((r, i) => (
              <div key={i} className={`flex ${r.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                  r.from === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary rounded-bl-sm"
                }`}>{r.text}</div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!reply.trim()) return;
              const token = getToken();
              if (!token || !issueId) return;

              const userText = reply;
              setResponses((rs) => [...rs, { from: "user", text: userText }]);
              setReply("");

              apiRequest<{ responses: Array<{ sender: "admin" | "user"; text: string }> }>(`/issues/${issueId}/respond`, {
                method: "POST",
                token,
                body: { text: userText, voice: false },
              })
                .then((data) => {
                  setResponses(data.responses.map((m) => ({ from: m.sender, text: m.text })));
                })
                .catch(() => {
                  setResponses((rs) => [...rs, { from: "admin", text: "Got it — we'll update you shortly." }]);
                });
            }}
            className="mt-4 flex gap-2"
          >
            <button type="button" onClick={() => {
              const SR = ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
              if (!SR) return;
              const rec = new SR(); rec.lang = "en-US";
              rec.onresult = (e: any) => setReply(e.results[0][0].transcript);
              rec.start();
            }} className="p-2.5 rounded-xl bg-secondary hover:bg-muted">
              <Mic className="h-4 w-4" />
            </button>
            <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a reply…" className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <Button type="submit"><Send className="h-4 w-4" /></Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Report an Issue</h1>
        <p className="text-muted-foreground mt-1">Help us keep your community clean.</p>
      </div>
      <Card className="p-6 md:p-8 shadow-card">
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Photo</label>
            <div className="mt-2 relative aspect-video rounded-2xl border-2 border-dashed border-border bg-secondary/40 overflow-hidden">
              {image ? (
                <img src={image} alt="upload" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Upload className="h-8 w-8 mb-2" />
                  <p className="text-sm">Click to upload an image</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Describe the issue</label>
            <div className="mt-2 relative">
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="What's the problem? Where exactly?" className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button type="button" onClick={startVoice} className="absolute bottom-3 right-3 p-2 rounded-lg bg-secondary hover:bg-muted" aria-label="Voice typing">
                <Mic className="h-4 w-4 text-primary" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Issue type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                {ISSUE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Severity</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value as "low" | "medium" | "high")} className="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
              <div className="mt-2 flex gap-2">
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Pin or type address" className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                <Button type="button" variant="outline" onClick={detect}><MapPin className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          <MapPicker
            pin={pin}
            L={L}
            onChange={(coords) => {
              setPin(coords);
              setLocation(`Lat ${coords.lat.toFixed(4)}, Lng ${coords.lng.toFixed(4)}`);
            }}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" className="shadow-glow" disabled={loading}>
              <Send className="h-4 w-4 mr-2" /> Submit report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function MapPicker({
  pin,
  L,
  onChange,
}: {
  pin: { lat: number; lng: number };
  L: any;
  onChange: (coords: { lat: number; lng: number }) => void;
}) {
  const getPinIcon = () => {
    if (!L) return undefined;
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.35);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  if (!L) {
    return (
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pin on map</label>
        <div className="mt-2 h-[320px] rounded-2xl bg-secondary/40 border border-border flex items-center justify-center text-sm text-muted-foreground">
          Loading map...
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pin on map</label>
      <div className="mt-2 h-[320px] rounded-2xl overflow-hidden border border-border">
        <MapContainer
          center={[pin.lat, pin.lng]}
          zoom={6}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onChange={onChange} />
          <Marker position={[pin.lat, pin.lng]} icon={getPinIcon()} />
        </MapContainer>
      </div>
    </div>
  );
}

function MapClickHandler({ onChange }: { onChange: (coords: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      const next = { lat: e.latlng.lat, lng: e.latlng.lng };
      onChange(next);
    },
  });
  return null;
}
