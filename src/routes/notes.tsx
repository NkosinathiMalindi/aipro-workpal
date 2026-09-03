import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NotebookPen, Sparkles } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkflow } from "@/hooks/useWorkflow";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Paste rough meeting notes and get key points, decisions, owners, deadlines and action items in seconds.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI" },
      {
        property: "og:description",
        content: "Turn messy notes into a clean summary with action items and deadlines.",
      },
    ],
  }),
  component: NotesPage,
});

const SAMPLE = `Weekly ops sync. Thabo said the supplier delivery slipped again, new ETA 14 March.
Lerato will call the supplier tomorrow and confirm penalties.
We agreed to pause the new packaging rollout until stock is stable.
Budget review must be sent to finance by end of next Friday - Nkosinathi owns it.
Open question: do we still run the March promo if stock is short?`;

function NotesPage() {
  const { result, loading, error, submit } = useWorkflow("notes");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <AppShell>
      <PageHeader
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Paste whatever you scribbled down. You'll get key points, decisions, owners and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card/70">
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting title (optional)</Label>
                <Input id="title" placeholder="Weekly ops sync" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date (optional)</Label>
                <Input id="date" placeholder="3 September" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">Who was there? (optional)</Label>
              <Input
                id="attendees"
                placeholder="Thabo, Lerato, Nkosinathi"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notes">Your notes or transcript</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setNotes(SAMPLE)}
                >
                  Use an example
                </button>
              </div>
              <Textarea
                id="notes"
                rows={12}
                placeholder="Paste your raw notes here — bullet points, half sentences and typos are all fine."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={loading || notes.trim().length < 20}
              onClick={() => void submit({ title, date, attendees, notes })}
            >
              <Sparkles className="size-4" />
              {loading ? "Reading your notes…" : "Summarise meeting"}
            </Button>
            {notes.trim().length < 20 ? (
              <p className="text-xs text-muted-foreground">Paste at least a few lines of notes to continue.</p>
            ) : null}
          </CardContent>
        </Card>

        <ResultCard
          title="Meeting summary"
          result={result}
          loading={loading}
          error={error}
          emptyIcon={<NotebookPen className="size-5" />}
          emptyTitle="No summary yet"
          emptyDescription="Your key points, decisions, action items and deadlines will appear here."
        />
      </div>
    </AppShell>
  );
}
