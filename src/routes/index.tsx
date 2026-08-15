import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, BrainCircuit, CalendarHeart, LifeBuoy, Sparkles } from "lucide-react";

import heroImage from "@/assets/hero-window.jpg";
import state1 from "@/assets/state-1.jpg";
import state2 from "@/assets/state-2.jpg";
import state3 from "@/assets/state-3.jpg";
import { CountUp } from "@/components/count-up";
import { AccordionGallery } from "@/components/accordion-gallery";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — Prepare for PMDD, don't just track it" },
      {
        name: "description",
        content:
          "Tracking tells you what is coming. Lumen tells you what to do about it: a preparedness plan, an AI reality checker, and a support kit for the people around you.",
      },
      { property: "og:title", content: "Lumen — Prepare for PMDD, don't just track it" },
      {
        property: "og:description",
        content:
          "A preparedness platform for people living with PMDD, and for the people who love them.",
      },
    ],
  }),
  component: Home,
});

const pillars = [
  {
    icon: CalendarHeart,
    title: "Prep Plan",
    body: "Build your luteal-phase protocol while you are clear-headed: what to cancel, what to eat, who to call, what not to decide.",
    to: "/plan" as const,
    cta: "Build my plan",
  },
  {
    icon: BrainCircuit,
    title: "Reality Checker",
    body: "Send the thought that is eating you. AI separates the feeling (real) from the conclusion (distorted) and gives you one small action.",
    to: "/reality-check" as const,
    cta: "Check a thought",
  },
  {
    icon: LifeBuoy,
    title: "Support Kit",
    body: "Generated scripts your partner, friend or manager can actually follow — what to say, what to never say, when to step in.",
    to: "/support" as const,
    cta: "Brief my people",
  },
];

const stats = [
  { value: 5.5, decimals: 1, suffix: "%", label: "of menstruating people live with PMDD" },
  { value: 12, suffix: " yrs", label: "average delay before an accurate diagnosis" },
  { value: 34, suffix: "%", label: "have attempted suicide during a luteal phase" },
  { value: 0, suffix: "", label: "apps that tell you what to do next", zero: true },
];

const galleryItems = [
  {
    image: state1,
    title: "Day 21: the shutdown",
    caption:
      "The body arrives before the calendar does. Fatigue, dread, and a sudden certainty that nothing is worth doing.",
  },
  {
    image: state2,
    title: "Day 24: the stranger",
    caption:
      "PMDD is not a bad mood. It is a temporary distortion of self — you look in the mirror and don't recognise the person deciding things.",
  },
  {
    image: state3,
    title: "Day 26: the hand",
    caption:
      "Support only works if it was arranged in advance. Lumen makes sure someone already knows what this week looks like.",
  },
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-aura">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-eyebrow">Premenstrual Dysphoric Disorder</p>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
              You already know it's coming.
              <span className="block text-primary">Lumen tells you what to do about it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Cycle trackers hand you data. If you live with PMDD, data was never the missing piece —
              a plan was. Lumen turns the two weeks you dread into something you have already
              rehearsed, with your people briefed and standing by.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/plan"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Build my prep plan <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
              >
                What is PMDD?
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-4xl border border-border shadow-lift">
              <img
                src={heroImage}
                alt="A woman sitting quietly by a window at dusk"
                width={1600}
                height={1104}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 max-w-[15rem] rounded-3xl border border-border bg-calm-panel p-4 shadow-lift backdrop-blur">
              <p className="flex items-center gap-2 text-xs text-primary">
                <Sparkles className="size-3.5" /> Reality check
              </p>
              <p className="mt-2 text-sm leading-snug">
                “Everyone is sick of me.” — that's the luteal phase talking, not the evidence.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-semibold text-primary">
                {s.zero ? (
                  "0"
                ) : (
                  <CountUp to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
                )}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto max-w-6xl px-5 pb-10 text-xs text-muted-foreground">
          Figures reflect commonly cited PMDD prevalence and outcome research (IAPMD). PMDD is a
          severe, and in some cases fatal, condition — not a synonym for PMS.
        </p>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-eyebrow">Three tools, one bad week</p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          Built for the version of you who can't think straight yet
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-lift"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <Link
                to={p.to}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {p.cta} <ArrowRight className="size-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-eyebrow">What the cycle actually looks like</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
            For the people who want to understand
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            PMDD is invisible from the outside, which is why it gets dismissed. Hover through a
            luteal phase.
          </p>
          <div className="mt-10">
            <AccordionGallery items={galleryItems} />
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-eyebrow">Where this goes next</p>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
          From preparedness tool to care platform
        </h2>
        <ol className="mt-10 space-y-4">
          {[
            {
              phase: "Now",
              text: "Prep plan, AI reality checker, and support kit — no account needed, everything stored on your device.",
            },
            {
              phase: "Next",
              text: "Opt-in personalisation: your own cycle history, symptom patterns and past reality checks tune the plan to you.",
            },
            {
              phase: "Then",
              text: "Lifestyle and medication insight: see which interventions measurably shifted your luteal weeks over time.",
            },
            {
              phase: "Later",
              text: "Clinician plug-in: doctors, psychiatrists and therapists join with consent and see the record you chose to share.",
            },
          ].map((r) => (
            <li
              key={r.phase}
              className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:gap-8"
            >
              <span className="w-16 shrink-0 font-display text-sm font-semibold text-primary">
                {r.phase}
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">{r.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
