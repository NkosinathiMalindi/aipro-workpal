import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkflow } from "@/hooks/useWorkflow";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Write clear, professional emails in seconds. Pick your tone and audience and get a ready-to-send draft.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "Tone and audience controls turn a rough idea into a polished email draft.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Friendly", "Professional", "Formal", "Persuasive", "Apologetic", "Direct", "Warm & encouraging"];
const AUDIENCES = ["Your manager", "A teammate", "The whole team", "A client", "A new prospect", "A supplier", "An executive / board", "A job applicant"];
const LENGTHS = ["Very short (2-3 sentences)", "Short (1 paragraph)", "Medium (2-3 paragraphs)", "Detailed"];

function EmailPage() {
  const { result, loading, error, submit } = useWorkflow("email");
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [tone, setTone] = useState(TONES[1]);
  const [length, setLength] = useState(LENGTHS[1]);
  const [sender, setSender] = useState("");
  const [points, setPoints] = useState("");

  return (
    <AppShell>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Tell us what you need to say. We'll handle the wording, tone and structure."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card/70">
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="purpose">What is this email about?</Label>
              <Textarea
                id="purpose"
                rows={3}
                placeholder="e.g. Ask my manager to move Friday's review to next week because of a client visit"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Who is it for?</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone of voice</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender">Sign off as (optional)</Label>
                <Input
                  id="sender"
                  placeholder="Nkosinathi, Operations Lead"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Anything that must be included? (optional)</Label>
              <Textarea
                id="points"
                rows={3}
                placeholder="Dates, numbers, names, a deadline, a link…"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={loading || purpose.trim().length < 5}
              onClick={() => void submit({ purpose, audience, tone, length, sender, points })}
            >
              <Sparkles className="size-4" />
              {loading ? "Writing your email…" : "Generate email"}
            </Button>
            {purpose.trim().length < 5 ? (
              <p className="text-xs text-muted-foreground">
                Add a sentence about the email's purpose to get started.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <ResultCard
          title="Your draft"
          result={result}
          loading={loading}
          error={error}
          emptyIcon={<Mail className="size-5" />}
          emptyTitle="No draft yet"
          emptyDescription="Fill in the form and your email will appear here, ready to copy into your inbox."
        />
      </div>
    </AppShell>
  );
}
