import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { RevealImage } from "@/components/site/RevealImage";
import { RESERVAR } from "@/data/site";
import imgQuarto from "@/assets/pacotes/quarto-decorado.webp";
import imgEspumante from "@/assets/pacotes/espumante.webp";

/* ─────────────────────────────────────────────────────────────────────────────
   PACOTES ROMÂNTICOS — logo após a Galeria

   Um adicional à hospedagem: decoração especial no quarto, espumante para
   brindar e café da manhã servido no quarto. A Galeria mostra a pousada; aqui
   o visitante descobre que pode tornar a estadia ainda mais especial.

   Desktop: texto à esquerda (5/12) e, à direita, a foto do quarto decorado
   com o detalhe do espumante sobreposto na base. Celular: foto → título →
   os três itens → botões (via `contents` + `order`); abaixo de 640px a
   foto do quarto fica deitada (5:4), os itens mais enxutos e os botões
   lado a lado com rótulos curtos.

   Fotos reais do pacote, recortadas e otimizadas em src/assets/pacotes/.
   "Conhecer os pacotes" leva à página de pacotes do site atual; "Reservar
   estadia" ao sistema de reservas (o mesmo link do resto do site).
   ──────────────────────────────────────────────────────────────────────── */

const PACOTES_URL = "https://pousadabellavista.com.br/pacotes-romanticos";

const INCLUI = [
  {
    nome: "Decoração especial",
    texto: "O quarto preparado com carinho, à espera de vocês.",
  },
  {
    nome: "Espumante para brindar",
    texto: "Um brinde a dois para celebrar a ocasião.",
  },
  {
    nome: "Café da manhã no quarto",
    texto: "Começar o dia com calma, conforto e privacidade.",
  },
];

export function Packages() {
  return (
    <section
      id="pacotes"
      aria-labelledby="pacotes-titulo"
      className="overflow-hidden secao-filetes bg-cream py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:gap-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-10">
        {/* ── Texto ───────────────────────────────────────────────────── */}
        <div className="contents lg:col-span-5 lg:block">
          <Reveal className="order-2 lg:order-none">
            <p className="eyebrow flex items-center gap-4">
              <span aria-hidden className="h-px w-8 bg-wine/60" />
              Pacotes românticos
            </p>
            <h2
              id="pacotes-titulo"
              className="mt-4 font-display text-[2.1rem] leading-[1.08] sm:mt-5 sm:text-5xl lg:text-[2.75rem] xl:text-[3rem]"
            >
              <span className="block">Uma noite especial</span>
              <span className="block text-wine">merece alguns detalhes a mais.</span>
            </h2>
            <p className="mt-4 max-w-[44ch] text-[0.95rem] leading-relaxed text-muted-foreground sm:mt-7 sm:text-[1.05rem]">
              <span className="sm:hidden">
                Uma experiência preparada para tornar a estadia ainda mais memorável, como adicional
                à sua hospedagem.
              </span>
              <span className="hidden sm:inline">
                Surpreenda quem você ama com uma experiência preparada para tornar a estadia ainda
                mais memorável. É um adicional que você contrata junto com a sua hospedagem.
              </span>
            </p>
          </Reveal>

          <Reveal delay={140} className="order-3 lg:order-none lg:mt-12">
            <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              A experiência inclui
            </p>
            <ul className="mt-3 border-b border-foreground/10 sm:mt-4">
              {INCLUI.map((item) => (
                <li
                  key={item.nome}
                  className="group relative grid gap-1 border-t border-foreground/10 py-3.5 sm:gap-1.5 sm:py-5"
                >
                  {/* fio em vinho que percorre a linha no hover */}
                  <span
                    aria-hidden
                    className="absolute -top-px left-0 h-px w-6 bg-wine/70 transition-[width] duration-700 ease-out group-hover:w-full"
                  />
                  <span className="font-display text-base font-bold tracking-[-0.015em] transition-colors duration-500 group-hover:text-wine sm:text-lg">
                    {item.nome}
                  </span>
                  <span className="text-[0.85rem] leading-relaxed text-muted-foreground sm:text-[0.95rem]">
                    {item.texto}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={240} className="order-4 lg:order-none lg:mt-10">
            <div className="flex flex-row items-center gap-3 sm:gap-4">
              <a
                href={PACOTES_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-base btn-primary whitespace-nowrap max-sm:px-5!"
              >
                <span className="sm:hidden">Ver pacotes</span>
                <span className="hidden sm:inline">Conhecer os pacotes</span>
                <ArrowUpRight className="size-3.5" />
              </a>
              <a href={RESERVAR} className="btn-base btn-outline whitespace-nowrap max-sm:px-5!"
              >
                <span className="sm:hidden">Reservar</span>
                <span className="hidden sm:inline">Reservar estadia</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* ── Fotos ───────────────────────────────────────────────────── */}
        <div className="order-1 lg:order-none lg:col-span-7 lg:pl-8 xl:pl-14">
          <div className="relative pb-[14%] sm:pb-[12%]">
            <figure className="relative ml-auto w-[88%] sm:w-[80%]">
              <RevealImage
                src={imgQuarto}
                alt="Quarto da pousada com decoração romântica: pétalas de rosa sobre a cama e o chão, toalhas em forma de cisnes e balões de coração"
                frameClassName="aspect-[5/4] sm:aspect-[4/5]"
                imgClassName="object-[center_30%] sm:object-center"
              />
              <figcaption className="mt-3 hidden text-right text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase sm:block">
                Adicional à hospedagem
              </figcaption>
            </figure>

            <RevealImage
              src={imgEspumante}
              alt="Espumante, duas taças, chocolate e frutas servidos no quarto"
              delay={260}
              parallax={24}
              className="absolute bottom-0 left-0 z-10 w-[36%] sm:w-[40%]"
              frameClassName="aspect-[4/5] border-[6px] border-cream sm:border-8"
              shadow
            />
          </div>
        </div>
      </div>
    </section>
  );
}
