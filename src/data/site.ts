// Constantes e conteúdo estrutural do site, compartilhados entre as seções
// em src/components/site/*.tsx — extraído de routes/index.tsx pra deixar
// cada seção como um componente próprio, só com o JSX/lógica dela.

export const CDN = "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1600,fit=crop/4RNMQ9ouR8E9LLTz";
export const WHATSAPP = "https://wa.me/5554992074419";
// página de pedido de reserva do próprio site (routes/reservar.tsx)
export const RESERVAR = "/reservar";
export const INSTAGRAM_URL = "https://www.instagram.com/apousadabellavista";
export const INSTAGRAM = "@apousadabellavista";
export const ADDRESS = "Vale dos Vinhedos, Bento Gonçalves/RS";

// Contato completo — usado no rodapé (Footer.tsx).
export const EMAIL = "contato@pousadabellavista.com.br";
export const TELEFONE = "(54) 99207-4419";
// Dados da empresa (política de privacidade)
export const RAZAO_SOCIAL = "Pousada Bella Vista LTDA";
export const CNPJ = "45.687.021/0001-65";
export const ENDERECO_COMPLETO = "Via Trento, 1118, Vale dos Vinhedos, Bento Gonçalves/RS";
// mesmas coordenadas do mapa da seção Localização
export const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=-29.1765045,-51.5506722";

// Itens do menu: usados no header (Navbar.tsx), tanto na versão desktop
// quanto no menu mobile. O `href` é uma âncora da Home ("#galeria") ou uma
// página ("/gastronomia"). `secao` é o id da seção da Home que acende o item
// enquanto a pessoa está nela (para as âncoras, é a própria âncora).
export interface NavItem {
  label: string;
  href: string;
  secao?: string;
}

export const NAV: NavItem[] = [
  { label: "Início", href: "#inicio" },
  { label: "Acomodações", href: "#acomodacoes" },
  // sem `secao`: a mini-seção da Home é curta demais para acender o item;
  // ele fica aceso só na página /gastronomia
  { label: "Gastronomia", href: "/gastronomia" },
  { label: "Galeria", href: "/galeria" },
  { label: "Localização", href: "#localizacao" },
];

export const img = {
  hero: `${CDN}/dsc_0418-1-y6x4wZ74XXBLilYQ.jpg`,
  faixa: `${CDN}/imghero2-sNYl3KNv2fW1BJZV.png`,
  depoimentos: `${CDN}/48-zHA98mLLwPSIL8Yq.jpg`,
  pacotes: `${CDN}/chatgpt-image-14-de-jan.-de-2026-13_29_38-5KvLRn5j1e8eZzQH.png`,
  regiao: `${CDN}/87-IZjWWfJdAfFzla5q.jpg`,
  reserva: `${CDN}/design-sem-nome-17-QyfLy3d5iEksNux8.png`,
};

// As acomodações (textos, fotos e páginas dedicadas) ficam em
// src/data/acomodacoes.ts.

export interface NumeroDestaque {
  valor: string;
  label: string;
}

export const numeros: NumeroDestaque[] = [
  { valor: "+ de 3.000", label: "avaliações positivas" },
  { valor: "4,9/5", label: "nota média das avaliações" },
  { valor: "+ de 8", label: "anos de excelência" },
];

export interface Politica {
  label: string;
  href: string;
}

export const politicas: Politica[] = [
  { label: "Política de cancelamento", href: "/politica-de-cancelamento" },
  { label: "Regras da pousada", href: "/politicas-e-regras" },
  { label: "Perguntas frequentes (FAQ)", href: "/perguntas-frequentes" },
  { label: "Horário de check-in / check-out", href: "/horarios" },
  { label: "Estacionamento", href: "/estacionamento" },
];

// Links legais do rodapé — aparecem separados e com menos destaque que as
// `politicas` acima. Páginas: routes/politica-de-privacidade.tsx e
// routes/politica-de-cookies.tsx.
export const politicasLegais: Politica[] = [
  { label: "Política de privacidade", href: "/politica-de-privacidade" },
  { label: "Política de cookies", href: "/politica-de-cookies" },
];

export interface Avaliacao {
  fonte: string;
  desc: string;
  nota: string;
}

export const avaliacoes: Avaliacao[] = [
  { fonte: "Travelers' Choice 2025", desc: "Avaliações dos hóspedes", nota: "4,8" },
  { fonte: "Booking.com", desc: "Avaliação da nossa pousada", nota: "9,7" },
  { fonte: "Google Avaliações", desc: "Avaliação no Google", nota: "5,0" },
];
