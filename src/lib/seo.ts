/* ─────────────────────────────────────────────────────────────────────────────
   SEO E COMPARTILHAMENTO (title, description, Open Graph, Twitter, canonical)

   Toda página usa `seo({...})` no `head` da rota:

     head: () => seo({
       titulo: "Galeria | Bella Vista Pousada Familiar",
       descricao: "…",            // resultado do Google: até ~155 caracteres
       caminho: "/galeria",       // vira o canonical e o og:url
       imagem: "/og/galeria.jpg", // prévia ao compartilhar (WhatsApp, redes)
       imagemAlt: "…",
       descricaoSocial: "…",      // opcional: texto da prévia, se diferente
     }),

   Imagens de compartilhamento: public/og/<página>.jpg, em JPG 1200x630
   (formato aceito por WhatsApp, Facebook, LinkedIn e X). Geradas a partir da
   foto do cabeçalho de cada página. Para uma página nova, gere uma no mesmo
   tamanho e coloque na pasta.

   Lembretes: título no padrão "<Página> | Bella Vista Pousada Familiar"
   (AGENTS.md), sem travessões nos textos, e a página nova também entra no
   public/sitemap.xml.
   ──────────────────────────────────────────────────────────────────────── */

/** endereço oficial do site (canonical, og:url, imagens de compartilhamento) */
export const SITE_URL = "https://pousadabellavista.com.br";
export const NOME_SITE = "Bella Vista Pousada Familiar";

export interface OpcoesSeo {
  titulo: string;
  descricao: string;
  /** caminho da página, começando com "/" (ex.: "/galeria") */
  caminho: string;
  /** imagem em public/, começando com "/" (ex.: "/og/galeria.jpg") */
  imagem: string;
  imagemAlt: string;
  /** título da prévia ao compartilhar (padrão: o mesmo `titulo`) */
  tituloSocial?: string;
  /** texto da prévia ao compartilhar (padrão: a mesma `descricao`) */
  descricaoSocial?: string;
}

export function urlAbsoluta(caminho: string) {
  return caminho.startsWith("http") ? caminho : `${SITE_URL}${caminho}`;
}

export function seo(o: OpcoesSeo) {
  const url = urlAbsoluta(o.caminho);
  const imagem = urlAbsoluta(o.imagem);
  const tituloSocial = o.tituloSocial ?? o.titulo;
  const descricaoSocial = o.descricaoSocial ?? o.descricao;

  return {
    meta: [
      { title: o.titulo },
      { name: "description", content: o.descricao },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: NOME_SITE },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: url },
      { property: "og:title", content: tituloSocial },
      { property: "og:description", content: descricaoSocial },
      { property: "og:image", content: imagem },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: o.imagemAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: tituloSocial },
      { name: "twitter:description", content: descricaoSocial },
      { name: "twitter:image", content: imagem },
      { name: "twitter:image:alt", content: o.imagemAlt },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
