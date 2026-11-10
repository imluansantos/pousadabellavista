// Utilitários de datas do sistema de reservas, sem dependências.
//
// Tudo trabalha com "dias de calendário" no formato ISO "AAAA-MM-DD" (sem
// hora e sem fuso), que é como hotelaria pensa: a reserva de 12/11 a 14/11
// ocupa as NOITES de 12 e 13; o dia 14 é só a saída. Internamente as contas
// usam Date em horário local ao meio-dia, para nunca escorregar de dia por
// causa de fuso ou horário de verão.

export type DiaISO = string; // "2026-11-12"

export function paraISO(d: Date): DiaISO {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

export function deISO(iso: DiaISO): Date {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, (m ?? 1) - 1, d ?? 1, 12);
}

export function ehISOValido(valor: unknown): valor is DiaISO {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  return paraISO(deISO(valor)) === valor;
}

export function hoje(): DiaISO {
  return paraISO(new Date());
}

export function somarDias(iso: DiaISO, dias: number): DiaISO {
  const d = deISO(iso);
  d.setDate(d.getDate() + dias);
  return paraISO(d);
}

/** número de noites entre a entrada e a saída */
export function noitesEntre(entrada: DiaISO, saida: DiaISO): number {
  return Math.round((deISO(saida).getTime() - deISO(entrada).getTime()) / 86_400_000);
}

export function primeiroDoMes(iso: DiaISO): DiaISO {
  return `${iso.slice(0, 7)}-01`;
}

export function somarMeses(iso: DiaISO, meses: number): DiaISO {
  const d = deISO(primeiroDoMes(iso));
  d.setMonth(d.getMonth() + meses);
  return paraISO(d);
}

export function mesmoMes(a: DiaISO, b: DiaISO): boolean {
  return a.slice(0, 7) === b.slice(0, 7);
}

/**
 * Semanas do mês para desenhar o calendário (domingo a sábado). Dias de
 * outros meses vêm como `null`, para deixar o espaço vazio.
 */
export function semanasDoMes(mes: DiaISO): (DiaISO | null)[][] {
  const inicio = deISO(primeiroDoMes(mes));
  const vazioAntes = inicio.getDay();
  const diasNoMes = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0).getDate();
  const celulas: (DiaISO | null)[] = Array.from({ length: vazioAntes }, () => null);
  for (let d = 1; d <= diasNoMes; d++) {
    celulas.push(paraISO(new Date(inicio.getFullYear(), inicio.getMonth(), d, 12)));
  }
  while (celulas.length % 7) celulas.push(null);
  const semanas: (DiaISO | null)[][] = [];
  for (let i = 0; i < celulas.length; i += 7) semanas.push(celulas.slice(i, i + 7));
  return semanas;
}

/* ── formatação (pt-BR) ──────────────────────────────────────────────── */

const fmt = (opcoes: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("pt-BR", opcoes);
const fmtMes = fmt({ month: "long", year: "numeric" });
const fmtDiaSemanaCurto = fmt({ weekday: "short" });
const fmtCurto = fmt({ day: "numeric", month: "short" });
const fmtLongo = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
const fmtNumerico = fmt({ day: "2-digit", month: "2-digit", year: "numeric" });

const semPonto = (s: string) => s.replace(/\./g, "");
const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Novembro de 2026" */
export const nomeDoMes = (iso: DiaISO) => maiuscula(fmtMes.format(deISO(iso)));
/** "12 nov" */
export const dataCurta = (iso: DiaISO) => semPonto(fmtCurto.format(deISO(iso))).replace(/ de /g, " ");
/** "quarta-feira, 12 de novembro de 2026" */
export const dataLonga = (iso: DiaISO) => fmtLongo.format(deISO(iso));
/** "12/11/2026" */
export const dataNumerica = (iso: DiaISO) => fmtNumerico.format(deISO(iso));
/** "qua" */
export const diaDaSemanaCurto = (iso: DiaISO) => semPonto(fmtDiaSemanaCurto.format(deISO(iso)));

/** Iniciais dos dias da semana, começando no domingo. */
export const DIAS_DA_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
export const DIAS_DA_SEMANA_NOMES = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

export const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;
