import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Clock,
  Coffee,
  Leaf,
  ScrollText,
  Sparkles,
  Wheat,
  Wine,
  type LucideIcon,
} from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { ConsulteTambem, ContatoDuvidas } from "@/components/site/PaginaInformativa";
import { WHATSAPP } from "@/data/site";
import imgPizza from "@/assets/paginas/gastronomia-pizza.webp";
import imgCafeJardim from "@/assets/paginas/gastronomia-cafe-jardim.webp";
import imgTabua from "@/assets/paginas/gastronomia-tabua.webp";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   GASTRONOMIA: /gastronomia

   Todo o conteúdo da página "Cardápio" do site atual (pousadabellavista.com.br/
   cardapio), sem travessões no texto:
     • cabeçalho padrão das páginas (PageHero) com a pizza artesanal;
     • dois blocos lado a lado, cada um abrindo com a sua foto:
       "Café da manhã incluso" (cartão vinho, mesa do café no jardim) e
       "Itens adicionais" (cartão creme, tábua de frios com vinho, e o botão
       para pedir pelo WhatsApp);
     • "Consulte também" e o contato.
   ──────────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute("/gastronomia")({
  head: () =>
    seo({
      titulo: "Gastronomia | Bella Vista Pousada Familiar",
      descricao: "Café da manhã incluso, servido das 8h às 10h, e itens adicionais sob pedido: pizzas artesanais, tábuas de frios e folhados na Bella Vista Pousada Familiar.",
      caminho: "/gastronomia",
      imagem: "/og/gastronomia.jpg",
      imagemAlt: "Pizza artesanal de muçarela e tomate servida na pousada",
      descricaoSocial: "Sabores pensados para acompanhar sua estadia no Vale dos Vinhedos.",
    }),
  component: GastronomiaPage,
});

const CAFE: { icon: LucideIcon; texto: string }[] = [
  { icon: Leaf, texto: "Produtos locais e frescos" },
  { icon: Wheat, texto: "Opções veganas e sem glúten sob pedido" },
  { icon: Clock, texto: "Servido das 8h às 10h" },
];

const ADICIONAIS = [
  "Pizzas artesanais de fermentação natural",
  "Tábuas de frios e pães especiais",
  "Folhados salgados e doces",
  "Itens adicionais sob consulta",
];

const CONSULTE = [
  { icon: Clock, titulo: "Horários de check-in e check-out", href: "/horarios" },
  { icon: ScrollText, titulo: "Políticas e regras", href: "/politicas-e-regras" },
  { icon: Sparkles, titulo: "Perguntas frequentes", href: "/perguntas-frequentes" },
];

/** foto no topo de cada cartão, com um zoom bem leve no hover. No desktop
    a foto do café cresce para o cartão ter a mesma altura do vizinho. */
function FotoCartao({
  src,
  alt,
  posicao,
  className = "",
}: {
  src: string;
  alt: string;
  posicao: string;
  className?: string;
}) {
  return (
    <div className={`group relative aspect-[4/3] overflow-hidden sm:aspect-[16/10] ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${posicao}`}
      />
    </div>
  );
}

function GastronomiaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        image={imgPizza}
        imageAlt="Fatia de pizza artesanal com tomate cereja e queijo derretido sendo servida"
        trail={[{ label: "Gastronomia" }]}
        eyebrow="Experiência gastronômica"
        title={
          <>
            Sabores que acompanham <span className="text-white/60">a sua estadia.</span>
          </>
        }
      >
        <p className="mt-6 max-w-[46ch] text-[1.05rem] leading-relaxed text-white/80">
          Sabores pensados para acompanhar sua estadia com conforto, qualidade e um toque
          especial.
        </p>
      </PageHero>

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-10">
        {/* ── Os dois blocos ───────────────────────────────────────────────── */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* café da manhã incluso */}
          <section
            aria-labelledby="cafe-incluso-titulo"
            className="flex flex-col overflow-hidden rounded-2xl bg-wine text-white"
          >
            <FotoCartao
              src={imgCafeJardim}
              alt="Mesa do café da manhã posta no jardim, com toalha xadrez, cesta de pães, geleias e garrafas térmicas"
              posicao="object-[center_62%]"
              className="md:aspect-auto md:min-h-[20rem] md:flex-1"
            />
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center justify-between">
                <p className="text-[0.7rem] font-semibold tracking-[0.24em] text-white/70 uppercase">
                  Incluso na diária
                </p>
                <span className="grid size-11 place-items-center rounded-full border border-white/25">
                  <Coffee aria-hidden className="size-5" strokeWidth={1.6} />
                </span>
              </div>
              <h2
                id="cafe-incluso-titulo"
                className="mt-6 font-display text-[2rem] leading-tight font-bold tracking-[-0.02em] sm:text-[2.3rem]"
              >
                Café da manhã incluso
              </h2>
              <p className="mt-3 mb-7 text-[1rem] leading-relaxed text-white/85">
                Servido diariamente com pães artesanais, bolos caseiros, frios, frutas, geleias e
                opções quentes preparadas na hora.
              </p>
              <ul className="space-y-3 border-t border-white/15 pt-6">
                {CAFE.map(({ icon: Icon, texto }) => (
                  <li key={texto} className="flex items-center gap-3 text-[0.95rem] text-white/90">
                    <Icon aria-hidden className="size-4 shrink-0 text-white/70" strokeWidth={1.75} />
                    {texto}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* itens adicionais */}
          <section
            aria-labelledby="adicionais-titulo"
            className="flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-cream/70"
          >
            <FotoCartao
              src={imgTabua}
              alt="Tábuas de frios e pães com geleia, servidas com vinho branco e taças da Bella Vista"
              posicao="object-[center_58%]"
            />
            <div className="flex flex-1 flex-col p-7 sm:p-9">
              <div className="flex items-center justify-between">
                <p className="text-[0.7rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                  Sob pedido
                </p>
                <span className="grid size-11 place-items-center rounded-full border border-wine/20 text-wine">
                  <Wine aria-hidden className="size-5" strokeWidth={1.6} />
                </span>
              </div>
              <h2
                id="adicionais-titulo"
                className="mt-6 font-display text-[2rem] leading-tight font-bold tracking-[-0.02em] sm:text-[2.3rem]"
              >
                Itens adicionais
              </h2>
              <p className="mt-3 text-[1rem] leading-relaxed text-muted-foreground">
                Disponíveis mediante solicitação, ideais para tornar o momento ainda mais especial.
              </p>
              <ol className="mt-6 border-b border-foreground/10">
                {ADICIONAIS.map((item, i) => (
                  <li
                    key={item}
                    className="group relative flex items-baseline gap-4 border-t border-foreground/10 py-3.5"
                  >
                    <span
                      aria-hidden
                      className="absolute -top-px left-0 h-px w-5 bg-wine/70 transition-[width] duration-700 ease-out group-hover:w-full"
                    />
                    <span className="w-5 text-[0.7rem] font-semibold tracking-[0.12em] text-wine/60 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.98rem] font-medium">{item}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-auto pt-7">
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-base btn-primary">
                  Solicitar pelo WhatsApp
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </div>
          </section>
        </div>

        <ConsulteTambem itens={CONSULTE} className="mt-14 md:mt-16" />
      </main>

      <ContatoDuvidas
        titulo="Quer pedir um item adicional ou tem alguma dúvida?"
        texto="Fale com a nossa equipe pelo WhatsApp."
      />

      <Footer />
      <WhatsappButton />
    </div>
  );
}
