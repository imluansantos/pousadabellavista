// Disponibilidade das suítes, separada da tela de propósito.
//
// Os bloqueios vêm de três fontes, somadas em `obterBloqueios`:
//   • a planilha de reservas do Google Sheets (src/lib/reservas/planilha.ts),
//     lida pela página e passada aqui como `extras`;
//   • os bloqueios manuais de src/data/reservas.ts;
//   • no modo de teste (/reservar?demo=1), períodos fictícios gerados a partir
//     de hoje, só para ver o calendário com datas ocupadas.
//
// Para trocar a fonte no futuro (calendários iCal do Airbnb/Booking, banco de
// dados), basta entregar a mesma lista de `Bloqueio`.
import { BLOQUEIOS_MANUAIS, REGRAS } from "@/data/reservas";
import { hoje, noitesEntre, somarDias, type DiaISO } from "@/lib/reservas/datas";

export interface Bloqueio {
  /** primeira noite ocupada */
  inicio: DiaISO;
  /** dia da saída (a noite deste dia já está livre) */
  fim: DiaISO;
  origem: "manual" | "airbnb" | "booking" | "site" | "demo";
}

/** períodos fictícios do modo de teste, diferentes para cada suíte */
function bloqueiosDemo(slug: string): Bloqueio[] {
  const base = hoje();
  const desvio = { "nascer-do-sol": 0, videiras: 2, "por-do-sol": 4 }[slug] ?? 0;
  const faixas: [number, number][] = [
    [2, 5],
    [9, 11],
    [16, 23],
    [30, 32],
    [41, 44],
    [52, 53],
  ];
  return faixas.map(([a, b]) => ({
    inicio: somarDias(base, a + desvio),
    fim: somarDias(base, b + desvio),
    origem: "demo" as const,
  }));
}

export function obterBloqueios(
  slug: string,
  opcoes: { demo?: boolean; extras?: Bloqueio[] } = {},
): Bloqueio[] {
  const manuais = (BLOQUEIOS_MANUAIS[slug] ?? []).map((b) => ({ ...b, origem: "manual" as const }));
  return [...manuais, ...(opcoes.extras ?? []), ...(opcoes.demo ? bloqueiosDemo(slug) : [])];
}

/** Conjunto das noites ocupadas, para consulta rápida dia a dia. */
export function noitesOcupadas(bloqueios: Bloqueio[]): Set<DiaISO> {
  const noites = new Set<DiaISO>();
  for (const b of bloqueios) {
    for (let d = b.inicio; d < b.fim; d = somarDias(d, 1)) noites.add(d);
  }
  return noites;
}

/* ── regras de período ───────────────────────────────────────────────── */

export function primeiroDiaReservavel(): DiaISO {
  return somarDias(hoje(), REGRAS.antecedenciaDias);
}

export function ultimoDiaReservavel(): DiaISO {
  return somarDias(hoje(), REGRAS.janelaDias);
}

/** mínimo de noites para quem entra em `entrada` (considera feriados) */
export function minimoNoites(entrada: DiaISO): { noites: number; motivo?: string } {
  const especial = REGRAS.minimosEspeciais.find((m) => entrada >= m.inicio && entrada < m.fim);
  return especial
    ? { noites: especial.minimoNoites, motivo: especial.motivo }
    : { noites: REGRAS.minimoNoites };
}

/** primeira noite ocupada a partir de `entrada` (limita a saída possível) */
export function proximaNoiteOcupada(entrada: DiaISO, ocupadas: Set<DiaISO>): DiaISO | null {
  const limite = ultimoDiaReservavel();
  for (let d = entrada; d <= limite; d = somarDias(d, 1)) if (ocupadas.has(d)) return d;
  return null;
}

export type ErroPeriodo =
  | { tipo: "passado" }
  | { tipo: "fora-da-janela" }
  | { tipo: "ocupado"; noite: DiaISO }
  | { tipo: "minimo"; minimo: number; motivo?: string }
  | { tipo: "maximo"; maximo: number };

export function validarPeriodo(
  entrada: DiaISO,
  saida: DiaISO,
  ocupadas: Set<DiaISO>,
): ErroPeriodo | null {
  if (entrada < primeiroDiaReservavel()) return { tipo: "passado" };
  if (saida > ultimoDiaReservavel()) return { tipo: "fora-da-janela" };
  const noites = noitesEntre(entrada, saida);
  const min = minimoNoites(entrada);
  if (noites < min.noites) return { tipo: "minimo", minimo: min.noites, motivo: min.motivo };
  if (noites > REGRAS.maximoNoites) return { tipo: "maximo", maximo: REGRAS.maximoNoites };
  for (let d = entrada; d < saida; d = somarDias(d, 1)) {
    if (ocupadas.has(d)) return { tipo: "ocupado", noite: d };
  }
  return null;
}

export function capacidadeDa(slug: string): { maximo: number; confirmada: boolean } {
  const n = REGRAS.capacidade[slug];
  return n ? { maximo: n, confirmada: true } : { maximo: REGRAS.capacidadePadrao, confirmada: false };
}
