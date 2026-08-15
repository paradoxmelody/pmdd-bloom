import { useState } from "react";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  image: string;
  title: string;
  caption: string;
};

/** Horizontal accordion gallery: hovering/clicking a panel expands it. */
export function AccordionGallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex h-[26rem] w-full flex-col gap-3 sm:h-[30rem] sm:flex-row">
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <button
            key={item.title}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-expanded={isActive}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-border text-left transition-all duration-700 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive ? "flex-[3.2]" : "flex-[1] opacity-70 hover:opacity-100",
            )}
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              width={900}
              height={1100}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms]",
                isActive ? "scale-100" : "scale-110",
              )}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-5">
              <span className="block font-display text-lg font-semibold text-foreground">
                {item.title}
              </span>
              <span
                className={cn(
                  "mt-2 block max-w-sm text-sm leading-relaxed text-muted-foreground transition-all duration-500",
                  isActive ? "opacity-100" : "hidden opacity-0 sm:block sm:opacity-0",
                )}
              >
                {item.caption}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
