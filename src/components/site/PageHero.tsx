import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, House } from "lucide-react";
import type { ImagemCapa } from "@/data/capas";

/* ─────────────────────────────────────────────────────────────────────────────
   CABEÇALHO PADRÃO DAS PÁGINAS INTERNAS

   Toda página nova do site (fora a Home) abre com este componente — é o
   "padrão de imagem no cabeçalho" do site. Hoje usado em:
     • /perguntas-frequentes
     • /acomodacoes/$slug

   Como é:
     • a foto ocupa a largura toda da tela, desde o topo (o menu flutua por
       cima), e termina com os dois cantos de baixo arredondados — a página
       "começa" logo abaixo dessa curva;
     • véu escuro em degradê (mais forte embaixo, onde fica o texto) e o zoom
       suave de entrada da foto, como na Hero da Home;
     • a TRILHA (Início › … › página atual) em pílula de cor sólida, no lugar
       do antigo "Voltar ao início". Cada item é clicável;
     • quando o visitante rola e a trilha sai da tela, uma cópia dela fica
       flutuando no canto inferior esquerdo — do lado oposto ao botão do
       WhatsApp e na mesma altura dele —, para voltar a qualquer momento.
       No celular ela fica mais curta (o nome da página é cortado com "…");
     • eyebrow, título grande e, opcionalmente, um texto (`children`) e uma
       coluna à direita (`aside`) — ex.: a busca do FAQ;
     • no desktop, uma marca "Role" no canto inferior direito.

   Uso:
     <PageHero
       image={capas.horarios} imageAlt="…"   // ou uma URL simples
       trail={[{ label: "Acomodações", hash: "acomodacoes" }, { label: "Videiras" }]}
       eyebrow="Acomodação"
       title="Videiras"
       aside={<Busca />}          // opcional
       veuForteNoCelular          // opcional: véu mais escuro abaixo de 1024px
       compacto                   // opcional: cabeçalho mais baixo (ex.: /reservar)
       enxutoNoCelular            // opcional: com `compacto`, ainda mais baixo no celular
       semTrilhaFlutuante         // opcional: sem a cópia flutuante da trilha
     >
       <p>Texto opcional abaixo do título</p>
     </PageHero>
   ──────────────────────────────────────────────────────────────────────── */

export interface TrilhaItem {
  label: string;
  /** âncora de uma seção da Home (ex.: "acomodacoes") — o item vira link
   *  para ela. Sem `hash`, o item é só texto (ex.: a página atual). */
  hash?: string;
}

