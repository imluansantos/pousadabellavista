import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Search, X } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { FAQ, TODAS_PERGUNTAS, type CategoriaFaq } from "@/data/faq";
import { RESERVAR, WHATSAPP } from "@/data/site";
import imgVista from "@/assets/experiencia/vista-vale.webp";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   PÁGINA DE PERGUNTAS FREQUENTES — /perguntas-frequentes

   Todas as perguntas do FAQ do site atual (src/data/faq.ts), em um modelo
   diferente do acordeão da Home: um "índice" de leitura, com tudo aberto.
     • abertura com o cabeçalho padrão das páginas (PageHero.tsx) e a busca
       (filtra enquanto digita, ignora acentos e destaca o trecho encontrado);
     • desktop: índice de temas fixo à esquerda, que acompanha a rolagem;
       celular: os temas viram uma faixa de atalhos logo abaixo da abertura;
     • cada tema: número, título e descrição, e as respostas em duas colunas;
     • no fim, contato pelo WhatsApp e reserva.
   Cada pergunta tem âncora própria (ex.: /perguntas-frequentes#check-in).
   ──────────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute("/perguntas-frequentes")({
  head: () => ({
    ...seo({
      titulo: "Perguntas frequentes | Bella Vista Pousada Familiar",
      descricao: "Check-in e check-out, café da manhã, pets, crianças, estacionamento, cancelamento e mais: as respostas sobre a hospedagem na Bella Vista Pousada Familiar.",
      caminho: "/perguntas-frequentes",
      imagem: "/og/perguntas-frequentes.jpg",
      imagemAlt: "Área externa da pousada com cadeiras e vista para o Vale dos Vinhedos",
      descricaoSocial: "Tudo o que você precisa saber antes de se hospedar no Vale dos Vinhedos.",
    }),
    // dados estruturados: permitem que o Google mostre as respostas na busca
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: TODAS_PERGUNTAS.map((p) => ({
            "@type": "Question",
            name: p.pergunta,
            acceptedAnswer: { "@type": "Answer", text: p.resposta },
          })),
        }),
      },
    ],
  }),
  component: PerguntasFrequentesPage,
});

/** minúsculas e sem acentos — para a busca achar "cafe" em "café" */
const normalizar = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

