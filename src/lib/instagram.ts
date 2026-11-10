import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Últimas postagens do Instagram da pousada — usado pela seção
   components/site/InstagramFeed.tsx.

   O FEED JÁ ESTÁ LIGADO
   O perfil @apousadabellavista está conectado ao Behold (app.behold.so, conta
   do Luan) e o feed JSON fica em FEED_PADRAO, logo abaixo. O plano gratuito
   entrega as 6 últimas postagens e até 1.200 visualizações por mês.

   Para trocar de feed sem mexer no código, crie um `.env.local` (e a mesma
   variável na hospedagem) com:
        VITE_INSTAGRAM_FEED_URL=https://feeds.behold.so/SEU_ID

   Se o feed falhar (ex.: limite do mês atingido), a seção mostra as fotos de
   reserva (`fallback`), todas levando ao perfil.

   ⚠️ Use só links PÚBLICOS de feed. Nunca coloque aqui um token de acesso da
   API do Instagram: tudo que começa com VITE_ fica visível no navegador.
   ──────────────────────────────────────────────────────────────────────── */

export interface InstagramPost {
  id: string;
  image: string;
  link: string;
  caption: string;
  tipo: "imagem" | "video" | "carrossel";
}

export interface InstagramFeedData {
  posts: InstagramPost[];
  /** só vêm quando o feed informa */
  seguidores?: number;
  seguindo?: number;
  /** true quando os posts vieram do Instagram (e não das fotos de reserva) */
  aoVivo: boolean;
}

/** feed público do Behold (é um link público, não é um token: pode ficar aqui) */
const FEED_PADRAO = "https://feeds.behold.so/3i7aXjecZI8myn2ohyfK";

// (colchetes: o tsconfig exige esse acesso para variáveis de ambiente)
const FEED_URL: string = import.meta.env["VITE_INSTAGRAM_FEED_URL"] || FEED_PADRAO;

type Bruto = Record<string, unknown>;

const texto = (v: unknown): string | undefined =>
  typeof v === "string" && v.length > 0 ? v : undefined;

/**
 * Converte o JSON do feed em posts. Aceita o formato do Behold
 * (`{ posts: [...] }` ou uma lista) e o formato da API do Instagram
 * (`{ data: [...] }`, com media_url / thumbnail_url).
 */
function normalizar(json: unknown): Omit<InstagramFeedData, "aoVivo"> {
  const raiz = (json ?? {}) as Bruto;
  const lista = (
    Array.isArray(json) ? json : Array.isArray(raiz["posts"]) ? raiz["posts"] : raiz["data"]
  ) as Bruto[] | undefined;

  const posts: InstagramPost[] = [];
  for (const p of lista ?? []) {
    const tipoBruto = String(p["mediaType"] ?? p["media_type"] ?? "IMAGE").toUpperCase();
    const video = tipoBruto === "VIDEO";
    const sizes = p["sizes"] as Record<string, { mediaUrl?: string }> | undefined;
    const image =
      texto(sizes?.["medium"]?.mediaUrl) ??
      texto(p["thumbnailUrl"]) ??
      texto(p["thumbnail_url"]) ??
      (video ? undefined : (texto(p["mediaUrl"]) ?? texto(p["media_url"])));
    const link = texto(p["permalink"]);
    if (!image || !link) continue;

    posts.push({
      id: String(p["id"] ?? link),
      image,
      link,
      caption: texto(p["prunedCaption"]) ?? texto(p["caption"]) ?? "",
      tipo: video ? "video" : tipoBruto === "CAROUSEL_ALBUM" ? "carrossel" : "imagem",
    });
  }

  const seguidores = raiz["followersCount"] ?? raiz["followers_count"];
  const seguindo = raiz["followsCount"] ?? raiz["follows_count"];
  return {
    posts,
    ...(typeof seguidores === "number" ? { seguidores } : {}),
    ...(typeof seguindo === "number" ? { seguindo } : {}),
  };
}

// Cada leitura do feed conta como 1 visualização no plano do Behold (1.200
// por mês no gratuito). Para economizar: o feed só é pedido quando a seção
// se aproxima da tela (`ativo`) e a resposta fica guardada no navegador do
// visitante por 6 horas.
const CHAVE_CACHE = "pbv-instagram-feed";
const VALIDADE_CACHE = 6 * 60 * 60 * 1000;

function lerCache(): unknown {
  try {
    const bruto = window.localStorage.getItem(CHAVE_CACHE);
    if (!bruto) return undefined;
    const { t, url, json } = JSON.parse(bruto) as { t: number; url: string; json: unknown };
    return url === FEED_URL && Date.now() - t < VALIDADE_CACHE ? json : undefined;
  } catch {
    return undefined;
  }
}

function salvarCache(json: unknown) {
  try {
    window.localStorage.setItem(CHAVE_CACHE, JSON.stringify({ t: Date.now(), url: FEED_URL, json }));
  } catch {
    /* sem armazenamento: tudo bem, só não guarda */
  }
}

export function useInstagramFeed(
  fallback: InstagramPost[],
  limite = 6,
  ativo = true,
): InstagramFeedData {
  const [dados, setDados] = useState<InstagramFeedData>({
    posts: fallback.slice(0, limite),
    aoVivo: false,
  });

  useEffect(() => {
    if (!ativo) return;
    const aplicar = (json: unknown) => {
      const { posts, ...numeros } = normalizar(json);
      if (!posts.length) return false;
      setDados({ posts: posts.slice(0, limite), aoVivo: true, ...numeros });
      return true;
    };

    if (aplicar(lerCache())) return;

    const ctrl = new AbortController();
    fetch(FEED_URL, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: unknown) => {
        if (aplicar(json)) salvarCache(json);
      })
      .catch(() => {
        /* sem feed: continua com as fotos de reserva */
      });
    return () => ctrl.abort();
  }, [limite, ativo]);

  return dados;
}
