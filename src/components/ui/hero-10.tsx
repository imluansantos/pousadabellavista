import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Bloco "Hero 10" do 21st.dev, integrado ao projeto — usado como a seção de
// fechamento da Home (components/site/PlanejeEstadia.tsx).
//
// Ajustes para o site da pousada:
//   • sem as dependências `motion` e `react-wrap-balancer`: as mesmas
//     animações (conteúdo surgindo com leve desfoque e as 3 fotos se abrindo
//     em leque a partir do centro) foram refeitas com CSS + IntersectionObserver,
//     e o equilíbrio das linhas usa `text-wrap: balance` (classe text-balance);
//   • botões com o padrão do site (btn-base + btn-primary / btn-outline), no
//     lugar do Button do shadcn;
//   • título como h2 (a página já tem o h1 na Hero), com eyebrow opcional;
//   • `socialProof` aceita conteúdo livre (ex.: as notas das avaliações);
//   • as fotos aparecem inteiras, com um respiro curto em branco antes do
//     rodapé (no original elas eram cortadas pela borda); no desktop o leque
//     se abre um pouco mais ao passar o mouse;
//   • respeita "reduzir movimento" do sistema (aparece tudo sem animação).
// O leque (proporção 4/5, rotação −6° / 0° / 6°, a do meio maior e à frente)
// e a estrutura centralizada são os do componente original.

export interface Hero10Cta {
  text: ReactNode;
  href: string;
  /** abre em nova aba (links externos) */
  external?: boolean;
}

export interface Hero10Props {
  eyebrow?: string;
  title: string;
  titleLine2Prefix?: string;
  titleHighlight?: string;
  description: ReactNode;
  socialProof?: ReactNode;
  images: string[];
  imageAlts?: string[];
  animation?: "none" | "subtle";
  primaryCTA: Hero10Cta;
  secondaryCTA?: Hero10Cta;
  variant?: "standard" | "compact";
  className?: string;
}

const variantStyles = {
  standard: {
    section: "pt-20 pb-16 sm:pt-32 sm:pb-24",
    title: "text-[2.1rem] sm:text-5xl lg:text-[3.6rem]",
    description: "max-w-[34rem] text-[0.95rem] sm:text-[1.1rem]",
    content: "gap-7 sm:gap-11",
    fan: "max-w-[54rem]",
  },
  compact: {
    section: "pt-16 pb-8 sm:pt-24 sm:pb-12",
    title: "text-3xl sm:text-4xl md:text-[2.6rem]",
    description: "max-w-md text-[0.98rem]",
    content: "gap-7 sm:gap-9",
    fan: "max-w-2xl",
  },
} as const;

/** posição de cada foto do leque (esquerda, centro, direita) */
const fanSlots = [
  { width: "w-[38%]", layout: "-mr-6 sm:-mr-8 z-10", rotate: -6, x: 48, ty: 24, hover: "lg:group-hover/fan:-translate-x-4 lg:group-hover/fan:-rotate-2" },
  { width: "w-[42%]", layout: "z-20", rotate: 0, x: 0, ty: -8, hover: "lg:group-hover/fan:-translate-y-2" },
  { width: "w-[38%]", layout: "-ml-6 sm:-ml-8 z-10", rotate: 6, x: -48, ty: 24, hover: "lg:group-hover/fan:translate-x-4 lg:group-hover/fan:rotate-2" },
] as const;

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** true depois que o elemento entra na tela (uma vez só) */
function useNaTela<T extends Element>(ativo: boolean) {
  const ref = useRef<T>(null);
  const [visto, setVisto] = useState(!ativo);

  useEffect(() => {
    if (!ativo) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisto(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ativo]);

  return [ref, visto] as const;
}

function useReduzirMovimento() {
  const [reduzir, setReduzir] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduzir(mq.matches);
    const ouvir = () => setReduzir(mq.matches);
    mq.addEventListener("change", ouvir);
    return () => mq.removeEventListener("change", ouvir);
  }, []);
  return reduzir;
}

/** estilo de "surgir" (opacidade + leve subida + desfoque) com atraso */
function surgir(visivel: boolean, animar: boolean, atrasoMs: number): CSSProperties {
  if (!animar) return {};
  return {
    opacity: visivel ? 1 : 0,
    transform: visivel ? "none" : "translateY(12px)",
    filter: visivel ? "blur(0px)" : "blur(6px)",
    transition: `opacity 500ms ${EASE} ${atrasoMs}ms, transform 500ms ${EASE} ${atrasoMs}ms, filter 500ms ${EASE} ${atrasoMs}ms`,
  };
}

