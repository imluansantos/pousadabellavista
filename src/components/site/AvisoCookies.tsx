import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Cookie } from "lucide-react";
import {
  EVENTO_REVER_COOKIES,
  GA_ID,
  carregarAnalytics,
  lerConsentimento,
  registrarPagina,
  salvarConsentimento,
  type Consentimento,
} from "@/lib/analytics";

/* ─────────────────────────────────────────────────────────────────────────────
   AVISO DE COOKIES + GOOGLE ANALYTICS (montado uma vez, em routes/__root.tsx)

   • Sem VITE_GA_ID configurado: não mostra nada (o site não usa cookies de
     análise, então não há o que pedir).
   • Primeira visita: cartão no canto inferior com "Aceitar" e "Recusar".
     O GA só é carregado depois do "Aceitar" (src/lib/analytics.ts).
   • Visitas seguintes: respeita a escolha salva; com "aceito", carrega o GA
     e registra cada página visitada.
   • A política de cookies tem um botão para rever a escolha.

   Desempenho: o aviso aparece depois que a página carrega (precisa ler a
   escolha salva no navegador). Por isso ele é propositalmente pequeno e sem
   animação de entrada: se o texto ocupar uma área grande da tela, o
   PageSpeed passa a medir o LCP por ele e a nota no celular cai.
   ──────────────────────────────────────────────────────────────────────── */

export function AvisoCookies() {
  const caminho = useLocation({ select: (l) => l.pathname });
  // undefined = ainda não leu o navegador (não mostra nada no servidor)
  const [escolha, setEscolha] = useState<Consentimento | null | undefined>(undefined);

  useEffect(() => {
    if (!GA_ID) return;
    setEscolha(lerConsentimento());
    const rever = () => setEscolha(null);
    window.addEventListener(EVENTO_REVER_COOKIES, rever);
    return () => window.removeEventListener(EVENTO_REVER_COOKIES, rever);
  }, []);

  // com consentimento: carrega o GA e registra a página atual
  useEffect(() => {
    if (escolha !== "aceito") return;
    carregarAnalytics();
    registrarPagina(caminho);
  }, [escolha, caminho]);

  if (!GA_ID || escolha !== null) return null;

  function decidir(valor: Consentimento) {
    salvarConsentimento(valor);
    setEscolha(valor);
  }

  return (
    <aside
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed right-20 bottom-4 left-4 z-50 rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur sm:right-auto sm:bottom-6 sm:left-6 sm:w-[22rem]"
    >
      <p className="flex items-start gap-2 text-[0.82rem] leading-snug text-foreground/80">
        <Cookie aria-hidden className="mt-0.5 size-3.5 shrink-0 text-wine" />
        <span>
          Usamos cookies de análise só com o seu aceite.{" "}
          <Link
            to="/politica-de-cookies"
            className="font-medium text-wine underline decoration-wine/30 underline-offset-4"
          >
            Saiba mais
          </Link>
        </span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => decidir("aceito")} className="btn-base btn-primary !px-5 !py-2">
          Aceitar
        </button>
        <button type="button" onClick={() => decidir("recusado")} className="btn-base btn-outline !px-5 !py-2">
          Recusar
        </button>
      </div>
    </aside>
  );
}
