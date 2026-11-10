import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { acomodacoes } from "@/data/acomodacoes";

/* Etapa 1: escolha da suíte. Três opções com a foto real, o nome e a frase
   de cada uma; a escolhida fica marcada. "Conhecer a suíte" abre a página
   dela numa nova aba, para não perder o pedido em andamento. */

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
      <div className="grid gap-4 sm:grid-cols-3">
        {acomodacoes.map((a) => {
          const marcada = a.slug === suite;
          return (
            <div key={a.slug} className="group relative">
              <label
                className={`block cursor-pointer overflow-hidden rounded-xl border bg-card transition-[border-color,box-shadow] duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-wine has-[:focus-visible]:ring-offset-2 ${
                  marcada ? "border-wine shadow-[0_18px_40px_-24px_rgba(96,0,20,0.55)]" : "border-border hover:border-foreground/25"
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
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <img
                    src={a.capa.pequena}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden
                    className={`absolute top-3 right-3 grid size-7 place-items-center rounded-full border transition-colors ${
                      marcada ? "border-wine bg-wine text-white" : "border-white/80 bg-ink/20 text-transparent backdrop-blur-sm"
                    }`}
                  >
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                </span>
                <span className="block p-4 pb-12">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: `hsl(${a.tema})` }} />
                    <span className="text-[1.05rem] font-bold tracking-[-0.01em]">{a.nome}</span>
                  </span>
                  <span className="mt-1.5 block text-[0.85rem] leading-snug text-muted-foreground">{a.tagline}</span>
                </span>
              </label>
              <Link
                to="/acomodacoes/$slug"
                params={{ slug: a.slug }}
                target="_blank"
                className="absolute bottom-4 left-4 inline-flex items-center gap-1 text-[0.78rem] font-medium text-wine underline decoration-wine/30 underline-offset-4 hover:decoration-wine"
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
