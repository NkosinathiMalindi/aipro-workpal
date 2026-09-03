import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runWorkflow } from "@/lib/ai.functions";

type Workflow = "email" | "notes" | "tasks" | "research";

export function useWorkflow(workflow: Workflow) {
  const run = useServerFn(runWorkflow);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(fields: Record<string, string>) {
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { workflow, fields } });
      setResult(res.text);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "Something went wrong. Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
  }

  return { result, loading, error, submit, reset };
}
