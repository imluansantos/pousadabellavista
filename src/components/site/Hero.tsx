import { ArrowUpRight } from "lucide-react";
import { RESERVAR } from "@/data/site";
import { capas } from "@/data/capas";
import heroMobile from "@/assets/hero-mobile.webp";

// Hero cinematográfica: a foto ocupa toda a seção, com um overlay em duas
// camadas (mais escuro à esquerda — onde fica o texto — esmaecendo para a
// direita, e uma leve sombra na base pra dar profundidade). O bloco de
// texto fica alinhado à esquerda, sem card/caixa por trás, só tipografia
// grande sobre a fotografia. `items-center` no <section> centraliza o bloco
// verticalmente; o `pt-*` no wrapper garante uma folga segura abaixo do
// header fixo em telas mais baixas.
export function Hero() {
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
          pra direita onde a foto aparece mais + leve escurecimento na base */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-28 lg:px-10 lg:pt-24">
        <div className="max-w-xl">
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
        </div>
      </div>
    </section>
  );
}
