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

   Desempenho: o aviso só aparece na PRIMEIRA INTERAÇÃO do visitante (rolar,
   tocar, clicar ou teclar). Se ele surgisse sozinho depois do carregamento,
   o Google mediria o LCP (maior elemento da tela) por ele, já que o título
   e a foto da Home entram com animação, e a nota no celular cairia. Como o
   LCP para de ser medido na primeira interação, assim o aviso não interfere.
   Nada muda para o GA: ele continua só sendo carregado após o "Aceitar".
   ──────────────────────────────────────────────────────────────────────── */

export function AvisoCookies() {
  const caminho = useLocation({ select: (l) => l.pathname });
  // undefined = ainda não leu o navegador (não mostra nada no servidor)
  const [escolha, setEscolha] = useState<Consentimento | null | undefined>(undefined);
  // só mostra o aviso depois da primeira interação (ver comentário acima)
  const [interagiu, setInteragiu] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    setEscolha(lerConsentimento());
    const rever = () => {
      setInteragiu(true);
      setEscolha(null);
    };
    window.addEventListener(EVENTO_REVER_COOKIES, rever);
    return () => window.removeEventListener(EVENTO_REVER_COOKIES, rever);
  }, []);

  // sem resposta salva: espera o visitante interagir com a página
  useEffect(() => {
    if (escolha !== null || interagiu) return;
    const eventos = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    const liberar = () => setInteragiu(true);
    eventos.forEach((e) => window.addEventListener(e, liberar, { passive: true, once: true }));
    return () => eventos.forEach((e) => window.removeEventListener(e, liberar));
  }, [escolha, interagiu]);

  // com consentimento: carrega o GA e registra a página atual
  useEffect(() => {
    if (escolha !== "aceito") return;
    carregarAnalytics();
    registrarPagina(caminho);
  }, [escolha, caminho]);

  if (!GA_ID || escolha !== null || !interagiu) return null;

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
