import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/Reveal";

// Comodidades em duas faixas contínuas ("marquee"), inspiradas na seção de
// depoimentos do site da All Frames: a fileira de cima desliza devagar para a
// esquerda e a de baixo para a direita. Cada fileira pausa quando o mouse (ou
// o foco do teclado) está sobre ela, pra dar tempo de ler.
//
// Performance: cada faixa é um único elemento animado só com `transform`
// (keyframes `marquee-left` / `marquee-right` em src/styles.css), rodando no
// compositor — sem JS por frame. A lista é renderizada duas vezes lado a lado
// e a faixa anda exatamente -50%, o que fecha o loop sem "pulo".
// Com "reduzir movimento" ativo, as faixas param e viram rolagem horizontal.

export interface AmenityItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Foto do card (exibida em 16:10, recortada ao centro). */
  image?: string;
  imageAlt?: string;
}

export interface AmenitiesMarqueeProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  heading?: string;
  description?: string;
  items: AmenityItem[];
  /** Segundos para uma volta completa de cada faixa (maior = mais lento). */
  durations?: [number, number];
}

export function AmenitiesMarquee({
  eyebrow,
  heading,
  description,
  items,
  durations = [70, 80],
  className,
  ...props
}: AmenitiesMarqueeProps) {
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)];

  return (
    <section className={cn("overflow-hidden bg-cream py-20 md:py-28", className)} {...props}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {heading && (
              <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] sm:text-5xl">
                {heading}
              </h2>
            )}
          </div>
          {description && (
            <p className="text-[1.05rem] leading-relaxed text-muted-foreground lg:col-span-5">
              {description}
            </p>
          )}
        </Reveal>
      </div>

      <div className="mt-9 flex flex-col gap-1 md:mt-11">
        {rows.map((row, r) => (
          <Reveal key={r} delay={r * 140}>
            <MarqueeRow
              items={row}
              direction={r === 0 ? "left" : "right"}
              duration={durations[r] ?? 75}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: AmenityItem[];
  direction: "left" | "right";
  duration: number;
}) {
  return (
    <div
      className={cn(
        "group/row relative",
        // esmaece as pontas da faixa
        "[mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]",
        "overflow-hidden py-3 motion-reduce:snap-x motion-reduce:overflow-x-auto",
      )}
    >
      <div
        className={cn(
          "flex w-max will-change-transform",
          direction === "left"
            ? "animate-[marquee-left_var(--marquee-duration)_linear_infinite]"
            : "animate-[marquee-right_var(--marquee-duration)_linear_infinite]",
          "group-hover/row:[animation-play-state:paused] group-focus-within/row:[animation-play-state:paused]",
          "motion-reduce:animate-none motion-reduce:px-6",
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[0, 1].map((copy) =>
          items.map((item) => (
            <div
              key={`${copy}-${item.id}`}
              aria-hidden={copy === 1 || undefined}
              className={cn("shrink-0 pr-5 motion-reduce:snap-start", copy === 1 && "motion-reduce:hidden")}
            >
              <AmenityCard item={item} />
            </div>
          )),
        )}
      </div>
    </div>
  );
}

// Card clássico: foto em cima, texto embaixo, sem enfeites.
function AmenityCard({ item }: { item: AmenityItem }) {
  const Icon = item.icon;

  return (
    <article
      className={cn(
        "group flex h-full w-[250px] flex-col overflow-hidden rounded-xl border border-border bg-card sm:w-[280px] lg:w-[300px]",
        "shadow-[0_1px_2px_oklch(0_0_0/4%)] transition-[translate,box-shadow,border-color] duration-500 ease-out",
        "hover:-translate-y-0.5 hover:border-wine/20 hover:shadow-[0_18px_36px_-22px_oklch(0_0_0/30%)]",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {item.image ? (
          <img
            src={item.image}
            alt={item.imageAlt ?? item.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover object-center transition-[scale] duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, oklch(0.42 0.14 20 / 6%) 0 1px, transparent 1px 12px)",
            }}
          >
            <Icon className="size-8 text-wine/50" strokeWidth={1.2} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        <h3 className="font-display text-base leading-snug sm:text-lg">{item.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </article>
  );
}
