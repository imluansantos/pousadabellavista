// As 9 comodidades da pousada — usadas na página /comodidades
// (src/routes/comodidades.tsx). Textos originais do site; fotos em 4:3
// otimizadas a partir dos originais em src/assets/comodidades/.
import imgApartamentos from "@/assets/comodidades/otimizadas/apartamentos-confortaveis.webp";
import imgCafe from "@/assets/comodidades/otimizadas/cafe-da-manha-excepcional.webp";
import imgEstacionamento from "@/assets/comodidades/otimizadas/estacionamento-gratuito.webp";
import imgBanheiro from "@/assets/comodidades/otimizadas/banheiro-privativo.webp";
import imgPet from "@/assets/comodidades/otimizadas/pet-friendly.webp";
import imgAr from "@/assets/comodidades/otimizadas/arcondicionado.webp";
import imgVista from "@/assets/comodidades/otimizadas/vista-encantadora.webp";
import imgWifi from "@/assets/comodidades/otimizadas/wifi.webp";
import imgArLivre from "@/assets/comodidades/otimizadas/area-ao-ar-livre.webp";

export interface Comodidade {
  id: string;
  titulo: string;
  texto: string;
  foto: string;
  alt: string;
}

export const comodidades: Comodidade[] = [
  {
    id: "apartamentos",
    titulo: "Apartamentos confortáveis",
    texto:
      "Quartos espaçosos e decorados com cuidado — roupa de cama premium e ambientes pensados para relaxar.",
    foto: imgApartamentos,
    alt: "Apartamento com cama de casal, poltrona e janela para o verde",
  },
  {
    id: "cafe",
    titulo: "Café da manhã excepcional",
    texto:
      "Produtos frescos e regionais servidos diariamente — uma experiência que começa o dia com sabor.",
    foto: imgCafe,
    alt: "Mesa de café da manhã com pães, bolo e geleias",
  },
  {
    id: "estacionamento",
    titulo: "Estacionamento gratuito",
    texto: "Vagas seguras e próximas aos apartamentos, facilitando seu desembarque e descanso.",
    foto: imgEstacionamento,
    alt: "Estacionamento em frente aos apartamentos da pousada",
  },
  {
    id: "banheiro",
    titulo: "Banheiro privativo",
    texto: "Higiene e privacidade com amenidades selecionadas e limpeza dedicada.",
    foto: imgBanheiro,
    alt: "Banheiro privativo com box de vidro e pia",
  },
  {
    id: "pet",
    titulo: "Pet friendly",
    texto:
      "Animais são bem-vindos, com atenção especial para o conforto do seu pet (consulte as políticas).",
    foto: imgPet,
    alt: "Cachorro de roupinha descansando no gramado da pousada",
  },
  {
    id: "ar",
    titulo: "Ar-condicionado",
    texto: "Climatização silenciosa para noites confortáveis, independente da estação.",
    foto: imgAr,
    alt: "Ar-condicionado split na parede do apartamento",
  },
  {
    id: "vista",
    titulo: "Vista encantadora",
    texto: "Vistas para o jardim, os vinhedos ou áreas naturais — um convite ao descanso.",
    foto: imgVista,
    alt: "Área externa com ombrelones voltada para a vista do vale",
  },
  {
    id: "wifi",
    titulo: "Wi-Fi rápido",
    texto: "Conexão estável e de alta velocidade — ideal para trabalho ou streaming.",
    foto: imgWifi,
    alt: "Roteador Wi-Fi",
  },
  {
    id: "ar-livre",
    titulo: "Área ao ar livre",
    texto: "Jardins, varanda e cantos de relaxamento para curtir a natureza e o silêncio.",
    foto: imgArLivre,
    alt: "Deck de madeira com cadeiras ao sol, cercado por jardim",
  },
];
