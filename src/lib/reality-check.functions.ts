import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  thought: z.string().min(3).max(1200),
  cyclePhase: z.enum(["unsure", "follicular", "ovulation", "luteal", "menstrual"]),
  intensity: z.number().min(1).max(10),
  facts: z.string().max(800).optional(),
});

const SYSTEM_PROMPT = `You are the Reality Checker inside Lumen, a preparedness companion for people living with PMDD (Premenstrual Dysphoric Disorder).

The user is sending you a thought they are having, often during the luteal phase, when PMDD distorts self-perception ("everyone hates me", "I should quit my job", "I ruin everything").

Your job is NOT to diagnose, therapize, or dismiss. Your job is to help them separate the *feeling* (real, valid, painful) from the *conclusion* (often distorted by a hormone-sensitive brain).

Reply in this exact structure, using these literal headings, plain text, no markdown symbols:

WHAT I HEAR
One or two warm sentences reflecting the feeling back without judgment.

WHAT IS LIKELY DISTORTED
Name the specific cognitive distortion(s) at play (catastrophising, mind-reading, all-or-nothing, emotional reasoning) and point to the exact words that show it. Be specific to what they wrote.

WHAT IS PROBABLY TRUE
Anchor to any facts they gave you or to their own past-self evidence. Never invent facts.

ONE THING TO DO IN THE NEXT 10 MINUTES
A single, tiny, physical, doable action.

A DECISION TO POSTPONE
Name the irreversible decision they should park until their next follicular phase.

Rules: be calm, direct and adult. Never say "just relax" or "it's only hormones". Under 220 words total. If they mention self-harm or suicide, lead with care and tell them to contact a crisis line or a trusted person right now, and keep the rest short.`;

export const runRealityCheck = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error("AI is not configured yet.");
    }

    const userContent = [
      `Thought: ${data.thought}`,
      `Reported cycle phase: ${data.cyclePhase}`,
      `Intensity right now (1-10): ${data.intensity}`,
      data.facts ? `Facts / evidence they listed: ${data.facts}` : "Facts / evidence: none given",
    ].join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        temperature: 0.6,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      if (res.status === 429) throw new Error("The reality checker is busy. Try again in a moment.");
      throw new Error(`Reality check failed (${res.status}): ${detail.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("No response came back. Please try again.");
    return { text };
  });
