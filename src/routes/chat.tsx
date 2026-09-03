import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessagesSquare, Send, Sparkles, AlertCircle } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Disclaimer, Markdown } from "@/components/AiOutput";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with a friendly workplace assistant about emails, plans, tricky conversations and everyday work questions.",
      },
      { property: "og:title", content: "AI Chatbot — Workplace AI" },
      {
        property: "og:description",
        content: "A conversational assistant for everyday work questions, in plain English.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "How do I politely chase an overdue invoice?",
  "Help me prepare for a difficult performance conversation",
  "Turn these bullet points into a status update",
  "What should I include in a project kickoff agenda?",
];

function ChatPage() {
  const send = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(
        e instanceof Error && e.message ? e.message : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        icon={MessagesSquare}
        title="AI Chatbot"
        description="Ask anything about your work day — writing, planning, prep or advice."
      />

      <Card className="border-border bg-card/70">
        <CardContent className="flex h-[62vh] min-h-[420px] flex-col gap-4 pt-6">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.length === 0 && !loading ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">
                  Hi! What are you working on?
                </p>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  Start typing below, or try one of these:
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void ask(s)}
                      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:border-primary/50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[92%] rounded-2xl rounded-bl-sm border border-border bg-muted/50 px-4 py-3"
                  }
                >
                  {m.role === "user" ? m.content : <Markdown>{m.content}</Markdown>}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start" aria-live="polite">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-border bg-muted/50 px-4 py-3">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="size-2 animate-bounce rounded-full bg-primary"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground">Thinking…</span>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <span className="text-muted-foreground">{error}</span>
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <Textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void ask(input);
                  }
                }}
                placeholder="Type your question… (Enter to send, Shift+Enter for a new line)"
                className="resize-none"
                aria-label="Message"
              />
              <Button
                size="icon"
                className="size-10 shrink-0"
                disabled={loading || !input.trim()}
                onClick={() => void ask(input)}
                aria-label="Send message"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <Disclaimer />
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
