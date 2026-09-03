import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton, Disclaimer, EmptyState, Markdown, OutputSkeleton } from "@/components/AiOutput";

export function ResultCard({
  title,
  result,
  loading,
  error,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  result: string | null;
  loading: boolean;
  error: string | null;
  emptyIcon: ReactNode;
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <Card className="border-border bg-card/70">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        {result && !loading ? <CopyButton text={result} /> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? <OutputSkeleton /> : null}

        {!loading && error ? (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium">We couldn't finish that</p>
              <p className="mt-1 text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : null}

        {!loading && !error && !result ? (
          <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
        ) : null}

        {!loading && result ? (
          <>
            <Markdown>{result}</Markdown>
            <Disclaimer />
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
