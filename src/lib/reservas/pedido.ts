// Estado do pedido de reserva e montagem da mensagem do WhatsApp.
import { acomodacoes, getAcomodacao } from "@/data/acomodacoes";
import { ADICIONAIS, HORARIOS } from "@/data/reservas";
import { WHATSAPP } from "@/data/site";
import {
  dataCurta,
  dataNumerica,
  diaDaSemanaCurto,
  ehISOValido,
  noitesEntre,
  plural,
  type DiaISO,
} from "@/lib/reservas/datas";
import { primeiroDiaReservavel } from "@/lib/reservas/disponibilidade";

export type Etapa = "suite" | "datas" | "hospedes" | "revisao" | "enviado";
export const ETAPAS: { id: Exclude<Etapa, "enviado">; titulo: string }[] = [
  { id: "suite", titulo: "Suíte" },
  { id: "datas", titulo: "Datas" },
  { id: "hospedes", titulo: "Hóspedes" },
  { id: "revisao", titulo: "Revisão" },
];

export interface Pedido {
  codigo: string;
  suite: string | null;
  entrada: DiaISO | null;
  saida: DiaISO | null;
  adultos: number;
  /** idade de cada criança (null enquanto não informada) */
  criancas: (number | null)[];
  pet: boolean;
  adicionais: string[];
  nome: string;
  telefone: string;
  email: string;
  chegada: string;
  observacoes: string;
  aceite: boolean;
}

const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function novoCodigo(): string {
  let c = "";
  const aleatorio = globalThis.crypto?.getRandomValues?.(new Uint32Array(4));
  for (let i = 0; i < 4; i++) {
    const n = aleatorio ? aleatorio[i]! : Math.floor(Math.random() * 2 ** 32);
    c += ALFABETO[n % ALFABETO.length];
  }
  return `BV-${c}`;
}

export function pedidoVazio(): Pedido {
  return {
    codigo: novoCodigo(),
    suite: null,
    entrada: null,
    saida: null,
    adultos: 2,
    criancas: [],
    pet: false,
    adicionais: [],
    nome: "",
    telefone: "",
    email: "",
    chegada: "",
    observacoes: "",
    aceite: false,
  };
}

/* ── rascunho salvo no navegador ─────────────────────────────────────── */

const CHAVE = "bv-reserva-rascunho-v1";

export function lerRascunho(): Pedido | null {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const p = { ...pedidoVazio(), ...JSON.parse(bruto) } as Pedido;
    if (p.suite && !getAcomodacao(p.suite)) p.suite = null;
    // datas vencidas ou inválidas não voltam
    if (!ehISOValido(p.entrada) || p.entrada < primeiroDiaReservavel()) {
      p.entrada = null;
      p.saida = null;
    }
    if (p.saida && (!ehISOValido(p.saida) || !p.entrada || p.saida <= p.entrada)) p.saida = null;
    p.aceite = false;
    return p;
  } catch {
    return null;
  }
}

export function salvarRascunho(p: Pedido) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(p));
  } catch {
    /* navegador sem armazenamento: segue sem rascunho */
  }
}

export function apagarRascunho() {
  try {
    window.localStorage.removeItem(CHAVE);
  } catch {
    /* idem */
  }
}

/* ── validação dos dados do hóspede ──────────────────────────────────── */

export const soDigitos = (s: string) => s.replace(/\D/g, "");

/** (54) 99207-4419 enquanto digita; números de fora ficam como estão */
export function mascaraTelefone(valor: string): string {
  if (valor.trim().startsWith("+")) return valor;
  const d = soDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export type ErrosContato = Partial<Record<"nome" | "telefone" | "email" | "criancas", string>>;

export function validarContato(p: Pedido): ErrosContato {
  const e: ErrosContato = {};
  if (p.nome.trim().length < 3) e.nome = "Informe seu nome completo.";
  const tel = soDigitos(p.telefone);
  if (tel.length < 10 || tel.length > 13) e.telefone = "Informe um telefone com DDD.";
  if (p.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()))
    e.email = "Confira o e-mail (ou deixe em branco).";
  if (p.criancas.some((i) => i === null)) e.criancas = "Informe a idade de cada criança.";
  return e;
}