function PerguntasFrequentesPage() {
  const [busca, setBusca] = useState("");
  const termo = normalizar(busca.trim());

  const categorias = useMemo<CategoriaFaq[]>(() => {
    if (!termo) return FAQ;
    return FAQ.map((c) => ({
      ...c,
      perguntas: c.perguntas.filter((p) =>
        normalizar(`${p.pergunta} ${p.resposta}`).includes(termo),
      ),
    })).filter((c) => c.perguntas.length > 0);
  }, [termo]);

  const encontradas = categorias.reduce((n, c) => n + c.perguntas.length, 0);
  const ativa = useTemaAtivo(categorias.map((c) => c.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Abertura (cabeçalho padrão das páginas) ─────────────────────── */}
      <PageHero
        image={imgVista}
        imageAlt=""
        trail={[{ label: "Perguntas frequentes" }]}
        eyebrow="Perguntas frequentes"
        title={
          <>
            Tudo o que você precisa saber <span className="text-white/60">antes de chegar.</span>
          </>
        }
        aside={
          <>
            <p className="max-w-[40ch] text-[1.02rem] leading-relaxed text-white/80">
              {TODAS_PERGUNTAS.length} respostas sobre a hospedagem, organizadas em {FAQ.length}{" "}
              temas. Procure pelo assunto ou navegue pelo índice.
            </p>

            {/* busca */}
            <label className="relative mt-6 block">
              <span className="sr-only">Buscar uma pergunta</span>
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-foreground/45"
              />
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.currentTarget.value)}
                placeholder="Buscar: café, pet, estacionamento…"
                className="h-14 w-full rounded-full bg-white pr-12 pl-12 text-[0.95rem] text-foreground shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] outline-none placeholder:text-foreground/40 focus-visible:ring-2 focus-visible:ring-white/60 [&::-webkit-search-cancel-button]:hidden"
              />
              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca("")}
                  aria-label="Limpar busca"
                  className="absolute top-1/2 right-4 grid size-7 -translate-y-1/2 place-items-center rounded-full text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </label>
          </>
        }
      />

      {/* ── Atalhos dos temas (celular / tablet) ────────────────────────── */}
      <nav
        aria-label="Temas"
        className="border-b border-foreground/10 lg:hidden"
      >
        <div className="flex gap-2 overflow-x-auto px-6 py-4 [scrollbar-width:none]">
          {categorias.map((c) => (
            <a
              key={c.id}
              href="/perguntas-frequentes"
              data-secao={c.id}
              className="shrink-0 rounded-full border border-foreground/12 px-4 py-2 text-[0.8rem] font-medium whitespace-nowrap text-foreground/75 transition-colors hover:border-wine/40 hover:text-wine"
            >
              {c.titulo}
              <span className="ml-1.5 text-foreground/35 tabular-nums">{c.perguntas.length}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* ── Conteúdo ────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:grid lg:grid-cols-12 lg:gap-12 lg:px-10">
        {/* índice fixo (desktop) */}
        <aside className="hidden lg:col-span-3 lg:block">
          <nav aria-label="Temas" className="sticky top-32">
            <p className="text-[0.66rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              Índice
            </p>
            <ol className="mt-5 border-l border-foreground/10">
              {categorias.map((c) => {
                const n = FAQ.findIndex((f) => f.id === c.id) + 1;
                const on = ativa === c.id;
                return (
                  <li key={c.id}>
                    <a
                      href="/perguntas-frequentes"
              data-secao={c.id}
                      aria-current={on ? "true" : undefined}
                      className={`-ml-px flex items-baseline gap-3 border-l py-2.5 pl-5 text-[0.9rem] transition-colors ${
                        on
                          ? "border-wine font-semibold text-wine"
                          : "border-transparent text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      <span className="w-5 shrink-0 text-[0.68rem] tracking-[0.1em] tabular-nums opacity-70">
                        {String(n).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{c.titulo}</span>
                      <span className="text-[0.72rem] text-foreground/35 tabular-nums">
                        {c.perguntas.length}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="mt-10 block border-t border-foreground/10 pt-6 text-[0.88rem] leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
            >
              Não encontrou sua dúvida?
              <span className="mt-1 flex items-center gap-1.5 font-semibold text-wine">
                Fale com a gente
                <ArrowUpRight className="size-3.5" />
              </span>
            </a>
          </nav>
        </aside>

        <div className="lg:col-span-9">
          {termo && (
            <p className="mb-10 text-[0.95rem] text-muted-foreground" aria-live="polite">
              {encontradas > 0 ? (
                <>
                  <span className="font-semibold text-foreground">{encontradas}</span>{" "}
                  {encontradas === 1 ? "resposta encontrada" : "respostas encontradas"} para “
                  {busca.trim()}”.
                </>
              ) : (
                <>Nenhuma pergunta encontrada para “{busca.trim()}”.</>
              )}
            </p>
          )}

          {encontradas === 0 ? (
            <div className="rounded-2xl bg-cream px-8 py-14 text-center">
              <p className="font-display text-2xl font-bold tracking-[-0.02em]">
                Não achou o que procurava?
              </p>
              <p className="mx-auto mt-3 max-w-[40ch] text-muted-foreground">
                Tente outra palavra ou fale direto com a nossa equipe pelo WhatsApp.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => setBusca("")} className="btn-base btn-outline">
                  Limpar busca
                </button>
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-base btn-primary">
                  Falar no WhatsApp
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-16 md:space-y-20">
              {categorias.map((c) => (
                <Tema
                  key={c.id}
                  categoria={c}
                  numero={FAQ.findIndex((f) => f.id === c.id) + 1}
                  termo={termo}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Contato ─────────────────────────────────────────────────────── */}
      <section className="bg-cream py-20 md:py-24">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow flex items-center justify-center gap-4">
            <span aria-hidden className="h-px w-8 bg-wine/60" />
            Ainda com dúvidas?
            <span aria-hidden className="h-px w-8 bg-wine/60" />
          </p>
          <h2 className="mt-5 font-display text-4xl leading-[1.08] sm:text-5xl lg:text-[2.75rem]">
            Fale com a gente. <span className="text-wine">Estamos à disposição.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-muted-foreground">
            Nossa equipe está à disposição pelo WhatsApp para ajudar com a sua reserva ou qualquer
            detalhe da estadia.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-base btn-primary">
              Falar no WhatsApp
              <ArrowUpRight className="size-3.5" />
            </a>
            <a href={RESERVAR} className="btn-base btn-outline">
              Reservar estadia
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
      <WhatsappButton />
    </div>
  );
}

function Tema({
  categoria,
  numero,
  termo,
}: {
  categoria: CategoriaFaq;
  numero: number;
  termo: string;
}) {
  return (
    <section id={categoria.id} aria-labelledby={`${categoria.id}-titulo`} className="scroll-mt-28">
      <header className="flex items-end gap-5 border-b border-foreground/15 pb-5">
        <span className="font-display text-5xl leading-none font-bold tracking-[-0.04em] text-wine/20 tabular-nums md:text-6xl">
          {String(numero).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id={`${categoria.id}-titulo`}
            className="font-display text-2xl leading-tight font-bold tracking-[-0.02em] md:text-[1.75rem]"
          >
            {categoria.titulo}
          </h2>
          <p className="mt-1 text-[0.92rem] text-muted-foreground">{categoria.descricao}</p>
        </div>
        <span className="hidden shrink-0 pb-1 text-[0.7rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase sm:block">
          {categoria.perguntas.length} {categoria.perguntas.length === 1 ? "pergunta" : "perguntas"}
        </span>
      </header>

      <dl className="grid gap-x-12 md:grid-cols-2">
        {categoria.perguntas.map((p) => (
          <div
            key={p.id}
            id={p.id}
            className="group relative scroll-mt-28 border-b border-foreground/10 py-6 target:bg-wine/[0.03]"
          >
            <span
              aria-hidden
              className="absolute -bottom-px left-0 h-px w-0 bg-wine/60 transition-[width] duration-700 ease-out group-hover:w-full"
            />
            <dt className="text-[1.02rem] leading-snug font-semibold tracking-[-0.01em] transition-colors duration-500 group-hover:text-wine">
              <Destaque texto={p.pergunta} termo={termo} />
            </dt>
            <dd className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
              <Destaque texto={p.resposta} termo={termo} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Marca o trecho buscado dentro do texto (comparando sem acentos). */
function Destaque({ texto, termo }: { texto: string; termo: string }) {
  if (!termo) return <>{texto}</>;
  // A busca compara o texto sem acentos, mas o destaque precisa devolver o
  // texto original ("Café", não "cafe"). Por isso cada letra é normalizada
  // separadamente e as posições são convertidas de uma versão para a outra.
  const base = [...texto].map((ch) => normalizar(ch));
  const plano = base.join("");
  const partes: ReactNode[] = [];
  let i = 0; // posição no texto original (em letras)
  let p = 0; // posição no texto normalizado
  let achou = plano.indexOf(termo, 0);
  const letras = [...texto];
  while (achou !== -1) {
    // avança até a letra onde começa o trecho
    let inicio = i;
    let pos = p;
    while (pos < achou && inicio < letras.length) pos += base[inicio++]!.length;
    let fim = inicio;
    let posFim = pos;
    while (posFim < achou + termo.length && fim < letras.length) posFim += base[fim++]!.length;
    if (inicio > i) partes.push(letras.slice(i, inicio).join(""));
    partes.push(
      <mark key={inicio} className="rounded-sm bg-wine/12 px-0.5 text-inherit">
        {letras.slice(inicio, fim).join("")}
      </mark>,
    );
    i = fim;
    p = posFim;
    achou = plano.indexOf(termo, posFim);
  }
  if (i < letras.length) partes.push(letras.slice(i).join(""));
  return <>{partes}</>;
}

/** Qual tema está na tela agora — para destacar no índice. */
function useTemaAtivo(ids: string[]) {
  const [ativa, setAtiva] = useState(ids[0] ?? "");
  const chave = ids.join("|");

  useEffect(() => {
    const lista = chave ? chave.split("|") : [];
    let frame = 0;
    const atualizar = () => {
      frame = 0;
      let atual = lista[0] ?? "";
      for (const id of lista) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 180) atual = id;
      }
      setAtiva(atual);
    };
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [chave]);

  return ativa;
}
