import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Ellipsis,
  Heart,
  Layers,
  LayoutGrid,
  Link2,
  Play,
  UserPlus,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { INSTAGRAM, INSTAGRAM_URL } from "@/data/site";
import { useInstagramFeed, type InstagramPost } from "@/lib/instagram";
import avatar from "@/assets/instagram/avatar.webp";
import f22 from "@/assets/galeriahome/otimizadas/galeria-22.webp";
import f09 from "@/assets/galeriahome/otimizadas/galeria-09.webp";
import f10 from "@/assets/galeriahome/otimizadas/galeria-10.webp";
import f08 from "@/assets/galeriahome/otimizadas/galeria-08.webp";
import f06 from "@/assets/galeriahome/otimizadas/galeria-06.webp";
import f20 from "@/assets/galeriahome/otimizadas/galeria-20.webp";

/* ─────────────────────────────────────────────────────────────────────────────
   INSTAGRAM — logo após os Pacotes Românticos

   Layout em duas colunas no desktop: à direita o texto, os três temas das
   postagens e o botão "Seguir"; à esquerda o notebook (o aparelho fica à
   esquerda para que a rolagem da página, feita com o mouse à direita, não
   caia dentro da tela). Os dois blocos ficam centralizados na página.
   O notebook (no celular, um smartphone) é desenhado em código, com o
   perfil da pousada recriado: cabeçalho compacto e a grade de postagens,
   que o visitante rola dentro da própria tela. Cada foto abre a
   postagem no Instagram.

   A grade mostra as 6 últimas postagens do perfil, puxadas do feed do
   Behold (ver src/lib/instagram.ts), em duas fileiras de 3. Se o feed não
   responder, entram 6 fotos da pousada como reserva.
   ──────────────────────────────────────────────────────────────────────── */

const FOTOS_RESERVA: InstagramPost[] = [
  [f22, "Espumante, taças e frutas em decoração romântica"],
  [f09, "Cesta de café da manhã"],
  [f10, "Vista aérea da pousada"],
  [f08, "Mesa de café da manhã"],
  [f06, "Deck com vista para o vale"],
  [f20, "Cama decorada com cisnes de toalha e pétalas"],
].map(([image, caption], i) => ({
  id: `reserva-${i}`,
  image: image!,
  caption: caption!,
  link: INSTAGRAM_URL,
  tipo: "imagem" as const,
}));

const USUARIO = INSTAGRAM.replace("@", "");

