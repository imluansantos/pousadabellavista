import { Check } from "lucide-react";
import { ETAPAS, type Etapa } from "@/lib/reservas/pedido";

/* Indicador das 4 etapas. As já concluídas são clicáveis para voltar.

   • Celular (abaixo de lg): uma régua em 4 trechos, com "Etapa X de 4" em
     cima e o nome de cada etapa embaixo do seu trecho. Mostra o caminho
     inteiro sem esconder nomes e ocupa só uma faixa estreita.
   • Desktop: os círculos numerados ligados por fios. */

export function Etapas({
  atual,
  concluidas,
  onIr,
}: {
  atual: Etapa;
  concluidas: Set<Etapa>;
  onIr: (e: Etapa) => void;
}) {
  const idxAtual = ETAPAS.findIndex((e) => e.id === atual);
  return (
    <nav aria-label="Etapas do pedido">
      <ReguaCelular atual={atual} idxAtual={idxAtual} concluidas={concluidas} onIr={onIr} />

      <ol className="hidden items-center gap-3 lg:flex">
        {ETAPAS.map((e, i) => {
          const ehAtual = e.id === atual;
          const feita = concluidas.has(e.id) && !ehAtual;
          const clicavel = feita || i < idxAtual;
          const conteudo = (
            <>
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full text-[0.75rem] font-bold transition-colors ${
                  ehAtual
                    ? "bg-wine text-white"
                    : feita
                      ? "bg-wine/10 text-wine"
                      : "border border-border text-muted-foreground"
                }`}
              >
                {feita ? <Check aria-hidden className="size-3.5" strokeWidth={2.5} /> : i + 1}
              </span>
              <span
                className={`text-[0.82rem] font-medium ${ehAtual ? "text-foreground" : "text-muted-foreground"}`}
              >
                {e.titulo}
              </span>
            </>
          );
          return (
            <li key={e.id} className="flex min-w-0 items-center gap-3">
              {clicavel ? (
                <button
                  type="button"
                  onClick={() => onIr(e.id)}
                  className="flex items-center gap-2 rounded-full pr-1 transition-opacity hover:opacity-75"
                >
                  {conteudo}
                  <span className="sr-only">(concluída, voltar)</span>
                </button>
              ) : (
                <span className="flex items-center gap-2" aria-current={ehAtual ? "step" : undefined}>
                  {conteudo}
                </span>
              )}
              {i < ETAPAS.length - 1 && <span aria-hidden className="h-px w-8 bg-border" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Régua do celular: 4 trechos + o nome de cada etapa. */
function ReguaCelular({
  atual,
  idxAtual,
  concluidas,
  onIr,
}: {
  atual: Etapa;
  idxAtual: number;
  concluidas: Set<Etapa>;
  onIr: (e: Etapa) => void;
}) {
  return (
    <div className="lg:hidden">
      <p className="text-[0.66rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
        Etapa <span className="text-wine tabular-nums">{idxAtual + 1}</span> de {ETAPAS.length}
      </p>
      <ol className="mt-3 grid grid-cols-4 gap-1.5">
        {ETAPAS.map((e, i) => {
          const ehAtual = e.id === atual;
          const feita = i < idxAtual || (concluidas.has(e.id) && !ehAtual);
          const clicavel = feita || i < idxAtual;
          const conteudo = (
            <>
              <span
                aria-hidden
                className={`block h-[3px] rounded-full transition-colors duration-500 ${
                  ehAtual ? "bg-wine" : feita ? "bg-wine/45" : "bg-foreground/10"
                }`}
              />
              <span
                className={`mt-2 flex items-center gap-1 text-[0.72rem] leading-none ${
                  ehAtual
                    ? "font-semibold text-foreground"
                    : feita
                      ? "font-medium text-wine"
                      : "text-muted-foreground/80"
                }`}
              >
                {feita && <Check aria-hidden className="size-3 shrink-0" strokeWidth={2.75} />}
                <span className="truncate">{e.titulo}</span>
              </span>
            </>
          );
          return (
            <li key={e.id} className="min-w-0">
              {clicavel ? (
                // área de toque generosa (a régua em si é fina)
                <button type="button" onClick={() => onIr(e.id)} className="block w-full py-1.5 text-left">
                  {conteudo}
                  <span className="sr-only">(concluída, voltar)</span>
                </button>
              ) : (
                <span className="block py-1.5" aria-current={ehAtual ? "step" : undefined}>
                  {conteudo}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
