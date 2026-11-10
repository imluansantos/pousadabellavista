// Depoimentos reais de hóspedes — seção "Depoimentos" da home
// (components/site/Testimonials.tsx). São mostrados de 3 em 3; as setas
// passam para os próximos. Para adicionar, remover ou reordenar, é só
// editar esta lista (a quantidade de páginas se ajusta sozinha).

import type { Testimonial } from "@/components/ui/testimonials-3";

const HOSPEDE = "Hóspede";

export const depoimentos: Testimonial[] = [
  {
    name: "Wagner",
    role: HOSPEDE,
    quote:
      "Estadia excelente: lugar bonito, quarto novo e confortável, café da manhã incrível com vista, e atendimento excepcional da Natália e dona Rosa. Altamente recomendado.",
  },
  {
    name: "Priscilla",
    role: HOSPEDE,
    quote:
      "De tudo! O quarto é amplo, conta com cozinha equipada! A localização é maravilhosa! Café da manhã rico e muito bem servido. Você vê o carinho da Natália em cada coisa!",
  },
  {
    name: "Amaro",
    role: HOSPEDE,
    quote:
      "Café da manhã excelente, quarto super confortável e atendimento familiar e simpático. A pousada ainda oferece convênios ótimos!",
  },
  {
    name: "Renata",
    role: HOSPEDE,
    quote:
      "Quarto confortável e bem equipado, café da manhã farto no quarto e excelente aquecimento no inverno. Localização ideal no Vale dos Vinhedos, com vista linda e vinícolas próximas. Anfitriãs muito atenciosas.",
  },
  {
    name: "Janaína",
    role: HOSPEDE,
    quote: "Simplesmente perfeito! Tudo muito caprichoso e maravilhoso.",
  },
  {
    name: "Christiane",
    role: HOSPEDE,
    quote:
      "A pousada faz jus ao nome. Vista linda, localização ótima, acomodação perfeita, com mimos deixados pela Sra. Rosa, anfitriã. Cordialidade dos proprietários. Café da manhã maravilhoso, tudo caseiro e saboroso.",
  },
  {
    name: "James",
    role: HOSPEDE,
    quote:
      "Pousada tranquila e confortável no Vale dos Vinhedos, com quartos espaçosos, cozinha completa, ótimo café da manhã e atendimento impecável.",
  },
  {
    name: "Mariele",
    role: HOSPEDE,
    quote: "Muito agradável, completo, confortável e sempre muito cheiroso. Um lugar acolhedor, perfeito para descansar e aproveitar a estadia. Voltaremos com certeza!",
  },
  {
    name: "Valeska",
    role: HOSPEDE,
    quote:
      "Vista hermosa a los viñedos, súper cómodo, limpio, el departamento tiene de todo: galletas, té, café de cortesía, una cava pequeña, agua, bebidas y cervezas para la venta, TV, aire acondicionado, un desayuno que da para 4 personas y la amabilidad de Natalia y Rosa. Un 7 la atención.",
  },
  {
    name: "Michele",
    role: HOSPEDE,
    quote:
      "Fomos muito bem recebidos, gostamos de todos os detalhes do quarto: harmonioso, confortável, limpinho. Não deixou nada a desejar.",
  },
  {
    name: "Daniel",
    role: HOSPEDE,
    quote: "Cordialidade da equipe, café da manhã, espaço do quarto, cozinha montada.",
  },
  {
    name: "Murilo",
    role: HOSPEDE,
    quote:
      "Fomos recebidos pela proprietária da pousada, com muita cortesia e simpatia. A propriedade é muito bem cuidada, com bom gosto.",
  },
  // Avaliações do Google (5/5), adicionadas em novembro de 2026
  {
    name: "Elaine",
    role: HOSPEDE,
    quote:
      "Ficamos em família nas férias de julho e fomos muito bem recebidos pela Natália. Uma pousada aconchegante, quartos espaçosos, cheirosos, muito limpos e equipados. Um café da manhã maravilhoso, quentinho e feito com carinho! Com certeza indicamos!",
  },
  {
    name: "Ana",
    role: HOSPEDE,
    quote:
      "A pousada é sensacional. No Vale dos Vinhedos, com várias vinícolas para visitar a pé. Tudo muito limpo, ótima cama, ar-condicionado e chuveiro. Na cozinha, tudo que precisei. O café da manhã foi perfeito e o atendimento, muito acolhedor. Amei!",
  },
  {
    name: "Fábio",
    role: HOSPEDE,
    quote:
      "Adoramos a pousada. Próxima a diversas vinícolas, ambiente agradável, lindo e tranquilo. Tudo muito limpo e organizado, cada detalhe da acomodação. Café da manhã excelente, tudo fresquinho e feito com cuidado. Recomendo muito e com certeza voltaremos.",
  },
  {
    name: "Monica",
    role: HOSPEDE,
    quote:
      "Simplesmente encanta! A pousada é perfeita, aconchegante, me senti em casa. As anfitriãs são uma simpatia. A cesta de café da manhã entregue no quarto, com todos os produtos fresquinhos e deliciosos, é um mimo maravilhoso.",
  },
  {
    name: "Clarisse",
    role: HOSPEDE,
    quote:
      "A pousada é linda e a vista é de tirar o fôlego! O quarto é bem decorado e cheio de mimos. O café da manhã é um show à parte. As meninas do atendimento ajudam em tudo, com dicas sobre lugares e descontos. Super recomendo!",
  },
  {
    name: "Karoline",
    role: HOSPEDE,
    quote:
      "Passamos o feriado de 7 de setembro e foi incrível! O café da manhã era perfeito, tudo no equilíbrio certo. Prezamos muito pelo silêncio, e o local nos proporcionou isso. Com certeza voltaremos assim que possível!",
  },
  {
    name: "Geórgia",
    role: HOSPEDE,
    quote:
      "Quarto e banheiro limpos e aconchegantes, com uma varanda para apreciar o vale acompanhado de um bom vinho. O café da manhã é excepcional, bem diverso e delicioso, e ainda foi adaptado à minha restrição alimentar. Natália e D. Rosa sempre muito solícitas.",
  },
  {
    name: "Juliana",
    role: HOSPEDE,
    quote:
      "Pousada super bem localizada, perto das vinícolas, e serviço muito acolhedor! Quarto excelente, com mini cozinha, chazinhos disponíveis e um atendimento carinhoso que faz a gente se sentir em casa. O ponto alto é o café da manhã, super bem servido e gostoso.",
  },
  {
    name: "Emerson",
    role: HOSPEDE,
    quote:
      "Local agradável e aconchegante. O atendimento foi excelente, muito familiar. O café da manhã é excelente, e quando é servido no deck, fica ainda melhor. Como o local é pequeno, preserva o ambiente tranquilo e familiar. Nós vamos voltar.",
  },
  {
    name: "Patrícia",
    role: HOSPEDE,
    quote:
      "Tudo perfeito! Aconchegante, limpeza impecável, fácil de encontrar. O café da manhã é excepcional! Levamos junto nossa cachorra, que foi muito bem recebida também. Amamos tudo, com certeza voltaremos.",
  },
  {
    name: "Talys",
    role: HOSPEDE,
    quote:
      "Tudo excelente! Acomodação confortável, com cozinha. Vista linda. Café da manhã excelente. Super recomendo.",
  },
  {
    name: "Flávia",
    role: HOSPEDE,
    quote:
      "Pousada aconchegante, nossa estadia foi ótima. Café da manhã diferenciado, maravilhoso!",
  },
];
