import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Search,
  MessagesSquare,
  Menu,
  Sparkles,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, blurb: "Your workspace overview" },
  { to: "/email", label: "Email Generator", icon: Mail, blurb: "Draft the right message" },
  { to: "/notes", label: "Meeting Notes", icon: NotebookPen, blurb: "Summaries & action items" },
  { to: "/tasks", label: "Task Planner", icon: ListChecks, blurb: "Prioritise and schedule" },
  { to: "/research", label: "Research Assistant", icon: Search, blurb: "Insights on any topic" },
  { to: "/chat", label: "AI Chatbot", icon: MessagesSquare, blurb: "Ask anything, anytime" },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div
        className="grid size-9 place-items-center rounded-xl text-primary-foreground"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <Sparkles className="size-5" aria-hidden />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-foreground">Workplace AI</p>
        <p className="text-xs text-muted-foreground">Productivity Assistant</p>
      </div>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          activeProps={{
            className: "bg-sidebar-accent text-foreground font-medium",
          }}
        >
          <item.icon className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <div className="py-3">
          <Brand />
        </div>
        <div className="mt-4 flex-1">
          <NavLinks />
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-3 text-xs text-muted-foreground">
          Built for people, not prompt experts. Every result is editable before you send it.
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-4">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="py-2">
              <Brand />
            </div>
            <div className="mt-6">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <Brand />
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
