import { useEffect } from "react";
import { useLocation, useRouter } from "@tanstack/react-router";

/* ─────────────────────────────────────────────────────────────────────────────
   ROLAGEM SEM "#" NA URL (montado uma vez, em routes/__root.tsx)

   O site nunca mostra "#secao" na barra de endereço. Para ir até uma seção,
   um link usa `data-secao="galeria"` (com `href` apontando para a página da
   seção, ex.: "/") ou, como fallback, um href com âncora ("#galeria" ou
   "/#galeria"). Este componente intercepta o clique:
     • seção na mesma página: rola suavemente até ela (respeitando o
       scroll-margin de cada seção) e a URL continua limpa;
     • seção em outra página: guarda o destino, navega para a página e,
       quando ela aparece, leva a pessoa direto até a seção.
   Se alguém chegar com um link antigo que tem "#", a página rola até a
   seção e o "#" some da URL.

   Clique com Ctrl/Cmd/Shift (nova aba ou janela) e links externos seguem o
   comportamento normal do navegador.
   ──────────────────────────────────────────────────────────────────────── */

const CHAVE = "pbv-ir-para-secao";

function rolarAte(id: string, suave: boolean) {
  const behavior: ScrollBehavior = suave ? "smooth" : "auto";
  if (id === "inicio") {
    window.scrollTo({ top: 0, behavior });
    return true;
  }
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior, block: "start" });
  return true;
}

/** tira o "#…" da barra de endereço sem recarregar nem mexer no histórico */
function limparUrl() {
  if (!window.location.hash) return;
  window.history.replaceState(
    window.history.state,
    "",
    window.location.pathname + window.location.search,
  );
}

function lerPendente() {
  try {
    const id = window.sessionStorage.getItem(CHAVE);
    if (id) window.sessionStorage.removeItem(CHAVE);
    return id;
  } catch {
    return null;
  }
}

/** espera a seção existir (a página pode ainda estar montando) e vai até ela;
 *  repete uma vez depois, sem animação, caso fotos tenham mudado o layout */
function irQuandoExistir(id: string) {
  let tentativas = 0;
  const tentar = () => {
    if (rolarAte(id, false)) {
      window.setTimeout(() => rolarAte(id, false), 450);
      return;
    }
    if (++tentativas < 30) window.setTimeout(tentar, 100);
  };
  window.setTimeout(tentar, 60);
}

export function RolagemSemHash() {
  const router = useRouter();
  const pathname = useLocation({ select: (l) => l.pathname });

  // chegada na página: destino guardado por um clique em outra página, ou um
  // link antigo com "#"
  useEffect(() => {
    const id = lerPendente() ?? decodeURIComponent(window.location.hash.slice(1));
    limparUrl();
    if (id) irQuandoExistir(id);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      if (a.target && a.target !== "_self") return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const id = a.dataset["secao"] ?? decodeURIComponent(url.hash.slice(1));
      if (!id) return;

      e.preventDefault();

      if (url.pathname === window.location.pathname) {
        // espera um instante: o menu do celular precisa fechar (e destravar a
        // rolagem da página) antes de rolar
        window.setTimeout(() => rolarAte(id, true), 30);
        limparUrl();
        return;
      }

      try {
        window.sessionStorage.setItem(CHAVE, id);
      } catch {
        // sem sessionStorage: a página abre no topo
      }
      router.history.push(url.pathname + url.search);
    };

    // um "#" que apareça de outro jeito (ex.: botão voltar) também some
    const onHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      limparUrl();
      if (id) rolarAte(id, true);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHash);
    };
  }, [router]);

  return null;
}
