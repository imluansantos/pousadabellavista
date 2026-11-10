import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { RESERVAR } from "@/data/site";
import { acomodacoes } from "@/data/acomodacoes";

/* ─────────────────────────────────────────────────────────────────────────────
   ACOMODAÇÕES — logo após "A Experiência Bella Vista"

   As três acomodações em colunas: foto natural em cima (com o número e a
   cor de assinatura de cada quarto como detalhe) e, embaixo, nome, frase e
   as duas ações — "Conhecer a acomodação" (página dedicada; o card inteiro é
   clicável) e "Reservar" (sistema de reservas).

   No celular as três viram um carrossel com deslize lateral, pensado para
   deixar claro que há mais para ver: um card inteiro e a ponta do próximo
   à vista, os cards fora de foco ficam um pouco menores e mais claros, um
   "empurrãozinho" automático na primeira vez que o carrossel aparece, e
   embaixo barras de progresso, o contador 01 / 03 com o nome do quarto e
   setas.

   No hover a foto "salta" um pouco, o fio na cor do quarto percorre a base
   e o nome ganha essa cor. A acomodação do meio desce um pouco no desktop.

   Textos, fotos e cor de assinatura (`tema`) em src/data/acomodacoes.ts — os
   mesmos dados alimentam a página de cada acomodação.
   ──────────────────────────────────────────────────────────────────────── */

