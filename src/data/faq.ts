/* ─────────────────────────────────────────────────────────────────────────────
   Perguntas frequentes da pousada.

   Todas as perguntas e respostas da página de FAQ do site atual
   (pousadabellavista.com.br/perguntas-frequentes), com o texto original,
   organizadas por tema. Usado em:
     • components/site/Faq.tsx         → seção da Home (só as `FAQ_HOME`)
     • routes/perguntas-frequentes.tsx → página com todas as perguntas

   Para incluir/editar uma pergunta, mexa só aqui. O `id` vira a âncora da
   pergunta na página (ex.: /perguntas-frequentes#check-in).
   ──────────────────────────────────────────────────────────────────────── */

export interface Pergunta {
  id: string;
  pergunta: string;
  resposta: string;
}

export interface CategoriaFaq {
  id: string;
  titulo: string;
  descricao: string;
  perguntas: Pergunta[];
}

export const FAQ: CategoriaFaq[] = [
  {
    id: "reserva-e-estadia",
    titulo: "Reserva e estadia",
    descricao: "Horários, pagamento, cancelamento e o que combinar antes de chegar.",
    perguntas: [
      {
        id: "check-in",
        pergunta: "Qual é o horário de check-in?",
        resposta: "O check-in é a partir das 14h. A pousada conta com recepção 24 horas.",
      },
      {
        id: "check-out",
        pergunta: "Qual é o horário de check-out?",
        resposta: "O check-out deve ser realizado até as 12h.",
      },
      {
        id: "check-in-antecipado",
        pergunta: "É possível solicitar check-in antecipado?",
        resposta: "Sim, mediante consulta prévia e disponibilidade.",
      },
      {
        id: "check-out-tardio",
        pergunta: "É possível solicitar check-out tardio?",
        resposta: "Sim, sujeito à disponibilidade da pousada.",
      },
      {
        id: "bagagem",
        pergunta: "Posso guardar bagagem antes do check-in ou após o check-out?",
        resposta: "Sim. Mediante combinação prévia, podemos guardar a bagagem.",
      },
      {
        id: "pagamento",
        pergunta: "Quais formas de pagamento são aceitas?",
        resposta: "Aceitamos PIX, dinheiro e cartões de débito e crédito.",
      },
      {
        id: "cancelamento",
        pergunta: "Como funciona a política de cancelamento?",
        resposta:
          "A política de cancelamento varia conforme a antecedência e é informada no momento da reserva.",
      },
      {
        id: "taxas-adicionais",
        pergunta: "Há cobrança de taxas adicionais?",
        resposta: "Somente em casos de serviços extras, danos ou descumprimento das regras.",
      },
      {
        id: "nota-fiscal",
        pergunta: "A pousada emite nota fiscal?",
        resposta:
          "Sim. Emitimos nota fiscal de serviço, podendo ser no CPF ou CNPJ, conforme preferência do hóspede.",
      },
      {
        id: "estadias-longas",
        pergunta: "A pousada é adequada para estadias longas?",
        resposta:
          "Sim. As acomodações possuem estrutura completa, ideais também para estadias mais longas.",
      },
    ],
  },
  {
    id: "cafe-da-manha",
    titulo: "Café da manhã",
    descricao: "Quando, onde e como é servido.",
    perguntas: [
      {
        id: "cafe-incluso",
        pergunta: "O café da manhã está incluso?",
        resposta: "Sim, o café da manhã está incluso na diária e é servido das 8h às 10h.",
      },
      {
        id: "cafe-no-quarto",
        pergunta: "O café da manhã pode ser servido no quarto?",
        resposta:
          "Sim. O café da manhã pode ser servido na acomodação ou no deck externo, conforme a preferência do hóspede.",
      },
      {
        id: "cafe-na-hora",
        pergunta: "O café da manhã é preparado na hora?",
        resposta: "Sim. O café da manhã é preparado diariamente, com itens frescos.",
      },
    ],
  },
  {
    id: "acomodacoes",
    titulo: "Acomodações e serviços",
    descricao: "O que você encontra no quarto e os serviços durante a estadia.",
    perguntas: [
      {
        id: "toalhas-e-roupas-de-cama",
        pergunta: "A pousada fornece toalhas e roupas de cama?",
        resposta:
          "Sim. As acomodações são entregues totalmente montadas, com roupas de cama, cobertores, travesseiros e toalhas de banho e rosto.",
      },
      {
        id: "produtos-de-higiene",
        pergunta: "A pousada fornece produtos de higiene?",
        resposta:
          "Sim. Disponibilizamos itens básicos de higiene, como shampoo, condicionador, sabonetes, papel higiênico e álcool em gel.",
      },
      {
        id: "secador-de-cabelo",
        pergunta: "A pousada disponibiliza secador de cabelo?",
        resposta:
          "Sim. Todas as acomodações contam com secador de cabelo potente, disponível para uso durante a estadia.",
      },
      {
        id: "ferro-de-passar",
        pergunta: "As acomodações possuem ferro de passar roupa?",
        resposta:
          "Sim. Todas as acomodações disponibilizam ferro de passar roupa para uso durante a estadia.",
      },
      {
        id: "cozinha",
        pergunta: "As acomodações possuem cozinha ou utensílios básicos?",
        resposta:
          "Sim. Todas as acomodações contam com cozinha equipada, com utensílios básicos para uso durante a estadia.",
      },
      {
        id: "internet",
        pergunta: "O local possui acesso à internet?",
        resposta: "Sim, disponibilizamos Wi-Fi gratuito.",
      },
      {
        id: "limpeza",
        pergunta: "A pousada oferece serviço de limpeza?",
        resposta: "Sim, a limpeza e arrumação das acomodações são realizadas diariamente.",
      },
      {
        id: "lavanderia",
        pergunta: "A pousada oferece serviço de lavanderia?",
        resposta:
          "Sim. Mediante solicitação, oferecemos serviço de lavanderia, sujeito à disponibilidade e valores informados no momento do pedido.",
      },
      {
        id: "escadas",
        pergunta: "A pousada possui escadas?",
        resposta:
          "Sim. Duas acomodações possuem acesso por escadas e uma acomodação é térrea. Recomendamos informar sua preferência no momento da reserva.",
      },
      {
        id: "limite-de-pessoas",
        pergunta: "Há limite de pessoas por acomodação?",
        resposta: "Sim, cada acomodação possui capacidade máxima definida.",
      },
      {
        id: "datas-especiais",
        pergunta: "É possível decorar o quarto para datas especiais?",
        resposta:
          "Sim. Oferecemos pacotes de decoração para datas especiais, mediante contratação antecipada.",
      },
    ],
  },
  {
    id: "familia-e-pets",
    titulo: "Família e pets",
    descricao: "Crianças e animais de estimação são bem-vindos.",
    perguntas: [
      {
        id: "animais",
        pergunta: "A pousada aceita animais de estimação?",
        resposta: "Sim, somos pet friendly, mediante aviso prévio no momento da reserva.",
      },
      {
        id: "criancas",
        pergunta: "A pousada aceita crianças?",
        resposta:
          "Sim, crianças são bem-vindas. Cama extra ou berço estão disponíveis mediante solicitação prévia.",
      },
      {
        id: "familias",
        pergunta: "A pousada é indicada para famílias?",
        resposta:
          "Sim. Somos uma pousada familiar, ideal para estadias em família, inclusive com crianças e pets.",
      },
    ],
  },
  {
    id: "estacionamento-e-seguranca",
    titulo: "Estacionamento e segurança",
    descricao: "Vaga, acesso ao portão e chegada em qualquer horário.",
    perguntas: [
      {
        id: "estacionamento",
        pergunta: "A pousada possui estacionamento?",
        resposta: "Sim, oferecemos 1 vaga por acomodação, dentro do pátio da pousada.",
      },
      {
        id: "portao-a-noite",
        pergunta: "Como funciona o acesso ao portão à noite?",
        resposta:
          "No check-in, o hóspede recebe o controle do portão principal, garantindo acesso livre à pousada em qualquer horário.",
      },
      {
        id: "seguranca",
        pergunta: "Como funciona a segurança na pousada?",
        resposta:
          "O acesso é controlado por chave da acomodação e controle do portão, oferecendo autonomia e segurança aos hóspedes.",
      },
    ],
  },
  {
    id: "convivencia",
    titulo: "Convivência e regras",
    descricao: "Para que a estadia seja tranquila para todos.",
    perguntas: [
      {
        id: "silenciosa",
        pergunta: "A pousada é silenciosa?",
        resposta:
          "Sim. Estamos localizados em uma área tranquila, ideal para quem busca descanso e sossego.",
      },
      {
        id: "horario-de-silencio",
        pergunta: "Há restrição de horário para silêncio?",
        resposta: "Sim, solicitamos silêncio das 23h às 6h.",
      },
      {
        id: "visitas",
        pergunta: "É permitido receber visitas?",
        resposta: "Sim, visitas são permitidas mediante aviso prévio, sem pernoite.",
      },
      {
        id: "fumar",
        pergunta: "Posso fumar nas dependências?",
        resposta: "O fumo é permitido somente nas áreas externas da pousada.",
      },
      {
        id: "danos",
        pergunta: "O que fazer em caso de danos no quarto?",
        resposta: "Solicitamos que a equipe seja informada para as devidas providências.",
      },
    ],
  },
  {
    id: "regiao-e-contato",
    titulo: "Região e contato",
    descricao: "O que há por perto e como falar com a gente.",
    perguntas: [
      {
        id: "proximidades",
        pergunta: "Há mercado, vinícolas ou restaurantes próximos?",
        resposta:
          "Sim. Estamos localizados no Vale dos Vinhedos e sempre indicamos mercados, vinícolas e restaurantes próximos.",
      },
      {
        id: "contato",
        pergunta: "Como entrar em contato com a pousada?",
        resposta: "Pelos canais informados no site e no momento da reserva.",
      },
    ],
  },
];

export const TODAS_PERGUNTAS: Pergunta[] = FAQ.flatMap((c) => c.perguntas);

/** As perguntas que aparecem na seção da Home, nesta ordem. */
const IDS_HOME = [
  "cafe-incluso",
  "animais",
  "criancas",
  "estacionamento",
  "pagamento",
  "cancelamento",
] as const;

export const FAQ_HOME: Pergunta[] = IDS_HOME.map((id) => {
  const p = TODAS_PERGUNTAS.find((q) => q.id === id);
  if (!p) throw new Error(`FAQ: pergunta "${id}" não encontrada em src/data/faq.ts`);
  return p;
});