export function PageHero({
  image,
  imageAlt,
  trail,
  eyebrow,
  title,
  aside,
  veuForteNoCelular = false,
  compacto = false,
  enxutoNoCelular = false,
  semTrilhaFlutuante = false,
  children,
}: {
  /** de preferência uma capa de src/data/capas.ts (várias resoluções);
   *  uma URL simples também funciona */
  image: string | ImagemCapa;
  /** vazio quando a foto é só decorativa */
  imageAlt: string;
  /** itens depois de "Início"; o último é a página atual */
  trail: TrilhaItem[];
  eyebrow: string;
  title: ReactNode;
  aside?: ReactNode;
  /** reforça o véu só no celular/tablet (abaixo de lg), para fotos com muitos
   *  detalhes claros atrás do texto. Ex.: páginas das acomodações. */
  veuForteNoCelular?: boolean;
  /** cabeçalho mais baixo, para páginas em que o conteúdo precisa aparecer
   *  logo (ex.: /reservar) */
  compacto?: boolean;
  /** junto com `compacto`: no celular (abaixo de 640px) o cabeçalho fica bem
   *  mais baixo, para o conteúdo da página aparecer logo (ex.: /reservar) */
  enxutoNoCelular?: boolean;
  /** não mostra a cópia flutuante da trilha (ex.: quando a página tem uma
   *  barra fixa no rodapé, como /reservar no celular) */
  semTrilhaFlutuante?: boolean;
  children?: ReactNode;
}) {
  // a trilha flutuante aparece quando a trilha do cabeçalho sai da tela
  const ancora = useRef<HTMLDivElement>(null);
  const [flutuante, setFlutuante] = useState(false);

  useEffect(() => {
    const el = ancora.current;
    if (!el) return;
    // aparece quando a trilha do cabeçalho passa por baixo do menu fixo do
    // topo (~96px); some quando ela volta a ficar visível — e também na
    // barra final do rodapé, para não cobrir os direitos reservados
    const MENU = 96;
    const FIM_DA_PAGINA = 110;
    let frame = 0;
    const atualizar = () => {
      frame = 0;
      const doc = document.documentElement;
      const noFim = doc.scrollHeight - (window.scrollY + window.innerHeight) < FIM_DA_PAGINA;
      setFlutuante(el.getBoundingClientRect().bottom < MENU && !noFim);
    };
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <header
        className={`relative isolate flex overflow-hidden rounded-b-[1.75rem] bg-ink text-white sm:rounded-b-[2.5rem] ${
          compacto
            ? enxutoNoCelular
              ? "min-h-[17rem] sm:min-h-[24rem] lg:min-h-[28rem]"
              : "min-h-[24rem] lg:min-h-[28rem]"
            : "min-h-[38rem] lg:min-h-[max(40rem,82svh)]"
        }`}
      >
        <img
          src={typeof image === "string" ? image : image.src}
          {...(typeof image === "string"
            ? {}
            : {
                srcSet: image.srcSet,
                // no celular a foto (deitada) cobre um cabeçalho em pé, então
                // aparece bem mais larga que a tela: pedimos uma versão maior
                sizes: "(max-width: 767px) 200vw, 100vw",
              })}
          fetchPriority="high"
          alt={imageAlt}
          {...(imageAlt ? {} : { "aria-hidden": true })}
          className="hero-zoom-in absolute inset-0 -z-10 h-full w-full object-cover"
        />
        {/* véu: escuro em cima (menu) e principalmente embaixo (texto) */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(20,14,12,0.55)_0%,rgba(20,14,12,0.18)_32%,rgba(20,14,12,0.45)_62%,rgba(20,14,12,0.9)_100%)]"
        />
        {/* véu extra do celular: no desktop o texto ocupa só a parte de baixo,
            mas no celular ele cobre quase a foto toda, então escurecemos a
            faixa do texto e deixamos o topo (menu) como está */}
        {veuForteNoCelular && (
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(20,14,12,0)_0%,rgba(20,14,12,0.35)_22%,rgba(20,14,12,0.62)_42%,rgba(20,14,12,0.72)_70%,rgba(20,14,12,0.6)_100%)] lg:hidden"
          />
        )}

        <div
          className={`mx-auto flex w-full max-w-7xl flex-col justify-end px-5 sm:px-8 lg:px-10 ${
            compacto
              ? enxutoNoCelular
                ? "pt-28 pb-7 sm:pt-32 sm:pb-9 md:pb-11"
                : "pt-32 pb-9 md:pb-11"
              : "pt-36 pb-10 md:pb-14 lg:pb-16"
          }`}
        >
          <div ref={ancora} className="fade-up">
            <Trilha trail={trail} />
          </div>

          <div
            className={`grid gap-8 md:mt-10 lg:grid-cols-12 lg:items-end lg:gap-12 ${
              enxutoNoCelular ? "mt-6 sm:mt-8" : "mt-8"
            }`}
          >
            <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
              <p className="fade-up flex items-center gap-4 text-[0.72rem] font-semibold tracking-[0.26em] text-white/75 uppercase [animation-delay:80ms]">
                <span aria-hidden className="h-px w-8 bg-white/50" />
                {eyebrow}
              </p>
              <h1
                className={`fade-up font-display leading-[1.03] tracking-[-0.025em] [animation-delay:140ms] sm:mt-4 sm:text-6xl lg:text-[4.25rem] ${
                  enxutoNoCelular ? "mt-3 text-[2.2rem]" : "mt-4 text-[2.6rem]"
                }`}
              >
                {title}
              </h1>
              {children && <div className="fade-up [animation-delay:200ms]">{children}</div>}
            </div>

            {aside && (
              <div className="fade-up [animation-delay:240ms] lg:col-span-5">{aside}</div>
            )}
          </div>
        </div>

        {/* marca de rolagem (desktop) */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-8 bottom-12 hidden flex-col items-center gap-3 lg:flex xl:right-10"
        >
          <span className="text-[0.6rem] font-semibold tracking-[0.3em] text-white/55 uppercase [writing-mode:vertical-rl]">
            Role
          </span>
          <span className="relative h-12 w-px overflow-hidden bg-white/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[pageHeroScroll_2.4s_ease-in-out_infinite] bg-white/80" />
          </span>
        </div>
      </header>

      {!semTrilhaFlutuante && (
        <>
          {/* trilha flutuante — canto inferior esquerdo, alinhada ao botão do
              WhatsApp (que fica no canto direito) */}
          <div
            {...(flutuante ? {} : { inert: true, "aria-hidden": true })}
            className={`fixed bottom-[2.1rem] left-4 z-40 max-w-[calc(100vw-6.5rem)] transition-[opacity,transform] duration-500 ease-out sm:left-6 sm:max-w-[calc(100vw-8rem)] ${
              flutuante ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
            }`}
          >
            <Trilha trail={trail} flutuante />
          </div>
        </>
      )}
    </>
  );
}

/** A trilha em si — usada no cabeçalho e na versão flutuante. */
function Trilha({ trail, flutuante = false }: { trail: TrilhaItem[]; flutuante?: boolean }) {
  return (
    <nav aria-label={flutuante ? "Você está em (atalho)" : "Você está em"}>
      <ol
        className={`flex max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-ink py-1.5 pr-4 pl-1.5 text-[0.78rem] text-white/60 ${
          flutuante
            ? "shadow-[0_14px_34px_-12px_rgba(20,14,12,0.55)]"
            : "inline-flex shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)]"
        }`}
      >
        <li className="shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full bg-white/10 py-1 pr-3 pl-2 font-medium text-white transition-colors hover:bg-white hover:text-ink"
          >
            <House className="size-3.5" strokeWidth={1.75} />
            Início
          </Link>
        </li>
        {trail.map((item, i) => {
          const atual = i === trail.length - 1;
          // no celular, a versão flutuante mostra só "Início › página atual"
          const esconderNoCelular = flutuante && !atual;
          return (
            <Fragment key={item.label}>
              <li
                aria-hidden
                className={`shrink-0 text-white/35 ${esconderNoCelular ? "hidden sm:block" : ""}`}
              >
                <ChevronRight className="size-3.5" />
              </li>
              <li
                className={`min-w-0 ${atual ? "truncate" : "shrink-0"} ${
                  esconderNoCelular ? "hidden sm:block" : ""
                }`}
              >
                {atual || !item.hash ? (
                  <span
                    {...(atual ? { "aria-current": "page" as const } : {})}
                    className={atual ? "font-medium text-white" : ""}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link to="/" data-secao={item.hash} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
