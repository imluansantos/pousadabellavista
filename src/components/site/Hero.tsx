import { ArrowUpRight } from "lucide-react";
import { RESERVAR, avaliacoes } from "@/data/site";
import { HORARIOS } from "@/data/reservas";
import { capas } from "@/data/capas";
import heroMobile from "@/assets/hero-mobile.webp";

// Hero cinematográfica: a foto ocupa toda a seção, com um overlay em duas
// camadas (mais escuro à esquerda, onde fica o texto, esmaecendo para a
// direita, e uma leve sombra na base pra dar profundidade). O bloco de
// texto fica alinhado à esquerda, sem card/caixa por trás, só tipografia
// grande sobre a fotografia. `items-center` no <section> centraliza o bloco
// verticalmente; o `pt-*` no wrapper garante uma folga segura abaixo do
// header fixo em telas mais baixas.
//
// À direita (desktop), a "ficha da casa": as informações práticas em
// tipografia e fios finos, como a etiqueta de um vinho ou o cartão de um
// hotel antigo. De propósito SEM caixas, pílulas, estrelas ou ícones, que
// deixam a Hero com cara de template. No celular, vira uma linha discreta
// abaixo do botão. Notas em src/data/site.ts (`avaliacoes`) e horários em
// src/data/reservas.ts (`HORARIOS`).

const nota = (fonte: string) => avaliacoes.find((a) => a.fonte.startsWith(fonte))?.nota;

const FICHA = [
  { rotulo: "Chegada", valor: `a partir das ${HORARIOS.checkIn}` },
  { rotulo: "Saída", valor: `até as ${HORARIOS.checkOut}` },
  { rotulo: "Café da manhã", valor: "incluso na diária" },
];

export function Hero() {
  const google = nota("Google");
  const booking = nota("Booking");

  return (
    <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      {/* foto principal (LCP): carrega primeiro e com prioridade alta. No
          celular vem um recorte em pé, bem mais leve, já enquadrado na
          fachada; do tablet em diante, a foto inteira em várias resoluções
          (src/data/capas.ts), até 3200px em telas grandes ou retina */}
      <picture>
        <source media="(max-width: 767px)" srcSet={heroMobile} />
        <img
          src={capas.home.src}
          srcSet={capas.home.srcSet}
          sizes="100vw"
          alt="Fachada iluminada da Pousada Bella Vista à noite, no Vale dos Vinhedos"
          fetchPriority="high"
          className="hero-zoom-in absolute inset-0 h-full w-full object-cover object-center md:object-[center_40%]"
        />
      </picture>

      {/* overlay: esquerda mais escura (legibilidade do texto), esmaecendo
          pra direita onde a foto aparece mais + leve escurecimento na base,
          que também dá leitura à ficha da casa no canto inferior direito */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
      {/* desktop: sombra suave na direita, atrás da ficha da casa (a foto é
          mais clara e cheia de luzes desse lado) */}
      <div className="absolute inset-0 hidden bg-gradient-to-l from-ink/90 from-0% via-ink/60 via-30% to-transparent to-60% lg:block" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-28 lg:grid lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-10 lg:pt-24">
        <div className="max-w-xl lg:col-span-7">
          <h1 className="fade-up font-display text-4xl font-bold leading-[1.08] text-primary-foreground sm:text-5xl lg:text-[3.4rem]">
            Uma{" "}
            {/* destaque em vinho (--wine): faixa atrás da parte de baixo das
                letras, como marca-texto */}
            <span
              className="whitespace-nowrap"
              style={{
                backgroundImage:
                  "linear-gradient(transparent 62%, var(--wine) 62%, var(--wine) 90%, transparent 90%)",
              }}
            >
              bela vista
            </span>{" "}
            para os seus melhores dias
          </h1>
          <p
            className="fade-up mt-5 max-w-sm text-base text-primary-foreground/80 sm:text-[1.05rem]"
            style={{ animationDelay: "150ms" }}
          >
            Pousada familiar no Vale dos Vinhedos, em <br></br>Bento Gonçalves.
          </p>
          <a
            href={RESERVAR}
            className="fade-up btn-base btn-ghost-light mt-9"
            style={{ animationDelay: "300ms" }}
          >
            Reservar
            <ArrowUpRight className="size-3.5" />
          </a>

          {/* celular e tablet: a ficha resumida em uma linha */}
          <p
            className="fade-up mt-8 text-[0.8rem] leading-relaxed text-primary-foreground/65 lg:hidden"
            style={{ animationDelay: "450ms" }}
          >
            {google && (
              <>
                <span className="font-semibold text-primary-foreground">{google}</span> no Google
                <span aria-hidden className="mx-2.5 text-primary-foreground/30">/</span>
              </>
            )}
            Chegada a partir das {HORARIOS.checkIn}
            <span aria-hidden className="mx-2.5 text-primary-foreground/30">/</span>
            Café da manhã incluso
          </p>
        </div>

        {/* desktop: a ficha da casa */}
        <aside
          aria-label="A pousada em resumo"
          className="fade-up relative hidden pl-8 text-primary-foreground [text-shadow:0_1px_16px_rgb(0_0_0/0.5)] lg:col-span-4 lg:col-start-9 lg:block"
          style={{ animationDelay: "450ms" }}
        >
          {/* fio vertical fino, com um trecho em vinho no topo (a "fita" da
              etiqueta), na mesma cor do marca-texto do título */}
          <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-white/30" />
          <span aria-hidden className="absolute top-0 left-0 h-16 w-[3px] -translate-x-px rounded-full bg-wine" />

          {google && (
            <div className="flex items-end gap-4 border-b border-white/20 pb-5">
              {/* a nota com o mesmo marca-texto vinho de "bela vista" */}
              <p className="font-display text-[3.6rem] leading-[0.82] font-bold tracking-[-0.04em]">
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(transparent 60%, var(--wine) 60%, var(--wine) 88%, transparent 88%)",
                  }}
                >
                  {google}
                </span>
              </p>
              <p className="pb-1 text-[0.85rem] leading-snug text-white/85">
                nota no Google
                {booking && (
                  <>
                    <br />
                    {booking} no Booking.com
                  </>
                )}
              </p>
            </div>
          )}

          <dl className="divide-y divide-white/20">
            {FICHA.map((item) => (
              <div key={item.rotulo} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="text-[0.68rem] font-semibold tracking-[0.2em] text-white/70 uppercase">
                  {item.rotulo}
                </dt>
                <dd className="text-right text-[0.97rem] whitespace-nowrap text-white">{item.valor}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
