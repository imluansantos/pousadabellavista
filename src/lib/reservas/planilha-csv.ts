// Leitura da planilha de reservas (CSV exportado do Google Sheets).
// Função pura: recebe o texto do CSV e devolve os bloqueios por suíte, mais
// a lista de linhas que não puderam ser lidas (para avisar a pousada).
//
// Formato esperado (a ordem das colunas não importa, só o nome no cabeçalho):
//   Suíte | Entrada | Saída | Origem | Observação
//   Videiras | 12/11/2026 | 14/11/2026 | Airbnb |
// "Saída" é o dia em que o hóspede vai embora (a noite desse dia fica livre).
import { acomodacoes } from "@/data/acomodacoes";
import { ehISOValido, type DiaISO } from "@/lib/reservas/datas";
import type { Bloqueio } from "@/lib/reservas/disponibilidade";

/** CSV simples com suporte a aspas ("a, b" e "" para aspas dentro). */
export function lerCSV(texto: string): string[][] {
  const linhas: string[][] = [];
  let linha: string[] = [];
  let campo = "";
  let aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]!;
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ",") {
      linha.push(campo);
      campo = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      linha.push(campo);
      linhas.push(linha);
      linha = [];
      campo = "";
    } else campo += c;
  }
  if (campo || linha.length) {
    linha.push(campo);
    linhas.push(linha);
  }
  return linhas;
}

/** "Pôr do Sol" -> "por do sol" (sem acento, minúsculo, espaços simples) */
const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const SUITES = new Map(acomodacoes.map((a) => [normalizar(a.nome), a.slug]));
for (const a of acomodacoes) SUITES.set(normalizar(a.slug), a.slug);

/** Aceita 12/11/2026, 12/11/26, 2026-11-12 e 12-11-2026. */
export function lerData(valor: string): DiaISO | null {
  const v = valor.trim();
  let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return montar(m[1]!, m[2]!, m[3]!);
  m = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/);
  if (m) return montar(m[3]!.length === 2 ? `20${m[3]}` : m[3]!, m[2]!, m[1]!);
  return null;
}
function montar(a: string, m: string, d: string): DiaISO | null {
  const iso = `${a}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  return ehISOValido(iso) ? iso : null;
}

const ORIGENS: Record<string, Bloqueio["origem"]> = {
  airbnb: "airbnb",
  booking: "booking",
  "booking com": "booking",
  site: "site",
  whatsapp: "site",
  direto: "site",
};

export interface LeituraPlanilha {
  bloqueios: Record<string, Bloqueio[]>;
  ignoradas: { linha: number; motivo: string }[];
}

export function interpretarPlanilha(csv: string): LeituraPlanilha {
  const linhas = lerCSV(csv).filter((l) => l.some((c) => c.trim()));
  const bloqueios: Record<string, Bloqueio[]> = Object.fromEntries(acomodacoes.map((a) => [a.slug, []]));
  const ignoradas: LeituraPlanilha["ignoradas"] = [];
  if (linhas.length === 0) return { bloqueios, ignoradas };

  // localiza as colunas pelo nome do cabeçalho
  const cab = linhas[0]!.map(normalizar);
  const col = (...nomes: string[]) => cab.findIndex((c) => nomes.some((n) => c.startsWith(n)));
  const cSuite = col("suite", "acomodacao", "quarto");
  const cEntrada = col("entrada", "check in", "checkin", "inicio");
  const cSaida = col("saida", "check out", "checkout", "fim");
  const cOrigem = col("origem", "canal");
  if (cSuite < 0 || cEntrada < 0 || cSaida < 0) {
    ignoradas.push({ linha: 1, motivo: "Cabeçalho sem as colunas Suíte, Entrada e Saída." });
    return { bloqueios, ignoradas };
  }

  linhas.slice(1).forEach((l, i) => {
    const n = i + 2; // número da linha na planilha
    const slug = SUITES.get(normalizar(l[cSuite] ?? ""));
    const inicio = lerData(l[cEntrada] ?? "");
    const fim = lerData(l[cSaida] ?? "");
    if (!slug) return ignoradas.push({ linha: n, motivo: `Suíte "${l[cSuite] ?? ""}" não reconhecida.` });
    if (!inicio || !fim) return ignoradas.push({ linha: n, motivo: "Data de entrada ou saída inválida." });
    if (fim <= inicio) return ignoradas.push({ linha: n, motivo: "A saída precisa ser depois da entrada." });
    const origem = ORIGENS[normalizar(cOrigem >= 0 ? (l[cOrigem] ?? "") : "")] ?? "manual";
    bloqueios[slug]!.push({ inicio, fim, origem });
  });

  return { bloqueios, ignoradas };
}
