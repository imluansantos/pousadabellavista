// Conteúdo da página /vale-dos-vinhedos (routes/vale-dos-vinhedos.tsx).
//
// Texto e contatos copiados da página atual do site
// (pousadabellavista.com.br/vale-dos-vinhedos), que por sua vez tirou o
// conteúdo do site oficial do Vale dos Vinhedos. Sem travessões no texto.
//
// `site`: o mesmo link do botão "Visitar site" da página atual (sem os
// parâmetros de rastreamento de anúncio que alguns tinham).

export interface LugarVale {
  nome: string;
  /** rótulo curto acima do nome */
  tipo: string;
  paragrafos: string[];
  telefone?: string;
  email?: string;
  site?: string;
  /** observação curta no lugar do contato (ex.: ingressos antecipados) */
  nota?: string;
}

export const VALE_INTRO =
  "Mais do que um destino, o Vale dos Vinhedos é uma experiência completa. Entre paisagens encantadoras, vinícolas premiadas e uma gastronomia marcante, cada visita se transforma em um momento único. Aqui, você encontra roteiros cuidadosamente selecionados que unem sabor, cultura, bem-estar e conexão com a natureza, criando memórias que permanecem muito além da viagem.";

export const VALE_FONTE = {
  texto: "Este conteúdo foi retirado do site oficial do Vale dos Vinhedos.",
  chamada: "Você pode encontrar mais informações acessando o site abaixo.",
  url: "https://www.valedosvinhedos.com.br/blog/experiencia-especiais-no-vale-dos-vinhedos",
};

