/* ─────────────────────────────────────────────────────────────────────────────
   GOOGLE ANALYTICS 4 (com consentimento)

   ID de medição da propriedade "Pousada Bella Vista" no GA4 (fica no
   código mesmo: ele é público, aparece no HTML de qualquer site com GA).
   Para trocar sem mexer aqui, defina VITE_GA_ID (.env.local ou Vercel);
   VITE_GA_ID vazio ("") desliga o GA e o aviso de cookies.

   No localhost (npm run dev) o GA não é carregado, para os seus testes não
   entrarem nas estatísticas. O aviso de cookies aparece normalmente.

   Pela LGPD, o GA só é carregado DEPOIS que o visitante clica em "Aceitar"
   no aviso de cookies (components/site/AvisoCookies.tsx). A escolha fica
   salva no navegador (CHAVE_CONSENTIMENTO) e aparece na política de
   cookies. Se mudar algo aqui, revise /politica-de-cookies e
   /politica-de-privacidade.
   ──────────────────────────────────────────────────────────────────────── */

const GA_ID_PADRAO = "G-XL36T3KYTY";

const doAmbiente = import.meta.env["VITE_GA_ID"] as string | undefined;
export const GA_ID: string = (doAmbiente ?? GA_ID_PADRAO).trim();

function emDesenvolvimento() {
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h.endsWith(".localhost");
}

export const CHAVE_CONSENTIMENTO = "bv-consentimento-cookies";
/** evento disparado para reabrir o aviso (ex.: botão na política de cookies) */
export const EVENTO_REVER_COOKIES = "bv:rever-cookies";

export type Consentimento = "aceito" | "recusado";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function lerConsentimento(): Consentimento | null {
  try {
    const v = window.localStorage.getItem(CHAVE_CONSENTIMENTO);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    return null;
  }
}

export function salvarConsentimento(valor: Consentimento) {
  try {
    window.localStorage.setItem(CHAVE_CONSENTIMENTO, valor);
  } catch {
    /* sem armazenamento: vale só para esta visita */
  }
}

let carregado = false;

/** Injeta o gtag.js uma única vez (só chame com consentimento). */
export function carregarAnalytics() {
  if (carregado || !GA_ID || typeof window === "undefined" || emDesenvolvimento()) return;
  carregado = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  // page_view é enviado à mão a cada troca de página (o site navega sem recarregar)
  window.gtag("config", GA_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

/** Registra a visualização de uma página (ignorado sem GA carregado). */
export function registrarPagina(caminho: string) {
  if (!carregado || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: caminho,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Esquece a escolha e mostra o aviso de novo. */
export function reverCookies() {
  try {
    window.localStorage.removeItem(CHAVE_CONSENTIMENTO);
  } catch {
    /* segue */
  }
  window.dispatchEvent(new Event(EVENTO_REVER_COOKIES));
}
