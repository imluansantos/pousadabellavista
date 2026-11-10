import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Foto com revelação de baixo para cima (clip-path) + zoom-out lento ao
   entrar na tela, e um parallax vertical opcional e bem discreto.

   Mesma linguagem das fotos da seção "A Experiência Bella Vista". Com
   "reduzir movimento" a foto aparece direto e o parallax fica desligado.
   ──────────────────────────────────────────────────────────────────────── */

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

/**
 * Desloca o elemento no eixo Y conforme a rolagem (no máximo ±`amount` px),
 * só a partir de 1024px de largura. Escreve o transform direto no elemento
 * (sem re-render) e só trabalha enquanto ele está perto da tela.
 */
function useParallax<T extends HTMLElement>(amount: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || amount === 0) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    const update = () => {
      if (!desktop.matches || reduce.matches) {
        el.style.transform = "";
        return;
      }
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      // -1 quando o centro do elemento está no topo da tela, +1 na base
      const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      const y = Math.max(-1, Math.min(1, progress)) * amount;
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [amount]);

  return ref;
}

export function RevealImage({
  src,
  alt,
  delay = 0,
  className,
  frameClassName,
  imgClassName,
  shadow = false,
  parallax = 0,
}: {
  src: string;
  alt: string;
  delay?: number;
  /** posicionamento/largura do bloco */
  className?: string;
  /** proporção, borda etc. da moldura da foto */
  frameClassName?: string;
  /** ex.: object-position da foto */
  imgClassName?: string;
  shadow?: boolean;
  /** deslocamento máximo do parallax, em px (0 = desligado) */
  parallax?: number;
}) {
  const { ref, visible, animate } = useRevealOnScroll<HTMLDivElement>();
  const parallaxRef = useParallax<HTMLDivElement>(parallax);
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
    <div ref={parallaxRef} className={cn(parallax > 0 && "will-change-transform", className)}>
      <div
        ref={ref}
        style={outer}
        className={cn("rounded-xl", shadow && "shadow-[0_28px_56px_-28px_oklch(0.18_0.01_40/0.5)]")}
      >
        <div
          style={frame}
          className={cn("zoom-media relative rounded-xl bg-secondary", frameClassName)}
        >
          <div style={inner} className="absolute inset-0 overflow-hidden rounded-sm">
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={cn("h-full w-full object-cover", imgClassName)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
