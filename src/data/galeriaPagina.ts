// Fotos da página /galeria (routes/galeria.tsx), na ordem em que aparecem no
// mosaico. Ficam em src/assets/galeriapage/:
//   • gp-XX.webp: versão do mosaico (640px de largura);
//   • gp-XX-g.webp: versão grande, carregada só ao abrir a foto em tela cheia;
//   • galeria-XX.webp: fotos profissionais já recortadas (720 × 480), usadas
//     nos dois casos.
// `w`/`h` são as dimensões da versão do mosaico (o layout usa a proporção).
// Para incluir uma foto: otimize em webp, importe aqui e adicione na lista.
import gp02 from "@/assets/galeriapage/gp-02.webp";
import gp02g from "@/assets/galeriapage/gp-02-g.webp";
import g10 from "@/assets/galeriapage/galeria-10.webp";
import gp07 from "@/assets/galeriapage/gp-07.webp";
import gp07g from "@/assets/galeriapage/gp-07-g.webp";
import gp23 from "@/assets/galeriapage/gp-23.webp";
import gp23g from "@/assets/galeriapage/gp-23-g.webp";
import g02 from "@/assets/galeriapage/galeria-02.webp";
import gp13 from "@/assets/galeriapage/gp-13.webp";
import gp13g from "@/assets/galeriapage/gp-13-g.webp";
import gp03 from "@/assets/galeriapage/gp-03.webp";
import gp03g from "@/assets/galeriapage/gp-03-g.webp";
import g19 from "@/assets/galeriapage/galeria-19.webp";
import gp01 from "@/assets/galeriapage/gp-01.webp";
import gp01g from "@/assets/galeriapage/gp-01-g.webp";
import g03 from "@/assets/galeriapage/galeria-03.webp";
import gp12 from "@/assets/galeriapage/gp-12.webp";
import gp12g from "@/assets/galeriapage/gp-12-g.webp";
import gp19 from "@/assets/galeriapage/gp-19.webp";
import gp19g from "@/assets/galeriapage/gp-19-g.webp";
import g05 from "@/assets/galeriapage/galeria-05.webp";
import gp08 from "@/assets/galeriapage/gp-08.webp";
import gp08g from "@/assets/galeriapage/gp-08-g.webp";
import g22 from "@/assets/galeriapage/galeria-22.webp";
import gp11 from "@/assets/galeriapage/gp-11.webp";
import gp11g from "@/assets/galeriapage/gp-11-g.webp";
import g11 from "@/assets/galeriapage/galeria-11.webp";
import gp04 from "@/assets/galeriapage/gp-04.webp";
import gp04g from "@/assets/galeriapage/gp-04-g.webp";
import gp15 from "@/assets/galeriapage/gp-15.webp";
import gp15g from "@/assets/galeriapage/gp-15-g.webp";
import g17 from "@/assets/galeriapage/galeria-17.webp";
import gp18 from "@/assets/galeriapage/gp-18.webp";
import gp18g from "@/assets/galeriapage/gp-18-g.webp";
import gp09 from "@/assets/galeriapage/gp-09.webp";
import gp09g from "@/assets/galeriapage/gp-09-g.webp";
import g08 from "@/assets/galeriapage/galeria-08.webp";
import gp20 from "@/assets/galeriapage/gp-20.webp";
import gp20g from "@/assets/galeriapage/gp-20-g.webp";
import gp10 from "@/assets/galeriapage/gp-10.webp";
import gp10g from "@/assets/galeriapage/gp-10-g.webp";
import g06 from "@/assets/galeriapage/galeria-06.webp";
import gp21 from "@/assets/galeriapage/gp-21.webp";
import gp21g from "@/assets/galeriapage/gp-21-g.webp";
import gp14 from "@/assets/galeriapage/gp-14.webp";
import gp14g from "@/assets/galeriapage/gp-14-g.webp";
import g12 from "@/assets/galeriapage/galeria-12.webp";
import g21 from "@/assets/galeriapage/galeria-21.webp";
import gp05 from "@/assets/galeriapage/gp-05.webp";
import gp05g from "@/assets/galeriapage/gp-05-g.webp";
import gp22 from "@/assets/galeriapage/gp-22.webp";
import gp22g from "@/assets/galeriapage/gp-22-g.webp";
import g25 from "@/assets/galeriapage/galeria-25.webp";
import gp06 from "@/assets/galeriapage/gp-06.webp";
import gp06g from "@/assets/galeriapage/gp-06-g.webp";
import gp17 from "@/assets/galeriapage/gp-17.webp";
import gp17g from "@/assets/galeriapage/gp-17-g.webp";

export type CategoriaGaleria = "quartos" | "cafe" | "areas" | "detalhes";

export interface FotoGaleria {
  id: string;
  src: string;
  /** versão grande para a tela cheia (sem ela, usa `src`) */
  grande?: string;
  alt: string;
  categoria: CategoriaGaleria;
  w: number;
  h: number;
}

export const CATEGORIAS_GALERIA: { id: CategoriaGaleria | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "quartos", label: "Acomodações" },
  { id: "cafe", label: "Café da manhã" },
  { id: "areas", label: "Áreas externas" },
  { id: "detalhes", label: "Detalhes" },
];

