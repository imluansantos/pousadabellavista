import { Link } from "@tanstack/react-router";
import { acomodacoes } from "@/data/acomodacoes";

/* ─────────────────────────────────────────────────────────────────────────────
   ESCOLHA SUA ACOMODAÇÃO (seção 1 da página de cada suíte)

   Seletor compacto com as três suítes, dentro do cabeçalho da página (coluna
   `aside` do PageHero). Cada opção mostra a miniatura real e o nome; a suíte
   aberta fica marcada ("Você está aqui") e não é link.
   • desktop: três colunas lado a lado;
   • celular: faixa com rolagem lateral (arrastar), com encaixe suave.
   ──────────────────────────────────────────────────────────────────────── */

export function SeletorSuites({ atual }: { atual: string }) {
  return (
    // `w-0 min-w-full`: a faixa rolável do celular não alarga a coluna do
    // cabeçalho (sem isso, o texto do PageHero passaria da tela)
    <nav
      aria-labelledby="seletor-suites-titulo"
      className="w-0 min-w-full rounded-2xl border border-white/10 bg-ink/45 p-4 backdrop-blur-md sm:p-5"
    >
      <p
        id="seletor-suites-titulo"
        className="text-[0.68rem] font-semibold tracking-[0.24em] text-white/70 uppercase"
      >
        Escolha sua acomodação
      </p>
      <ul className="-mx-1 mt-3 flex snap-x scroll-px-1 px-1 py-1 snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-1 [&::-webkit-scrollbar]:hidden">
        {acomodacoes.map((s) => {
          const selecionada = s.slug === atual;
          const conteudo = (
            <>
              <span
                className={`relative block aspect-[4/3] overflow-hidden rounded-lg ring-1 transition-[box-shadow,opacity] duration-300 ${
                  selecionada
                    ? "ring-2 ring-white"
                    : "opacity-80 ring-white/15 group-hover:opacity-100 group-hover:ring-white/50"
                }`}
              >
                <img
                  src={s.capa.pequena}
                  alt=""
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </span>
              <span className="mt-2.5 flex items-center gap-2">
                <span
                  aria-hidden
                  className={`size-1.5 shrink-0 rounded-full ${selecionada ? "" : "bg-white/30"}`}
                  style={selecionada ? { backgroundColor: `hsl(${s.tema})`, boxShadow: "0 0 0 2px #fff" } : undefined}
                />
                <span className="truncate text-[0.88rem] font-semibold text-white">{s.nome}</span>
              </span>
              <span className="mt-0.5 block pl-3.5 text-[0.72rem] text-white/60">
                {selecionada ? "Você está aqui" : "Ver suíte"}
              </span>
            </>
          );

          return (
            <li key={s.slug} className="w-[42%] min-w-[8.5rem] shrink-0 snap-start sm:w-[30%] lg:w-auto lg:min-w-0">
              {selecionada ? (
                <span aria-current="page" className="group block">
                  {conteudo}
                </span>
              ) : (
                <Link
                  to="/acomodacoes/$slug"
                  params={{ slug: s.slug }}
                  aria-label={`Ver a suíte ${s.nome}`}
                  className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {conteudo}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
