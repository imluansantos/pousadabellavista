import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { acomodacoes, type Acomodacao } from "@/data/acomodacoes";
import { WHATSAPP } from "@/data/site";

/* ─────────────────────────────────────────────────────────────────────────────
   RESERVA E OUTRAS OPÇÕES (seção 5)

   Chamada final para reservar (mesmo fluxo do resto do site: o sistema de
   reservas em /reservar, com a suíte já escolhida, e o WhatsApp) e, ao lado, as outras duas suítes com
   foto e link, para quem ainda está comparando.
   ──────────────────────────────────────────────────────────────────────── */

export function ReservaSuite({ acomodacao: a }: { acomodacao: Acomodacao }) {
  const outras = acomodacoes.filter((o) => o.slug !== a.slug);

  return (
    <section aria-labelledby="reserva-titulo" className="secao-filetes bg-cream py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Reserva</p>
          <h2 id="reserva-titulo" className="mt-4 font-display text-[2rem] leading-[1.1] sm:text-[2.6rem]">
            Sua estadia na suíte {a.nome} começa aqui.
          </h2>
          <p className="mt-6 max-w-[46ch] text-[1.02rem] leading-relaxed text-muted-foreground">
            Consulte as datas disponíveis e garanta sua estadia. Ficou com alguma dúvida? Fale com
            a gente pelo WhatsApp.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/reservar" search={{ suite: a.slug }} className="btn-base btn-primary">
              Reservar agora
              <ArrowRight className="size-3.5" />
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="btn-base btn-outline"
            >
              Falar no WhatsApp
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="text-[0.72rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              Compare com as outras suítes
            </p>
          </Reveal>
          <ul className="mt-5 grid gap-6 sm:grid-cols-2">
            {outras.map((o, i) => (
              <li key={o.slug}>
                <Reveal delay={i * 120}>
                  <Link
                    to="/acomodacoes/$slug"
                    params={{ slug: o.slug }}
                    className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
                  >
                    <span className="zoom-media block aspect-[4/3] overflow-hidden rounded-xl">
                      <img
                        src={o.capa.pequena}
                        alt={o.capa.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="mt-4 flex items-start justify-between gap-4">
                      <span>
                        <span className="flex items-center gap-2.5">
                          <span
                            aria-hidden
                            className="size-2 rounded-full"
                            style={{ backgroundColor: `hsl(${o.tema})` }}
                          />
                          <span className="text-xl font-bold tracking-[-0.015em]">{o.nome}</span>
                        </span>
                        <span className="mt-1.5 block text-[0.88rem] leading-snug text-muted-foreground">
                          {o.tagline}
                        </span>
                      </span>
                      <ArrowRight
                        aria-hidden
                        className="mt-1.5 size-4.5 shrink-0 text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-wine"
                      />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
