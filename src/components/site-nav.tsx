import { Link } from "@tanstack/react-router";
import { Moon } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/plan", label: "Plan" },
  { to: "/reality-check", label: "Reality Check" },
  { to: "/support", label: "Support Kit" },
  { to: "/learn", label: "Learn" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full bg-calm-panel text-primary shadow-glow">
            <Moon className="size-4" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">Lumen</span>
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {links.slice(1).map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/reality-check"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          I need help now
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-display text-foreground">Lumen — prepare for the storm before it lands.</p>
          <ul className="flex flex-wrap gap-4">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 max-w-2xl text-xs leading-relaxed">
          Lumen is an educational and preparedness tool, not a medical device and not a substitute
          for diagnosis or treatment. If you are in crisis, contact your local emergency number or a
          crisis line immediately.
        </p>
      </div>
    </footer>
  );
}