export const LUGARES_VALE: LugarVale[] = [
  {
    nome: "Cooperativa Vinícola Aurora",
    tipo: "Vinícola",
    paragrafos: [
      "A Vinícola Aurora oferece experiências completas tanto em sua unidade Matriz, no centro de Bento Gonçalves, quanto na loja localizada no Vale dos Vinhedos. A visita turística guiada apresenta a história da cooperativa e os processos de produção, seguida de um minicurso de degustação com análise visual, olfativa e gustativa de vinhos e espumantes.",
      "Para os apreciadores, a degustação da Linha Premium inclui rótulos emblemáticos e espumantes reconhecidos, enquanto a harmonização entre vinhos e chocolates proporciona uma experiência sensorial equilibrando doçura, aromas e texturas.",
    ],
    telefone: "(54) 3455-2095",
    email: "turismo@vinicolaaurora.com.br",
    site: "https://www.vinicolaaurora.com.br/",
  },
  {
    nome: "Cave do Sol",
    tipo: "Vinícola",
    paragrafos: [
      "A Cave do Sol proporciona experiências sensoriais que exploram os sentidos de forma profunda e envolvente. Os roteiros Sentidos, Essência e Alma variam em duração e incluem degustação de produtos selecionados, além de taça de cristal exclusiva.",
      "Destaque para a Experiência Vinhos & Chocolates e para a Saudação ao Sol, que une meditação guiada, espumantes, antepastos e visita artística à vinícola, criando um momento de conexão e contemplação.",
    ],
    telefone: "(54) 98418-9882",
    email: "turismo@cavedosol.com.br",
    site: "https://www.cavedosol.com.br/inicial",
  },
  {
    nome: "Vinhos Larentis",
    tipo: "Vinícola",
    paragrafos: [
      "A Vinhos Larentis oferece atividades que vão do casual ao sofisticado. A degustação clássica permite escolher rótulos das linhas Reserva e espumantes, enquanto a degustação premium apresenta vinhos selecionados pelo enólogo, acompanhados por queijos e charcutaria.",
      "O visitante também pode optar pelo conceito de vinho em taça ou viver a experiência do piquenique nos vinhedos, desfrutando de produtos coloniais em meio à paisagem natural.",
    ],
    telefone: "(54) 98437-7729",
    email: "enoturismo@larentis.com.br",
    site: "https://www.larentis.com.br/intro",
  },
  {
    nome: "Pizzato",
    tipo: "Vinícola",
    paragrafos: [
      "A Pizzato se destaca pelas experiências de harmonização, combinando vinhos da casa com queijos e charcutarias regionais gaúchas. Cada roteiro é pensado para demonstrar como diferentes combinações podem realçar aromas, sabores e texturas.",
      "As experiências incluem cesto de pães e degustação de azeites regionais, criando um momento gastronômico completo e educativo.",
    ],
    telefone: "(54) 3055-0440",
    email: "turismo@pizzato.net",
    site: "https://www.pizzato.net/",
  },
  {
    nome: "Vinícola Torcello",
    tipo: "Vinícola",
    paragrafos: [
      "A Vinícola Torcello oferece diversas opções para quem deseja conhecer o universo do vinho. As degustações tradicionais e premium apresentam rótulos cuidadosamente selecionados, sempre acompanhadas de explicações sobre a elaboração.",
      "As visitas guiadas, como o Enotur do Conhecimento e o Enotur Premium, percorrem todas as etapas do processo produtivo. Já a Prova de Barricas proporciona contato direto com o produtor e vinhos em diferentes estágios de maturação.",
    ],
    telefone: "(54) 3459-1164",
    site: "https://www.torcello.com.br/",
  },
  {
    nome: "Vinícola Dom Cândido",
    tipo: "Vinícola",
    paragrafos: [
      "A Dom Cândido oferece experiências para diferentes perfis de visitantes, desde degustações descontraídas até roteiros mais técnicos e imersivos. As opções incluem visitas guiadas, degustações às cegas e harmonizações especiais.",
      "Para quem busca algo exclusivo, o Tour Origens e a Experiência Premium 4ª Geração proporcionam vivências personalizadas em meio às barricas de carvalho.",
    ],
    telefone: "(54) 2521-3500",
    email: "domcandido@domcandido.com.br",
    site: "https://www.domcandido.com.br/intro",
  },
  {
    nome: "Cave de Pedra",
    tipo: "Vinícola",
    paragrafos: [
      "A Cave de Pedra oferece tour técnico guiado com acesso às caves subterrâneas, torres do castelo e vinhedos, finalizando com degustação orientada de rótulos selecionados.",
      "A degustação às cegas é uma experiência diferenciada, realizada em ambiente reservado, convidando o visitante a explorar o mundo do vinho através dos sentidos.",
    ],
    telefone: "(54) 3459-1267",
    email: "varejo@cavedepedra.com.br",
    site: "https://www.cavedepedra.com.br/",
  },
  {
    nome: "Miolo Wine Group",
    tipo: "Vinícola",
    paragrafos: [
      "A Miolo oferece visitas guiadas tradicionais conduzidas por enólogos, além de experiências imersivas como o Terroirs do Brasil, que apresenta diferentes regiões vitivinícolas brasileiras.",
      "Outro destaque é o roteiro DOVV Espumantes, que apresenta a Denominação de Origem Vale dos Vinhedos com vista panorâmica da Torre Miolo.",
    ],
    telefone: "(54) 2102-1537",
    email: "visita@miolo.com.br",
    site: "https://www.miolo.com.br/",
  },
  {
    nome: "Casa Valduga",
    tipo: "Vinícola",
    paragrafos: [
      "A Casa Valduga é referência em enoturismo no Brasil. Suas experiências incluem visitas guiadas, degustações especiais, cursos sobre o mundo do vinho e vivências exclusivas com vinhos ícones da marca.",
      "Entre os destaques estão a Visita Seleção do Enólogo, a Wine Experience e experiências criativas como o Singolare, onde o visitante elabora seu próprio vinho.",
    ],
    nota: "Ingressos adquiridos antecipadamente",
    site: "https://www.casavalduga.com.br/pt",
  },
  {
    nome: "Union Distillery",
    tipo: "Destilaria",
    paragrafos: [
      "Visite uma destilaria e conheça o processo de elaboração de Malte Whisky, seguida de degustação orientada.",
    ],
    telefone: "(54) 98432-7123",
    email: "vendas@uniondistillery.com.br",
    site: "https://www.uniondistillery.com.br/",
  },
  {
    nome: "Famiglia Tasca",
    tipo: "Piquenique",
    paragrafos: [
      "Piquenique no jardim: com a estrutura ideal de um verdadeiro piquenique, prove delícias regionais servidas no jardim, em meio à natureza.",
    ],
    // ⚠️ a página atual mostra para a Famiglia Tasca o MESMO telefone da
    // Union Distillery, (54) 98432-7123, provavelmente copiado por engano.
    // Confirmar o número com o cliente antes de colocar aqui.
  },
  {
    nome: "Gastronomia, Bem-estar e Cultura",
    tipo: "Na região",
    paragrafos: [
      "O Vale dos Vinhedos também encanta pela diversidade gastronômica. Restaurantes oferecem refeições harmonizadas, menus autorais e experiências sensoriais com ingredientes locais.",
      "Há ainda piqueniques nos vinhedos, sunsets harmonizados, experiências de spa, arte em cerâmica, chocolates artesanais, destilaria de whisky e passeios de aventura, tornando a região completa para todos os estilos de viajantes.",
    ],
    nota: "Sabores, cultura, natureza e relaxamento",
  },
];

/** "(54) 3455-2095" → "tel:+555434552095" */
export function linkTelefone(telefone: string) {
  return `tel:+55${telefone.replace(/\D/g, "")}`;
}
