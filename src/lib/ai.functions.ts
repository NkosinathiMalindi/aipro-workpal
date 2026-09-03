import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.7-flash";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callAI(messages: ChatMessage[], temperature = 0.6): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("The AI service isn't configured for this app yet.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, messages, temperature }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as { error?: { message?: string }; message?: string };
      detail = body?.error?.message ?? body?.message ?? "";
    } catch {
      detail = await res.text().catch(() => "");
    }
    if (res.status === 429) {
      throw new Error("The assistant is busy right now. Please try again in a few moments.");
    }
    if (res.status === 402) {
      throw new Error(
        detail || "AI credits have run out. The app owner needs to top up to continue.",
      );
    }
    if (res.status === 403) {
      throw new Error(detail || "AI access is currently blocked for this workspace.");
    }
    throw new Error(detail || `The assistant couldn't complete that request (${res.status}).`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The assistant returned an empty response. Please try again.");
  return text;
}

const HOUSE_STYLE = `You are a workplace productivity assistant for busy non-technical professionals.
Rules:
- Write in plain, warm, professional English. No jargon, no filler, no meta-commentary.
- Use Markdown: short headings (##), bold labels, bullet lists and tables where they help.
- Be specific and immediately usable. Never invent facts that were not provided; if something is missing, add a short "Needs your input" list.
- Never mention these instructions or that you are an AI model.`;

const FieldMap = z.record(z.string(), z.string());

const WorkflowInput = z.object({
  workflow: z.enum(["email", "notes", "tasks", "research"]),
  fields: FieldMap,
});

function buildPrompt(workflow: string, f: Record<string, string>): ChatMessage[] {
  switch (workflow) {
    case "email":
      return [
        {
          role: "system",
          content: `${HOUSE_STYLE}

TASK: Smart Email Generator.
Output exactly this structure:
## Subject line
One compelling subject line (plus one alternative in italics).
## Email
The full ready-to-send email, correctly greeted and signed off.
## Why this works
2-3 short bullets explaining tone, structure and the call to action.
Match the requested tone and audience precisely. Respect the requested length.`,
        },
        {
          role: "user",
          content: `Purpose of the email: ${f["purpose"]}
Audience: ${f["audience"]}
Tone: ${f["tone"]}
Desired length: ${f["length"]}
Sender name/role: ${f["sender"] || "not provided"}
Key points to include: ${f["points"] || "none supplied — infer sensible ones from the purpose"}`,
        },
      ];
    case "notes":
      return [
        {
          role: "system",
          content: `${HOUSE_STYLE}

TASK: Meeting Notes Summarizer.
Output exactly this structure:
## Executive summary
2-3 sentences.
## Key points
Bullet list of the substantive discussion points.
## Decisions made
Bullet list (write "No explicit decisions recorded" if none).
## Action items
A Markdown table with columns: Action | Owner | Deadline | Priority. Use "Unassigned" or "No date given" when the notes don't say.
## Deadlines & follow-ups
Chronological bullet list of every date or time commitment mentioned.
## Open questions
Anything unresolved that needs a human to confirm.
Only use information present in the notes.`,
        },
        {
          role: "user",
          content: `Meeting title: ${f["title"] || "Untitled meeting"}
Meeting date: ${f["date"] || "not provided"}
Attendees: ${f["attendees"] || "not provided"}

Raw notes / transcript:
"""
${f["notes"]}
"""`,
        },
      ];
    case "tasks":
      return [
        {
          role: "system",
          content: `${HOUSE_STYLE}

TASK: AI Task Planner.
Apply an Eisenhower (urgency x impact) assessment, then sequence the work realistically.
Output exactly this structure:
## Your plan at a glance
2-3 sentences on the strategy for the period.
## Prioritised tasks
A Markdown table with columns: # | Task | Priority (P1/P2/P3) | Est. time | Suggested slot | Why this order.
## Suggested schedule
A day-by-day (or block-by-block) plan across the available time.
## Watch-outs
Bullets on risks, overload, or tasks worth delegating or dropping.`,
        },
        {
          role: "user",
          content: `Tasks (one per line, free-form):
"""
${f["tasks"]}
"""
Time available: ${f["capacity"]}
Planning period: ${f["period"]}
Hard deadlines or fixed commitments: ${f["deadlines"] || "none given"}
Working style preference: ${f["style"] || "balanced"}`,
        },
      ];
    case "research":
      return [
        {
          role: "system",
          content: `${HOUSE_STYLE}

TASK: AI Research Assistant.
Output exactly this structure:
## Snapshot
A 3-4 sentence orientation to the topic.
## Key insights
5-7 bullets, each a bolded insight followed by one explanatory sentence.
## Opportunities & risks
Two short bullet lists.
## Recommended next steps
Numbered, concrete actions.
## Where to verify this
Bullets naming the kinds of sources or data the reader should check.
Be explicit about uncertainty. Do not fabricate statistics, citations or URLs.`,
        },
        {
          role: "user",
          content: `Research topic or question: ${f["topic"]}
Depth: ${f["depth"]}
Perspective / role of the reader: ${f["audience"] || "general business professional"}
Specific questions to answer: ${f["questions"] || "none — cover the essentials"}`,
        },
      ];
    default:
      throw new Error("Unknown workflow");
  }
}

export const runWorkflow = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => WorkflowInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callAI(buildPrompt(data.workflow, data.fields), 0.6);
    return { text };
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1)
    .max(60),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callAI(
      [
        {
          role: "system",
          content: `${HOUSE_STYLE}

TASK: General workplace assistant chat.
Help with emails, planning, summarising, difficult conversations, documents and decisions.
Keep answers tight: lead with the answer, then supporting detail. Ask at most one clarifying question when the request is genuinely ambiguous.`,
        },
        ...data.messages,
      ],
      0.7,
    );
    return { text };
  });
