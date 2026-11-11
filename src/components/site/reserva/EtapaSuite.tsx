import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { acomodacoes } from "@/data/acomodacoes";

/* Etapa 1: escolha da suíte. Três opções com a foto real, o nome e a frase
   de cada uma; a escolhida fica marcada. "Conhecer a suíte" abre a página
   dela numa nova aba, para não perder o pedido em andamento.

   • Celular (abaixo de sm): cada suíte é uma linha compacta, com a foto à
     esquerda e o texto à direita, para as três caberem quase numa tela só.
   • Do sm em diante: três cartões lado a lado, com a foto em cima. */

export function EtapaSuite({
  suite,
  onEscolher,
}: {
  suite: string | null;
  onEscolher: (slug: string) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">Escolha a suíte</legend>
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {acomodacoes.map((a) => {
          const marcada = a.slug === suite;
          return (
            <div key={a.slug} className="group relative">
              <label
                className={`relative flex cursor-pointer overflow-hidden rounded-xl border bg-card transition-[border-color,box-shadow] duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-wine has-[:focus-visible]:ring-offset-2 sm:block ${
                  marcada
                    ? "border-wine shadow-[0_18px_40px_-24px_rgba(96,0,20,0.55)]"
                    : "border-border hover:border-foreground/25"
                }`}
              >
                <input
                  type="radio"
                  name="suite"
                  value={a.slug}
                  checked={marcada}
                  onChange={() => onEscolher(a.slug)}
                  className="sr-only"
                />
                <span className="relative block w-[6.75rem] shrink-0 overflow-hidden sm:aspect-[4/3] sm:w-auto">
                  <img
                    src={a.capa.pequena}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:static"
                  />
                </span>

                {/* marca de escolhida: canto superior direito do cartão
                    (no celular, sobre o fundo claro; do sm em diante, sobre a foto) */}
                <span
                  aria-hidden
                  className={`absolute top-3 right-3 grid size-6 place-items-center rounded-full border transition-colors sm:size-7 ${
                    marcada
                      ? "border-wine bg-wine text-white"
                      : "border-foreground/20 bg-card text-transparent sm:border-white/80 sm:bg-ink/20 sm:backdrop-blur-sm"
                  }`}
                >
                  <Check className="size-3.5 sm:size-4" strokeWidth={2.5} />
                </span>

                <span className="block min-w-0 flex-1 py-3.5 pr-11 pl-4 pb-9 sm:p-4 sm:pb-12">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ backgroundColor: `hsl(${a.tema})` }} />
                    <span className="text-[1rem] font-bold tracking-[-0.01em] sm:text-[1.05rem]">{a.nome}</span>
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[0.82rem] leading-snug text-muted-foreground sm:mt-1.5 sm:line-clamp-none sm:text-[0.85rem]">
                    {a.tagline}
                  </span>
                </span>
              </label>
              <Link
                to="/acomodacoes/$slug"
                params={{ slug: a.slug }}
                target="_blank"
                className="absolute bottom-3 left-[7.75rem] inline-flex items-center gap-1 text-[0.76rem] font-medium text-wine underline decoration-wine/30 underline-offset-4 hover:decoration-wine sm:bottom-4 sm:left-4 sm:text-[0.78rem]"
              >
                Conhecer a suíte
                <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(abre em nova aba)</span>
              </Link>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
