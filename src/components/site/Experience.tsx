import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Coffee, Grape, HeartHandshake, MapPin, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import imgVista from "@/assets/experiencia/vista-vale.webp";
import imgCafe from "@/assets/experiencia/cafe-da-manha.webp";
import imgQuarto from "@/assets/experiencia/quarto.webp";

/* ─────────────────────────────────────────────────────────────────────────────
   A EXPERIÊNCIA BELLA VISTA — segunda seção da home (logo abaixo da Hero)

   Composição editorial em duas áreas: texto + 4 diferenciais à esquerda e,
   à direita, uma composição assimétrica de fotos reais da pousada (a vista
   do deck para o vale como imagem dominante, um detalhe do quarto sobreposto
   na base e o café da manhã sobreposto no alto, só a partir do tablet).

   No celular a ordem é natural: etiqueta → título → texto → diferenciais →
   imagens, em versão compacta: diferenciais em grade 2x2 (ícone em cima),
   foto principal mais baixa (5:4), espaçamentos menores e texto resumido
   (a frase "Aqui, cada detalhe…" só aparece do tablet para cima). Animações: o texto usa o <Reveal> do projeto (fade + leve
   subida) e as fotos se revelam de baixo para cima (clip-path) com um
   zoom-out lento. Com "reduzir movimento" tudo aparece direto, sem
   transição. As fotos ficam em src/assets/experiencia/.
   ──────────────────────────────────────────────────────────────────────── */

interface Diferencial {
  icon: LucideIcon;
  titulo: string;
  texto: string;
}

const DIFERENCIAIS: Diferencial[] = [
  {
    icon: Grape,
    titulo: "Vista para os vinhedos",
    texto: "Uma paisagem que faz parte da estadia.",
  },
  {
    icon: HeartHandshake,
    titulo: "Hospitalidade familiar",
    texto: "Um atendimento próximo e acolhedor.",
  },
  { icon: Coffee, titulo: "Café da manhã", texto: "Comece o dia com calma e bons sabores." },
  { icon: MapPin, titulo: "Localização privilegiada", texto: "No coração do Vale dos Vinhedos." },
];

