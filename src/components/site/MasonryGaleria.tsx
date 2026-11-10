import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { FotoGaleria } from "@/data/galeriaPagina";

/* ─────────────────────────────────────────────────────────────────────────────
   MOSAICO (MASONRY) DA GALERIA

   Baseado no "Masonry" do React Bits, sem GSAP (as animações são transições
   de CSS, que rodam no compositor e ficam leves no celular):
     • cada foto vai para a coluna mais baixa, mantendo a proporção natural;
     • ao entrar na tela, a foto sobe e aparece (em cascata, coluna a coluna);
     • ao trocar o filtro ou a largura da tela, as fotos deslizam até a nova
       posição;
     • no hover, a foto encolhe levemente (como no original).
   Colunas: 2 no celular, 3 no tablet, 4 no desktop.
   ──────────────────────────────────────────────────────────────────────── */

const GAP = 16;
const GAP_CELULAR = 10;

function useColunas() {
  const [colunas, setColunas] = useState(2);
  useEffect(() => {
    const q4 = window.matchMedia("(min-width: 1024px)");
    const q3 = window.matchMedia("(min-width: 640px)");
    const atualizar = () => setColunas(q4.matches ? 4 : q3.matches ? 3 : 2);
    atualizar();
    q4.addEventListener("change", atualizar);
    q3.addEventListener("change", atualizar);
    return () => {
      q4.removeEventListener("change", atualizar);
      q3.removeEventListener("change", atualizar);
    };
  }, []);
  return colunas;
}

function useLargura<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [largura, setLargura] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setLargura(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setLargura(entry?.contentRect.width ?? 0));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, largura] as const;
}

export function MasonryGaleria({
  fotos,
  onAbrir,
}: {
  fotos: FotoGaleria[];
  onAbrir: (id: string) => void;
}) {
  const colunas = useColunas();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const gap = colunas === 2 ? GAP_CELULAR : GAP;

  // posição de cada foto: sempre na coluna mais baixa
  const { itens, altura } = useMemo(() => {
    if (!largura) return { itens: [], altura: 0 };
    const larguraColuna = (largura - gap * (colunas - 1)) / colunas;
    const alturas = new Array<number>(colunas).fill(0);
    const itens = fotos.map((foto) => {
      const col = alturas.indexOf(Math.min(...alturas));
      const x = col * (larguraColuna + gap);
      const y = alturas[col] ?? 0;
      const h = (larguraColuna * foto.h) / foto.w;
      alturas[col] = y + h + gap;
      return { foto, x, y, w: larguraColuna, h, col };
    });
    return { itens, altura: Math.max(0, ...alturas) - gap };
  }, [fotos, largura, colunas, gap]);

  // fotos que já entraram na tela (a animação de entrada acontece uma vez)
  const [vistas, setVistas] = useState<Set<string>>(() => new Set<string>());
  const observador = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    observador.current = new IntersectionObserver(
      (entries) => {
        const novas: string[] = [];
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).dataset["id"];
            if (id) novas.push(id);
            observador.current?.unobserve(e.target);
          }
        }
        if (novas.length) {
          setVistas((v) => {
            const s = new Set(v);
            for (const id of novas) s.add(id);
            return s;
          });
        }
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 },
    );
    return () => observador.current?.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full" style={{ height: altura || undefined }}>
      {itens.map(({ foto, x, y, w, h, col }) => {
        const vista = vistas.has(foto.id);
        return (
          <button
            key={foto.id}
            type="button"
            data-id={foto.id}
            ref={(el) => {
              if (el && !vistas.has(foto.id)) observador.current?.observe(el);
            }}
            onClick={() => onAbrir(foto.id)}
            aria-label={`Ampliar foto: ${foto.alt}`}
            className="group absolute top-0 left-0 cursor-zoom-in rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2"
            style={{
              width: w,
              height: h,
              transform: `translate3d(${x}px, ${y + (vista ? 0 : 60)}px, 0)`,
              opacity: vista ? 1 : 0,
              transition:
                "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out, width 500ms ease, height 500ms ease",
              transitionDelay: vista ? `${col * 70}ms` : "0ms",
            }}
          >
            <span className="relative block h-full w-full overflow-hidden rounded-[10px] bg-secondary shadow-[0_10px_50px_-10px_rgba(40,20,16,0.2)] transition-transform duration-300 ease-out group-hover:scale-[0.95]">
              <img
                src={foto.src}
                alt={foto.alt}
                width={foto.w}
                height={foto.h}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
