import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Faq05 } from "@/components/ui/faq-05";
import { FAQ_HOME, TODAS_PERGUNTAS } from "@/data/faq";

/* ─────────────────────────────────────────────────────────────────────────────
   PERGUNTAS FREQUENTES — logo após o Instagram

   Bloco "FAQ 5" do 21st.dev (src/components/ui/faq-05.tsx): à esquerda o
   título e três horários de referência; à direita as 6 dúvidas mais comuns,
   uma aberta por vez. Abaixo da caixa, o convite para a página com todas as
   perguntas (/perguntas-frequentes).

   As perguntas e respostas ficam em src/data/faq.ts (a lista da Home é a
   `FAQ_HOME`).
   ──────────────────────────────────────────────────────────────────────── */

const HORARIOS = [
  { valor: "14h", label: "Check-in" },
  { valor: "12h", label: "Check-out" },
  { valor: "24h", label: "Recepção" },
];

export function Faq() {
  const items = FAQ_HOME.map((p) => ({ id: p.id, q: p.pergunta, a: p.resposta }));

  return (
    <section
      id="perguntas-frequentes"
      aria-labelledby="faq-titulo"
      className="overflow-hidden secao-filetes bg-cream py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <Faq05
            items={items}
            {...(items[0] ? { defaultValue: items[0].id } : {})}
            intro={
              <>
                <p className="eyebrow flex items-center gap-4">
                  <span aria-hidden className="h-px w-8 bg-wine/60" />
                  Perguntas frequentes<span className="hidden sm:inline">&nbsp;(FAQ)</span>
                </p>
                <h2
                  id="faq-titulo"
                  className="mt-3 font-display text-[2rem] leading-[1.08] sm:mt-5 sm:text-[2.6rem] xl:text-[2.85rem]"
                >
                  <span className="block">Antes de chegar,</span>
                  <span className="block text-wine">tudo esclarecido.</span>
                </h2>
                <p className="mt-3 max-w-[36ch] text-[0.92rem] leading-relaxed text-muted-foreground sm:mt-5 sm:text-[1.02rem]">
                  <span className="sm:hidden">
                    As dúvidas mais comuns sobre a hospedagem, respondidas por quem cuida da sua
                    estadia.
                  </span>
                  <span className="hidden sm:inline">
                    As perguntas que mais recebemos sobre a hospedagem, respondidas por quem cuida
                    de cada detalhe da sua estadia.
                  </span>
                </p>

                {/* horários de referência */}
                <dl className="mt-6 grid grid-cols-3 border-t border-foreground/10 sm:mt-8 md:mt-auto">
                  {HORARIOS.map((h, i) => (
                    <div
                      key={h.label}
                      className={`pt-4 sm:pt-5 ${i > 0 ? "border-l border-foreground/10 pl-4 sm:pl-5" : ""}`}
                    >
                      <dt className="text-[0.62rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                        {h.label}
                      </dt>
                      <dd className="mt-1 font-display text-xl font-bold sm:mt-1.5 sm:text-2xl tracking-[-0.02em] text-foreground">
                        {h.valor}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            }
          />
        </Reveal>

        {/* ── Convite para a página completa (fora da caixa) ─────────────── */}
        <Reveal delay={140} className="mt-7 flex flex-col items-center gap-4 text-center sm:mt-10 sm:gap-5 md:mt-12">
          <p className="max-w-[46ch] text-[0.9rem] leading-relaxed text-muted-foreground sm:text-[0.98rem]">
            Ficou alguma dúvida? Reunimos as{" "}
            <span className="font-semibold text-foreground">
              {TODAS_PERGUNTAS.length} respostas
            </span>{" "}
            sobre a hospedagem em uma única página.
          </p>
          <Link to="/perguntas-frequentes" className="btn-base btn-outline">
            Ver todas as perguntas
            <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
