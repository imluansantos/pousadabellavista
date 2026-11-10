import { Check } from "lucide-react";
import { ETAPAS, type Etapa } from "@/lib/reservas/pedido";

/* Indicador das 4 etapas. As já concluídas são clicáveis para voltar. */

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
      <ol className="flex items-center gap-2 sm:gap-3">
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
                className={`text-[0.82rem] font-medium ${ehAtual ? "text-foreground" : "text-muted-foreground"} ${
                  ehAtual ? "" : "hidden sm:inline"
                }`}
              >
                {e.titulo}
              </span>
            </>
          );
          return (
            <li key={e.id} className="flex min-w-0 items-center gap-2 sm:gap-3">
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
              {i < ETAPAS.length - 1 && <span aria-hidden className="h-px w-4 bg-border sm:w-8" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
