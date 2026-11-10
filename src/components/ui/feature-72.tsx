import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/Reveal";

// Grid de features inspirado no "Feature 72" (shadcnblocks / 21st.dev), em
// versão editorial para a pousada: foto em tela cheia (4:3) e texto sobre um
// degradê escuro. Sem
// `image`, o card mostra um placeholder (hachura + ícone).
//
// ANIMAÇÃO DE ENTRADA — por fileira, uma vez por carregamento (só F5 repete).
// Otimizada para rodar 100% na GPU (compositor):
//   • só anima `opacity`, `translate` e `scale` — nada de blur, clip-path,
//     sombra ou propriedades que forcem layout/repaint a cada frame;
//   • a "cortina" da foto é uma camada sólida encolhendo com scaleY, não um
//     clip-path;
//   • zero re-render do React: o observer liga `data-reveal` direto no DOM e
//     todo o resto é CSS (transições + `--d` para o atraso em cascata);
//   • as posições dos cards são lidas numa única passada antes de escrever
//     no DOM (sem layout thrashing), e cada card sai do observer ao revelar;
//   • com "reduzir movimento" ativo no sistema, nada anima.

export interface Feature72Item {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** URL/import da foto do card (exibida em 4:3, recortada ao centro). */
  image?: string;
  /** Texto alternativo da foto; usa o título se omitido. */
  imageAlt?: string;
}

export interface Feature72Props extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  heading?: string;
  description?: string;
  linkUrl?: string;
  linkText?: string;
  /** Ação no cabeçalho, abaixo do texto (ex.: botão "Ver mais comodidades"). */
  action?: React.ReactNode;
  /** 3 colunas (padrão, home) ou 2 colunas com cards maiores (página /comodidades). */
  columns?: 2 | 3;
  features: Feature72Item[];
}

const STAGGER_MS = 140;