export function InstagramFeed() {
  // o feed só é pedido quando a seção chega perto da tela (economiza as
  // visualizações do plano do Behold; ver src/lib/instagram.ts)
  const secao = useRef<HTMLElement>(null);
  const [perto, setPerto] = useState(false);
  useEffect(() => {
    const el = secao.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setPerto(true);
          obs.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const feed = useInstagramFeed(FOTOS_RESERVA, 6, perto);
  // esconde o aviso "role dentro da tela" depois que a pessoa rolar
  const [rolou, setRolou] = useState(false);

  return (
    <section
      ref={secao}
      id="instagram"
      aria-labelledby="instagram-titulo"
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-6 sm:gap-14 lg:px-10 xl:flex-row xl:items-center xl:justify-center xl:gap-16">
        {/* ── Texto ─────────────────────────────────────────────────────── */}
        <Reveal className="md:grid md:grid-cols-2 md:gap-x-12 xl:order-2 xl:block xl:w-[21rem] xl:shrink-0">
          <div>
          <p className="eyebrow flex items-center gap-4">
            <span aria-hidden className="h-px w-8 bg-wine/60" />
            Instagram
          </p>
          <h2
            id="instagram-titulo"
            className="mt-4 font-display text-[2.1rem] leading-[1.08] sm:mt-5 sm:text-5xl lg:text-[2.75rem] xl:text-[3rem]"
          >
            <span className="block">O dia a dia da pousada,</span>
            <span className="block text-wine">de perto.</span>
          </h2>
          <p className="mt-3 max-w-[38ch] text-[0.95rem] leading-relaxed text-muted-foreground sm:mt-5 sm:text-[1.05rem]">
            Acompanhe a rotina da pousada no{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-wine underline decoration-wine/30 underline-offset-4 transition-colors hover:decoration-wine"
            >
              {INSTAGRAM}
            </a>
            .
          </p>
          </div>

          <div className="md:self-end xl:self-auto">
          {/* o que aparece por lá */}
          <ol className="mt-8 hidden border-b border-foreground/10 sm:block md:mt-0 xl:mt-8">
            {TEMAS.map((t, i) => (
              <li
                key={t}
                className="group relative flex items-baseline gap-5 border-t border-foreground/10 py-2.5 sm:py-3.5"
              >
                <span
                  aria-hidden
                  className="absolute -top-px left-0 h-px w-5 bg-wine/70 transition-[width] duration-700 ease-out group-hover:w-full"
                />
                <span className="w-5 text-[0.7rem] font-semibold tracking-[0.12em] text-wine/60 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[0.98rem] font-semibold tracking-[-0.01em] transition-colors duration-500 group-hover:text-wine sm:text-[1.08rem]">
                  {t}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 hidden flex-wrap items-center gap-x-6 gap-y-4 sm:flex">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn-base btn-primary">
              Seguir no Instagram
              <ArrowUpRight className="size-3.5" />
            </a>
            {feed.aoVivo && (
              <p className="flex items-center gap-2.5 text-[0.78rem] text-muted-foreground">
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-wine/40" />
                  <span className="relative inline-flex size-2 rounded-full bg-wine" />
                </span>
                Últimas postagens, direto do perfil
              </p>
            )}
          </div>
          </div>
        </Reveal>

        {/* ── Palco do notebook (sm+) / celular ───────────────────────────── */}
        <Reveal
          delay={140}
          className="relative xl:order-1 xl:min-w-0 xl:flex-1"
        >
          <div className="relative" onScrollCapture={() => setRolou(true)}>
            <Notebook className="hidden sm:block">
              <PerfilInstagram feed={feed} variante="notebook" />
            </Notebook>
            {/* celular: sem moldura de aparelho. Um cartão do perfil e um
                mosaico editorial com as 6 últimas postagens */}
            <MosaicoCelular feed={feed} className="sm:hidden" />
          </div>

          {/* aviso discreto de que a tela rola; some depois da 1ª rolagem */}
          <p
            aria-hidden
            className={`relative mt-5 hidden items-center justify-center gap-2.5 text-[0.72rem] sm:flex tracking-[0.04em] text-muted-foreground/80 transition-opacity duration-700 ${
              rolou ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="relative flex h-[18px] w-[11px] justify-center rounded-full border border-foreground/30">
              <span className="mt-[3px] h-[4px] w-px animate-[instaRolar_1.8s_ease-in-out_infinite] rounded-full bg-foreground/50" />
            </span>
            Role dentro da tela para ver as postagens
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Celular: cartão do perfil + mosaico ────────────────────────────────── */

/** posição de cada postagem no mosaico (3 colunas): a 1ª ocupa 2×2, as
 *  duas seguintes empilham ao lado dela e as três últimas fecham embaixo */
const MOSAICO = [
  "col-span-2 row-span-2",
  "",
  "",
  "",
  "",
  "",
];

function MosaicoCelular({
  feed,
  className = "",
}: {
  feed: ReturnType<typeof useInstagramFeed>;
  className?: string;
}) {
  const seguidores = feed.seguidores ?? PERFIL.seguidores;

  return (
    <div className={className}>
      {/* perfil */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3.5 rounded-2xl border border-foreground/10 bg-white/70 py-3 pr-4 pl-3 shadow-[0_18px_40px_-30px_oklch(0.18_0.01_40/0.45)]"
      >
        <span className="shrink-0 rounded-full bg-[linear-gradient(45deg,#feda75_0%,#fa7e1e_25%,#d62976_50%,#962fbf_75%,#4f5bd5_100%)] p-[2px]">
          <img
            src={avatar}
            alt="Logo da Pousada Bella Vista"
            className="size-12 rounded-full border-2 border-white object-cover"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.95rem] font-semibold tracking-[-0.01em]">
            {USUARIO}
          </span>
          <span className="mt-0.5 block text-[0.75rem] text-muted-foreground tabular-nums">
            {formatarNumero(PERFIL.posts)} posts
            <span aria-hidden className="mx-1.5 text-wine/60">
              ·
            </span>
            {formatarNumero(seguidores)} seguidores
          </span>
        </span>
        <LogoInstagramColorido className="size-6 shrink-0 transition-transform duration-500 group-hover:scale-110" />
      </a>

      {/* mosaico */}
      <ul className="mt-3 grid grid-cols-3 gap-1.5">
        {feed.posts.slice(0, 6).map((post, i) => (
          <li key={post.id} className={MOSAICO[i] ?? ""}>
            <a
              href={post.link}
              target="_blank"
              rel="noreferrer"
              aria-label={post.caption ? `Ver no Instagram: ${post.caption}` : "Ver no Instagram"}
              className="group relative block aspect-square h-full w-full overflow-hidden rounded-xl bg-secondary"
            >
              <img
                src={post.image}
                alt={post.caption}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {post.tipo !== "imagem" && (
                <span className="absolute top-2 right-2 text-white drop-shadow">
                  {post.tipo === "video" ? (
                    <Play className="size-3.5 fill-white" />
                  ) : (
                    <Layers className="size-3.5" />
                  )}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>

      {/* botão e aviso de feed ao vivo */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
        className="btn-base btn-primary mt-6 w-full"
      >
        Seguir no Instagram
        <ArrowUpRight className="size-3.5" />
      </a>
      {feed.aoVivo && (
        <p className="mt-3 flex items-center justify-center gap-2.5 text-[0.75rem] text-muted-foreground">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-wine/40" />
            <span className="relative inline-flex size-2 rounded-full bg-wine" />
          </span>
          Últimas postagens, direto do perfil
        </p>
      )}
    </div>
  );
}

/** Logo do Instagram em contorno, com o degradê oficial da marca. */
function LogoInstagramColorido({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={`url(#${id})`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <defs>
        <linearGradient id={id} x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#feda75" />
          <stop offset="0.25" stopColor="#fa7e1e" />
          <stop offset="0.5" stopColor="#d62976" />
          <stop offset="0.75" stopColor="#962fbf" />
          <stop offset="1" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.6" cy="6.4" r="0.9" fill={`url(#${id})`} stroke="none" />
    </svg>
  );
}

/** temas das postagens, na lista ao lado do aparelho */
const TEMAS = ["Cafés da manhã", "Detalhes dos quartos", "Fins de tarde no Vale"];

/* ── Molduras ───────────────────────────────────────────────────────────── */

function Notebook({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1040px] ${className}`}>
      {/* tampa + tela */}
      <div className="relative mx-auto w-[88%] rounded-t-[1.4rem] bg-ink p-[1.4%] pb-[2.2%] shadow-[0_40px_80px_-40px_oklch(0.18_0.01_40/0.45)]">
        <span
          aria-hidden
          className="absolute top-[0.55%] left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-white/15"
        />
        <div className="aspect-[16/10] overflow-hidden rounded-[0.35rem] bg-white">{children}</div>
      </div>
      {/* base */}
      <div className="relative mx-auto h-3.5 w-full rounded-b-[1.2rem] bg-gradient-to-b from-[#e6e3e1] to-[#bdb8b5] shadow-[0_18px_30px_-18px_oklch(0.18_0.01_40/0.5)] sm:h-4">
        <span
          aria-hidden
          className="absolute top-0 left-1/2 h-1.5 w-[14%] -translate-x-1/2 rounded-b-md bg-[#cfcac7]"
        />
      </div>
    </div>
  );
}

/** moldura de celular (não usada no momento: no celular aparece o
 *  MosaicoCelular) */
function Celular({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[320px] ${className}`}>
      <div className="relative rounded-[2.6rem] bg-ink p-2.5 shadow-[0_40px_80px_-40px_oklch(0.18_0.01_40/0.5)]">
        <span
          aria-hidden
          className="absolute top-4 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink"
        />
        <div className="aspect-[9/17.5] overflow-hidden rounded-[2.1rem] bg-white">{children}</div>
      </div>
    </div>
  );
}

/* ── Perfil recriado ────────────────────────────────────────────────────── */

/**
 * Dados do cabeçalho do perfil. Os números são fixos (atualize de vez em
 * quando); seguidores e seguindo vêm do feed quando ele responde, e
 * substituem os valores daqui automaticamente.
 */
const PERFIL = {
  nome: "Bella Vista Pousada Familiar | Vale dos Vinhedos",
  posts: 193,
  seguidores: 1837,
  seguindo: 1228,
  bio: [
    "No coração do Vale dos Vinhedos, com acomodações completas, para a família toda 🏡✨",
    "🐶 Somos petfriendly",
  ],
  endereco: "Via Trento, 1118, Vale dos Vinhedos, Bento Gonçalves, Rio Grande do Sul 95711-000",
  site: "www.pousadabellavista.com.br",
};

const formatarNumero = (n: number) => n.toLocaleString("pt-BR");

function PerfilInstagram({
  feed,
  variante,
  estatico = false,
}: {
  feed: ReturnType<typeof useInstagramFeed>;
  variante: "notebook" | "celular";
  /** sem rolagem (miniatura do celular) */
  estatico?: boolean;
}) {
  const notebook = variante === "notebook";
  const seguidores = feed.seguidores ?? PERFIL.seguidores;
  const seguindo = feed.seguindo ?? PERFIL.seguindo;

  const numeros = (
    <>
      <span>
        <b className="font-semibold">{formatarNumero(PERFIL.posts)}</b> posts
      </span>
      <span>
        <b className="font-semibold">{formatarNumero(seguidores)}</b> seguidores
      </span>
      <span>
        <b className="font-semibold">{formatarNumero(seguindo)}</b> seguindo
      </span>
    </>
  );

  const bio = (
    <div className="text-[12px] leading-[1.45]">
      {PERFIL.bio.map((linha) => (
        <p key={linha}>{linha}</p>
      ))}
      <p className="text-black/50">{PERFIL.endereco}</p>
      <a
        href="https://www.pousadabellavista.com.br"
        target="_blank"
        rel="noreferrer"
        className="mt-0.5 inline-flex items-center gap-1 font-semibold text-[#4a5df9] hover:underline"
      >
        <Link2 className="size-3.5 -rotate-45" />
        {PERFIL.site}
      </a>
    </div>
  );

  const botoes = (
    <div className="flex gap-2">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
        className="flex-1 rounded-lg bg-[#4a5df9] py-1.5 text-center text-[12px] font-semibold text-white transition-colors hover:bg-[#3b4ee6]"
      >
        Seguir
      </a>
      <a
        href={`https://ig.me/m/${USUARIO}`}
        target="_blank"
        rel="noreferrer"
        className="flex-1 rounded-lg bg-[#efeff2] py-1.5 text-center text-[12px] font-semibold transition-colors hover:bg-[#e2e2e6]"
      >
        Enviar mensagem
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Ver perfil no Instagram"
        className="grid w-8 shrink-0 place-items-center rounded-lg bg-[#efeff2] transition-colors hover:bg-[#e2e2e6]"
      >
        <UserPlus className="size-3.5" />
      </a>
    </div>
  );

  return (
    <div className="flex h-full flex-col font-sans text-[#0c1014]">
      {/* barra do navegador (notebook) / barra de status (celular) */}
      {notebook ? (
        <div className="flex shrink-0 items-center gap-3 border-b border-black/[0.06] bg-[#f4f2f1] px-3 py-2">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="mx-auto w-full max-w-sm truncate rounded-md bg-white px-3 py-1 text-center text-[11px] text-black/55">
            instagram.com/{USUARIO}
          </span>
          <span className="w-12" aria-hidden />
        </div>
      ) : (
        <div className="h-9 shrink-0" aria-hidden />
      )}

      {/* conteúdo rolável */}
      <div
        className={`min-h-0 flex-1 ${estatico ? "overflow-hidden" : "overflow-y-auto [scrollbar-width:thin]"}`}
      >
        <div className={notebook ? "mx-auto max-w-[600px] px-6 pt-6" : "px-4 pt-1"}>
          {notebook ? (
            /* ── cabeçalho no layout do Instagram para computador ── */
            <>
              <div className="flex items-start gap-8">
                <img
                  src={avatar}
                  alt="Logo da Pousada Bella Vista"
                  className="size-[104px] shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[17px] font-semibold">
                    {USUARIO}
                    <Ellipsis className="size-4 text-black/70" aria-hidden />
                  </p>
                  <p className="mt-0.5 text-[12px]">{PERFIL.nome}</p>
                  <p className="mt-2.5 flex gap-4 text-[12px]">{numeros}</p>
                  <div className="mt-3">{bio}</div>
                </div>
              </div>
              <div className="mt-4">{botoes}</div>
            </>
          ) : (
            /* ── cabeçalho no layout do Instagram para celular ── */
            <>
              <div className="flex items-center gap-5">
                <img
                  src={avatar}
                  alt="Logo da Pousada Bella Vista"
                  className="size-[72px] shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold">{USUARIO}</p>
                  <p className="mt-1.5 flex justify-between text-[11px] leading-tight">{numeros}</p>
                </div>
              </div>
              <p className="mt-3 text-[12px] font-semibold">Bella Vista Pousada Familiar</p>
              <div className="mt-0.5">{bio}</div>
              <div className="mt-3">{botoes}</div>
            </>
          )}

          {/* aba "Publicações" */}
          <div className="mt-5 flex justify-center border-t border-black/10">
            <span className="-mt-px flex items-center gap-1.5 border-t border-[#0c1014] pt-2.5 pb-2 text-[11px] font-semibold tracking-[0.08em] uppercase">
              <LayoutGrid className="size-3" />
              Publicações
            </span>
          </div>
        </div>

        {/* grade de posts */}
        <ul
          className={`grid grid-cols-3 gap-0.5 ${notebook ? "mx-auto max-w-[600px] px-6" : ""}`}
        >
          {feed.posts.map((post) => (
            <li key={post.id}>
              <a
                href={post.link}
                target="_blank"
                rel="noreferrer"
                aria-label={post.caption ? `Ver no Instagram: ${post.caption}` : "Ver no Instagram"}
                className="group relative block aspect-[3/4] overflow-hidden bg-black/5"
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                {post.tipo !== "imagem" && (
                  <span className="absolute top-1.5 right-1.5 text-white drop-shadow">
                    {post.tipo === "video" ? (
                      <Play className="size-3.5 fill-current" />
                    ) : (
                      <Layers className="size-3.5" />
                    )}
                  </span>
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Heart className="size-5 fill-white text-white" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* fim da grade: convite para ver o resto do perfil no Instagram
            (botão no visual do próprio Instagram, como os de "Seguir") */}
        <div
          className={`flex flex-col items-center text-center ${notebook ? "px-6 pt-7 pb-8" : "px-4 pt-6 pb-7"}`}
        >
          <p className="text-[11px] text-black/50">Tem muito mais por lá.</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="group mt-3 inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(45deg,#feda75_0%,#fa7e1e_25%,#d62976_50%,#962fbf_75%,#4f5bd5_100%)] px-4 py-2 text-[12px] font-semibold text-white shadow-sm transition-[filter,box-shadow] hover:shadow-md hover:brightness-110"
          >
            <IconeInstagram className="size-4" />
            Ver mais postagens
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

/** Glifo do Instagram (contorno), no mesmo traço dos ícones do lucide. */
function IconeInstagram({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
