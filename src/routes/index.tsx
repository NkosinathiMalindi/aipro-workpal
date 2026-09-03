import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, ShieldCheck, Clock, Wand2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { AppShell, NAV } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclaimer } from "@/components/AiOutput";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workplace AI — Productivity Assistant Dashboard" },
      {
        name: "description",
        content:
          "Draft emails, summarise meetings, plan tasks and research topics with a friendly AI assistant built for non-technical professionals.",
      },
      { property: "og:title", content: "Workplace AI — Productivity Assistant Dashboard" },
      {
        property: "og:description",
        content:
          "Five AI workflows for everyday work: emails, meeting notes, task planning, research and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const HIGHLIGHTS = [
  { icon: Clock, title: "Minutes, not hours", text: "Turn messy input into polished output fast." },
  { icon: Wand2, title: "No prompt skills needed", text: "Simple forms do the prompting for you." },
  { icon: ShieldCheck, title: "You stay in control", text: "Everything is editable before you use it." },
];

function Dashboard() {
  const tools = NAV.filter((n) => n.to !== "/");

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-2xl border border-border">
        <img
          src={heroBg}
          alt=""
          aria-hidden
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5 text-primary" /> Your everyday AI co-worker
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Get the busywork off your desk
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Five guided workflows help you write, summarise, plan and research — in plain English,
            with no technical setup.
          </p>
          <Link
            to="/email"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
          >
            Start with an email <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map((h) => (
          <div key={h.title} className="rounded-xl border border-border bg-card/60 p-4">
            <h.icon className="size-5 text-accent" aria-hidden />
            <p className="mt-3 text-sm font-medium text-foreground">{h.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{h.text}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold tracking-tight text-foreground">
        Choose a workflow
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="group">
            <Card className="h-full border-border bg-card/70 transition-colors group-hover:border-primary/50">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <tool.icon className="size-5" />
                </div>
                <CardTitle className="text-base">{tool.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tool.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Open <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Disclaimer className="mt-8" />
    </AppShell>
  );
}
