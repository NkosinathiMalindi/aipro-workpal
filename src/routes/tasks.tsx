import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Sparkles } from "lucide-react";
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

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content:
          "Drop in your to-do list and get a prioritised, realistically scheduled plan with time estimates.",
      },
      { property: "og:title", content: "AI Task Planner — Workplace AI" },
      {
        property: "og:description",
        content: "Prioritisation and scheduling for a messy to-do list, in seconds.",
      },
    ],
  }),
  component: TasksPage,
});

const PERIODS = ["Today", "Tomorrow", "This week", "Next two weeks", "This month"];
const CAPACITY = ["About 2 focused hours", "Half a day", "A full working day", "Around 20 hours", "Around 35 hours"];
const STYLES = ["Balanced", "Knock out quick wins first", "Deep focus on big items first", "Protect meeting-free mornings"];

function TasksPage() {
  const { result, loading, error, submit } = useWorkflow("tasks");
  const [tasks, setTasks] = useState("");
  const [period, setPeriod] = useState(PERIODS[2]);
  const [capacity, setCapacity] = useState(CAPACITY[4]);
  const [deadlines, setDeadlines] = useState("");
  const [style, setStyle] = useState(STYLES[0]);

  return (
    <AppShell>
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="List everything on your plate. We'll rank it by urgency and impact, then build a schedule."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card/70">
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="tasks">Your tasks (one per line)</Label>
              <Textarea
                id="tasks"
                rows={10}
                placeholder={"Finish Q3 budget draft\nCall the supplier about the delay\nPrepare Monday team update\nBook venue for the offsite"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Planning period</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERIODS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time you actually have</Label>
                <Select value={capacity} onValueChange={setCapacity}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CAPACITY.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>How do you like to work?</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STYLES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadlines">Fixed deadlines or meetings (optional)</Label>
              <Input
                id="deadlines"
                placeholder="Board pack due Thursday 12:00; standup daily 09:00"
                value={deadlines}
                onChange={(e) => setDeadlines(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={loading || tasks.trim().length < 8}
              onClick={() => void submit({ tasks, period, capacity, deadlines, style })}
            >
              <Sparkles className="size-4" />
              {loading ? "Building your plan…" : "Prioritise & schedule"}
            </Button>
            {tasks.trim().length < 8 ? (
              <p className="text-xs text-muted-foreground">Add at least one task to build a plan.</p>
            ) : null}
          </CardContent>
        </Card>

        <ResultCard
          title="Your plan"
          result={result}
          loading={loading}
          error={error}
          emptyIcon={<ListChecks className="size-5" />}
          emptyTitle="No plan yet"
          emptyDescription="Your prioritised task table and day-by-day schedule will show up here."
        />
      </div>
    </AppShell>
  );
}
