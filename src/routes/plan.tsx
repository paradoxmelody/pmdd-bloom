import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, Download, RotateCcw, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Luteal Prep Plan — Lumen" },
      {
        name: "description",
        content:
          "Build a PMDD preparedness protocol while you are clear-headed: what to cancel, what to postpone, who to call, and what your future self needs to hear.",
      },
      { property: "og:title", content: "Luteal Prep Plan — Lumen" },
      {
        property: "og:description",
        content: "Rehearse the hard week before it arrives, and save it to your device.",
      },
    ],
  }),
  component: PlanPage;
});

type PlanState = {
  cycleStart: string;
  cycleLength: number;
  earlySigns: string;
  cancel: string;
  protect: string;
  postpone: string;
  allies: string;
  crisis: string;
  letter: string;
  checks: Record<string, boolean>;
};

const EMPTY: PlanState = {
  cycleStart: "",
  cycleLength: 28,
  earlySigns: "",
  cancel: "",
  protect: "",
  postpone: "",
  allies: "",
  crisis: "",
  letter: "",
  checks: {},
};

const STORAGE_KEY = "lumen.prep-plan.v1";

const readySteps = [
  "Freezer has 3 low-effort meals",
  "Alcohol out of the house",
  "Sleep window protected (same time, 7 nights)",
  "One ally has the dates",
  "No irreversible decisions scheduled",
  "Meds / supplements refilled",
  "Support Kit sent to my person",
];

const fields = [
  {
    key: "earlySigns" as const,
    label: "My earliest warning signs",
    hint: "The first two or three things that show up before the mood does — jaw tension, doom-scrolling, sudden certainty that a friend is annoyed with me.",
  },
  {
    key: "cancel" as const,
    label: "What I give myself permission to cancel",
    hint: "Name it now so future-you does not have to negotiate.",
  },
  {
    key: "protect" as const,
    label: "What must stay in place no matter what",
    hint: "Sleep, meds, food, one walk, one shower.",
  },
  {
    key: "postpone" as const,
    label: "Decisions I am not allowed to make this week",
    hint: "Quitting, breaking up, sending the message, deleting the account.",
  },
  {
    key: "allies" as const,
    label: "Who I call, and for what",
    hint: "Name + what they are good at. One person for practical help, one for just sitting with it.",
  },
  {
    key: "crisis" as const,
    label: "Crisis contacts",
    hint: "Clinician, crisis line, and the person who can physically come over.",
  },
  {
    key: "letter" as const,
    label: "Letter to myself on day 24",
    hint: "Written by the version of you that can think clearly. This is the part people say saves them.",
    big: true,
  },
];

function PlanPage() {
  const [plan, setPlan] = useState<PlanState>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPlan({ ...EMPTY, ...(JSON.parse(raw) as PlanState) });
    } catch {
      /* ignore corrupt state */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }, [plan, loaded]);

  const window = useMemo(() => {
    if (!plan.cycleStart) return null;
    const start = new Date(plan.cycleStart);
    if (Number.isNaN(start.getTime())) return null;
    const len = Math.min(Math.max(plan.cycleLength || 28, 20), 45);
    const from = new Date(start);
    from.setDate(from.getDate() + len - 14);
    const to = new Date(start);
    to.setDate(to.getDate() + len - 1);
    const today = new Date();
    const daysToStorm = Math.ceil((from.getTime() - today.getTime()) / 86_400_000);
    const fmt = (d: Date) => d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
    return { label: `${fmt(from)} – ${fmt(to)}`, daysToStorm };
  }, [plan.cycleStart, plan.cycleLength]);

  const done = readySteps.filter((s) => plan.checks[s]).length;
  const readiness = Math.round((done / readySteps.length) * 100);

  const download = () => {
    const body = [
      "LUMEN — LUTEAL PREP PLAN",
      window ? `Predicted hard window: ${window.label}` : "",
      "",
      ...fields.map((f) => `${f.label.toUpperCase()}\n${plan[f.key] || "—"}\n`),
      "READINESS CHECKLIST",
      ...readySteps.map((s) => `${plan.checks[s] ? "[x]" : "[ ]"} ${s}`),
    ]
      .filter(Boolean)
      .join("\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "lumen-prep-plan.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Plan downloaded");
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="text-eyebrow">Prep plan</p>
      <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
        Write it while you're well
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        This plan is written by clear-headed you, for luteal you. It saves automatically to this
        device only — no account, no server.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Your window</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="cycleStart">First day of last period</Label>
                <Input
                  id="cycleStart"
                  type="date"
                  className="mt-2"
                  value={plan.cycleStart}
                  onChange={(e) => setPlan((p) => ({ ...p, cycleStart: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="cycleLength">Typical cycle length (days)</Label>
                <Input
                  id="cycleLength"
                  type="number"
                  min={20}
                  max={45}
                  className="mt-2"
                  value={plan.cycleLength}
                  onChange={(e) => setPlan((p) => ({ ...p, cycleLength: Number(e.target.value) }))}
                />
              </div>
            </div>
            {window && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-2xl border border-border bg-calm-panel p-4"
              >
                <p className="text-sm">
                  Predicted hard window:{" "}
                  <span className="font-display font-semibold text-primary">{window.label}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {window.daysToStorm > 0
                    ? `${window.daysToStorm} days to prepare.`
                    : "You may be in it now. Open your letter and your Support Kit."}
                </p>
              </motion.div>
            )}
          </section>

          {fields.map((f) => (
            <section key={f.key} className="rounded-3xl border border-border bg-card p-6">
              <Label htmlFor={f.key} className="font-display text-base">
                {f.label}
              </Label>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.hint}</p>
              <Textarea
                id={f.key}
                rows={f.big ? 7 : 3}
                className="mt-3 resize-y"
                value={plan[f.key]}
                onChange={(e) => setPlan((p) => ({ ...p, [f.key]: e.target.value }))}
              />
            </section>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Readiness</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {done} of {readySteps.length} in place
            </p>
            <Progress value={readiness} className="mt-4" />
            <ul className="mt-5 space-y-3">
              {readySteps.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Checkbox
                    id={s}
                    checked={!!plan.checks[s]}
                    onCheckedChange={(v) =>
                      setPlan((p) => ({ ...p, checks: { ...p.checks, [s]: Boolean(v) } }))
                    }
                  />
                  <Label htmlFor={s} className="text-sm leading-snug font-normal">
                    {s}
                  </Label>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={download}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Download className="size-4" /> Download plan
              </button>
              <button
                onClick={() => {
                  setPlan(EMPTY);
                  toast("Plan cleared");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
              >
                <RotateCcw className="size-4" /> Clear
              </button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-primary">
              <Check className="size-3.5" /> Saved to this device automatically
            </p>
          </div>

          <div className="mt-5 rounded-3xl border border-storm/40 bg-card p-6">
            <p className="flex items-center gap-2 font-display text-sm font-semibold text-storm">
              <ShieldAlert className="size-4" /> If it turns into a crisis
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              PMDD can become dangerous in the luteal phase. If you are thinking about harming
              yourself, contact your local emergency number or a crisis line now, and tell one person
              out loud.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
