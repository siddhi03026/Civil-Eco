import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth-store";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/map")({
  component: AdminMap,
});

type Severity = "high" | "medium" | "low";

type MarkerData = {
  latitude: number;
  longitude: number;
  severity: Severity;
  status: "pending" | "in-progress" | "resolved";
};

function AdminMap() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues if any
    import("leaflet").then((leaflet) => {
      // Fix for default marker icons
      // @ts-ignore
      delete leaflet.Icon.Default.prototype._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setL(leaflet);
    });

    const token = getToken();
    if (!token) return;

    apiRequest<{ markers: MarkerData[] }>("/issues/map", { token })
      .then((res) => setMarkers(res.markers || []))
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load map markers"));
  }, []);

  const getIcon = (severity: Severity) => {
    if (!L) return undefined;
    const color = severity === "high" ? "#ef4444" : severity === "medium" ? "#f59e0b" : "#22c55e";
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
  };

  if (!L) {
    return <div className="h-[600px] flex items-center justify-center bg-muted rounded-2xl">Loading Map...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Issue map</h1>
        <p className="text-muted-foreground mt-1">Real-time geographic distribution (OpenStreetMap).</p>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <Legend color="bg-destructive" label="High Severity" />
        <Legend color="bg-warning" label="Medium Severity" />
        <Legend color="bg-success" label="Low Severity" />
      </div>

      <Card className="overflow-hidden shadow-card h-[600px] border-none">
        <MapContainer 
          center={[20.5937, 78.9629]} 
          zoom={5} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((m, idx) => (
            <Marker 
              key={idx} 
              position={[m.latitude, m.longitude]} 
              icon={getIcon(m.severity)}
            >
              <Popup>
                <div className="p-1">
                  <div className="font-bold border-b pb-1 mb-2 capitalize">{m.severity} Severity Issue</div>
                  <div className="text-xs space-y-1">
                    <p><strong>Status:</strong> <span className="capitalize">{m.status}</span></p>
                    <p><strong>Lat:</strong> {m.latitude.toFixed(4)}</p>
                    <p><strong>Lng:</strong> {m.longitude.toFixed(4)}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Card>
      
      <style>{`
        .leaflet-container {
          background: #f8fafc;
          border-radius: 1rem;
        }
        .custom-div-icon {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <div className="flex items-center gap-2 font-medium"><span className={`h-3 w-3 rounded-full ${color} shadow-sm`} /> {label}</div>;
}
