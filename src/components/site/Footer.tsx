import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import {
  ArrowUpRight,
  Car,
  ChevronRight,
  Clock,
  CircleHelp,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ScrollText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  EMAIL,
  ENDERECO_COMPLETO,
  INSTAGRAM,
  INSTAGRAM_URL,
  MAPS_URL,
  politicas,
  politicasLegais,
  TELEFONE,
  WHATSAPP,
} from "@/data/site";
import logoMark from "@/assets/logo-mark.webp";
import logoTitle from "@/assets/logo-title.webp";
import logoSubtitle from "@/assets/logo-subtitle.webp";
import logoLunding from "@/assets/lunding-logo.webp";

/* ─────────────────────────────────────────────────────────────────────────────
   RODAPÉ — fundo vinho, textos brancos

   Três colunas centralizadas na página:
     • esquerda: logo + frase da pousada, centralizadas na vertical em
       relação às outras duas colunas;
     • meio: "Links úteis" — os 5 links de sempre e, separados por um fio e com
       menos destaque, Política de privacidade e Política de cookies;
     • direita: "Contato" — e-mail, Instagram, telefone/WhatsApp e endereço.
   Os títulos "Links úteis" e "Contato" ficam sempre na mesma altura (as duas
   colunas começam alinhadas pelo topo).

   Embaixo, separado por um fio: direitos reservados à esquerda e o crédito
   da Lunding à direita (logo pequena + link para lunding.com.br).

   Celular (< 640px): layout próprio e centralizado (RodapeCelular): logo
   e frase; atalhos de contato em círculos (WhatsApp, Instagram, e-mail e
   mapa) e o contato escrito. Os links úteis ganham destaque logo abaixo da
   marca, num painel com ícone e seta em cada linha; as políticas legais
   ficam numa linha discreta no fim. A barra final é a mesma.

   Links e contatos em src/data/site.ts (`politicas`, `politicasLegais`,
   EMAIL, TELEFONE, ENDERECO_COMPLETO, MAPS_URL).
   ──────────────────────────────────────────────────────────────────────── */

const externo = (href: string) =>
  href.startsWith("http") ? ({ target: "_blank", rel: "noreferrer" } as const) : {};

const CONTATOS: { icon: LucideIcon; label: string; texto: string; href: string }[] = [
  { icon: Mail, label: "E-mail", texto: EMAIL, href: `mailto:${EMAIL}` },
  { icon: Instagram, label: "Instagram", texto: INSTAGRAM, href: INSTAGRAM_URL },
  { icon: Phone, label: "Telefone e WhatsApp", texto: TELEFONE, href: WHATSAPP },
  { icon: MapPin, label: "Endereço", texto: ENDERECO_COMPLETO, href: MAPS_URL },
];

function Titulo({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.26em] text-white/60 uppercase">
      <span aria-hidden className="h-px w-5 bg-white/40" />
      {children}
    </p>
  );
}

/** links úteis (painel do rodapé): rótulo e ícone de cada página */
const LINK_PAINEL: Record<string, { label: string; icon: LucideIcon }> = {
  "/politica-de-cancelamento": { label: "Política de cancelamento", icon: ShieldCheck },
  "/politicas-e-regras": { label: "Regras da pousada", icon: ScrollText },
  "/perguntas-frequentes": { label: "Perguntas frequentes", icon: CircleHelp },
  "/horarios": { label: "Horário de check-in e check-out", icon: Clock },
  "/estacionamento": { label: "Estacionamento", icon: Car },
};

const ATALHOS: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: MessageCircle, label: "WhatsApp", href: WHATSAPP },
  { icon: Instagram, label: "Instagram", href: INSTAGRAM_URL },
  { icon: Mail, label: "E-mail", href: `mailto:${EMAIL}` },
  { icon: MapPin, label: "Mapa", href: MAPS_URL },
];

/** tempo da animação do toque antes de seguir para a página (ms) */
const ATRASO_TOQUE = 320;

/** Painel dos links úteis (celular e desktop): cada página numa linha com
 *  ícone e seta. No hover, ou no toque no celular, a linha clareia, o ícone
 *  fica branco com o desenho em vinho, o nome desliza um pouco e a seta
 *  avança; no clique a animação aparece por um instante antes de a página
 *  abrir. */
