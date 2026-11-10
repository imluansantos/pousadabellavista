import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BedDouble,
  House,
  Images,
  Instagram,
  MapPin,
  Menu,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  ENDERECO_COMPLETO,
  INSTAGRAM,
  INSTAGRAM_URL,
  MAPS_URL,
  NAV,
  type NavItem,
  RESERVAR,
  WHATSAPP,
} from "@/data/site";
import logoMark from "@/assets/logo-mark.webp";
import logoTitle from "@/assets/logo-title.webp";
import logoSubtitle from "@/assets/logo-subtitle.webp";
import { NotificationCenter } from "@/components/site/NotificationCenter";

// Mesmo ícone de WhatsApp usado no header da All Frames Technology (SVG
// oficial da marca) — reproduzido aqui pra manter a mesma linguagem visual,
// já que o lucide-react não tem um ícone de WhatsApp próprio.
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}

const ehAncora = (href: string) => href.startsWith("#");
/** id da seção da Home que acende cada item (âncora ou `secao`) */
const secaoDo = (item: NavItem) => item.secao ?? (ehAncora(item.href) ? item.href.slice(1) : null);
const SECTION_IDS = NAV.map(secaoDo).filter((id): id is string => Boolean(id));

// Ícones do menu mobile, um por link (chave = href do NAV em data/site.ts).
// Link sem ícone aqui simplesmente aparece sem ícone.
const NAV_ICONS: Record<string, LucideIcon> = {
  "#inicio": House,
  "#acomodacoes": BedDouble,
  "/gastronomia": UtensilsCrossed,
  "/galeria": Images,
  "#localizacao": MapPin,
};

