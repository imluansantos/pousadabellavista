// Agenda de reservas lida de uma planilha do Google Sheets.
//
// • `buscarAgenda` roda NO SERVIDOR (função de servidor do TanStack Start):
//   busca o CSV da planilha no máximo uma vez a cada `PLANILHA.cacheSegundos`
//   e entrega a mesma resposta para todos os visitantes. Assim o Google
//   recebe 1 pedido por minuto, não 1 por visitante.
// • `useAgenda` roda no navegador: lê ao abrir a página, a cada minuto
//   enquanto a aba está visível e quando a pessoa volta para a aba. Na hora de
//   enviar o pedido, pede uma leitura nova (`fresca`), sem esperar o cache.
//
// Se a planilha não responder, o site segue funcionando: usa a última
// leitura boa (se houver) e avisa que a equipe confirma no WhatsApp.
import { useCallback, useEffect, useRef, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { PLANILHA } from "@/data/reservas";
import { interpretarPlanilha, type LeituraPlanilha } from "@/lib/reservas/planilha-csv";

export interface Agenda extends LeituraPlanilha {
  /** quando a planilha foi lida com sucesso pela última vez (ISO) */
  lidaEm: string | null;
  /** false quando a última tentativa falhou */
  ok: boolean;
}

let cache: { agenda: Agenda; expira: number; lidaEm: number } | null = null;

/** leitura "fresca" (na hora de enviar o pedido) no máximo a cada 10 s */
const INTERVALO_MINIMO_FRESCA = 10_000;

export const buscarAgenda = createServerFn({ method: "GET" })
  .validator((d: { fresca?: boolean } | undefined) => ({ fresca: Boolean(d?.fresca) }))
  .handler(async ({ data }): Promise<Agenda> => {
  const agora = Date.now();
  const podeReler = data.fresca && cache && agora - cache.lidaEm > INTERVALO_MINIMO_FRESCA;
  if (cache && cache.expira > agora && !podeReler) return cache.agenda;

  const url =
    `https://docs.google.com/spreadsheets/d/${PLANILHA.id}/gviz/tq` +
    `?tqx=out:csv&headers=1&sheet=${encodeURIComponent(PLANILHA.aba)}`;
  try {
    const resposta = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!resposta.ok) throw new Error(`Planilha respondeu ${resposta.status}`);
    const texto = await resposta.text();
    // planilha privada devolve a página de login do Google (HTML), não CSV
    if (texto.trimStart().startsWith("<")) throw new Error("Planilha sem acesso público de leitura");
    const agenda: Agenda = { ...interpretarPlanilha(texto), lidaEm: new Date().toISOString(), ok: true };
    cache = { agenda, expira: agora + PLANILHA.cacheSegundos * 1000, lidaEm: agora };
    return agenda;
  } catch (erro) {
    console.error("[reservas] não foi possível ler a planilha:", erro);
    // mantém a última leitura boa, marcada como desatualizada; tenta de novo
    // em 15 segundos em vez de esperar o minuto inteiro
    const anterior = cache?.agenda;
    const agenda: Agenda = anterior
      ? { ...anterior, ok: false }
      : { bloqueios: {}, ignoradas: [], lidaEm: null, ok: false };
    cache = { agenda, expira: agora + 15_000, lidaEm: agora };
    return agenda;
  }
  });

export type EstadoAgenda =
  | { status: "carregando"; agenda: null }
  | { status: "pronta"; agenda: Agenda }
  | { status: "erro"; agenda: Agenda | null };

/** Agenda no navegador, atualizada a cada minuto enquanto a aba está aberta. */
export function useAgenda(ativo = true) {
  const [estado, setEstado] = useState<EstadoAgenda>({ status: "carregando", agenda: null });
  const ultima = useRef<Agenda | null>(null);

  /** `fresca`: pede ao servidor uma leitura nova da planilha (usado ao enviar) */
  const atualizar = useCallback(async (fresca = false): Promise<Agenda | null> => {
    try {
      const agenda = await buscarAgenda({ data: { fresca } });
      ultima.current = agenda;
      setEstado(agenda.ok ? { status: "pronta", agenda } : { status: "erro", agenda });
      return agenda;
    } catch {
      setEstado({ status: "erro", agenda: ultima.current });
      return ultima.current;
    }
  }, []);

  useEffect(() => {
    if (!ativo) return;
    void atualizar();
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") void atualizar();
    }, 60_000);
    const aoVoltar = () => document.visibilityState === "visible" && void atualizar();
    document.addEventListener("visibilitychange", aoVoltar);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, [ativo, atualizar]);

  return { ...estado, atualizar };
}
