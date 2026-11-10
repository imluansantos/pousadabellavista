import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Images } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { SeletorSuites } from "@/components/site/acomodacao/SeletorSuites";
import { ApresentacaoSuite } from "@/components/site/acomodacao/ApresentacaoSuite";
import { AmbientesSuite } from "@/components/site/acomodacao/AmbientesSuite";
import { ComodidadesSuite } from "@/components/site/acomodacao/ComodidadesSuite";
import { ReservaSuite } from "@/components/site/acomodacao/ReservaSuite";
import { GaleriaSuite } from "@/components/site/acomodacao/GaleriaSuite";
import { getAcomodacao, todasAsFotos, type Acomodacao } from "@/data/acomodacoes";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   Página dedicada de cada acomodação: /acomodacoes/nascer-do-sol,
   /acomodacoes/videiras e /acomodacoes/por-do-sol.

   As três páginas usam a mesma estrutura e os mesmos componentes
   (src/components/site/acomodacao/*); todo o conteúdo vem de
   src/data/acomodacoes.ts.
     1. Escolha sua acomodação: seletor dentro do cabeçalho (PageHero aside)
     2. Apresentação: cabeçalho com foto, nome e reserva + seção "A suíte"
     3. Explore os ambientes: cada ambiente abre a galeria nas fotos dele
     4. Comodidades + informações práticas
     5. Reserva + as outras duas suítes
   ──────────────────────────────────────────────────────────────────────── */

// descrição de cada suíte no Google (até ~155 caracteres; a tagline vira o
// texto da prévia ao compartilhar). Imagens de compartilhamento: public/og/<slug>.jpg
const SEO_SUITES: Record<string, string> = {
  "nascer-do-sol":
    "Suíte Nascer do Sol: quarto, sala e cozinha integrados num só ambiente amplo, com café da manhã incluso. Bella Vista Pousada Familiar, no Vale dos Vinhedos.",
  videiras:
    "Suíte Videiras: intimista e elegante, com cozinha equipada e café da manhã incluso. Bella Vista Pousada Familiar, no Vale dos Vinhedos.",
  "por-do-sol":
    "Suíte Pôr do Sol: charme, conforto e um cantinho de leitura ao lado da cama, com café da manhã incluso. Bella Vista Pousada Familiar, no Vale dos Vinhedos.",
};

export const Route = createFileRoute("/acomodacoes/$slug")({
  loader: ({ params }) => {
    const acomodacao = getAcomodacao(params.slug);
    if (!acomodacao) throw notFound();
    return acomodacao;
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({
          titulo: `Suíte ${loaderData.nome} | Bella Vista Pousada Familiar`,
          descricao: SEO_SUITES[loaderData.slug] ?? loaderData.tagline,
          caminho: `/acomodacoes/${loaderData.slug}`,
          imagem: `/og/${loaderData.slug}.jpg`,
          imagemAlt: loaderData.capa.alt,
          descricaoSocial: loaderData.tagline,
        })
      : {
          meta: [
            // slug que não existe: a página 404 (PaginaNaoEncontrada)
            { title: "Página não encontrada | Bella Vista Pousada Familiar" },
            { name: "robots", content: "noindex" },
          ],
        },
  component: AcomodacaoRota,
});

function AcomodacaoRota() {
  const a = Route.useLoaderData();
  // `key`: ao trocar de suíte pelo seletor, a página recomeça do zero
  // (galeria fechada, animações de entrada de novo)
  return <AcomodacaoPage key={a.slug} acomodacao={a} />;
}

function AcomodacaoPage({ acomodacao: a }: { acomodacao: Acomodacao }) {
  const itens = useMemo(() => todasAsFotos(a), [a]);
  const [galeria, setGaleria] = useState<number | null>(null);
  const abrir = useCallback((indice: number) => setGaleria(Math.max(0, indice)), []);
  const fechar = useCallback(() => setGaleria(null), []);

  return (
    <div
      className="min-h-screen bg-background"
      style={{ "--theme-color": a.tema } as CSSProperties}
    >
      <Navbar />

      {/* ── 1 + 2. Cabeçalho: seletor das suítes e apresentação ─────────── */}
      <PageHero
        image={a.capa}
        imageAlt={a.capa.alt}
        trail={[{ label: "Acomodações", hash: "acomodacoes" }, { label: a.nome }]}
        eyebrow="Suíte"
        title={a.nome}
        aside={<SeletorSuites atual={a.slug} />}
        veuForteNoCelular
      >
        <span
          aria-hidden
          className="mt-6 block h-px w-14"
          style={{ backgroundColor: "hsl(var(--theme-color))" }}
        />
        <p className="mt-6 max-w-[42ch] text-[1.05rem] leading-relaxed text-white/85">
          {a.tagline}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/reservar" search={{ suite: a.slug }} className="btn-base btn-primary">
            Reservar agora
            <ArrowRight className="size-3.5" />
          </Link>
          <button type="button" onClick={() => abrir(0)} className="btn-base btn-ghost-light">
            <Images aria-hidden className="size-3.5" />
            Ver as {itens.length} fotos
          </button>
        </div>
      </PageHero>

      <main>
        <ApresentacaoSuite acomodacao={a} onAbrirGaleria={abrir} />
        <AmbientesSuite acomodacao={a} onAbrirGaleria={abrir} />
        <ComodidadesSuite acomodacao={a} />
        <ReservaSuite acomodacao={a} />
      </main>

      <Footer />
      <WhatsappButton />

      {galeria !== null && (
        <GaleriaSuite
          nomeSuite={a.nome}
          itens={itens}
          indice={galeria}
          onIr={setGaleria}
          onFechar={fechar}
        />
      )}
    </div>
  );
}
