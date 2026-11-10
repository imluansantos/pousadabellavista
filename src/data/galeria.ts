// Fotos da Galeria da home (components/site/Gallery.tsx), na ordem em que
// aparecem na "fita" do DriftWall — a fita serpenteia pelas colunas, então
// fotos vizinhas aqui ficam vizinhas no mural. A ordem alterna quartos, café
// da manhã e áreas externas.
//
// Originais em src/assets/galeriahome/; aqui as versões recortadas (3:2) e
// otimizadas de src/assets/galeriahome/otimizadas/.

import foto10 from "@/assets/galeriahome/otimizadas/galeria-10.webp";
import foto23 from "@/assets/galeriahome/otimizadas/galeria-23.webp";
import foto19 from "@/assets/galeriahome/otimizadas/galeria-19.webp";
import foto06 from "@/assets/galeriahome/otimizadas/galeria-06.webp";
import foto12 from "@/assets/galeriahome/otimizadas/galeria-12.webp";
import foto17 from "@/assets/galeriahome/otimizadas/galeria-17.webp";
import foto04 from "@/assets/galeriahome/otimizadas/galeria-04.webp";
import foto16 from "@/assets/galeriahome/otimizadas/galeria-16.webp";
import foto11 from "@/assets/galeriahome/otimizadas/galeria-11.webp";
import foto00 from "@/assets/galeriahome/otimizadas/galeria-00.webp";
import foto05 from "@/assets/galeriahome/otimizadas/galeria-05.webp";
import foto02 from "@/assets/galeriahome/otimizadas/galeria-02.webp";
import foto22 from "@/assets/galeriahome/otimizadas/galeria-22.webp";
import foto03 from "@/assets/galeriahome/otimizadas/galeria-03.webp";
import foto08 from "@/assets/galeriahome/otimizadas/galeria-08.webp";
import foto25 from "@/assets/galeriahome/otimizadas/galeria-25.webp";
import foto20 from "@/assets/galeriahome/otimizadas/galeria-20.webp";
import foto21 from "@/assets/galeriahome/otimizadas/galeria-21.webp";
import foto14 from "@/assets/galeriahome/otimizadas/galeria-14.webp";
import foto24 from "@/assets/galeriahome/otimizadas/galeria-24.webp";
import foto13 from "@/assets/galeriahome/otimizadas/galeria-13.webp";
import foto09 from "@/assets/galeriahome/otimizadas/galeria-09.webp";
import foto18 from "@/assets/galeriahome/otimizadas/galeria-18.webp";
import foto07 from "@/assets/galeriahome/otimizadas/galeria-07.webp";
import foto01 from "@/assets/galeriahome/otimizadas/galeria-01.webp";
import foto15 from "@/assets/galeriahome/otimizadas/galeria-15.webp";

export interface FotoGaleria {
  image: string;
  title: string;
}

export const fotosGaleria: FotoGaleria[] = [
  { image: foto10, title: "Vista aérea da Pousada Bella Vista" },
  { image: foto23, title: "Café da manhã servido na mesa com cesta de pães e geleias" },
  { image: foto19, title: "Quarto decorado com corações e pétalas de rosa" },
  { image: foto06, title: "Deck com guarda-sóis verdes e vista para o vale" },
  { image: foto12, title: "Sala de estar com poltronas verdes, TV e mesa de jantar" },
  { image: foto17, title: "Entrada de apartamento com um cachorrinho no calçamento" },
  { image: foto04, title: "Quarto com manta vinho, poltrona e janela para o verde" },
  { image: foto16, title: "Deck de madeira com cadeiras e guarda-sóis" },
  { image: foto11, title: "Fachada da pousada com floreiras e calçamento de pedra" },
  { image: foto00, title: "Quarto com cama de casal, manta laranja e iluminação embutida" },
  { image: foto05, title: "Arco-íris sobre o jardim e o deck da pousada" },
  { image: foto02, title: "Quarto com cama de casal, manta azul e arara de madeira" },
  { image: foto22, title: "Espumante, taças, frutas e chocolate em decoração romântica" },
  { image: foto03, title: "Acomodação ampla com poltronas azuis, mesa e cozinha" },
  { image: foto08, title: "Mesa de café da manhã com pães, bolos, geleias e flores" },
  { image: foto25, title: "Porta da acomodação Videiras" },
  { image: foto20, title: "Cama decorada com toalhas em forma de cisnes e pétalas" },
  { image: foto21, title: "Sala com lareira elétrica e pétalas de rosa no chão" },
  { image: foto14, title: "Banheiro com cuba branca e acabamento claro" },
  { image: foto24, title: "Detalhe decorativo de barril em miniatura" },
  { image: foto13, title: "Cozinha compacta com geladeira, pia e bancada" },
  { image: foto09, title: "Cesta de café da manhã sobre o banco de madeira" },
  { image: foto18, title: "Acesso à pousada pela rua de pedra" },
  { image: foto07, title: "Quarto com cama de casal e cama de solteiro, manta vermelha" },
  { image: foto01, title: "Painel de madeira com TV e nichos decorativos" },
  { image: foto15, title: "Quarto com cama de casal e manta clara" },
];
