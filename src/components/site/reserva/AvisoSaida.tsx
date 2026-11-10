import { useEffect, useRef, useState } from "react";
import { useBlocker } from "@tanstack/react-router";
import { Check, Link2, X } from "lucide-react";
import { RESERVAR } from "@/data/site";
import { apagarRascunho, resumoCurto, salvarRascunho, temProgresso, type Pedido } from "@/lib/reservas/pedido";

/* ─────────────────────────────────────────────────────────────────────────────
   AVISO AO SAIR DA PÁGINA DE RESERVAS (usado em routes/reservar.tsx)

   Quando a pessoa tem um pedido em andamento e tenta sair de /reservar, abre
   a janela "Quer guardar seu pedido?":
     • Guardar e sair: mantém o rascunho no navegador (o cartão "Continuar
       pedido" aparece nas outras páginas, ver RetomarReserva.tsx);
     • Sair sem guardar: apaga o rascunho;
     • Continuar reservando: fecha a janela e fica na página.

   Duas portas de saída são cobertas:
     1. cliques em links (menu, rodapé, logo, botões), inclusive os <a> comuns
        que recarregam a página: o clique é segurado em fase de captura no
        `window`, antes do Link do TanStack e do RolagemSemHash, e repetido
        depois da escolha;
     2. navegações do roteador sem clique (voltar do navegador dentro do site,
        navigate()): `useBlocker`.
   Fechar a aba ou digitar outro endereço não abre a janela (o navegador só
   permite uma mensagem genérica); nesses casos o rascunho já está salvo
   automaticamente e o cartão de retomar aparece na próxima visita.
   ──────────────────────────────────────────────────────────────────────── */

type Saida = { tipo: "clique"; alvo: HTMLElement } | { tipo: "roteador" };

function linkDeSaida(e: MouseEvent): HTMLAnchorElement | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a || a.target === "_blank" || a.hasAttribute("download")) return null;
  const href = a.getAttribute("href") ?? "";
  if (href.startsWith("#") || /^(mailto|tel|sms|whatsapp):/i.test(href)) return null;
  let url: URL;
  try {
    url = new URL(a.href, window.location.href);
  } catch {
    return null;
  }
  // links para a própria página de reservas não são saída
  if (url.origin === window.location.origin && url.pathname.replace(/\/$/, "") === RESERVAR) return null;
  return a;
}

export function AvisoSaida({ pedido, ativo }: { pedido: Pedido; ativo: boolean }) {
  const [saida, setSaida] = useState<Saida | null>(null);
  const [copiado, setCopiado] = useState(false);
  const liberado = useRef(false);
  const deveAvisar = useRef(false);
  deveAvisar.current = ativo && temProgresso(pedido);
  const pedidoAtual = useRef(pedido);
  pedidoAtual.current = pedido;

  // 2. navegações do roteador (voltar, navigate)
  const bloqueio = useBlocker({
    shouldBlockFn: ({ next }) =>
      deveAvisar.current && !liberado.current && next.pathname !== "/reservar",
    enableBeforeUnload: false,
    withResolver: true,
  });
  useEffect(() => {
    if (bloqueio.status === "blocked") setSaida({ tipo: "roteador" });
  }, [bloqueio.status]);

  // 1. cliques em links
  useEffect(() => {
    function aoClicar(e: MouseEvent) {
      if (liberado.current || !deveAvisar.current) return;
      const a = linkDeSaida(e);
      if (!a) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      setSaida({ tipo: "clique", alvo: a });
    }
    window.addEventListener("click", aoClicar, true);
    return () => window.removeEventListener("click", aoClicar, true);
  }, []);

  function sair(guardar: boolean) {
    if (guardar) salvarRascunho(pedidoAtual.current);
    else apagarRascunho();
    const atual = saida;
    setSaida(null);
    liberado.current = true;
    // se a navegação não sair da página por algum motivo, volta a avisar
    window.setTimeout(() => (liberado.current = false), 1500);
    if (atual?.tipo === "clique") atual.alvo.click();
    else if (bloqueio.status === "blocked") bloqueio.proceed();
  }

  function ficar() {
    setSaida(null);
    if (bloqueio.status === "blocked") bloqueio.reset();
  }

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* sem permissão de área de transferência */
    }
  }

  // foco preso na janela, Esc = continuar reservando
  const caixa = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!saida) return;
    const anterior = document.activeElement as HTMLElement | null;
    caixa.current?.querySelector<HTMLElement>("[data-foco-inicial]")?.focus();
    function teclas(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        ficar();
        return;
      }
      if (e.key !== "Tab" || !caixa.current) return;
      const focaveis = [...caixa.current.querySelectorAll<HTMLElement>("button")];
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo?.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro?.focus();
      }
    }
    document.addEventListener("keydown", teclas);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", teclas);
      document.body.style.overflow = overflow;
      anterior?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saida]);

  if (!saida) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-[80] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-[2px] duration-200 sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && ficar()}
    >
      <div
        ref={caixa}
        role="dialog"
        aria-modal="true"
        aria-labelledby="aviso-saida-titulo"
        aria-describedby="aviso-saida-texto"
        className="animate-in slide-in-from-bottom-4 relative w-full max-w-md rounded-t-3xl bg-background p-6 pb-8 shadow-2xl duration-300 sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={ficar}
          aria-label="Fechar e continuar reservando"
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X aria-hidden className="size-4" />
        </button>

        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-wine">Pedido em andamento</p>
        <h2 id="aviso-saida-titulo" className="mt-2 pr-8 font-display text-[1.7rem] leading-tight">
          Quer guardar seu pedido?
        </h2>
        <p id="aviso-saida-texto" className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">{resumoCurto(pedido)}</span>. Guardando, você continua
          de onde parou quando voltar, neste navegador.
        </p>

        <div className="mt-6 grid gap-3">
          <button type="button" data-foco-inicial onClick={() => sair(true)} className="btn-base btn-primary w-full">
            Guardar e sair
          </button>
          <button type="button" onClick={() => sair(false)} className="btn-base btn-outline w-full">
            Sair sem guardar
          </button>
          <button
            type="button"
            onClick={ficar}
            className="mt-1 text-[0.9rem] font-medium text-foreground underline-offset-4 hover:underline"
          >
            Continuar reservando
          </button>
        </div>

        <div className="mt-5 border-t border-border pt-4 text-center">
          <button
            type="button"
            onClick={copiarLink}
            className="inline-flex items-center gap-2 text-[0.82rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            {copiado ? <Check aria-hidden className="size-3.5" /> : <Link2 aria-hidden className="size-3.5" />}
            {copiado ? "Link copiado" : "Copiar link do pedido (suíte e datas)"}
          </button>
          <span className="sr-only" aria-live="polite">
            {copiado ? "Link copiado" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