function ImageFan({
  images,
  imageAlts,
  animar,
}: {
  images: string[];
  imageAlts?: string[] | undefined;
  animar: boolean;
}) {
  const [ref, visto] = useNaTela<HTMLDivElement>(animar);

  return (
    <div
      ref={ref}
      className="group/fan relative flex w-full items-start justify-center"
      style={surgir(visto, animar, 300)}
    >
      {images.slice(0, 3).map((src, i) => {
        const slot = fanSlots[i] ?? fanSlots[1];
        // as laterais começam "fechadas" atrás da foto do meio e se abrem
        const x = animar && !visto ? slot.x : 0;
        return (
          <div
            key={src}
            className={cn("relative shrink-0", slot.width, slot.layout)}
            style={{
              transform: `translate(${x}px, ${slot.ty}px) rotate(${slot.rotate}deg)`,
              transition: animar ? `transform 700ms ${EASE} ${450 + i * 100}ms` : undefined,
            }}
          >
            <div
              className={cn(
                "aspect-4/5 overflow-hidden rounded-[1.1rem] bg-cream shadow-[0_30px_60px_-24px_rgba(40,20,16,0.45)] outline outline-black/[0.06] transition-transform duration-700 ease-out sm:rounded-[1.4rem]",
                slot.hover,
              )}
            >
              <img
                src={src}
                alt={imageAlts?.[i] ?? ""}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Hero10({
  eyebrow,
  title,
  titleLine2Prefix,
  titleHighlight,
  description,
  socialProof,
  images,
  imageAlts,
  animation = "none",
  primaryCTA,
  secondaryCTA,
  variant = "standard",
  className,
}: Hero10Props) {
  const reduzir = useReduzirMovimento();
  const animar = animation === "subtle" && !reduzir;
  const vs = variantStyles[variant];
  const [ref, visto] = useNaTela<HTMLDivElement>(animar);

  return (
    <section className={cn("relative isolate w-full overflow-hidden bg-white", className)}>
      <div
        ref={ref}
        className={cn(
          "relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center",
          vs.section,
          vs.content,
        )}
      >
        <div
          className="flex w-full max-w-5xl flex-col items-center gap-4 sm:gap-6"
          style={surgir(visto, animar, 0)}
        >
          {eyebrow && (
            <p className="eyebrow flex items-center justify-center gap-4">
              <span aria-hidden className="h-px w-8 bg-wine/60" />
              {eyebrow}
              <span aria-hidden className="h-px w-8 bg-wine/60" />
            </p>
          )}
          <h2
            className={cn(
              "font-display leading-[1.06] tracking-[-0.03em] text-balance text-foreground",
              vs.title,
            )}
          >
            {title}
            {(titleLine2Prefix || titleHighlight) && (
              <>
                <br />
                {titleLine2Prefix && <span>{titleLine2Prefix} </span>}
                {titleHighlight && <span className="text-wine">{titleHighlight}</span>}
              </>
            )}
          </h2>
          <p
            className={cn("leading-relaxed text-balance text-muted-foreground", vs.description)}
          >
            {description}
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 sm:gap-6" style={surgir(visto, animar, 100)}>
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href={primaryCTA.href}
              {...(primaryCTA.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="btn-base btn-primary whitespace-nowrap max-sm:px-5!"
            >
              {primaryCTA.text}
              <ArrowUpRight className="size-3.5" />
            </a>
            {secondaryCTA && (
              <a
                href={secondaryCTA.href}
                {...(secondaryCTA.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="btn-base btn-outline whitespace-nowrap max-sm:px-5!"
              >
                {secondaryCTA.text}
                <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </div>
          {socialProof}
        </div>

        {images.length > 0 && (
          // fotos inteiras; no celular o leque é mais largo que a tela e as
          // laterais vazam pelas bordas (a seção corta só na horizontal)
          <div className="flex w-full justify-center pb-6 sm:pb-8">
            <div className={cn("mx-auto w-[132%] max-w-none shrink-0 pt-2 sm:w-[92%] lg:w-full", vs.fan)}>
              <ImageFan images={images} imageAlts={imageAlts} animar={animar} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero10;
