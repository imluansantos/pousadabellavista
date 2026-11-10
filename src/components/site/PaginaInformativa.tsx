import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { WHATSAPP } from "@/data/site";

/* ─────────────────────────────────────────────────────────────────────────────
   Peças compartilhadas pelas páginas informativas (políticas, regras etc.):
     • <IndicePagina>   índice fixo à esquerda, no desktop;
     • <ParteNumerada>  cabeçalho "01 Título" com fio embaixo;
     • <ContatoDuvidas> bloco creme de "Ainda com dúvidas?" no fim da página;
     • <ConsulteTambem> atalhos para outras páginas informativas.
   Usadas em /politica-de-cancelamento, /politicas-e-regras, /estacionamento
   e /horarios.
   ──────────────────────────────────────────────────────────────────────── */

export interface ParteIndice {
  id: string;
  titulo: string;
}

export function IndicePagina({ partes }: { partes: ParteIndice[] }) {
  // link para a própria página + data-secao: o RolagemSemHash rola até a
  // parte sem "#" na URL
  const pagina = useLocation({ select: (l) => l.pathname });
  return (
    <aside className="hidden lg:col-span-3 lg:block">
      <nav aria-label="Nesta página" className="sticky top-32">
        <p className="text-[0.66rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
          Nesta página
        </p>
        <ol className="mt-5 border-l border-foreground/10">
          {partes.map((p, i) => (
            <li key={p.id}>
              <a
                href={pagina}
                data-secao={p.id}
                className="-ml-px flex items-baseline gap-3 border-l border-transparent py-2.5 pl-5 text-[0.9rem] text-foreground/65 transition-colors hover:border-wine hover:text-wine"
              >
                <span className="w-5 shrink-0 text-[0.68rem] tracking-[0.1em] tabular-nums opacity-70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p.titulo}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

export function ParteNumerada({
  numero,
  id,
  titulo,
  children,
}: {
  numero: number;
  id: string;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-28">
      <header className="flex items-end gap-5 border-b border-foreground/15 pb-5">
        <span className="font-display text-5xl leading-none font-bold tracking-[-0.04em] text-wine/20 tabular-nums md:text-6xl">
          {String(numero).padStart(2, "0")}
        </span>
        <h2
          id={`${id}-titulo`}
          className="pb-1 font-display text-2xl leading-tight font-bold tracking-[-0.02em] md:text-[1.75rem]"
        >
          {titulo}
        </h2>
      </header>
      {children}
    </section>
  );
}

export function ContatoDuvidas({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section className="px-6 pb-20 md:pb-24 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 rounded-[1.75rem] bg-cream px-7 py-10 sm:px-10 md:flex-row md:items-center md:justify-between md:py-12 lg:px-14">
        <div className="max-w-xl">
          <p className="eyebrow flex items-center gap-4">
            <span aria-hidden className="h-px w-8 bg-wine/60" />
            Ainda com dúvidas?
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight sm:text-[2.2rem]">{titulo}</h2>
          <p className="mt-3 text-[1rem] leading-relaxed text-muted-foreground">{texto}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-base btn-primary">
            Falar com a equipe
            <ArrowUpRight className="size-3.5" />
          </a>
          <Link to="/perguntas-frequentes" className="btn-base btn-outline">
            Perguntas frequentes
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export interface ItemConsulte {
  icon: LucideIcon;
  titulo: string;
  href: string;
}

export function ConsulteTambem({ itens, className = "" }: { itens: ItemConsulte[]; className?: string }) {
  return (
    <nav aria-label="Consulte também" className={className}>
      <p className="text-[0.66rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
        Consulte também
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {itens.map(({ icon: Icon, titulo, href }) => {
          const externo = href.startsWith("http");
          return (
            <li key={titulo}>
              <a
                href={href}
                {...(externo ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group flex h-full items-center gap-4 rounded-2xl border border-foreground/10 p-4 transition-colors hover:border-wine/30 hover:bg-cream/60"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-wine/20 text-wine">
                  <Icon aria-hidden className="size-[1.05rem]" strokeWidth={1.75} />
                </span>
                <span className="flex-1 text-[0.92rem] leading-snug font-semibold">{titulo}</span>
                {externo ? (
                  <ArrowUpRight className="size-4 shrink-0 text-foreground/40 transition-colors group-hover:text-wine" />
                ) : (
                  <ArrowRight className="size-4 shrink-0 text-foreground/40 transition-colors group-hover:text-wine" />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
