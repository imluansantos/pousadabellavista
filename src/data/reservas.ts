// Regras e dados do sistema de reservas (página /reservar).
//
// Ainda não há back-end: o pedido é montado no site e finalizado pelo
// WhatsApp, onde a equipe confirma a disponibilidade e envia os dados do
// sinal. Tudo que é regra de negócio da pousada fica aqui, para ajustar sem
// mexer nos componentes. Itens marcados com "confirmar" ainda dependem de
// resposta da pousada.
import type { DiaISO } from "@/lib/reservas/datas";

export interface RegrasReserva {
  /** mínimo de noites padrão */
  minimoNoites: number;
  /** máximo de noites por pedido */
  maximoNoites: number;
  /** quantos dias à frente o calendário abre (a partir de hoje) */
  janelaDias: number;
  /** 0 = aceita pedido para hoje; 1 = a partir de amanhã… */
  antecedenciaDias: number;
  /** máximo de hóspedes por pedido (adultos + crianças), por suíte */
  capacidade: Record<string, number | undefined>;
  /** capacidade usada quando a suíte não tem número confirmado */
  capacidadePadrao: number;
  /**
   * Períodos com mínimo de noites diferente (feriados, alta temporada).
   * `inicio` incluso, `fim` excluso.
   * Ex.: { inicio: "2026-12-30", fim: "2027-01-02", minimoNoites: 3, motivo: "Réveillon" }
   */
  minimosEspeciais: { inicio: DiaISO; fim: DiaISO; minimoNoites: number; motivo: string }[];
}

export const REGRAS: RegrasReserva = {
  minimoNoites: 1, // confirmar com a pousada
  maximoNoites: 30,
  janelaDias: 365,
  antecedenciaDias: 0,
  // máximo de hóspedes por suíte, os mesmos números da ficha de cada
  // acomodação (`ficha.hospedes` em src/data/acomodacoes.ts): mudou lá,
  // mude aqui também
  capacidade: { "nascer-do-sol": 4, videiras: 3, "por-do-sol": 3 },
  // usado só se surgir uma suíte nova sem número na lista acima
  capacidadePadrao: 3,
  minimosEspeciais: [],
};

/**
 * Planilha do Google Sheets com as reservas (uma linha por reserva:
 * Suíte | Entrada | Saída | Origem | Observação). Precisa estar compartilhada
 * como "Qualquer pessoa com o link: Leitor". Ver src/lib/reservas/planilha.ts.
 */
export const PLANILHA = {
  id: "1__1SEuOZbrBMwThC9pEsiUA7E22w8BKP9yU6zhJHLvw",
  /** nome da aba com as reservas */
  aba: "Reservas",
  /** por quanto tempo o servidor reaproveita a última leitura */
  cacheSegundos: 60,
};

/** Horários confirmados em /horarios e /politicas-e-regras. */
export const HORARIOS = { checkIn: "14h", checkOut: "12h" };

/**
 * Bloqueios manuais (manutenção, uso próprio…), por suíte. `inicio` é a
 * primeira noite ocupada e `fim` o dia de saída (excluso), como numa reserva.
 * Quando a sincronização com Airbnb e Booking entrar, os bloqueios de lá
 * chegam pelo mesmo formato (ver src/lib/reservas/disponibilidade.ts).
 */
export const BLOQUEIOS_MANUAIS: Record<string, { inicio: DiaISO; fim: DiaISO; motivo?: string }[]> = {
  "nascer-do-sol": [],
  videiras: [],
  "por-do-sol": [],
};

/** Adicionais e preferências que o hóspede pode sinalizar (sem valor no site). */
export const ADICIONAIS: { id: string; titulo: string; texto: string }[] = [
  {
    id: "pacote-romantico",
    titulo: "Pacote romântico",
    texto: "Decoração especial no quarto, espumante e café da manhã servido na suíte.",
  },
  {
    id: "cafe-na-suite",
    titulo: "Café da manhã na suíte",
    texto: "Já incluso na diária: em vez do deck, o café é servido na sua acomodação.",
  },
];

/** Opções do horário previsto de chegada (check-in a partir das 14h). */
export const HORARIOS_CHEGADA = [
  "14h às 16h",
  "16h às 18h",
  "18h às 20h",
  "Depois das 20h",
  "Ainda não sei",
];

/** Texto das regras para crianças e pets (confirmado em /politicas-e-regras). */
export const AVISOS = {
  criancas: "Cama extra ou berço sob consulta, com custo de R$ 100,00 por criança, por diária.",
  pet: "Pet friendly, sem taxa adicional. É só avisar na reserva.",
  sinal: "A reserva é confirmada com o pagamento de 40% do valor total. O saldo é pago na pousada.",
};
