// Lugares de cada pilar da seção "Experiências" da home
// (components/site/Experiences.tsx), mostrados no pop-out de cada pilar.
//
// ⚠️ TEMPOS DE CARRO: são estimativas a partir da pousada (Via Trento, 1118).
// Os das vinícolas vêm do site antigo; os demais são aproximados e devem
// ser conferidos — é só editar o campo `tempo` aqui.
//
// O botão "Ver no Maps" busca pelo nome do lugar + Bento Gonçalves no
// Google Maps (campo `busca`, se quiser refinar a busca de algum lugar).

export interface Lugar {
  nome: string;
  /** referência curta de localização */
  local: string;
  /** tempo aproximado de carro a partir da pousada */
  tempo: string;
  /** texto da busca no Google Maps (padrão: nome + Bento Gonçalves) */
  busca?: string;
}

export interface PilarExperiencia {
  nome: string;
  texto: string;
  lugares: Lugar[];
}

export const PILARES_EXPERIENCIA: PilarExperiencia[] = [
  {
    nome: "Vinhos",
    texto: "Vinícolas, degustações e enoturismo.",
    lugares: [
      { nome: "Casa Valduga", local: "Via Trento, 2355 · Linha Leopoldina", tempo: "1 a 3 min" },
      { nome: "Vinhos Larentis", local: "Via Trento · Vale dos Vinhedos", tempo: "2 a 4 min" },
      { nome: "Miolo Wine Group", local: "RS-444, km 21 · Vale dos Vinhedos", tempo: "8 a 10 min" },
      { nome: "Cave de Pedra", local: "RS-444 · Vale dos Vinhedos", tempo: "8 a 10 min" },
      {
        nome: "Vinícola Aurora",
        local: "RS-444, 21 · Vinosul",
        tempo: "10 a 15 min",
        busca: "Vinícola Aurora, Bento Gonçalves - RS",
      },
      {
        nome: "Pizzato Vinhas e Vinhos",
        local: "Via dos Parreirais · Santa Lúcia",
        tempo: "12 a 15 min",
      },
    ],
  },
  {
    nome: "Gastronomia",
    texto: "Restaurantes, sabores regionais e experiências à mesa.",
    lugares: [
      {
        nome: "Giordani Gastronomia Cultural",
        local: "Vale dos Vinhedos",
        tempo: "≈ 3 min", // conferir
      },
      {
        nome: "Restaurante Maria Valduga",
        local: "Casa Valduga · Via Trento, 2355",
        tempo: "≈ 3 min", // conferir
        busca: "Restaurante Maria Valduga, Casa Valduga, Bento Gonçalves - RS",
      },
      {
        nome: "Mamma Gema Trattoria",
        local: "RS-444, km 18 · Vale dos Vinhedos",
        tempo: "≈ 10 min", // conferir
      },
      {
        nome: "Pizza Entre Vinhos",
        local: "RS-444, km 18 · Vale dos Vinhedos",
        tempo: "≈ 10 min", // conferir
      },
    ],
  },
  {
    nome: "Paisagens",
    texto: "Vinhedos, estradas, natureza e cenários da Serra Gaúcha.",
    lugares: [
      {
        nome: "Mirante Vale dos Vinhedos",
        local: "RS-444, km 23 · Vale dos Vinhedos",
        tempo: "≈ 10 min", // conferir
      },
      {
        nome: "Wine Garden Miolo",
        local: "RS-444, km 21 · Vale dos Vinhedos",
        tempo: "≈ 10 min", // conferir
        busca: "Miolo Wine Group, Vale dos Vinhedos, Bento Gonçalves - RS",
      },
      {
        nome: "Mirante do Campanário",
        local: "Bento Gonçalves",
        tempo: "≈ 20 min", // conferir
      },
    ],
  },
  {
    nome: "Cultura",
    texto: "História, arquitetura, tradição italiana e experiências locais.",
    lugares: [
      {
        nome: "Caminhos de Pedra",
        local: "Roteiro de casas de imigrantes italianos",
        tempo: "≈ 30 min", // conferir
      },
      {
        nome: "Maria Fumaça · Trem do Vinho",
        local: "Estação de Bento Gonçalves · Centro",
        tempo: "≈ 15 min", // conferir
        busca: "Maria Fumaça Trem do Vinho, Bento Gonçalves - RS",
      },
      {
        nome: "Casa Vanni 1935",
        local: "Caminhos de Pedra · Bento Gonçalves",
        tempo: "≈ 30 min", // conferir
      },
      {
        nome: "Parque da Ovelha",
        local: "Caminhos de Pedra · Bento Gonçalves",
        tempo: "≈ 30 min", // conferir
      },
    ],
  },
];

export function linkMaps(lugar: Lugar): string {
  const q = lugar.busca ?? `${lugar.nome}, Bento Gonçalves - RS`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
