import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Info } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export const AI_DISCLAIMER = "AI-generated content may require human review";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground ${className}`}
    >
      <Info className="size-3.5 shrink-0" aria-hidden />
      {AI_DISCLAIMER}
    </p>
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h2 className="text-lg font-semibold text-foreground" {...p} />,
          h2: (p) => (
            <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground" {...p} />
          ),
          h3: (p) => <h4 className="mt-4 text-sm font-semibold text-foreground" {...p} />,
          p: (p) => <p className="leading-relaxed" {...p} />,
          ul: (p) => <ul className="list-disc space-y-1.5 pl-5 marker:text-primary" {...p} />,
          ol: (p) => <ol className="list-decimal space-y-1.5 pl-5 marker:text-primary" {...p} />,
          strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
          a: (p) => <a className="text-primary underline underline-offset-2" {...p} />,
          code: (p) => <code className="rounded bg-muted px-1.5 py-0.5 text-xs" {...p} />,
          blockquote: (p) => (
            <blockquote className="border-l-2 border-primary/60 pl-3 text-muted-foreground" {...p} />
          ),
          table: (p) => (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs" {...p} />
            </div>
          ),
          th: (p) => (
            <th className="border-b border-border bg-muted/50 px-3 py-2 font-semibold" {...p} />
          ),
          td: (p) => <td className="border-b border-border/60 px-3 py-2 align-top" {...p} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function OutputSkeleton() {
  return (
    <div className="space-y-3" aria-live="polite" aria-busy="true">
      <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-3 w-full animate-pulse rounded bg-muted/70" />
      <div className="h-3 w-11/12 animate-pulse rounded bg-muted/70" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-muted/70" />
      <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
      <div className="h-3 w-full animate-pulse rounded bg-muted/70" />
      <div className="h-3 w-3/4 animate-pulse rounded bg-muted/70" />
      <p className="pt-1 text-xs text-muted-foreground">Your assistant is thinking…</p>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <div className="mb-3 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
