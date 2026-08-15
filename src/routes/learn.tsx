import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "What is PMDD? — Lumen education" },
      {
        name: "description",
        content:
          "Plain-language answers about PMDD: what it is, how it differs from PMS, how it is diagnosed and treated, and how to support someone who has it.",
      },
      { property: "og:title", content: "What is PMDD? — Lumen education" },
      {
        property: "og:description",
        content: "Plain-language PMDD education for those who have it and those who love them.",
      },
    ],
  }),
  component: Learn,
});

const faqs = [
  {
    q: "What is PMDD?",
    a: "Premenstrual Dysphoric Disorder is a severe, cyclical mood disorder listed in the DSM-5. In the luteal phase — roughly the one to two weeks before menstruation — a person with PMDD experiences intense depression, anxiety, irritability, rage, or hopelessness, which lifts within a few days of bleeding starting. It is understood as an abnormal brain sensitivity to normal hormone fluctuation, not a hormone imbalance and not a character flaw.",
  },
  {
    q: "How is PMDD different from PMS?",
    a: "PMS is uncomfortable; PMDD is disabling. Around 80% of menstruating people get some premenstrual symptoms. PMDD affects roughly 5.5% and meets a psychiatric threshold: the symptoms damage relationships, work and safety. The defining feature is the cyclical on/off pattern — someone with PMDD is not depressed all month.",
  },
  {
    q: "Why do people say it makes them feel like a different person?",
    a: "PMDD distorts self-perception, not just mood. Thoughts feel like facts: 'my partner resents me', 'I should quit', 'I have always been this useless'. The reasoning feels airtight in the moment and absurd ten days later. This is why prepared plans and external reality checks matter more than in-the-moment willpower.",
  },
  {
    q: "Is PMDD dangerous?",
    a: "Yes. Research cited by IAPMD indicates around 34% of people with PMDD have attempted suicide, with attempts clustered in the luteal phase. People have died from this condition. Treating it as 'bad PMS' is a safety issue, which is why Lumen builds crisis contacts into the prep plan rather than treating them as an afterthought.",
  },
  {
    q: "How is it diagnosed?",
    a: "There is no blood test. Diagnosis requires prospective daily symptom tracking across at least two cycles — commonly with the DRSP (Daily Record of Severing Problems) — showing symptoms confined to the luteal phase. Average time to accurate diagnosis is still around 12 years, largely because symptoms get misread as bipolar disorder, borderline personality disorder or generalised depression.",
  },
  {
    q: "What treatments exist?",
    a: "Common evidence-based options include SSRIs (continuous or luteal-phase dosing), combined hormonal contraceptives used continuously, GnRH analogues with add-back therapy in severe cases, CBT/DBT skills, and lifestyle levers such as sleep protection, reducing alcohol, resistance exercise, and calcium or vitamin B6 supplementation. What works is highly individual — which is exactly why tracking interventions over time is on the Lumen roadmap. Always work with a clinician.",
  },
  {
    q: "I love someone with PMDD. What do I actually do?",
    a: "Learn the calendar so you are not surprised. Agree on what help looks like while they are well, not mid-episode. Do not argue with the content of a distorted thought — acknowledge the feeling, postpone the decision. Reduce load: meals, admin, driving. Never say 'is it that time of the month'. The Support Kit generates a script you can keep on your phone.",
  },
  {
    q: "Is Lumen a medical device?",
    a: "No. Lumen is an educational and preparedness tool. It does not diagnose, treat, or replace clinical care, and the AI reality checker is a self-reflection aid, not a therapist. In a crisis, contact your local emergency number or a crisis line.",
  },
];

function Learn() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-eyebrow">Education</p>
      <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
        PMDD, explained without the fog
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        Written for two readers at once: the person who suspects this is what they have, and the
        person trying to support them.
      </p>

      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-display text-base">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 rounded-3xl border border-border bg-calm-panel p-6">
        <h2 className="font-display text-xl font-semibold">Now turn it into a plan</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Understanding is step one. Rehearsing is step two.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/plan"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Build a prep plan
          </Link>
          <Link
            to="/support"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary"
          >
            Brief a loved one
          </Link>
        </div>
      </div>
    </div>
  );
}
