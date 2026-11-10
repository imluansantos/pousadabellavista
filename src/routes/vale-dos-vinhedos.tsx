import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  Mail,
  Phone,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { Reveal } from "@/components/site/Reveal";
import { ConsulteTambem, ContatoDuvidas } from "@/components/site/PaginaInformativa";
import { capas } from "@/data/capas";
import {
  LUGARES_VALE,
  VALE_FONTE,
  VALE_INTRO,
  linkTelefone,
  type LugarVale,
} from "@/data/valeDosVinhedos";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   VALE DOS VINHEDOS: /vale-dos-vinhedos

   Todo o conteúdo da página atual do site (pousadabellavista.com.br/
   vale-dos-vinhedos), sem travessões no texto:
     • cabeçalho padrão das páginas (PageHero) com a foto do Vale e o texto
       de abertura "Experiências no Vale dos Vinhedos";
     • um cartão por vinícola/atração: tipo, nome, os dois parágrafos,
       telefone e e-mail clicáveis e o botão "Visitar site";
     • a fonte do conteúdo (site oficial do Vale dos Vinhedos) com o botão
       "Ver mais informações";
     • "Consulte também" e o contato ("Você tem alguma dúvida?").

   Chega-se aqui pelo botão "O que mais visitar" da seção Experiências da
   Home (components/site/Experiences.tsx). Conteúdo: src/data/valeDosVinhedos.ts.
   ──────────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute("/vale-dos-vinhedos")({
  head: () =>
    seo({
      titulo: "Vale dos Vinhedos | Bella Vista Pousada Familiar",
      descricao: "Experiências no Vale dos Vinhedos: vinícolas, degustações, harmonizações, destilaria e piqueniques perto da Bella Vista Pousada Familiar, em Bento Gonçalves/RS.",
      caminho: "/vale-dos-vinhedos",
      imagem: "/og/vale-dos-vinhedos.jpg",
      imagemAlt: "Parreirais e vinícolas do Vale dos Vinhedos, em Bento Gonçalves/RS",
      descricaoSocial: "Roteiros que unem sabor, cultura, bem-estar e natureza no Vale dos Vinhedos.",
    }),
  component: ValeDosVinhedosPage,
});

const CONSULTE = [
  { icon: UtensilsCrossed, titulo: "Gastronomia da pousada", href: "/gastronomia" },
  { icon: Clock, titulo: "Horários de check-in e check-out", href: "/horarios" },
  { icon: Sparkles, titulo: "Perguntas frequentes", href: "/perguntas-frequentes" },
];

function ValeDosVinhedosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        image={capas.valeDosVinhedos}
        imageAlt="Parreirais do Vale dos Vinhedos com uma vinícola de arquitetura italiana ao fundo e as montanhas da Serra Gaúcha no horizonte"
        trail={[{ label: "Experiências", hash: "experiencias" }, { label: "Vale dos Vinhedos" }]}
        eyebrow="Roteiros e vivências"
        title={
          <>
            Experiências no <span className="text-white/60">Vale dos Vinhedos.</span>
          </>
        }
      >
        <p className="mt-6 max-w-[60ch] text-[1.05rem] leading-relaxed text-white/80">
          {VALE_INTRO}
        </p>
      </PageHero>

      <main className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:px-10">
        {/* ── Cabeçalho da lista ───────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4">
              <span aria-hidden className="h-px w-8 bg-wine/60" />
              O que visitar
            </p>
            <h2
              id="lugares-titulo"
              className="mt-4 font-display text-3xl leading-tight sm:text-[2.4rem]"
            >
              Vinícolas e experiências <span className="text-wine">perto da pousada.</span>
            </h2>
          </div>
          <p className="text-[0.95rem] leading-relaxed text-muted-foreground lg:col-span-5 lg:col-start-8">
            Confirme horários, valores e reservas diretamente com cada lugar antes da visita.
          </p>
        </div>

        {/* ── Cartões ──────────────────────────────────────────────────────── */}
        <ul
          aria-labelledby="lugares-titulo"
          className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-3"
        >
          {LUGARES_VALE.map((l, i) => (
            <li key={l.nome} className="flex">
              <Reveal delay={(i % 3) * 90} className="flex w-full">
                <CartaoLugar numero={i + 1} lugar={l} />
              </Reveal>
            </li>
          ))}
        </ul>

        {/* ── Fonte do conteúdo ────────────────────────────────────────────── */}
        <section
          aria-labelledby="fonte-titulo"
          className="mt-14 flex flex-col items-start gap-6 rounded-2xl border border-foreground/10 p-7 sm:p-9 md:mt-16 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex gap-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-wine/20 text-wine">
              <BookOpen aria-hidden className="size-5" strokeWidth={1.6} />
            </span>
            <div>
              <h2 id="fonte-titulo" className="text-[1.05rem] font-semibold tracking-[-0.01em]">
                {VALE_FONTE.texto}
              </h2>
              <p className="mt-1 text-[0.95rem] leading-relaxed text-muted-foreground">
                {VALE_FONTE.chamada}
              </p>
            </div>
          </div>
          <a
            href={VALE_FONTE.url}
            target="_blank"
            rel="noreferrer"
            className="btn-base btn-outline shrink-0"
          >
            Ver mais informações
            <ArrowUpRight className="size-3.5" />
          </a>
        </section>

        <ConsulteTambem itens={CONSULTE} className="mt-14 md:mt-16" />
      </main>

      <ContatoDuvidas
        titulo="Você tem alguma dúvida?"
        texto="Fale com a nossa equipe para montar o seu roteiro pelo Vale dos Vinhedos."
      />

      <Footer />
      <WhatsappButton />
    </div>
  );
}

function CartaoLugar({ numero, lugar }: { numero: number; lugar: LugarVale }) {
  const temContato = lugar.telefone || lugar.email;
  return (
    <article className="flex w-full flex-col rounded-2xl border border-foreground/10 bg-card p-7 transition-[border-color,box-shadow] duration-500 hover:border-wine/25 hover:shadow-[0_18px_40px_-24px_rgba(20,14,12,0.35)] sm:p-8">
      <p className="flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
        <span className="font-display text-sm font-light tracking-normal text-wine/70 tabular-nums">
          {String(numero).padStart(2, "0")}
        </span>
        <span aria-hidden className="h-px w-5 bg-wine/50" />
        {lugar.tipo}
      </p>
      <h3 className="mt-4 font-display text-[1.55rem] leading-tight font-bold tracking-[-0.02em] text-wine">
        {lugar.nome}
      </h3>

      <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-foreground/75">
        {lugar.paragrafos.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      {(temContato || lugar.nota || lugar.site) && (
        <div className="mt-auto pt-6">
          <div className="border-t border-foreground/10 pt-5">
            {temContato && (
              <ul className="space-y-2 text-[0.88rem]">
                {lugar.telefone && (
                  <li>
                    <a
                      href={linkTelefone(lugar.telefone)}
                      className="inline-flex items-center gap-2.5 text-foreground/80 transition-colors hover:text-wine"
                    >
                      <Phone aria-hidden className="size-3.5 text-wine/80" strokeWidth={1.75} />
                      {lugar.telefone}
                    </a>
                  </li>
                )}
                {lugar.email && (
                  <li>
                    <a
                      href={`mailto:${lugar.email}`}
                      className="inline-flex min-w-0 items-center gap-2.5 break-all text-foreground/80 transition-colors hover:text-wine"
                    >
                      <Mail aria-hidden className="size-3.5 shrink-0 text-wine/80" strokeWidth={1.75} />
                      {lugar.email}
                    </a>
                  </li>
                )}
              </ul>
            )}
            {lugar.nota && (
              <p
                className={`inline-flex items-center gap-2.5 text-[0.88rem] font-semibold text-wine ${
                  temContato ? "mt-2" : ""
                }`}
              >
                <Sparkles aria-hidden className="size-3.5" strokeWidth={1.75} />
                {lugar.nota}
              </p>
            )}
            {lugar.site && (
              <a
                href={lugar.site}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visitar site: ${lugar.nome}`}
                className="btn-base btn-outline mt-5"
              >
                Visitar site
                <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