export function Experience() {
  return (
    <section
      id="experiencia"
      aria-labelledby="experiencia-titulo"
      className="overflow-hidden bg-background py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 sm:gap-16 lg:grid-cols-12 lg:gap-10 lg:px-10">
        {/* ── Conteúdo ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow">A experiência Bella Vista</p>
            <h2
              id="experiencia-titulo"
              className="mt-4 font-display text-[2.15rem] leading-[1.08] sm:mt-5 sm:text-5xl lg:text-[2.75rem] xl:text-[3rem]"
            >
              <span className="block">Mais do que uma hospedagem.</span>
              <span className="block text-wine">Um lugar para desacelerar.</span>
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted-foreground sm:mt-7 sm:text-[1.05rem]">
              {/* no celular, uma versão mais curta do texto */}
              <span className="sm:hidden">
                Entre vinhedos e a calma da Serra Gaúcha, um lugar para sair da rotina sem pressa.
              </span>
              <span className="hidden sm:inline">
                Entre vinhedos, bons momentos e a tranquilidade da Serra Gaúcha, a Bella Vista foi
                pensada para quem quer sair da rotina e aproveitar cada instante sem pressa.
              </span>
            </p>
            <p className="mt-6 hidden items-center gap-3 text-sm text-foreground/75 sm:flex">
              <span aria-hidden className="h-px w-8 shrink-0 bg-wine/60" />
              Aqui, cada detalhe convida você a ficar mais um pouco.
            </p>
          </Reveal>

          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 sm:mt-12 sm:gap-x-10 sm:gap-y-7">
            {DIFERENCIAIS.map((d, i) => (
              <li key={d.titulo}>
                <Reveal delay={200 + i * 90}>
                  <DiferencialItem {...d} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Composição de imagens ────────────────────────────────────── */}
        <div className="lg:col-span-7 lg:pl-6 xl:pl-12">
          <div className="relative mx-auto w-full max-w-[560px] pb-[14%] sm:max-w-[620px] sm:pb-[14%] lg:max-w-none">
            {/* café da manhã — no alto, à esquerda, sobreposto à principal */}
            <RevealImage
              src={imgCafe}
              alt="Café da manhã servido na Pousada Bella Vista"
              delay={420}
              className="absolute top-[8%] left-[4%] z-10 hidden w-[32%] sm:block"
              frameClassName="aspect-[4/5] border-8 border-background"
              shadow
            />

            {/* imagem principal — a vista do deck para o vale */}
            <figure className="relative ml-auto w-[88%] sm:w-[76%]">
              <RevealImage
                src={imgVista}
                alt="Deck da Pousada Bella Vista com vista para o Vale dos Vinhedos"
                className="w-full"
                frameClassName="aspect-[5/4] sm:aspect-[4/5]"
              />
              <figcaption className="mt-3 hidden text-right text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase sm:block">
                Vista do deck · Vale dos Vinhedos
              </figcaption>
            </figure>

            {/* detalhe do quarto — sobreposto na base, à esquerda */}
            <RevealImage
              src={imgQuarto}
              alt="Detalhe de um dos quartos da Pousada Bella Vista"
              delay={260}
              className="absolute bottom-0 left-0 z-10 w-[36%] sm:w-[38%]"
              frameClassName="aspect-[4/5] border-[6px] border-background sm:border-8"
              shadow
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DiferencialItem({ icon: Icon, titulo, texto }: Diferencial) {
  return (
    <div className="group relative flex flex-col gap-2.5 border-t border-foreground/10 pt-4 sm:flex-row sm:gap-4 sm:pt-5">
      {/* traço em vinho sobre a linha — cresce discretamente no hover */}
      <span
        aria-hidden
        className="absolute -top-px left-0 h-px w-6 bg-wine/70 transition-[width] duration-500 ease-out group-hover:w-14"
      />
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-wine" strokeWidth={1.5} />
      <div>
        <h3 className="text-[0.88rem] leading-snug font-semibold tracking-normal sm:text-[0.95rem]">
          {titulo}
        </h3>
        <p className="mt-1 text-[0.8rem] leading-snug text-muted-foreground sm:text-sm sm:leading-relaxed">
          {texto}
        </p>
      </div>
    </div>
  );
}

/* ── Foto com revelação de baixo para cima ─────────────────────────────── */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function useRevealOnScroll<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setAnimate(false);
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible, animate };
}

function RevealImage({
  src,
  alt,
  delay = 0,
  className,
  frameClassName,
  shadow = false,
  priority = false,
}: {
  src: string;
  alt: string;
  delay?: number;
  /** posicionamento/largura do bloco */
  className?: string;
  /** proporção, borda etc. da moldura da foto */
  frameClassName?: string;
  shadow?: boolean;
  priority?: boolean;
}) {
  const { ref, visible, animate } = useRevealOnScroll<HTMLDivElement>();
  const t = (prop: string, ms: number) => (animate ? `${prop} ${ms}ms ${EASE} ${delay}ms` : "none");

  // A sombra fica num invólucro sem clip-path (senão seria cortada) e só
  // aparece junto com a foto.
  const outer: CSSProperties = { opacity: visible ? 1 : 0, transition: t("opacity", 700) };
  const frame: CSSProperties = {
    clipPath: visible ? "inset(0% 0% 0% 0% round 0.75rem)" : "inset(100% 0% 0% 0% round 0.75rem)",
    transition: t("clip-path", 1300),
  };
  const inner: CSSProperties = {
    transform: visible ? "scale(1)" : "scale(1.12)",
    transition: t("transform", 1800),
  };

  return (
    <div
      ref={ref}
      style={outer}
      className={cn(
        "rounded-xl",
        shadow && "shadow-[0_28px_56px_-28px_oklch(0.18_0.01_40/0.5)]",
        className,
      )}
    >
      <div
        style={frame}
        className={cn("zoom-media relative rounded-xl bg-secondary", frameClassName)}
      >
        <div style={inner} className="absolute inset-0">
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