function PainelLinks({
  className = "",
  fino = false,
}: {
  className?: string;
  /** linhas mais baixas (desktop) */
  fino?: boolean;
}) {
  // link tocado: a linha anima e, logo depois, a página abre
  const [tocado, setTocado] = useState<string | null>(null);
  // ao voltar para a página pelo "voltar" do navegador, a linha não fica marcada
  useEffect(() => {
    const limpar = () => setTocado(null);
    window.addEventListener("pageshow", limpar);
    return () => window.removeEventListener("pageshow", limpar);
  }, []);

  const abrirComAnimacao = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    // nova aba, link externo ou atalho do teclado: comportamento normal
    if (href.startsWith("http") || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setTocado(href);
    window.setTimeout(() => window.location.assign(href), ATRASO_TOQUE);
  };

  return (
    <ul
      className={`overflow-hidden border border-white/15 ${fino ? "rounded-xl" : "rounded-2xl"} bg-white/[0.07] shadow-[0_24px_48px_-32px_oklch(0.1_0.02_20/0.8)] ${className}`}
    >
      {politicas.map((p) => {
        const item = LINK_PAINEL[p.href];
        const Icon = item?.icon ?? ArrowUpRight;
        return (
          <li key={p.label} className="border-t border-white/10 first:border-t-0">
            {/* hover (ou toque, no celular): a linha clareia, o ícone fica
                branco com o desenho em vinho, o nome desliza um pouco e a
                seta avança */}
            <a
              href={p.href}
              {...externo(p.href)}
              onClick={(e) => abrirComAnimacao(e, p.href)}
              data-tocado={tocado === p.href || undefined}
              className={`group flex items-center transition-colors duration-300 ${fino ? "gap-2.5 px-3 py-2" : "gap-3 px-3.5 py-3.5"} hover:bg-white/[0.08] active:bg-white/[0.08] data-tocado:bg-white/[0.1]`}
            >
              <span className={`grid shrink-0 place-items-center rounded-full bg-white/10 ${fino ? "size-7" : "size-9"} text-white transition-[background-color,color,transform] duration-300 ease-out group-hover:bg-white group-hover:text-wine group-active:scale-95 group-data-tocado:scale-95 group-data-tocado:bg-white group-data-tocado:text-wine`}>
                <Icon aria-hidden className={fino ? "size-3.5" : "size-4"} strokeWidth={1.7} />
              </span>
              <span className={`flex-1 leading-snug font-medium text-white transition-transform ${fino ? "text-[0.86rem]" : "text-[0.9rem]"} duration-300 ease-out group-hover:translate-x-1 group-data-tocado:translate-x-1`}>
                {item?.label ?? p.label}
              </span>
              <ChevronRight
                aria-hidden
                className="size-4 shrink-0 text-white/50 transition-[transform,color] duration-300 ease-out group-hover:translate-x-1 group-hover:text-white group-data-tocado:translate-x-1.5 group-data-tocado:text-white"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function RodapeCelular() {
  return (
    <div className="flex flex-col items-center text-center sm:hidden">
      {/* marca */}
      <a
        href="/"
        aria-label="Bella Vista, Pousada Familiar: voltar ao início"
        className="inline-flex flex-col items-center gap-3"
      >
        <img src={logoMark} alt="" aria-hidden className="h-12 w-auto" />
        <span className="flex flex-col items-center gap-1.5">
          <img src={logoTitle} alt="Bella Vista" className="h-6 w-auto" />
          <img src={logoSubtitle} alt="Pousada Familiar" className="h-[0.48rem] w-auto" />
        </span>
      </a>
      <p className="mt-4 max-w-[30ch] text-[0.9rem] leading-relaxed text-white/75">
        Uma pousada familiar no coração do Vale dos Vinhedos, para descansar sem pressa e voltar
        sempre.
      </p>

      {/* links úteis, em destaque: um painel com cada página numa linha */}
      <nav aria-label="Links úteis" className="mt-7 w-full text-left">
        <p className="flex items-center justify-center gap-3 text-[0.66rem] font-semibold tracking-[0.26em] text-white/70 uppercase">
          <span aria-hidden className="h-px w-6 bg-white/40" />
          Links úteis
          <span aria-hidden className="h-px w-6 bg-white/40" />
        </p>
        <PainelLinks className="mt-4" />
      </nav>

      {/* atalhos de contato */}
      <ul className="mt-8 grid w-full grid-cols-4 gap-2">
        {ATALHOS.map(({ icon: Icon, label, href }) => (
          <li key={label}>
            <a
              href={href}
              {...externo(href)}
              className="group flex flex-col items-center gap-2 text-[0.7rem] font-medium tracking-[0.04em] text-white/70"
            >
              <span className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/[0.06] text-white transition-colors duration-300 group-active:bg-white/15">
                <Icon aria-hidden className="size-[1.1rem]" strokeWidth={1.6} />
              </span>
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* contato escrito */}
      <div className="mt-6 w-full space-y-1 border-y border-white/12 py-5 text-[0.84rem] leading-relaxed">
        <a href={WHATSAPP} {...externo(WHATSAPP)} className="block font-semibold text-white">
          {TELEFONE}
        </a>
        <a href={`mailto:${EMAIL}`} className="block text-white/80">
          {EMAIL}
        </a>
        <a href={MAPS_URL} {...externo(MAPS_URL)} className="block text-white/60">
          {ENDERECO_COMPLETO}
        </a>
      </div>

      {/* políticas legais */}
      <p className="mt-5 flex items-center justify-center gap-2.5 text-[0.74rem] text-white/45">
        {politicasLegais.map((p, i) => (
          <span key={p.label} className="flex items-center gap-2.5">
            {i > 0 && <span aria-hidden className="size-0.5 rounded-full bg-white/40" />}
            <a href={p.href} {...externo(p.href)} className="hover:text-white/80">
              {p.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}

export function Footer() {
  return (
    <footer id="politicas" className="relative overflow-hidden bg-wine text-white">
      {/* brilho suave no canto, para o vinho não ficar "chapado" */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.07),transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-12 sm:pt-16 md:pt-20 lg:px-10">
        {/* ── Celular: layout próprio (ver RodapeCelular) ──────────────── */}
        <RodapeCelular />

        <div className="hidden gap-12 sm:grid md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* ── Marca ─────────────────────────────────────────────────── */}
          <div className="md:col-span-2 lg:col-span-4 lg:self-center lg:pr-6">
            <a
              href="/"
              aria-label="Bella Vista, Pousada Familiar: voltar ao início"
              className="group inline-flex items-center gap-4"
            >
              <img
                src={logoMark}
                alt=""
                aria-hidden
                className="h-12 w-auto shrink-0 transition-transform sm:h-14 duration-500 group-hover:scale-[1.04]"
              />
              <span className="flex flex-col items-center gap-1.5">
                <img src={logoTitle} alt="Bella Vista" className="h-6 w-auto sm:h-7" />
                <img src={logoSubtitle} alt="Pousada Familiar" className="h-[0.48rem] w-auto sm:h-[0.55rem]" />
              </span>
            </a>
            <p className="mt-4 max-w-[34ch] text-[0.92rem] leading-relaxed text-white/80 sm:mt-6 sm:text-[0.98rem]">
              Uma pousada familiar no coração do Vale dos Vinhedos, para descansar sem pressa e
              voltar sempre.
            </p>
          </div>

          {/* ── Links úteis ──────────────────────────────────────────── */}
          <nav aria-label="Links úteis" className="lg:col-span-4">
            <Titulo>Links úteis</Titulo>
            <PainelLinks className="mt-6" fino />
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 pl-1 text-[0.82rem]">
              {politicasLegais.map((p) => (
                <li key={p.label}>
                  <a
                    href={p.href}
                    {...externo(p.href)}
                    className="text-white/50 transition-colors hover:text-white/80"
                  >
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Contato ───────────────────────────────────────────────── */}
          <div className="lg:col-span-4">
            <Titulo>Contato</Titulo>
            <ul className="mt-4 space-y-3 text-[0.9rem] sm:mt-6 sm:space-y-4 sm:text-[0.94rem]">
              {CONTATOS.map(({ icon: Icon, label, texto, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...externo(href)}
                    className="group flex items-start gap-3.5"
                  >
                    <span className="mt-px grid size-8 shrink-0 place-items-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-white/40 group-hover:bg-white/10">
                      <Icon aria-hidden className="size-3.5" strokeWidth={1.75} />
                    </span>
                    <span className="pt-1 leading-snug text-white transition-opacity group-hover:opacity-75">
                      {texto}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Barra final ─────────────────────────────────────────────── */}
        <div className="mt-5 flex flex-col items-center gap-3 border-t border-white/15 pt-6 pb-24 text-center text-[0.75rem] text-white/70 sm:mt-14 sm:flex-row sm:justify-between sm:gap-4 sm:py-7 sm:text-left sm:text-[0.8rem] md:mt-16">
          <p>
            © {new Date().getFullYear()} Pousada Bella Vista · Pousada Familiar. Todos os direitos
            reservados.
          </p>
          <a
            href="https://lunding.com.br"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex shrink-0 flex-nowrap items-center justify-center gap-x-1.5 text-[clamp(0.66rem,calc((100vw-84px)/25),0.8rem)] text-white/70 sm:text-[0.8rem] transition-colors hover:text-white sm:gap-x-2.5"
          >
            {/* no celular a fonte acompanha a largura da tela (clamp), para a
                linha inteira caber sem quebrar */}
            <span className="whitespace-nowrap">Desenvolvido por</span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <img
                src={logoLunding}
                alt=""
                aria-hidden
                className="size-5 rounded-[5px] ring-1 ring-white/20"
              />
              <span>
                <span className="font-semibold text-white">Lunding</span> - Sites &amp; Soluções Digitais
              </span>
              <ArrowUpRight className="hidden size-3 opacity-60 transition-transform sm:block duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