/* ── textos do resumo ────────────────────────────────────────────────── */

export function textoHospedes(p: Pedido): string {
  const partes = [plural(p.adultos, "adulto", "adultos")];
  if (p.criancas.length) {
    const idades = p.criancas
      .map((i) => (i === null ? "?" : i === 0 ? "menos de 1 ano" : plural(i, "ano", "anos")))
      .join(", ");
    partes.push(`${plural(p.criancas.length, "criança", "crianças")} (${idades})`);
  }
  return partes.join(" e ");
}

const linhaData = (d: DiaISO, hora: string) => `${diaDaSemanaCurto(d)}, ${dataNumerica(d)} (${hora})`;

export function montarMensagem(p: Pedido): string {
  const suite = acomodacoes.find((a) => a.slug === p.suite);
  const noites = p.entrada && p.saida ? noitesEntre(p.entrada, p.saida) : 0;
  const adicionais = ADICIONAIS.filter((a) => p.adicionais.includes(a.id)).map((a) => a.titulo);
  const linhas = [
    "Olá! Gostaria de solicitar uma reserva na Pousada Bella Vista.",
    "",
    `*Pedido ${p.codigo}*`,
    `Suíte: ${suite?.nome ?? "a definir"}`,
    p.entrada ? `Entrada: ${linhaData(p.entrada, `a partir das ${HORARIOS.checkIn}`)}` : null,
    p.saida ? `Saída: ${linhaData(p.saida, `até ${HORARIOS.checkOut}`)}` : null,
    noites ? `Noites: ${noites}` : null,
    `Hóspedes: ${textoHospedes(p)}`,
    p.pet ? "Pet: sim, vou levar meu pet" : null,
    adicionais.length ? `Interesse em: ${adicionais.join(", ")}` : null,
    p.chegada ? `Chegada prevista: ${p.chegada}` : null,
    "",
    `Nome: ${p.nome.trim()}`,
    `Telefone: ${p.telefone.trim()}`,
    p.email.trim() ? `E-mail: ${p.email.trim()}` : null,
    p.observacoes.trim() ? `\nObservações: ${p.observacoes.trim()}` : null,
    "",
    "Aguardo a confirmação da disponibilidade e os dados para o sinal.",
  ];
  return linhas.filter((l) => l !== null).join("\n");
}

export function linkWhatsapp(p: Pedido): string {
  return `${WHATSAPP}?text=${encodeURIComponent(montarMensagem(p))}`;
}

/* ── pedido em andamento (aviso de saída e "continuar pedido") ────────── */

/** vale a pena perguntar/lembrar: já escolheu datas ou começou os dados */
export function temProgresso(p: Pedido | null): p is Pedido {
  return Boolean(p && p.suite && (p.entrada || p.nome.trim() || p.telefone.trim()));
}

/** "Videiras, 12 a 14 nov" (ou só a suíte, enquanto não há datas) */
export function resumoCurto(p: Pedido): string {
  const suite = acomodacoes.find((a) => a.slug === p.suite)?.nome ?? "Sua reserva";
  if (p.entrada && p.saida) return `${suite}, ${dataCurta(p.entrada)} a ${dataCurta(p.saida)}`;
  if (p.entrada) return `${suite}, a partir de ${dataCurta(p.entrada)}`;
  return suite;
}

/** endereço para retomar o pedido (/reservar?suite=…&entrada=…&saida=…) */
export function buscaDoPedido(p: Pedido): { suite?: string; entrada?: DiaISO; saida?: DiaISO } {
  return {
    suite: p.suite ?? undefined,
    entrada: p.entrada ?? undefined,
    saida: p.saida ?? undefined,
  };
}
