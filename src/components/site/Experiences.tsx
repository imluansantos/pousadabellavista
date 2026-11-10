import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Car, MapPin } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { linkMaps, PILARES_EXPERIENCIA, type PilarExperiencia } from "@/data/experiencias";
import imgVale from "@/assets/experiencias/vale-dos-vinhedos.webp";

/* ─────────────────────────────────────────────────────────────────────────────
   EXPERIÊNCIAS — "O Vale dos Vinhedos começa lá fora." (seção 06 da home)

   Vem logo depois da Localização (mapa, endereço, rota) e muda de tom de
   propósito: fotografia em destaque e um índice editorial das experiências
   — Vinhos, Gastronomia, Paisagens, Cultura — no lugar de cards. Sem
   distâncias, horários ou atrações inventadas: as únicas vinícolas citadas
   são as que já estavam no site antigo.

   A foto fica sempre parada. Cada pilar é um botão: o hover/foco destaca o
   pilar no índice e o clique abre um pop-out (Dialog) com alguns lugares
   daquele pilar — nome, tempo aproximado de carro, localização e "Ver no
   Maps". Os lugares ficam em src/data/experiencias.ts.

   Desktop: cabeçalho em duas colunas → foto + índice com o CTA fechando a
   coluna. Celular: cabeçalho → foto → índice → CTA.

   Foto: src/assets/experiencias/vale-dos-vinhedos.webp (recorte de
   src/assets/vale.webp sem as marcas de busca que havia na base).
   O CTA "O que mais visitar" leva à página /vale-dos-vinhedos do próprio
   site (routes/vale-dos-vinhedos.tsx).
   ──────────────────────────────────────────────────────────────────────── */

export function Experiences() {
  // pilar em foco (hover/foco do teclado) — null = nenhum
  const [ativo, setAtivo] = useState<number | null>(null);
  // pilar com o pop-out aberto — null = fechado
  const [aberto, setAberto] = useState<number | null>(null);
  const pilarAberto = aberto === null ? null : PILARES_EXPERIENCIA[aberto];

  return (
    <section
      id="experiencias"
      aria-labelledby="experiencias-titulo"
      className="overflow-hidden bg-background py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* ── Cabeçalho ─────────────────────────────────────────────────── */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4">
              <span aria-hidden className="h-px w-8 bg-wine/60" />
              Experiências
            </p>
            <h2
              id="experiencias-titulo"
              className="mt-4 font-display text-[2.1rem] leading-[1.06] sm:mt-6 sm:text-5xl lg:text-[3.1rem] xl:text-[3.5rem]"
            >
              <span className="block">O Vale dos Vinhedos</span>
              <span className="block text-wine">começa lá fora.</span>
            </h2>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5 lg:col-start-8">
            <p className="hidden text-[0.72rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase sm:block">
              Agora, descubra o que existe ao seu redor
            </p>
            <p className="text-[0.95rem] leading-relaxed text-foreground/75 sm:mt-5 sm:text-lg sm:leading-[1.65] xl:text-[1.2rem]">
              Entre vinhedos, sabores, paisagens e histórias, o Vale dos Vinhedos transforma cada
              passeio em parte da sua estadia.
            </p>
          </Reveal>
        </div>

        {/* ── Foto + índice editorial ───────────────────────────────────── */}
        <div className="mt-7 grid gap-5 sm:mt-10 sm:gap-12 md:mt-12 lg:mt-14 lg:grid-cols-12 lg:items-start lg:gap-12 xl:gap-16">
          <Reveal className="lg:col-span-7 xl:col-span-8">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary sm:aspect-[3/2] lg:aspect-square xl:aspect-[16/15]">
              <img
                src={imgVale}
                alt="Parreirais do Vale dos Vinhedos com uma vinícola de arquitetura italiana ao fundo e as montanhas da Serra Gaúcha no horizonte"
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover object-[64%_center] sm:object-center"
              />
            </figure>
          </Reveal>

          <div className="lg:col-span-5 xl:col-span-4">
            <ol onMouseLeave={() => setAtivo(null)} onBlur={() => setAtivo(null)}>
              {PILARES_EXPERIENCIA.map((p, i) => (
                <li key={p.nome}>
                  <Reveal delay={120 + i * 90}>
                    <PilarItem
                      numero={i + 1}
                      pilar={p}
                      ativo={ativo === i}
                      esmaecido={ativo !== null && ativo !== i}
                      onAtivar={() => setAtivo(i)}
                      onAbrir={() => setAberto(i)}
                    />
                  </Reveal>
                </li>
              ))}
            </ol>

            {/* CTA — fecha o índice e leva à página completa do Vale */}
            <Reveal delay={520}>
              <div className="mt-2 border-t border-foreground/15 pt-7 sm:pt-9">
                <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                  Quer descobrir ainda mais?
                </p>
                <p className="mt-2 font-display text-[1.4rem] leading-tight sm:mt-3 sm:text-[1.6rem] font-bold tracking-[-0.02em]">
                  Explore o Vale dos Vinhedos
                </p>
                <Link to="/vale-dos-vinhedos" className="btn-base btn-primary mt-5 sm:mt-6">
                  O que mais visitar
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <Dialog open={aberto !== null} onOpenChange={(o) => !o && setAberto(null)}>
        {pilarAberto && aberto !== null && (
          <LugaresPopout numero={aberto + 1} pilar={pilarAberto} />
        )}
      </Dialog>
    </section>
  );
}

