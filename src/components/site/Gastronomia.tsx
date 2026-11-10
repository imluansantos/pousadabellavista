import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import imgPizza from "@/assets/paginas/gastronomia-pizza-card.webp";

/* ─────────────────────────────────────────────────────────────────────────────
   GASTRONOMIA — mini-seção logo após o Café da manhã

   Um cartão baixo, no mesmo fundo do Café da manhã (as duas leem como um
   bloco só): foto pequena, título curto, os itens adicionais em uma linha e
   o botão para a página /gastronomia (conteúdo da antiga página "Cardápio").

   Desktop: foto à esquerda, texto no meio e botão à direita, numa faixa só.
   Celular: foto baixa em cima, texto e botão de largura total, mais enxuto.
   ──────────────────────────────────────────────────────────────────────── */

// no celular os 3 selos ficam sempre numa linha só: a fonte acompanha a
// largura da tela (clamp com vw) e a lista não quebra
const ADICIONAIS = ["Pizzas artesanais", "Tábuas de frios", "Folhados"];

export function Gastronomia() {
  return (
    <section
      id="gastronomia"
      aria-labelledby="gastronomia-titulo"
      className="bg-background pb-16 sm:pb-24 md:-mt-8 md:pb-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="group relative grid overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-cream shadow-[0_30px_60px_-44px_rgba(40,20,16,0.45)] sm:rounded-[2rem] md:grid-cols-12 md:items-center">
            {/* foto */}
            <div className="relative h-36 overflow-hidden sm:h-48 md:col-span-3 md:h-full md:min-h-[13rem]">
              <img
                src={imgPizza}
                alt="Fatia de pizza artesanal com tomate cereja e queijo derretido sendo servida"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[42%_28%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>

            {/* texto */}
            <div className="px-5 pt-5 pb-5 sm:px-8 sm:pt-7 sm:pb-8 md:col-span-6 md:py-8 md:pr-6 md:pl-10 lg:col-span-6">
              <p className="eyebrow flex items-center gap-4">
                <span aria-hidden className="h-px w-8 bg-wine/60" />
                Gastronomia
              </p>
              <h2
                id="gastronomia-titulo"
                className="mt-3 font-display text-[1.4rem] leading-[1.1] sm:mt-4 sm:text-[2rem]"
              >
                Sabores para <span className="text-wine">além do café.</span>
              </h2>
              <p className="mt-2 max-w-[46ch] text-[0.85rem] leading-relaxed text-muted-foreground sm:mt-3 sm:text-[1rem]">
                Itens adicionais sob pedido para tornar o momento ainda mais especial.
              </p>
              <ul className="mt-3 flex flex-nowrap gap-x-1.5 gap-y-2 sm:mt-4 sm:flex-wrap sm:gap-x-2">
                {ADICIONAIS.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-wine/15 bg-background/70 px-[0.85em] py-1 text-[clamp(0.6rem,calc(3.95vw-4.5px),0.8rem)] font-medium whitespace-nowrap text-foreground/80 sm:px-3 sm:text-[0.8rem]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* botão */}
            <div className="px-5 pb-5 sm:px-8 sm:pb-8 md:col-span-3 md:flex md:justify-end md:py-8 md:pr-10 md:pl-0">
              <Link to="/gastronomia" className="btn-base btn-primary w-full whitespace-nowrap md:w-auto">
                Conhecer a gastronomia
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
