import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STORIES, CHALLENGES } from "@/lib/mock-data";
import { Plus, Edit3 } from "lucide-react";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

function AdminContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Content</h1>
          <p className="text-muted-foreground mt-1">Stories and challenges shown to users.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-1" /> New</Button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-3">Awareness stories</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {STORIES.map((s) => (
            <Card key={s.id} className="p-5 shadow-card flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary">{s.tag}</span>
                <div className="mt-2 font-semibold">{s.title}</div>
                <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-muted"><Edit3 className="h-4 w-4" /></button>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-3">Challenges</h2>
        <Card className="shadow-card divide-y divide-border">
          {CHALLENGES.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{c.category}</div>
                <div className="font-medium">{c.title}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-soft text-primary">+{c.points}</span>
                <button className="p-2 rounded-lg hover:bg-muted"><Edit3 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
