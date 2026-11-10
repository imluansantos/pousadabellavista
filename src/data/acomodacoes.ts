// As três acomodações da pousada. Usadas nos cards da Home
// (components/site/Accommodations.tsx) e na página dedicada de cada uma
// (routes/acomodacoes.$slug.tsx + components/site/acomodacao/*).
// Para mudar textos, fotos, ambientes ou comodidades de uma suíte, edite só
// este arquivo.
//
// FOTOS DAS PÁGINAS DEDICADAS
// Ficam em src/assets/acomodacoes/<slug>/, já otimizadas em webp:
//   • <nome>.webp   : versão pequena (720px no lado maior), para prévias;
//   • <nome>-g.webp : versão grande (1800px), carregada só na tela cheia;
//   • capa-p.webp : miniatura da foto principal (seletor e "outras suítes").
// A foto principal do topo, em várias resoluções, vem de src/data/capas.ts.
// Para incluir uma foto: gere as duas versões com o mesmo nome, coloque na
// pasta da suíte e cite o nome em `foto("<slug>", "<nome>", ...)` abaixo.
//
// REGRA DE CONTEÚDO: só entra aqui o que está confirmado (fotos reais da
// suíte, FAQ e regras da pousada). Itens marcados com "confirmar" foram
// identificados nas fotos e devem ser validados com a pousada.
import ac1 from "@/assets/ac1.webp";
import ac2 from "@/assets/ac2.webp";
import ac3 from "@/assets/ac3.webp";
import ac3Card from "@/assets/ac3-card.webp";
import { capas, type ImagemCapa } from "@/data/capas";

// (capa.webp fica de fora: a foto principal agora vem de data/capas.ts)
const arquivos = import.meta.glob<string>(["../assets/acomodacoes/*/*.webp", "!**/capa.webp"], {
  eager: true,
  import: "default",
});

export interface FotoAcomodacao {
  /** versão pequena (prévias e miniaturas) */
  src: string;
  /** versão grande (tela cheia) */
  grande: string;
  alt: string;
  w: number;
  h: number;
}

function arquivo(slug: string, nome: string): string {
  const url = arquivos[`../assets/acomodacoes/${slug}/${nome}.webp`];
  if (!url) throw new Error(`Foto não encontrada: src/assets/acomodacoes/${slug}/${nome}.webp`);
  return url;
}

/** `w`/`h`: dimensões da versão pequena (o layout usa só a proporção). */
function foto(slug: string, nome: string, alt: string, w: number, h: number): FotoAcomodacao {
  return { src: arquivo(slug, nome), grande: arquivo(slug, `${nome}-g`), alt, w, h };
}

export interface Ambiente {
  id: string;
  titulo: string;
  /** frase curta: aparece na lista e na tela cheia */
  descricao: string;
  fotos: FotoAcomodacao[];
}

/** Chaves dos ícones (mapeadas para lucide-react em ComodidadesSuite.tsx). */
export type IconeComodidade =
  | "ar"
  | "poltrona"
  | "cama"
  | "enxoval"
  | "arara"
  | "ferro"
  | "banheiro"
  | "toalha"
  | "secador"
  | "sabonete"
  | "cozinha"
  | "geladeira"
  | "cooktop"
  | "micro-ondas"
  | "cafeteira"
  | "chaleira"
  | "mesa"
  | "wifi"
  | "tv"
  | "cafe-da-manha"
  | "limpeza"
  | "estacionamento"
  | "pet"
  | "chave";

export interface ItemComodidade {
  icone: IconeComodidade;
  texto: string;
  /** aparece na lista principal; os demais ficam em "Ver todas" */
  destaque?: boolean;
}

export interface GrupoComodidades {
  titulo: string;
  itens: ItemComodidade[];
}

export interface FichaAcomodacao {
  /** área em m² */
  area?: number;
  /** número máximo de hóspedes */
  hospedes?: number;
  /** quantidade de camas */
  camas?: number;
  /** tipo da cama, ex.: "Queen" */
  tipoCama?: string;
  banheiros?: number;
}