export const fotosGaleriaPagina: FotoGaleria[] = [
  { id: "gp-02", src: gp02, grande: gp02g, alt: "Mesa do café da manhã vista de cima, com cesta de pães, geleias e xícaras", categoria: "cafe", w: 640, h: 853 },
  { id: "galeria-10", src: g10, alt: "Vista aérea da Pousada Bella Vista", categoria: "areas", w: 720, h: 480 },
  { id: "gp-07", src: gp07, grande: gp07g, alt: "Acomodação Pôr do Sol com cama de casal e manta coral", categoria: "quartos", w: 640, h: 853 },
  { id: "gp-23", src: gp23, grande: gp23g, alt: "Varanda com ombrelone verde, mesa e cadeiras de madeira e vista do vale", categoria: "areas", w: 640, h: 853 },
  { id: "galeria-02", src: g02, alt: "Quarto com cama de casal, manta azul e arara de madeira", categoria: "quartos", w: 720, h: 480 },
  { id: "gp-13", src: gp13, grande: gp13g, alt: "Floreira de madeira com flores pendentes na varanda", categoria: "areas", w: 640, h: 853 },
  { id: "gp-03", src: gp03, grande: gp03g, alt: "Cesta de pães e croissants com café passado na xícara azul", categoria: "cafe", w: 640, h: 853 },
  { id: "galeria-19", src: g19, alt: "Quarto decorado com corações e pétalas de rosa", categoria: "detalhes", w: 720, h: 480 },
  { id: "gp-01", src: gp01, grande: gp01g, alt: "Lago com carpas e cascata de pedra entre as plantas do jardim", categoria: "areas", w: 640, h: 960 },
  { id: "galeria-03", src: g03, alt: "Acomodação ampla com poltronas azuis, mesa e cozinha", categoria: "quartos", w: 720, h: 480 },
  { id: "gp-12", src: gp12, grande: gp12g, alt: "Xícara rosa sobre o jogo americano, com o painel de cortiça ao fundo", categoria: "detalhes", w: 640, h: 853 },
  { id: "gp-19", src: gp19, grande: gp19g, alt: "Acomodação Videiras com manta verde e toalhas sobre o pufe", categoria: "quartos", w: 640, h: 480 },
  { id: "galeria-05", src: g05, alt: "Arco-íris sobre o jardim e o deck da pousada", categoria: "areas", w: 720, h: 480 },
  { id: "gp-08", src: gp08, grande: gp08g, alt: "Cantinho de leitura com poltrona e banqueta na acomodação Pôr do Sol", categoria: "quartos", w: 640, h: 1138 },
  { id: "galeria-22", src: g22, alt: "Espumante, taças, frutas e chocolate em decoração romântica", categoria: "detalhes", w: 720, h: 480 },
  { id: "gp-11", src: gp11, grande: gp11g, alt: "Mesa de refeições junto à janela, com a luz da manhã", categoria: "quartos", w: 640, h: 853 },
  { id: "galeria-11", src: g11, alt: "Fachada da pousada com floreiras e calçamento de pedra", categoria: "areas", w: 720, h: 480 },
  { id: "gp-04", src: gp04, grande: gp04g, alt: "Potes de salada de frutas com etiqueta de bom dia no café da manhã", categoria: "cafe", w: 640, h: 853 },
  { id: "gp-15", src: gp15, grande: gp15g, alt: "Acomodação com duas camas, mantas coral e azul", categoria: "quartos", w: 640, h: 853 },
  { id: "galeria-17", src: g17, alt: "Entrada de apartamento com um cachorrinho no calçamento", categoria: "areas", w: 720, h: 480 },
  { id: "gp-18", src: gp18, grande: gp18g, alt: "Escada de entrada da acomodação com canteiro de flores lilás", categoria: "areas", w: 640, h: 853 },
  { id: "gp-09", src: gp09, grande: gp09g, alt: "Banheiro com cuba branca, espelho redondo e nichos", categoria: "quartos", w: 640, h: 853 },
  { id: "galeria-08", src: g08, alt: "Mesa de café da manhã com pães, bolos, geleias e flores", categoria: "cafe", w: 720, h: 480 },
  { id: "gp-20", src: gp20, grande: gp20g, alt: "Acomodação Videiras com estante vazada separando os ambientes", categoria: "quartos", w: 640, h: 480 },
  { id: "gp-10", src: gp10, grande: gp10g, alt: "Sabonete líquido de uva sobre a bancada do banheiro", categoria: "detalhes", w: 640, h: 853 },
  { id: "galeria-06", src: g06, alt: "Deck com guarda-sóis verdes e vista para o vale", categoria: "areas", w: 720, h: 480 },
  { id: "gp-21", src: gp21, grande: gp21g, alt: "Cama da acomodação Videiras com parede de tijolinhos brancos", categoria: "quartos", w: 640, h: 853 },
  { id: "gp-14", src: gp14, grande: gp14g, alt: "Ímãs de geladeira com miniaturas do trem e da uva", categoria: "detalhes", w: 640, h: 853 },
  { id: "galeria-12", src: g12, alt: "Sala de estar com poltronas verdes, TV e mesa de jantar", categoria: "quartos", w: 720, h: 480 },
  { id: "galeria-21", src: g21, alt: "Sala com lareira elétrica e pétalas de rosa no chão", categoria: "detalhes", w: 720, h: 480 },
  { id: "gp-05", src: gp05, grande: gp05g, alt: "Xícara de café entre as plantas, na acomodação", categoria: "cafe", w: 640, h: 853 },
  { id: "gp-22", src: gp22, grande: gp22g, alt: "Cozinha com mesa preta e parede de cortiça na acomodação Videiras", categoria: "quartos", w: 640, h: 853 },
  { id: "galeria-25", src: g25, alt: "Porta da acomodação Videiras", categoria: "detalhes", w: 720, h: 480 },
  { id: "gp-06", src: gp06, grande: gp06g, alt: "Cozinha compacta da acomodação, com geladeira, pia e cafeteira", categoria: "quartos", w: 640, h: 474 },
  { id: "gp-17", src: gp17, grande: gp17g, alt: "Quarto iluminado com janela para o verde e toalhas sobre as camas", categoria: "quartos", w: 640, h: 480 },
];
