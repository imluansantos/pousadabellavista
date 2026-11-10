import { Fragment } from "react";
import { Reveal } from "@/components/site/Reveal";
import { RevealImage } from "@/components/site/RevealImage";
import imgCesta from "@/assets/cafe/otimizadas/cafe-cesta-bom-dia.webp";
import imgGeleias from "@/assets/cafe/otimizadas/cafe-geleias.webp";

/* ─────────────────────────────────────────────────────────────────────────────
   CAFÉ DA MANHÃ — seção da home logo após as Acomodações

   Espelha "A Experiência Bella Vista" (lá: texto → imagens; aqui: imagens →
   texto). À esquerda, a foto dominante (a cesta com o cartão "Bom dia!" e a
   xícara em primeiro plano) e, sobreposta na base à direita, um detalhe de
   geleias e bolinhos com um parallax bem leve. À direita, o texto e um
   bloco condensado de informações (horário em destaque, o que vai à mesa e
   as opções sob pedido).

   No celular (versão compacta): etiqueta/título/texto curto → as duas fotos
   lado a lado (cesta maior, geleias menores alinhadas pela base) → horário
   e informações. No tablet os blocos se reorganizam na grade (via
   `contents` + `order`): texto → foto principal → informações → detalhe.

   Fotos: originais em src/assets/cafe/, versões recortadas e otimizadas em
   src/assets/cafe/otimizadas/.
   ──────────────────────────────────────────────────────────────────────── */

const NA_MESA = ["Pães artesanais", "bolos caseiros", "frutas", "geleias", "opções quentes"];

export function Breakfast() {
  return (
    <section
      id="cafe-da-manha"
      aria-labelledby="cafe-titulo"
      className="overflow-hidden bg-background py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:grid sm:gap-y-12 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-10">
        {/* ── Composição de fotos ──────────────────────────────────────
            celular: as duas fotos lado a lado, a cesta maior e as geleias
            menores alinhadas pela base; tablet: os itens entram na grade;
            desktop: a composição sobreposta */}
        <div className="order-2 flex items-end gap-3 sm:contents lg:relative lg:col-span-7 lg:block lg:pr-6 lg:pb-[16%] xl:pr-12">
          <RevealImage
            src={imgCesta}
            alt="Cesta de pães, bolinhos e croissants com o cartão de bom dia, ao lado de uma xícara de café, na mesa ao ar livre da pousada"
            className="order-2 w-[60%] sm:col-span-2 sm:w-full lg:order-none lg:w-[80%]"
            frameClassName="aspect-[4/5]"
            imgClassName="object-[center_60%]"
          />

          <RevealImage
            src={imgGeleias}
            alt="Geleias caseiras, suco de uva do Vale dos Vinhedos e bolinhos servidos no café da manhã"
            delay={260}
            parallax={28}
            className="order-4 w-[40%] self-end sm:w-full sm:self-center lg:absolute lg:right-6 lg:bottom-0 lg:z-10 lg:order-none lg:w-[42%] xl:right-12"
            frameClassName="aspect-[4/5] lg:border-8 lg:border-background"
            shadow
          />
        </div>

        {/* ── Texto ───────────────────────────────────────────────────── */}
        <div className="contents lg:col-span-5 lg:block">
          <Reveal className="order-1 sm:col-span-2 lg:order-none">
            <p className="eyebrow">Café da manhã</p>
            <h2
              id="cafe-titulo"
              className="mt-4 font-display text-[2.15rem] leading-[1.08] sm:mt-5 sm:text-5xl lg:text-[2.75rem] xl:text-[3rem]"
            >
              <span className="block text-balance">Comece o dia com calma</span>
              <span className="block text-wine">e bons sabores.</span>
            </h2>
            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-muted-foreground sm:mt-7 sm:text-[1.05rem]">
              {/* no celular, uma versão mais curta do texto */}
              <span className="sm:hidden">
                Produtos frescos, sabores caseiros e o carinho de sempre, para começar o dia sem
                pressa.
              </span>
              <span className="hidden sm:inline">
                Um café da manhã preparado para você começar o dia sem pressa, com produtos frescos,
                sabores caseiros e o carinho que faz parte da experiência Bella Vista.
              </span>
            </p>
          </Reveal>

          <Reveal delay={150} className="order-3 sm:self-center lg:order-none lg:mt-12">
            {/* horário em destaque */}
            <div className="flex flex-wrap items-end gap-x-5 gap-y-3 border-y border-foreground/10 py-5 sm:gap-x-6 sm:py-7">
              <p className="font-display text-[2.2rem] leading-none font-bold tracking-[-0.03em] tabular-nums sm:text-5xl">
                08h
                <span aria-hidden className="mx-2.5 font-light text-wine">
                  —
                </span>
                <span className="sr-only">às</span>
                10h
              </p>
              <p className="pb-0.5 text-sm leading-snug text-muted-foreground">
                Servido diariamente
                <br />
                <span className="font-medium text-foreground">Incluso na hospedagem</span>
              </p>
            </div>

            {/* o que vai à mesa — uma linha, não uma lista de cards */}
            <p className="mt-5 text-[0.68rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase sm:mt-7">
              Na mesa
            </p>
            <p className="mt-2.5 max-w-[40ch] text-[0.95rem] leading-relaxed text-foreground/85 sm:mt-3 sm:text-[1.05rem]">
              {NA_MESA.map((item, i) => (
                <Fragment key={item}>
                  {/* o "·" fica preso ao item anterior, nunca no começo da linha */}
                  <span className="whitespace-nowrap">
                    {item}
                    {i < NA_MESA.length - 1 && (
                      <span aria-hidden className="mr-0.5 ml-2 text-wine/70">
                        ·
                      </span>
                    )}
                  </span>{" "}
                </Fragment>
              ))}
              <span className="text-muted-foreground">preparadas na hora.</span>
            </p>

            <p className="mt-5 flex items-start gap-3 text-[0.82rem] leading-relaxed text-muted-foreground sm:mt-7 sm:text-sm">
              <span aria-hidden className="mt-[0.7em] h-px w-8 shrink-0 bg-wine/60" />
              <span>Produtos locais e frescos. Sob pedido, opções veganas e sem glúten.</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