export interface Acomodacao {
  /** usado na URL: /acomodacoes/<slug> */
  slug: string;
  nome: string;
  /** frase curta do card na Home */
  resumo: string;
  /** frase do topo da página dedicada (e da descrição para buscadores) */
  tagline: string;
  /** título da seção "A suíte" */
  chamada: string;
  /** parágrafo curto e específico da seção "A suíte" */
  texto: string;
  /** diferenciais reais, em frases curtas */
  destaques: string[];
  /** foto do card da Home */
  foto: string;
  /** versão menor da foto para o card da Home (quando a original é grande) */
  fotoCard?: string;
  alt: string;
  /** foto principal da página dedicada */
  capa: ImagemCapa & { pequena: string; alt: string };
  /** cor de assinatura em HSL "H S% L%" (overlay do card, detalhes da página) */
  tema: string;
  /**
   * Ficha da acomodação: a faixa de números da seção "A suíte" (área,
   * hóspedes, camas e banheiros). Dados do site atual. Cada item só aparece
   * quando preenchido.
   */
  ficha?: FichaAcomodacao;
  /** ambientes da seção "Explore os ambientes" (só os que a suíte tem) */
  ambientes: Ambiente[];
  comodidades: GrupoComodidades[];
}

/* ── Comodidades ─────────────────────────────────────────────────────────
   Itens confirmados para TODAS as acomodações (FAQ e regras da pousada).
   Os grupos de cada suíte somam a esses os itens específicos dela. */

const QUARTO_COMUM: ItemComodidade[] = [
  { icone: "enxoval", texto: "Roupas de cama, cobertores e travesseiros" },
  { icone: "ferro", texto: "Ferro de passar roupa" },
];

const BANHEIRO_COMUM: ItemComodidade[] = [
  { icone: "banheiro", texto: "Banheiro privativo", destaque: true },
  { icone: "toalha", texto: "Toalhas de banho e de rosto" },
  { icone: "secador", texto: "Secador de cabelo", destaque: true },
  { icone: "sabonete", texto: "Amenidades de banho" },
];

// Cozinha: "equipada com utensílios básicos" é confirmado pelo FAQ. Os
// eletrodomésticos foram identificados nas fotos das três suítes (confirmar).
const COZINHA_COMUM: ItemComodidade[] = [
  { icone: "cozinha", texto: "Cozinha equipada com utensílios básicos", destaque: true },
  { icone: "geladeira", texto: "Geladeira" },
  { icone: "cooktop", texto: "Cooktop" },
  { icone: "micro-ondas", texto: "Micro-ondas" },
  { icone: "cafeteira", texto: "Cafeteira" },
  { icone: "chaleira", texto: "Chaleira elétrica" },
];

const TECNOLOGIA_COMUM: ItemComodidade[] = [
  { icone: "wifi", texto: "Wi-Fi gratuito", destaque: true },
  // TV identificada nas fotos das três suítes (confirmar)
  { icone: "tv", texto: "TV", destaque: true },
];

const SERVICOS_COMUM: ItemComodidade[] = [
  { icone: "cafe-da-manha", texto: "Café da manhã incluso, na suíte ou no deck", destaque: true },
  { icone: "limpeza", texto: "Limpeza e arrumação diárias" },
  { icone: "estacionamento", texto: "1 vaga de estacionamento no pátio", destaque: true },
  { icone: "pet", texto: "Pet friendly, com aviso na reserva" },
  { icone: "chave", texto: "Chave da suíte e controle do portão" },
];

function comodidades(especificas: {
  conforto?: ItemComodidade[];
  quarto?: ItemComodidade[];
  cozinha?: ItemComodidade[];
}): GrupoComodidades[] {
  return [
    {
      titulo: "Conforto",
      itens: [
        { icone: "ar", texto: "Ar-condicionado", destaque: true },
        ...(especificas.conforto ?? []),
      ],
    },
    { titulo: "Quarto", itens: [...(especificas.quarto ?? []), ...QUARTO_COMUM] },
    { titulo: "Banheiro", itens: BANHEIRO_COMUM },
    { titulo: "Cozinha e refeições", itens: [...COZINHA_COMUM, ...(especificas.cozinha ?? [])] },
    { titulo: "Tecnologia", itens: TECNOLOGIA_COMUM },
    { titulo: "Serviços e facilidades", itens: SERVICOS_COMUM },
  ];
}