export function Accommodations() {
  const trilho = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [tocou, setTocou] = useState(false);
  const total = acomodacoes.length;

  // qual card está em foco no carrossel (só faz diferença no celular)
  const atualizar = useCallback(() => {
    const el = trilho.current;
    if (!el) return;
    const cards = [...el.children] as HTMLElement[];
    const base = el.getBoundingClientRect().left + 24;
    let melhor = 0;
    let menor = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.getBoundingClientRect().left - base);
      if (d < menor) {
        menor = d;
        melhor = i;
      }
    });
    setAtivo(melhor);
  }, []);

  const irPara = (i: number) => {
    const el = trilho.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    setTocou(true);
    el.scrollTo({ left: card.offsetLeft - 24, behavior: "smooth" });
  };

  // "empurrãozinho": na primeira vez que o carrossel aparece no celular, ele
  // desliza um pouco e volta, mostrando que dá para arrastar para o lado
  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const celular = window.matchMedia("(max-width: 767px)").matches;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!celular || reduzir) return;
    let t1 = 0;
    let t2 = 0;
    let t3 = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        obs.disconnect();
        t1 = window.setTimeout(() => {
          if (el.scrollLeft > 4) return;
          // o "snap" desligado por um instante, senão ele puxa de volta na hora
          el.style.scrollSnapType = "none";
          el.scrollTo({ left: 72, behavior: "smooth" });
          t2 = window.setTimeout(() => {
            el.scrollTo({ left: 0, behavior: "smooth" });
            t3 = window.setTimeout(() => (el.style.scrollSnapType = ""), 700);
          }, 650);
        }, 700);
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  return (
    <section
      id="acomodacoes"
      aria-labelledby="acomodacoes-titulo"
      className="relative overflow-hidden secao-filetes bg-cream py-16 sm:py-24 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* ── Cabeçalho ─────────────────────────────────────────────────── */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4">
              <span aria-hidden className="h-px w-8 bg-wine/60" />
              Acomodações
            </p>
            <h2
              id="acomodacoes-titulo"
              className="mt-4 font-display text-[2.15rem] leading-[1.08] text-balance sm:mt-5 sm:text-5xl lg:text-[2.75rem] xl:text-[3rem]"
            >
              <span className="sm:block">Três refúgios, cada um</span>{" "}
              <span className="text-wine sm:block">com sua própria luz.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <p className="max-w-[44ch] text-base leading-relaxed text-muted-foreground sm:text-[1.05rem] lg:pb-1.5">
              {/* no celular, uma versão mais curta do texto */}
              <span className="sm:hidden">
                Cada acomodação com seu próprio ritmo de descanso. Escolha a sua e deixe o resto com
                a gente.
              </span>
              <span className="hidden sm:inline">
                Do primeiro raio de sol sobre o vale ao último tom dourado entre as parreiras, cada
                acomodação tem seu próprio ritmo de descanso. Escolha a sua e deixe o resto com a
                gente.
              </span>
            </p>
          </Reveal>
        </div>

        {/* ── Acomodações ───────────────────────────────────────────────── */}
        {/* no celular: carrossel com deslize lateral (um card e a ponta do
            próximo à vista); do tablet para cima: três colunas */}
        <div
          ref={trilho}
          onScroll={atualizar}
          onPointerDown={() => setTocou(true)}
          onTouchStart={() => setTocou(true)}
          aria-label="Acomodações"
          className="-mx-6 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-6 [scrollbar-width:none] sm:mt-14 md:mx-0 md:mt-16 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:gap-8 [&::-webkit-scrollbar]:hidden"
        >
          {acomodacoes.map((a, i) => (
            <Reveal
              key={a.slug}
              delay={i * 120}
              className={`w-[82%] shrink-0 snap-start sm:w-[58%] md:w-auto ${i === 1 ? "md:mt-16" : ""}`}
            >
              <article
                className={`group relative transition-[opacity,scale] duration-500 ease-out md:scale-100 md:opacity-100 ${
                  ativo === i ? "scale-100 opacity-100" : "scale-[0.96] opacity-60"
                }`}
                style={{ "--theme-color": a.tema } as CSSProperties}
              >
                {/* foto natural — "salta" um pouco no hover */}
                <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-background shadow-[0_28px_50px_-30px_hsl(var(--theme-color)/0.55)] transition-[translate,scale,box-shadow] duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:shadow-[0_40px_70px_-30px_hsl(var(--theme-color)/0.8)] md:aspect-[4/5]">
                  <img
                    src={a.fotoCard ?? a.foto}
                    alt={a.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  {/* número da acomodação */}
                  <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/90 py-1 pr-3 pl-2 text-[0.68rem] font-semibold tracking-[0.14em] text-foreground tabular-nums backdrop-blur-sm">
                    <span
                      aria-hidden
                      className="size-2 rounded-full"
                      style={{ backgroundColor: "hsl(var(--theme-color))" }}
                    />
                    {String(i + 1).padStart(2, "0")}
                    <span className="text-foreground/40">/ {String(acomodacoes.length).padStart(2, "0")}</span>
                  </span>
                  {/* fio na cor da acomodação que percorre a base no hover */}
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-1 w-12 transition-[width] duration-700 ease-out group-hover:w-full"
                    style={{ backgroundColor: "hsl(var(--theme-color))" }}
                  />
                </div>

                {/* texto */}
                <div className="pt-4 sm:pt-6">
                  <h3 className="font-display text-[1.45rem] sm:text-[1.75rem] leading-tight font-bold tracking-[-0.02em] transition-colors duration-500 group-hover:text-[hsl(var(--theme-color))]">
                    {a.nome}
                  </h3>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted-foreground sm:mt-2.5 sm:text-[0.98rem]">
                    {a.resumo}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-t border-foreground/10 pt-3.5 text-[0.84rem] font-semibold sm:mt-5 sm:pt-4 sm:text-[0.88rem]">
                    {/* link "esticado": o card inteiro leva à página */}
                    <Link
                      to="/acomodacoes/$slug"
                      params={{ slug: a.slug }}
                      aria-label={`Conhecer a acomodação ${a.nome}`}
                      className="flex items-center gap-2 whitespace-nowrap text-foreground transition-colors after:absolute after:inset-0 after:content-[''] hover:text-wine"
                    >
                      Conhecer a acomodação
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <a
                      href={`${RESERVAR}?suite=${a.slug}`}
                      aria-label={`Reservar a acomodação ${a.nome}`}
                      className="relative z-10 flex items-center gap-1.5 whitespace-nowrap text-muted-foreground transition-colors hover:text-wine"
                    >
                      Reservar
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* controles do carrossel (celular / tablet pequeno): barras de
            progresso, contador com o nome do quarto e setas */}
        <div className="mt-2 flex items-center justify-between gap-3 rounded-full border border-foreground/10 bg-white py-2 pr-2 pl-3.5 shadow-[0_14px_30px_-18px_rgba(40,20,16,0.35)] md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex shrink-0 items-center gap-1" aria-hidden>
              {acomodacoes.map((a, i) => (
                <button
                  key={a.slug}
                  type="button"
                  tabIndex={-1}
                  onClick={() => irPara(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    ativo === i ? "w-7 bg-wine" : "w-3 bg-foreground/20"
                  }`}
                />
              ))}
            </div>
            <div className="text-muted-foreground" aria-live="polite">
              {/* contador em cima, nome do quarto embaixo: o nome sempre
                  aparece inteiro, mesmo nos celulares mais estreitos */}
              <p className="flex flex-col leading-tight">
                <span className="font-display text-[0.68rem] font-semibold tracking-[0.08em] tabular-nums">
                  <span className="text-wine">{String(ativo + 1).padStart(2, "0")}</span>
                  <span className="mx-0.5 text-foreground/30">/</span>
                  {String(total).padStart(2, "0")}
                </span>
                <span className="mt-0.5 text-[0.86rem] font-medium whitespace-nowrap text-foreground">
                  {acomodacoes[ativo]?.nome}
                </span>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => irPara(Math.max(0, ativo - 1))}
              disabled={ativo === 0}
              aria-label="Acomodação anterior"
              className="btn-base btn-outline size-11 px-0! py-0! max-[359px]:hidden transition-opacity disabled:opacity-35 [&:hover_svg]:transform-none!"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => irPara(Math.min(total - 1, ativo + 1))}
              disabled={ativo === total - 1}
              aria-label="Próxima acomodação"
              className="btn-base btn-primary size-11 px-0! py-0! transition-opacity disabled:opacity-35 [&:hover_svg]:transform-none!"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
