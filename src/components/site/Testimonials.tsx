import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { TestimonialsSection } from "@/components/ui/testimonials-3";
import { depoimentos } from "@/data/depoimentos";

/* ─────────────────────────────────────────────────────────────────────────────
   DEPOIMENTOS — logo após a Galeria

   Cards do componente "Testimonials 3" (21st.dev — src/components/ui/
   testimonials-3.tsx), 3 por vez. As setas ao lado (no celular, abaixo)
   passam para os próximos 3; o contador mostra a página atual. A troca de
   página é um fade suave, sem deslizar.

   Celular (< 640px): um depoimento por vez, com as setas e o contador
   abaixo e troca também pelo gesto de arrastar para o lado. Todos os
   depoimentos ficam empilhados na mesma célula do grid (os outros
   invisíveis), então a altura é sempre a do maior e nada "pula" ao trocar.

   Depoimentos reais em src/data/depoimentos.ts.
   ──────────────────────────────────────────────────────────────────────── */

const POR_PAGINA = 3;

export function Testimonials() {
  const total = Math.ceil(depoimentos.length / POR_PAGINA);
  const [pagina, setPagina] = useState(0);

  const ir = (delta: number) => setPagina((p) => (p + delta + total) % total);
  const atuais = depoimentos.slice(pagina * POR_PAGINA, pagina * POR_PAGINA + POR_PAGINA);

  return (
    <section
      id="depoimentos"
      aria-labelledby="depoimentos-titulo"
      className="overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* ── Cabeçalho ─────────────────────────────────────────────────── */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow flex items-center justify-center gap-4">
            <span aria-hidden className="h-px w-8 bg-wine/60" />
            Depoimentos
            <span aria-hidden className="h-px w-8 bg-wine/60" />
          </p>
          <h2
            id="depoimentos-titulo"
            className="mt-4 font-display text-[2.1rem] leading-[1.08] sm:mt-5 sm:text-5xl lg:text-[2.75rem] xl:text-[3rem]"
          >
            Quem se hospeda, <span className="text-wine">volta.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-muted-foreground sm:mt-4 sm:text-[1.05rem]">
            <span className="sm:hidden">
              O carinho no atendimento, o café e a vista do Vale, nas palavras de quem já esteve
              aqui.
            </span>
            <span className="hidden sm:inline">
              O carinho no atendimento, o café da manhã e a vista do Vale, nas palavras de quem já
              passou alguns dias com a gente.
            </span>
          </p>
        </Reveal>

        {/* ── Celular: um depoimento por vez ────────────────────────────── */}
        <Reveal delay={140} className="sm:hidden">
          <DepoimentoUmPorVez />
        </Reveal>

        {/* ── Cards + setas (tablet e desktop) ──────────────────────────── */}
        <Reveal delay={140} className="hidden sm:block">
          <div className="mt-12 flex items-start gap-4 md:mt-14 lg:gap-8">
            <Seta direcao="anterior" onClick={() => ir(-1)} className="hidden lg:mt-20 lg:flex" />

            <div className="min-w-0 flex-1 lg:pb-16" aria-live="polite">
              <div key={pagina} className="animate-in fade-in duration-700">
                <TestimonialsSection testimonials={atuais} />
              </div>
            </div>

            <Seta direcao="proximo" onClick={() => ir(1)} className="hidden lg:mt-20 lg:flex" />
          </div>

          {/* contador + setas no celular */}
          <div className="mt-10 flex items-center justify-center gap-6 lg:mt-8">
            <Seta direcao="anterior" onClick={() => ir(-1)} className="lg:hidden" />
            <p className="font-display text-sm tracking-[0.2em] text-muted-foreground tabular-nums">
              <span className="text-wine">{String(pagina + 1).padStart(2, "0")}</span>
              <span className="mx-2 text-foreground/30">/</span>
              {String(total).padStart(2, "0")}
            </p>
            <Seta direcao="proximo" onClick={() => ir(1)} className="lg:hidden" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DepoimentoUmPorVez() {
  const total = depoimentos.length;
  const [atual, setAtual] = useState(0);
  const toqueX = useRef<number | null>(null);

  const ir = (delta: number) => setAtual((a) => (a + delta + total) % total);

  return (
    <div className="mt-8">
      <div
        className="grid touch-pan-y"
        aria-live="polite"
        onTouchStart={(e) => {
          toqueX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const inicio = toqueX.current;
          const fim = e.changedTouches[0]?.clientX;
          toqueX.current = null;
          if (inicio == null || fim == null) return;
          const dx = fim - inicio;
          if (Math.abs(dx) > 40) ir(dx < 0 ? 1 : -1);
        }}
      >
        {depoimentos.map((d, i) => (
          <div
            key={d.name}
            aria-hidden={i !== atual}
            className={`col-start-1 row-start-1 transition-opacity duration-500 ${
              i === atual ? "opacity-100" : "invisible opacity-0"
            }`}
          >
            <TestimonialsSection testimonials={[d]} className="h-full" />
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-center gap-6">
        <Seta direcao="anterior" onClick={() => ir(-1)} className="size-[3.25rem]!" unico />
        <p className="font-display text-sm tracking-[0.2em] text-muted-foreground tabular-nums">
          <span className="text-wine">{String(atual + 1).padStart(2, "0")}</span>
          <span className="mx-2 text-foreground/30">/</span>
          {String(total).padStart(2, "0")}
        </p>
        <Seta direcao="proximo" onClick={() => ir(1)} className="size-[3.25rem]!" unico />
      </div>
    </div>
  );
}

function Seta({
  direcao,
  onClick,
  className = "",
  unico = false,
}: {
  direcao: "anterior" | "proximo";
  onClick: () => void;
  className?: string;
  /** no carrossel do celular as setas passam um depoimento por vez */
  unico?: boolean;
}) {
  const Icone = direcao === "anterior" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        unico
          ? direcao === "anterior"
            ? "Depoimento anterior"
            : "Próximo depoimento"
          : direcao === "anterior"
            ? "Depoimentos anteriores"
            : "Próximos depoimentos"
      }
      className={`btn-base btn-outline size-12 shrink-0 px-0! py-0! [&:hover_svg]:transform-none! ${className}`}
    >
      <Icone className={unico ? "size-[1.15rem]" : "size-4"} />
    </button>
  );
}
