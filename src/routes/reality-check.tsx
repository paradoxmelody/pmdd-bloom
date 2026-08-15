import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { Loader2, Send, Wind } from "lucide-react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { runRealityCheck } from "@/lib/reality-check.functions";

export const Route = createFileRoute("/reality-check")({
  head: () => ({
    meta: [
      { title: "Reality Checker — is this me or the luteal phase? | Lumen" },
      {
        name: "description",
        content:
          "Send the thought that is eating you. Lumen's AI reality checker separates the feeling from the distorted conclusion and gives you one small next action.",
      },
      { property: "og:title", content: "Reality Checker — Lumen" },
      {
        property: "og:description",
        content: "Separate the feeling from the conclusion, and postpone the decision.",
      },
    ],
  }),
  component: RealityCheckPage,
});

const phases = [
  { value: "unsure", label: "Not sure" },
  { value: "luteal", label: "Luteal (the hard stretch)" },
  { value: "menstrual", label: "Bleeding" },
  { value: "follicular", label: "Follicular (post-period)" },
  { value: "ovulation", label: "Around ovulation" },
] as const;

function RealityCheckPage() {
  const [thought, setThought] = useState("");
  const [facts, setFacts] = useState("");
  const [phase, setPhase] = useState<(typeof phases)[number]["value"]>("luteal");
  const [intensity, setIntensity] = useState(7);

  const check = useServerFn(runRealityCheck);
  const mutation = useMutation({
    mutationFn: () =>
      check({
        data: { thought, facts: facts || undefined, cyclePhase: phase, intensity },
      }),
    onError: (e: Error) => toast.error(e.message || "Something went wrong."),
  });

  const sections = mutation.data ? splitSections(mutation.data.text) : [];

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="text-eyebrow">Reality checker</p>
      <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
        Is this me, or is this the phase?
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        PMDD doesn't only change your mood — it changes what you believe about yourself. Write the
        thought down exactly as it sounds in your head.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (thought.trim().length < 3) {
              toast.error("Write the thought first, even roughly.");
              return;
            }
            mutation.mutate();
          }}
          className="space-y-5"
        >
          <section className="rounded-3xl border border-border bg-card p-6">
            <Label htmlFor="thought" className="font-display text-base">
              The thought
            </Label>
            <Textarea
              id="thought"
              rows={5}
              className="mt-3"
              placeholder="Everyone in my life is quietly tired of me and I should stop reaching out."
              value={thought}
              onChange={(e) => setThought(e.target.value)}
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Where in your cycle?</Label>
                <Select value={phase} onValueChange={(v) => setPhase(v as typeof phase)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Intensity: {intensity}/10</Label>
                <Slider
                  className="mt-4"
                  min={1}
                  max={10}
                  step={1}
                  value={[intensity]}
                  onValueChange={([v]) => setIntensity(v)}
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="facts">Any facts you can hold onto (optional)</Label>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Evidence, not feelings: “she invited me on Sunday”, “my review was good in March”.
              </p>
              <Textarea
                id="facts"
                rows={3}
                className="mt-3"
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Thinking with you…
                </>
              ) : (
                <>
                  <Send className="size-4" /> Reality check this
                </>
              )}
            </button>
          </section>
        </form>

        <div className="space-y-5">
          {mutation.isPending && <Breathe />}

          {!mutation.isPending && !mutation.data && (
            <div className="rounded-3xl border border-border bg-calm-panel p-6">
              <h2 className="font-display text-lg font-semibold">What comes back</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>What I hear — the feeling, taken seriously.</li>
                <li>What is likely distorted — named, with your own words quoted.</li>
                <li>What is probably true — anchored to your evidence.</li>
                <li>One thing to do in the next 10 minutes.</li>
                <li>A decision to postpone until you're through it.</li>
              </ul>
              <p className="mt-5 text-xs text-muted-foreground">
                Not a therapist, not a diagnosis. A mirror that isn't warped.
              </p>
            </div>
          )}

          {sections.map((s, i) => (
            <motion.div
              key={s.heading + i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-3xl border border-border bg-card p-6"
            >
              <p className="text-eyebrow">{s.heading}</p>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Breathe() {
  return (
    <div className="grid place-items-center rounded-3xl border border-border bg-calm-panel p-12">
      <div className="relative grid size-40 place-items-center">
        <span className="absolute inset-0 animate-breathe rounded-full bg-primary/25 blur-xl" />
        <span className="absolute inset-6 animate-breathe rounded-full bg-primary/40" />
        <Wind className="relative size-6 text-primary-foreground" />
      </div>
      <p className="mt-6 text-sm text-muted-foreground">Breathe in as it grows, out as it falls.</p>
    </div>
  );
}

const HEADINGS = [
  "WHAT I HEAR",
  "WHAT IS LIKELY DISTORTED",
  "WHAT IS PROBABLY TRUE",
  "ONE THING TO DO IN THE NEXT 10 MINUTES",
  "A DECISION TO POSTPONE",
];

function splitSections(text: string) {
  const found: { heading: string; body: string }[] = [];
  const indices = HEADINGS.map((h) => ({ h, i: text.toUpperCase().indexOf(h) })).filter(
    (x) => x.i >= 0,
  );
  if (indices.length === 0) return [{ heading: "Reality check", body: text }];
  indices.sort((a, b) => a.i - b.i);
  indices.forEach((cur, idx) => {
    const end = idx + 1 < indices.length ? indices[idx + 1].i : text.length;
    const body = text
      .slice(cur.i + cur.h.length, end)
      .replace(/^[\s:]+/, "")
      .trim();
    found.push({ heading: cur.h.toLowerCase(), body });
  });
  return found;
}