/** Informações práticas (confirmadas em /horarios e /politicas-e-regras). */
export const INFO_ESTADIA: { rotulo: string; valor: string }[] = [
  { rotulo: "Check-in", valor: "A partir das 14h" },
  { rotulo: "Check-out", valor: "Até 12h" },
  { rotulo: "Café da manhã", valor: "Das 8h às 10h" },
  { rotulo: "Silêncio", valor: "Das 23h às 6h" },
];

/* ── As três suítes ──────────────────────────────────────────────────── */

const NS = "nascer-do-sol";
const VI = "videiras";
const PS = "por-do-sol";

export const acomodacoes: Acomodacao[] = [
  {
    slug: NS,
    nome: "Nascer do Sol",
    resumo:
      "Amplo e acolhedor, para quem gosta de espaço para respirar e de começar o dia sem pressa.",
    tagline: "Quarto, sala e cozinha integrados num só ambiente amplo.",
    chamada: "Espaço para respirar, do café da manhã ao fim do dia.",
    texto:
      "O Nascer do Sol foi pensado para quem valoriza amplitude. A cama, a sala de estar com duas poltronas, a mesa de jantar e a cozinha dividem o mesmo ambiente, com cantos para descansar, ler e simplesmente não fazer nada.",
    destaques: [
      "Ambiente amplo e integrado",
      "Sala de estar com duas poltronas e TV",
      "Mesa de jantar ao lado da cozinha",
    ],
    foto: ac1,
    alt: "Acomodação Nascer do Sol, com poltronas azuis, mesa de centro e cama de casal",
    capa: {
      ...capas.suites[NS],
      pequena: arquivo(NS, "capa-p"),
      alt: "Vista geral da suíte Nascer do Sol: cozinha, mesa de jantar, poltronas azuis e a cama ao fundo",
    },
    tema: "195 85% 32%", // ciano/azul das poltronas
    ficha: { area: 33, hospedes: 4, camas: 1, tipoCama: "Queen", banheiros: 1 },
    ambientes: [
      {
        id: "quarto",
        titulo: "Quarto",
        descricao: "Cama de casal com manta azul, arara para roupas e janela com cortinas.",
        fotos: [
          foto(NS, "quarto-1", "Cama de casal com manta azul, pufe aos pés e arara de roupas ao lado", 720, 540),
          foto(NS, "quarto-2", "Cama de casal vista de perto, com a sala de estar e a TV ao fundo", 540, 720),
        ],
      },
      {
        id: "sala",
        titulo: "Sala de estar e jantar",
        descricao: "Duas poltronas, mesa de centro, TV e a mesa de jantar no mesmo ambiente.",
        fotos: [
          foto(NS, "sala-1", "Duas poltronas azuis diante da TV, com a mesa de jantar ao lado", 720, 480),
          foto(NS, "sala-2", "Mesa de jantar posta, poltronas azuis e a cama ao fundo", 540, 720),
        ],
      },
      {
        id: "cozinha",
        titulo: "Cozinha",
        descricao: "Bancada com pia, cooktop, geladeira, cafeteira e utensílios básicos.",
        fotos: [
          foto(NS, "cozinha-1", "Cozinha com bancada de granito, cafeteira, chaleira e prateleira de taças", 720, 480),
          foto(NS, "cozinha-2", "Cozinha com pia, cooktop e geladeira", 720, 540),
        ],
      },
      {
        id: "banheiro",
        titulo: "Banheiro",
        descricao: "Banheiro privativo com cuba de apoio, espelho e secador de cabelo.",
        fotos: [
          foto(NS, "banheiro-1", "Banheiro com cuba de apoio branca, espelho e secador de cabelo", 540, 720),
        ],
      },
      {
        id: "entrada",
        titulo: "Entrada",
        descricao: "Porta própria com o nome da suíte e um pequeno jardim vertical.",
        fotos: [
          foto(NS, "entrada-1", "Porta branca da suíte Nascer do Sol, com jardim vertical e vaso de plantas", 720, 480),
        ],
      },
    ],
    comodidades: comodidades({
      conforto: [{ icone: "poltrona", texto: "Sala de estar com duas poltronas", destaque: true }],
      quarto: [
        { icone: "cama", texto: "Cama queen", destaque: true },
        { icone: "arara", texto: "Arara para roupas" },
      ],
      cozinha: [{ icone: "mesa", texto: "Mesa de jantar" }],
    }),
  },
  {
    slug: VI,
    nome: "Videiras",
    resumo: "Intimista e elegante, com cada detalhe no lugar certo. Aconchego na medida exata.",
    tagline: "Intimista, elegante e pensado nos mínimos detalhes.",
    chamada: "Pequenos detalhes, grandes momentos.",
    texto:
      "Compacto e muito bem planejado, o Videiras separa o quarto da cozinha com uma estante vazada de madeira. Atrás da cama, um revestimento branco de tijolinhos; na cozinha, uma mesa preta junto à parede de cortiça e a janela para o verde.",
    destaques: [
      "Estante vazada entre o quarto e a cozinha",
      "Mesa de refeições junto à parede de cortiça",
      "Janelas voltadas para o verde",
    ],
    foto: ac2,
    alt: "Acomodação Videiras, com cama de casal, manta verde e almofadas estampadas",
    capa: {
      ...capas.suites[VI],
      pequena: arquivo(VI, "capa-p"),
      alt: "Suíte Videiras com cama de casal, manta verde, poltrona e arara de madeira",
    },
    tema: "142 38% 24%", // verde profundo do parreiral
    ficha: { area: 30, hospedes: 3, camas: 1, tipoCama: "Queen", banheiros: 1 },
    ambientes: [
      {
        id: "quarto",
        titulo: "Quarto",
        descricao: "Cama de casal com manta verde, poltrona e revestimento de tijolinhos brancos.",
        fotos: [
          foto(VI, "quarto-1", "Cama de casal com manta verde e pufe com toalhas, diante da parede de tijolinhos brancos", 540, 720),
          foto(VI, "quarto-2", "Quarto com cama de casal, poltrona e arara de madeira junto à janela", 720, 540),
          foto(VI, "quarto-3", "Cama vista do pé, com o ar-condicionado e a porta de entrada ao fundo", 720, 540),
        ],
      },
      {
        id: "estante",
        titulo: "Estante e TV",
        descricao: "Estante vazada de madeira que separa o quarto da cozinha e acomoda a TV.",
        fotos: [
          foto(VI, "estante-1", "Estante vazada de madeira com a TV, entre a cama e a cozinha", 720, 540),
          foto(VI, "estante-2", "A cozinha vista do quarto, através da estante vazada", 720, 540),
        ],
      },
      {
        id: "cozinha",
        titulo: "Cozinha",
        descricao: "Cozinha linear com cooktop, geladeira e mesa preta junto à parede de cortiça.",
        fotos: [
          foto(VI, "cozinha-1", "Cozinha com bancada, geladeira e mesa preta posta junto à parede de cortiça", 720, 540),
          foto(VI, "cozinha-2", "Cozinha linear com chaleira, cafeteira, geladeira e janela para o verde", 540, 720),
          foto(VI, "cozinha-3", "Mesa preta com jogo americano, diante da janela", 540, 720),
        ],
      },
    ],
    comodidades: comodidades({
      conforto: [{ icone: "poltrona", texto: "Poltrona" }],
      quarto: [
        { icone: "cama", texto: "Cama queen", destaque: true },
        { icone: "arara", texto: "Arara para roupas" },
      ],
      cozinha: [{ icone: "mesa", texto: "Mesa de refeições" }],
    }),
  },
  {
    slug: PS,
    nome: "Pôr do Sol",
    resumo:
      "Vista privilegiada para o Vale dos Vinhedos e um fim de tarde que pede uma taça de vinho.",
    tagline: "Charme, conforto e um cantinho de leitura ao lado da cama.",
    chamada: "Um quarto para desacelerar.",
    texto:
      "No Pôr do Sol, a parede em relevo com luz embutida dá o tom do quarto. Ao lado da cama, uma poltrona e uma banqueta formam o cantinho de leitura; do outro lado, a cozinha tem uma mesa redonda junto à janela.",
    destaques: [
      "Parede em relevo com iluminação embutida",
      "Cantinho de leitura com poltrona e banqueta",
      "Mesa redonda junto à janela",
    ],
    foto: ac3,
    fotoCard: ac3Card,
    alt: "Acomodação Pôr do Sol, com cama de casal, manta vermelha e parede texturizada",
    capa: {
      ...capas.suites[PS],
      pequena: arquivo(PS, "capa-p"),
      alt: "Suíte Pôr do Sol com cama de casal, manta vermelha, parede em relevo e poltrona",
    },
    tema: "3 75% 38%", // vermelho do laço na cama
    ficha: { area: 28, hospedes: 3, camas: 1, tipoCama: "Queen", banheiros: 1 },
    ambientes: [
      {
        id: "quarto",
        titulo: "Quarto",
        descricao: "Cama de casal, parede em relevo com iluminação embutida e TV.",
        fotos: [
          foto(PS, "quarto-1", "Cama de casal com manta vermelha diante da parede em relevo iluminada", 540, 720),
          foto(PS, "quarto-2", "Quarto com cama de casal, TV na parede e janela", 540, 720),
          foto(PS, "quarto-3", "Cama de casal com toalhas enroladas e a TV ao fundo", 720, 540),
        ],
      },
      {
        id: "leitura",
        titulo: "Cantinho de leitura",
        descricao: "Poltrona e banqueta ao lado da cama, para ler ou descansar sem pressa.",
        fotos: [
          foto(PS, "leitura-1", "Poltrona e banqueta ao lado da cama, junto à parede em relevo", 405, 720),
          foto(PS, "leitura-2", "Poltrona clara e banqueta vistas de perto", 540, 720),
        ],
      },
      {
        id: "cozinha",
        titulo: "Cozinha e mesa",
        descricao: "Cozinha com geladeira, cooktop e cafeteira, e mesa redonda junto à janela.",
        fotos: [
          foto(PS, "cozinha-1", "Cozinha com geladeira, bancada e mesa redonda iluminada pela janela", 720, 540),
          foto(PS, "cozinha-2", "Bancada com pia, cooktop, cafeteira, chaleira e micro-ondas", 720, 534),
          foto(PS, "cozinha-3", "Mesa redonda branca com duas cadeiras e xícaras postas", 515, 720),
          foto(PS, "cozinha-4", "Ímãs de geladeira com miniaturas do trem e da uva", 540, 720),
        ],
      },
      {
        id: "banheiro",
        titulo: "Banheiro",
        descricao: "Cuba de apoio, espelho redondo, nichos e secador de cabelo.",
        fotos: [
          foto(PS, "banheiro-1", "Banheiro com cuba de apoio, espelho redondo, nichos e secador de cabelo", 540, 720),
          foto(PS, "banheiro-2", "Bancada de madeira com cuba branca e espelho redondo", 540, 720),
          foto(PS, "banheiro-3", "Sabonete líquido de uva sobre a bancada do banheiro", 540, 720),
        ],
      },
    ],
    comodidades: comodidades({
      conforto: [{ icone: "poltrona", texto: "Poltrona e banqueta de leitura", destaque: true }],
      quarto: [
        { icone: "cama", texto: "Cama queen", destaque: true },
        { icone: "arara", texto: "Arara para roupas" },
      ],
      cozinha: [{ icone: "mesa", texto: "Mesa redonda junto à janela" }],
    }),
  },
];

export function getAcomodacao(slug: string): Acomodacao | undefined {
  return acomodacoes.find((a) => a.slug === slug);
}

/** Todas as fotos da suíte, na ordem dos ambientes (galeria completa). */
export function todasAsFotos(a: Acomodacao): { foto: FotoAcomodacao; ambiente: Ambiente }[] {
  return a.ambientes.flatMap((ambiente) => ambiente.fotos.map((foto) => ({ foto, ambiente })));
}
