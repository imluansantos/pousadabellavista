import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { todasAsFotos, type Acomodacao } from "@/data/acomodacoes";

/* ─────────────────────────────────────────────────────────────────────────────
   EXPLORE OS AMBIENTES (seção 3)

   Índice editorial dos ambientes que a suíte realmente tem (lista em
   data/acomodacoes.ts). Clicar num ambiente abre a galeria em tela cheia já
   nas fotos dele.
   • desktop: lista numerada à esquerda e uma prévia grande à direita, que
     troca de foto quando o mouse (ou o foco do teclado) passa por um item;
   • celular: cada item traz a própria miniatura, sem prévia separada.
   ──────────────────────────────────────────────────────────────────────── */

export function AmbientesSuite({
  acomodacao: a,
  onAbrirGaleria,
}: {
  acomodacao: Acomodacao;
  onAbrirGaleria: (indice: number) => void;
}) {
  const [ativo, setAtivo] = useState(0);
  const fotos = todasAsFotos(a);
  const inicio = (id: string) => fotos.findIndex((f) => f.ambiente.id === id);
  const atual = a.ambientes[ativo] ?? a.ambientes[0];

  if (!atual) return null;

  return (
    <section aria-labelledby="ambientes-titulo" className="secao-filetes bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Explore os ambientes</p>
          <h2 id="ambientes-titulo" className="mt-4 font-display text-[2rem] leading-[1.1] sm:text-[2.6rem]">
            Cada canto da suíte {a.nome}, em detalhe.
          </h2>
          <p className="mt-4 text-[1rem] leading-relaxed text-muted-foreground">
            Escolha um ambiente para ver as fotos.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <ol>
              {a.ambientes.map((amb, i) => {
                const destaque = i === ativo;
                const capa = amb.fotos[0];
                return (
                  <li key={amb.id} className="relative border-t border-foreground/10 last:border-b">
                    {/* fio na cor da suíte, que cresce no item ativo (desktop) */}
                    <span
                      aria-hidden
                      className={`absolute -top-px left-0 hidden h-px transition-[width] duration-500 ease-out lg:block ${
                        destaque ? "w-full" : "w-0"
                      }`}
                      style={{ backgroundColor: "hsl(var(--theme-color))" }}
                    />
                    <button
                      type="button"
                      onClick={() => onAbrirGaleria(inicio(amb.id))}
                      onMouseEnter={() => setAtivo(i)}
                      onFocus={() => setAtivo(i)}
                      aria-label={`${amb.titulo}: ver ${amb.fotos.length} ${
                        amb.fotos.length === 1 ? "foto" : "fotos"
                      }`}
                      className="group flex w-full items-center gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine sm:gap-6 lg:py-6"
                    >
                      {capa && (
                        <span className="relative size-20 shrink-0 overflow-hidden rounded-lg sm:size-24 lg:hidden">
                          <img
                            src={capa.src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        </span>
                      )}
                      <span
                        aria-hidden
                        className={`hidden w-7 shrink-0 font-display text-sm tabular-nums transition-colors lg:block ${
                          destaque ? "text-wine" : "text-muted-foreground/70"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[1.25rem] leading-tight font-bold tracking-[-0.015em] sm:text-[1.5rem]">
                          {amb.titulo}
                        </span>
                        <span className="mt-1.5 block text-[0.88rem] leading-snug text-muted-foreground">
                          {amb.descricao}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 text-[0.78rem] font-medium text-muted-foreground transition-colors group-hover:text-wine">
                        <span className="hidden sm:inline">
                          {amb.fotos.length} {amb.fotos.length === 1 ? "foto" : "fotos"}
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          {/* prévia (desktop) */}
          <Reveal delay={120} className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-28">
              <button
                type="button"
                onClick={() => onAbrirGaleria(inicio(atual.id))}
                aria-label={`${atual.titulo}: ver ${atual.fotos.length} ${
                  atual.fotos.length === 1 ? "foto" : "fotos"
                }`}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
              >
                {a.ambientes.map((amb, i) => {
                  const capa = amb.fotos[0];
                  if (!capa) return null;
                  return (
                    <img
                      key={amb.id}
                      src={capa.grande}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.02] ${
                        i === ativo ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  );
                })}
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent p-6 pt-20 text-left text-white">
                  <span>
                    <span className="block text-[0.68rem] font-semibold tracking-[0.24em] text-white/70 uppercase">
                      {String(ativo + 1).padStart(2, "0")} · {atual.fotos.length}{" "}
                      {atual.fotos.length === 1 ? "foto" : "fotos"}
                    </span>
                    <span className="mt-1.5 block text-2xl font-bold tracking-[-0.015em]">
                      {atual.titulo}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[0.78rem] font-semibold text-ink">
                    Ver fotos
                    <ArrowUpRight aria-hidden className="size-3.5" />
                  </span>
                </span>
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
