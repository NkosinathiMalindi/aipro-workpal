import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
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

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Get a clear briefing on any work topic: a snapshot, key insights, risks, opportunities and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content: "Structured insights and summaries on any business topic, in plain language.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick overview", "Balanced briefing", "In-depth analysis"];

function ResearchPage() {
  const { result, loading, error, submit } = useWorkflow("research");
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState(DEPTHS[1]!);
  const [audience, setAudience] = useState("");
  const [questions, setQuestions] = useState("");

  return (
    <AppShell>
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Ask about a market, tool, trend or decision and get a structured briefing you can share."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card/70">
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="topic">What do you want to understand?</Label>
              <Textarea
                id="topic"
                rows={3}
                placeholder="e.g. What should a small logistics company consider before switching to electric delivery vans?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>How deep should we go?</Label>
                <Select value={depth} onValueChange={setDepth}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DEPTHS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Who is this for? (optional)</Label>
                <Input
                  id="audience"
                  placeholder="Operations manager"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questions">Specific questions to answer (optional)</Label>
              <Textarea
                id="questions"
                rows={4}
                placeholder="What are the main costs? What usually goes wrong? What should we do first?"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={loading || topic.trim().length < 8}
              onClick={() => void submit({ topic, depth, audience, questions })}
            >
              <Sparkles className="size-4" />
              {loading ? "Researching…" : "Get insights"}
            </Button>
            {topic.trim().length < 8 ? (
              <p className="text-xs text-muted-foreground">Describe your topic to start the briefing.</p>
            ) : null}
          </CardContent>
        </Card>

        <ResultCard
          title="Your briefing"
          result={result}
          loading={loading}
          error={error}
          emptyIcon={<Search className="size-5" />}
          emptyTitle="No briefing yet"
          emptyDescription="Insights, risks, opportunities and next steps will appear here once you ask a question."
        />
      </div>
    </AppShell>
  );
}