export function Navbar() {
  // true assim que a página rola — controla se a pill fica quase
  // transparente (sobre a foto da hero) ou ganha o vidro fosco mais escuro
  // (sobre o resto da página). Mesmo comportamento do header da All Frames
  // Technology, só que aqui a pill fica sempre com texto claro por cima do
  // vidro escuro (a hero desta página já nasce escurecida por um véu preto).
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // id da seção da Home em que a pessoa está (só as que têm item no menu);
  // null quando ela está numa seção que não aparece no menu
  const [secaoAtiva, setSecaoAtiva] = useState<string | null>("inicio");

  // Âncoras viram link para a Home com `data-secao`: o RolagemSemHash rola até
  // a seção (ou abre a Home e vai até ela) sem "#" na URL.
  const pathname = useLocation({ select: (l) => l.pathname });
  const isHome = pathname === "/";
  const toHref = (href: string) => (ehAncora(href) ? "/" : href);
  const secaoAttr = (href: string) => (ehAncora(href) ? { "data-secao": href.slice(1) } : {});
  const isActiveItem = (item: NavItem) => {
    // na Home: acende o item da seção visível
    if (isHome) {
      const id = secaoDo(item);
      return id !== null && id === secaoAtiva;
    }
    // nas páginas: acende o item da página (ou do grupo, ex.: /acomodacoes/…)
    const caminho = ehAncora(item.href) ? `/${item.href.slice(1)}` : item.href;
    return caminho !== "/inicio" && pathname.startsWith(caminho);
  };

  useEffect(() => {
    // offset abaixo da pill fixa — uma seção só vira "ativa" quando seu topo
    // já passou por baixo da barra, não assim que encosta nela.
    const headerOffset = 160;

    const updateFromScrollPosition = () => {
      setScrolled(window.scrollY > 24);

      // ativa só enquanto a linha logo abaixo do header está DENTRO da
      // seção; nas seções que não estão no menu nenhum item fica aceso
      let current: string | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= headerOffset && r.bottom > headerOffset) current = id;
      }
      setSecaoAtiva(current);
    };

    // Throttle via requestAnimationFrame — no máximo 1 execução por frame,
    // não importa quantos eventos de "scroll" o navegador disparar entre um
    // frame e outro (pode ser dezenas por segundo no mobile).
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateFromScrollPosition);
    };

    updateFromScrollPosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Trava o scroll da página por trás enquanto o menu mobile está aberto, e
  // fecha com Esc.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* pill flutuante, mesmo padrão do header da All Frames Technology:
          logo, menu centralizado e botão de contato dentro do mesmo
          contorno, ficando mais "vidro fosco" assim que a página rola. */}
      {/* com o menu mobile aberto o header sobe para z-[60], ficando acima
          do botão flutuante do WhatsApp (z-50) */}
      <header
        className={`fixed inset-x-0 top-0 px-3 pt-3 sm:px-4 sm:pt-4 ${open ? "z-[60]" : "z-40"}`}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between gap-3 rounded-full border px-4 py-2.5 transition-all duration-300 sm:px-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4 lg:px-6 lg:py-3 ${
            scrolled
              ? "border-white/12 bg-black/45 shadow-[0_8px_32px_-12px] shadow-black/60 backdrop-blur-md lg:backdrop-blur-xl"
              : "border-white/20 bg-black/15 backdrop-blur-sm"
          }`}
        >
          {/* logo em três imagens recortadas do arquivo original: o ícone
              (logotipo), "Bella Vista" e "Pousada Familiar". Tudo é
              proporcional a --s (altura do "Bella Vista"): o ícone tem 1,9×
              essa altura e o subtítulo ocupa 85% da largura do título,
              centralizado embaixo dele. */}
          <a
            href="/"
            data-secao="inicio"
            aria-label="Bella Vista, Pousada Familiar"
            className="group flex items-center gap-[calc(var(--s)*0.6)] justify-self-start [--s:20px] md:[--s:23px]"
          >
            <img
              src={logoMark}
              alt=""
              aria-hidden
              className="h-[calc(var(--s)*1.9)] w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-[1.05]"
            />
            <span className="flex shrink-0 flex-col items-center gap-[calc(var(--s)*0.2)] transition-transform duration-300 group-hover:scale-[1.05]">
              <img src={logoTitle} alt="Bella Vista" className="h-[var(--s)] w-auto object-contain" />
              <img
                src={logoSubtitle}
                alt="Pousada Familiar"
                className="h-[calc(var(--s)*0.32)] w-auto object-contain"
              />
            </span>
          </a>

          {/* o item da seção (ou página) em que a pessoa está fica branco e
              sublinhado, como no header da All Frames */}
          <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {NAV.map((item) => {
              const isActive = isActiveItem(item);
              return (
                <a
                  key={item.href}
                  href={toHref(item.href)}
                  {...secaoAttr(item.href)}
                  aria-current={isActive ? "location" : undefined}
                  className={`group relative px-2.5 py-2 text-[14px] xl:px-3.5 font-medium whitespace-nowrap transition-colors ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {item.label}
                  {/* item que abre outra página: setinha discreta, que avança
                      no hover (as seções da Home não têm seta) */}
                  {!ehAncora(item.href) && (
                    <ArrowUpRight
                      aria-hidden
                      className="ml-1 inline size-3 -translate-y-px opacity-50 transition-[opacity,transform] duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  )}
                  <span
                    className={`absolute inset-x-2.5 -bottom-0.5 h-px xl:inset-x-3.5 origin-center bg-white transition-transform duration-300 ease-out ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-2 justify-self-end">
            {/* central de notificações (sino) — visível também no mobile */}
            <NotificationCenter />

            <a
              href={RESERVAR}
              className="group relative hidden items-center gap-2 overflow-hidden rounded-full bg-cream px-4.5 py-2.5 text-[11px] font-bold tracking-[0.1em] text-ink uppercase shadow-[0_6px_24px_-8px] shadow-black/40 transition-all hover:shadow-black/60 lg:inline-flex"
            >
              <span className="relative z-10">Reservar</span>
              <ArrowUpRight className="relative z-10 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span
                className="absolute inset-0 -translate-x-full bg-black/10 transition-transform duration-700 ease-out group-hover:translate-x-full"
                style={{ transform: "skewX(-20deg)" }}
              />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="relative z-10 -mr-1.5 flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* backdrop — clique fora fecha o menu */}
        {open && (
          <div
            className="fixed inset-0 -z-10 bg-black/70 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}

        {open && (
          <div
            id="mobile-nav"
            className="animate-in fade-in slide-in-from-top-2 mt-2 max-h-[calc(100svh-6rem)] overflow-y-auto rounded-3xl border border-black/5 bg-white shadow-[0_24px_60px_-20px] shadow-black/45 duration-300 lg:hidden"
          >
            {/* versão compacta: itens mais baixos, CTAs lado a lado e rodapé
                enxuto — cabe inteiro na tela sem rolagem */}
            <nav className="flex flex-col px-5 pt-1 pb-5">
              {NAV.map((item) => {
                const Icon = NAV_ICONS[item.href];
                const isActive = isActiveItem(item);
                return (
                  <a
                    key={item.href}
                    href={toHref(item.href)}
                    {...secaoAttr(item.href)}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "location" : undefined}
                    className="group flex items-center justify-between gap-4 border-b border-ink/10 py-3.5 transition-colors"
                  >
                    <span className="flex items-center gap-3.5">
                      {Icon && (
                        <Icon
                          className={`size-[18px] shrink-0 transition-colors group-hover:text-wine ${
                            isActive ? "text-wine" : "text-ink/40"
                          }`}
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      )}
                      <span
                        className={`font-display text-lg transition-colors group-hover:text-wine ${
                          isActive ? "text-wine" : "text-ink"
                        }`}
                      >
                        {item.label}
                      </span>
                      {/* marcador da seção atual */}
                      {isActive && (
                        <span aria-hidden className="size-1.5 rounded-full bg-wine" />
                      )}
                    </span>
                    {/* só os itens que abrem outra página têm a seta */}
                    {!ehAncora(item.href) && (
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 shrink-0 text-ink/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-wine"
                      />
                    )}
                  </a>
                );
              })}

              <div className="mt-5 flex items-center gap-2">
                <a
                  href={RESERVAR}
                  onClick={() => setOpen(false)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-wine px-4 py-3.5 text-center text-[11px] font-bold tracking-[0.1em] text-white uppercase shadow-[0_10px_30px_-10px] shadow-wine/60"
                >
                  Reservar agora
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  aria-label="Falar no WhatsApp"
                  className="inline-flex size-[46px] shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-wine/40 hover:text-wine"
                >
                  <WhatsAppIcon className="size-[18px]" />
                </a>
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-ink/10 pt-4 text-[11px] text-ink/55">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-wine"
                >
                  <Instagram className="size-3.5 shrink-0" aria-hidden />
                  {INSTAGRAM}
                </a>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2 transition-colors hover:text-wine"
                >
                  <MapPin className="mt-px size-3.5 shrink-0" aria-hidden />
                  {ENDERECO_COMPLETO}
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
