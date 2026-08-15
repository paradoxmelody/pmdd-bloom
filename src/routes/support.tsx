import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support Kit — brief the people around you | Lumen" },
      {
        name: "description",
        content:
          "Generate a ready-to-send brief for a partner, friend or manager: what PMDD is, what happens in your luteal phase, what helps, and what to never say.",
      },
      { property: "og:title", content: "Support Kit — brief the people around you | Lumen" },
      {
        property: "og:description",
        content: "A script your people can actually follow, generated from your own words.",
      },
    ],
  }),
  component: SupportPage,
});

type Audience = "partner" | "friend" | "family" | "manager";

const audienceLabels: Record<Audience, string> = {
  partner: "Partner",
  friend: "Close friend",
  family: "Family member",
  manager: "Manager / colleague",
};

const needsByAudience: Record<Audience, string[]> = {
  partner: [
    "Take over meals and admin for the week without being asked",
    "Do not debate the content of what I say when I'm in it — hold the feeling, park the decision",
    "If I start a big conversation about us, say: “Let's talk about this on day 3.”",
    "Physical presence over advice. Sitting nearby counts.",
  ],
  friend: [
    "Text first, don't wait for me to reach out — I will assume you're tired of me",
    "Low-stakes invitations only, with an easy exit built in",
    "Don't take a cancelled plan personally; it isn't about you",
    "Ask “what's the smallest useful thing right now?”",
  ],
  family: [
    "No “is it that time of the month” — ever",
    "Practical help lands better than reassurance: driving, cooking, childcare",
    "Believe the calendar, not the argument in front of you",
    "Check in again after it lifts — that's when I can talk",
  ],
  manager: [
    "Where possible, keep this window free of high-stakes presentations and reviews",
    "Written briefs over surprise calls during these days",
    "I will flag capacity early rather than disappear",
    "This is a recognised cyclical medical condition, and it resolves within days",
  ],
};

const neverSay = [
  "“Everyone gets moody.”",
  "“You were fine yesterday.”",
  "“Have you tried yoga?”",
  "“You're being irrational.”",
  "“Is it that time of the month?”",
];

function SupportPage() {
  const [audience, setAudience] = useState<Audience>("partner");
  const [name, setName] = useState("");
  const [yourName, setYourName] = useState("");
  const [windowLabel, setWindowLabel] = useState("");
  const [signal, setSignal] = useState("I'll send you the word “storm”.");

  const message = useMemo(() => {
    const needs = needsByAudience[audience].map((n) => `• ${n}`).join("\n");
    return `Hi ${name || "[name]"},

I want to explain something while I'm feeling clear, so it's easier for both of us later.

I live with PMDD (Premenstrual Dysphoric Disorder). It's a recognised cyclical mood disorder — my brain is unusually sensitive to normal hormone shifts in the week or two before my period. It's not PMS and it's not a mood I'm choosing. During that window I can feel hopeless, enraged or convinced that people close to me resent me. Those thoughts feel completely true at the time, and they lift within a few days of my period starting.

My hard window is usually: ${windowLabel || "[dates]"}

What actually helps me:
${needs}

Please don't say:
${neverSay.map((n) => `• ${n}`).join("\n")}

My signal that I'm in it: ${signal || "[signal]"}

If I ever tell you I'm thinking about harming myself, take it seriously immediately — don't wait for it to pass.

Thank you for reading this. It matters more than you know.

— ${yourName || "[your name]"}`;
  }, [audience, name, windowLabel, signal, yourName]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Brief copied — paste it wherever you talk");
    } catch {
      toast.error("Couldn't copy. Select the text and copy manually.");
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Understanding my PMDD", text: message });
        return;
      } catch {
        /* user dismissed */
      }
    }
    void copy();
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="text-eyebrow">Support kit</p>
      <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
        Support only works if it's arranged early
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Fill in four fields and get a brief your person can keep on their phone. Nobody has to
        improvise mid-episode.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <section className="rounded-3xl border border-border bg-card p-6">
            <div className="grid gap-4">
              <div>
                <Label>Who is this for?</Label>
                <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(audienceLabels) as Audience[]).map((a) => (
                      <SelectItem key={a} value={a}>
                        {audienceLabels[a]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Their name</Label>
                <Input
                  id="name"
                  className="mt-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Thabo"
                />
              </div>
              <div>
                <Label htmlFor="yourName">Your name</Label>
                <Input
                  id="yourName"
                  className="mt-2"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder="Naledi"
                />
              </div>
              <div>
                <Label htmlFor="windowLabel">Your hard window</Label>
                <Input
                  id="windowLabel"
                  className="mt-2"
                  value={windowLabel}
                  onChange={(e) => setWindowLabel(e.target.value)}
                  placeholder="the 10 days before my period, usually 18–27 of the month"
                />
              </div>
              <div>
                <Label htmlFor="signal">Your agreed signal</Label>
                <Input
                  id="signal"
                  className="mt-2"
                  value={signal}
                  onChange={(e) => setSignal(e.target.value)}
                />
              </div>
            </div>
          </section>

          <Tabs defaultValue="do">
            <TabsList>
              <TabsTrigger value="do">What helps</TabsTrigger>
              <TabsTrigger value="dont">What hurts</TabsTrigger>
            </TabsList>
            <TabsContent
              value="do"
              className="mt-4 rounded-3xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground"
            >
              <ul className="space-y-3">
                {needsByAudience[audience].map((n) => (
                  <li key={n} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {n}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent
              value="dont"
              className="mt-4 rounded-3xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground"
            >
              <ul className="space-y-3">
                {neverSay.map((n) => (
                  <li key={n} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-storm" />
                    {n}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">Ready to send</h2>
              <div className="flex gap-2">
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <Copy className="size-4" /> Copy
                </button>
                <button
                  onClick={share}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
                >
                  <Share2 className="size-4" /> Share
                </button>
              </div>
            </div>
            <pre className="mt-5 max-h-[32rem] overflow-auto rounded-2xl bg-surface-2 p-5 font-sans text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {message}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