/** Revela os cards por fileira (mesmo topo na tela), uma única vez. */
function useRowReveal() {
  const refs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const els = refs.current.filter((el): el is HTMLDivElement => !!el);
    if (!els.length) return;

    const reveal = (el: HTMLDivElement, delay: number) => {
      el.style.setProperty("--d", `${delay}ms`);
      el.dataset.reveal = "in";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => reveal(el, 0));
      return;
    }

    const pending = new Set(els);

    const io = new IntersectionObserver(
      (entries) => {
        const hits = entries
          .filter((e) => e.isIntersecting && pending.has(e.target as HTMLDivElement))
          .map((e) => e.target as HTMLDivElement);
        if (!hits.length) return;

        // 1) Leitura: posições de todos os cards pendentes numa passada só.
        const rects = new Map<HTMLDivElement, DOMRect>();
        pending.forEach((el) => rects.set(el, el.getBoundingClientRect()));

        // 2) Escrita: revela a fileira inteira de cada card que entrou.
        for (const hit of hits) {
          if (!pending.has(hit)) continue;
          const top = rects.get(hit)!.top;
          [...pending]
            .filter((el) => Math.abs(rects.get(el)!.top - top) < 4)
            .sort((a, b) => rects.get(a)!.left - rects.get(b)!.left)
            .forEach((el, pos) => {
              pending.delete(el);
              io.unobserve(el);
              reveal(el, pos * STAGGER_MS);
            });
        }

        if (!pending.size) io.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return refs;
}

export function Feature72({
  eyebrow,
  heading,
  description,
  linkUrl,
  linkText,
  action,
  columns = 3,
  features,
  className,
  ...props
}: Feature72Props) {
  const large = columns === 2;
  const total = String(features.length).padStart(2, "0");
  const refs = useRowReveal();

  return (
    <section className={cn("bg-cream py-20 md:py-28", className)} {...props}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Cabeçalho em duas colunas: título à esquerda, texto de apoio à direita */}
        {(eyebrow || heading || description || action) && (
        <Reveal className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {heading && (
              <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] sm:text-5xl">
                {heading}
              </h2>
            )}
          </div>
          <div className="lg:col-span-5">
            {description && (
              <p className="text-[1.05rem] leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
            {linkUrl && linkText && (
              <a
                href={linkUrl}
                className="group mt-6 inline-flex items-center text-sm font-semibold tracking-wide text-wine"
              >
                {linkText}
                <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
            {action && <div className="mt-6">{action}</div>}
          </div>
        </Reveal>
        )}

        {/* Régua com contagem */}
        <Reveal className="flex items-center gap-4 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          <span className="tabular-nums text-wine">{total}</span>
          <span className="h-px flex-1 bg-border" />
          <span>Incluso na sua estadia</span>
        </Reveal>

        <div
          className={cn(
            "mt-8 grid gap-4 sm:grid-cols-2",
            large ? "lg:gap-6" : "lg:grid-cols-3 lg:gap-5",
          )}
        >
          {features.map((feature, i) => (
            <div
              key={feature.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={cn(
                // camada da entrada (separada do <article> p/ não brigar com o hover)
                "group/reveal",
                "translate-y-10 scale-[0.97] opacity-0",
                "transition-[opacity,translate,scale] delay-(--d) duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                "data-[reveal=in]:translate-y-0 data-[reveal=in]:scale-100 data-[reveal=in]:opacity-100",
                "motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none",
              )}
            >
              <FeatureCard feature={feature} index={i} large={large} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Atrasos dos elementos internos, relativos ao atraso do card (--d).
const AFTER_CARD = "delay-[calc(var(--d,0ms)_+_120ms)]";
const AFTER_TEXT = "delay-[calc(var(--d,0ms)_+_480ms)]";
const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

// Card editorial: foto em tela cheia e texto sobre um degradê escuro —
// propositalmente sem enfeites (selos, molduras, numeração).
// Tudo que anima (entrada e hover) usa só opacity/translate/scale.
function FeatureCard({
  feature,
  index,
  large = false,
}: {
  feature: Feature72Item;
  index: number;
  large?: boolean;
}) {
  const Icon = feature.icon;
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "group relative isolate aspect-[4/3] overflow-hidden rounded-xl bg-ink",
        "shadow-[0_1px_2px_oklch(0_0_0/6%),0_12px_32px_-20px_oklch(0_0_0/35%)]",
        "transition-[translate,box-shadow] duration-500 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_2px_4px_oklch(0_0_0/6%),0_24px_48px_-24px_oklch(0_0_0/40%)]",
      )}
    >
      {/* Foto (assenta com leve zoom-out na entrada; zoom lento no hover) */}
      <div
        className={cn(
          "absolute inset-0 scale-[1.12] transition-[scale] duration-[1500ms] group-data-[reveal=in]/reveal:scale-100",
          AFTER_CARD,
          EASE,
          "motion-reduce:scale-100 motion-reduce:transition-none",
        )}
      >
        {feature.image ? (
          <img
            src={feature.image}
            alt={feature.imageAlt ?? feature.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center transition-[scale] duration-[1400ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.07]"
          />
        ) : (
          <ImagePlaceholder icon={Icon} number={number} />
        )}
      </div>

      {/* Degradê de leitura + escurecimento extra no hover (só opacity) */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,oklch(0.16_0.01_40/0.92)_0%,oklch(0.16_0.01_40/0.6)_34%,transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,oklch(0.16_0.01_40/0.35),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      {/* Cortina de entrada: revela o card de baixo para cima (scaleY) */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-20 origin-top bg-cream",
          "transition-[scale] duration-[1000ms] group-data-[reveal=in]/reveal:scale-y-0",
          AFTER_CARD,
          EASE,
          "motion-reduce:hidden",
        )}
      />

      {/* Texto */}
      <div
        className={cn(
          cn("absolute inset-x-0 bottom-0 z-10 text-white", large ? "p-7 sm:p-9" : "p-6 sm:p-7"),
          "translate-y-3 opacity-0 transition-[opacity,translate] duration-[800ms]",
          "group-data-[reveal=in]/reveal:translate-y-0 group-data-[reveal=in]/reveal:opacity-100",
          AFTER_TEXT,
          EASE,
          "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        )}
      >
        <h3
          className={cn(
            "font-display leading-tight text-white",
            large ? "text-2xl sm:text-[1.9rem]" : "text-xl sm:text-[1.4rem]",
          )}
        >
          {feature.title}
        </h3>
        <p
          className={cn(
            "mt-2 max-w-[38ch] leading-relaxed text-white/78",
            large ? "text-[0.95rem] sm:mt-3" : "line-clamp-2 text-[0.875rem]",
          )}
        >
          {feature.description}
        </p>
      </div>
    </article>
  );
}

// Placeholder até a foto definitiva chegar: hachura fina + ícone num anel.
function ImagePlaceholder({ icon: Icon, number }: { icon: LucideIcon; number: string }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2.5 bg-secondary"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, oklch(0.42 0.14 20 / 6%) 0 1px, transparent 1px 12px)",
      }}
    >
      <div className="flex size-14 items-center justify-center rounded-full border border-wine/15 bg-card">
        <Icon className="size-6 text-wine/70" strokeWidth={1.2} />
      </div>
      <span className="text-[0.62rem] font-medium tracking-[0.24em] text-muted-foreground/80 uppercase">
        Imagem {number} · 4:3
      </span>
    </div>
  );
}