/* ── Pop-out com os lugares de cada pilar ─────────────────────────────── */

function LugaresPopout({ numero, pilar }: { numero: number; pilar: PilarExperiencia }) {
  return (
    <DialogContent className="max-h-[88svh] w-[calc(100%-2rem)] max-w-xl grid-cols-[minmax(0,1fr)] gap-0 overflow-y-auto rounded-2xl border-foreground/10 p-0 sm:rounded-2xl">
      <div className="px-7 pt-8 pb-6 sm:px-9 sm:pt-10">
        <p className="eyebrow flex items-center gap-3">
          <span className="font-display font-light tabular-nums">
            {String(numero).padStart(2, "0")}
          </span>
          <span aria-hidden className="h-px w-6 bg-wine/60" />
          Experiências
        </p>
        <DialogTitle className="mt-4 font-display text-[2rem] leading-none font-bold tracking-[-0.025em]">
          {pilar.nome}
        </DialogTitle>
        <DialogDescription className="mt-3 text-[0.95rem] leading-relaxed">
          {pilar.texto}
        </DialogDescription>
      </div>

      <ul className="border-t border-foreground/10">
        {pilar.lugares.map((l) => (
          <li
            key={l.nome}
            className="flex items-center gap-4 border-b border-foreground/10 px-7 py-4 last:border-b-0 sm:px-9"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold tracking-tight">{l.nome}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Car aria-hidden className="size-3.5 text-wine/80" strokeWidth={1.75} />
                  {l.tempo}
                </span>
                <span className="inline-flex min-w-0 items-start gap-1.5">
                  <MapPin
                    aria-hidden
                    className="mt-0.5 size-3.5 shrink-0 text-wine/80"
                    strokeWidth={1.75}
                  />
                  <span>{l.local}</span>
                </span>
              </p>
            </div>
            <a
              href={linkMaps(l)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ver ${l.nome} no Google Maps`}
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full whitespace-nowrap border border-foreground/15 px-3.5 py-2 text-xs font-semibold text-wine transition-colors duration-300 hover:border-wine/50"
            >
              Ver no Maps
              <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </li>
        ))}
      </ul>

      <p className="bg-cream px-7 py-4 text-xs leading-relaxed text-muted-foreground sm:px-9">
        Tempos aproximados de carro a partir da pousada. Confirme horários e reservas diretamente
        com cada lugar.
      </p>
    </DialogContent>
  );
}

function PilarItem({
  numero,
  pilar,
  ativo,
  esmaecido,
  onAtivar,
  onAbrir,
}: {
  numero: number;
  pilar: PilarExperiencia;
  ativo: boolean;
  esmaecido: boolean;
  onAtivar: () => void;
  onAbrir: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onAtivar}
      onFocus={onAtivar}
      onClick={onAbrir}
      aria-haspopup="dialog"
      className={`relative grid w-full cursor-pointer grid-cols-[2.25rem_1fr_auto] items-start border-t border-foreground/10 py-4 text-left sm:grid-cols-[2.75rem_1fr] sm:py-7 transition-opacity duration-500 ease-out outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine ${
        esmaecido ? "opacity-45" : "opacity-100"
      }`}
    >
      {/* fio em vinho que percorre a linha divisória do pilar em foco */}
      <span
        aria-hidden
        className={`absolute -top-px left-0 h-px w-full origin-left bg-wine transition-transform duration-700 ease-out ${
          ativo ? "scale-x-100" : "scale-x-0"
        }`}
      />

      <span
        className={`pt-1 font-display text-sm font-light sm:pt-2 tabular-nums transition-colors duration-500 ${
          ativo ? "text-wine" : "text-foreground/40"
        }`}
      >
        {String(numero).padStart(2, "0")}
      </span>

      <span className="block">
        <span
          className={`block font-display text-[1.4rem] leading-none sm:text-[1.75rem] font-bold tracking-[-0.025em] transition-colors duration-500 xl:text-[2rem] ${
            ativo ? "text-wine" : "text-foreground"
          }`}
        >
          {pilar.nome}
        </span>
        <span className="mt-1.5 block max-w-[34ch] text-[0.85rem] leading-relaxed text-muted-foreground sm:mt-3 sm:text-[0.95rem]">
          {pilar.texto}
        </span>
        <span className="mt-4 hidden items-center gap-2 text-[0.7rem] font-semibold tracking-[0.18em] text-wine uppercase sm:inline-flex">
          Ver lugares
          <ArrowRight
            aria-hidden
            className={`size-3.5 transition-transform duration-500 ease-out ${ativo ? "translate-x-1" : ""}`}
          />
        </span>
      </span>

      {/* celular: no lugar do "Ver lugares", uma seta discreta à direita */}
      <span
        aria-hidden
        className={`grid size-9 place-items-center self-center rounded-full border transition-colors duration-500 sm:hidden ${
          ativo ? "border-wine/50 text-wine" : "border-foreground/15 text-wine"
        }`}
      >
        <ArrowRight className="size-3.5" />
      </span>
    </button>
  );
}
