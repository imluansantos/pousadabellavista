// Central de Notificações — fonte estática das novidades do site.
//
// Para publicar uma novidade, adicione um objeto na lista `NOTIFICATIONS`
// abaixo. Para editar, altere o objeto. Para remover, apague-o.
//
// Regras importantes:
// - `id` identifica a notificação no navegador de cada visitante (é ele que
//   fica salvo no localStorage como "lida"). Use um id único e NÃO reaproveite
//   ids antigos: uma notificação nova com id novo aparece como "não lida" até
//   para quem já visitou o site. Se você mudar o id de uma notificação
//   existente, ela volta a aparecer como não lida para todo mundo.
// - `publishedAt` e `expiresAt` usam o formato "AAAA-MM-DD" e são
//   interpretados no fuso horário do visitante. A notificação fica ativa a
//   partir de 00:00 do dia `publishedAt` até 23:59 do dia `expiresAt`
//   (inclusive). `expiresAt: null` significa que ela não expira.
// - `href` é opcional: se preenchido, clicar na notificação também leva o
//   visitante para esse link (ex.: "#acomodacoes" ou uma URL externa).
// - A lista pode ficar em qualquer ordem: na central, as mais recentes
//   (maior `publishedAt`) aparecem primeiro.

export interface SiteNotification {
  id: string;
  title: string;
  message: string;
  /** Data de início, "AAAA-MM-DD". */
  publishedAt: string;
  /** Último dia em que a notificação aparece, "AAAA-MM-DD", ou null (não expira). */
  expiresAt: string | null;
  /** Link opcional aberto ao clicar na notificação. */
  href?: string;
}

export const NOTIFICATIONS: SiteNotification[] = [
  // mesma data: aparecem na ordem desta lista (calendário primeiro)
  {
    id: "calendario-2027",
    title: "Calendário 2027 aberto",
    message: "As reservas para 2027 já estão disponíveis.",
    publishedAt: "2026-11-10",
    expiresAt: null,
  },

  {
    id: "versao-2",
    title: "Nova versão do site",
    message: "O site está de cara nova! Aproveite o novo visual.",
    publishedAt: "2026-11-10",
    expiresAt: null,
  },
];

// "AAAA-MM-DD" → Date no fuso local. Sufixos definem início/fim do dia.
function parseLocalDate(value: string, endOfDay: boolean): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  return endOfDay
    ? new Date(Number(y), Number(m) - 1, Number(d), 23, 59, 59, 999)
    : new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0, 0);
}

/** true quando `now` está dentro do período publishedAt → expiresAt. */
export function isNotificationActive(n: SiteNotification, now: Date = new Date()): boolean {
  const start = parseLocalDate(n.publishedAt, false);
  if (!start || now < start) return false;
  if (n.expiresAt === null) return true;
  const end = parseLocalDate(n.expiresAt, true);
  return end !== null && now <= end;
}

/** Notificações ativas agora, da mais recente para a mais antiga. */
export function getActiveNotifications(now: Date = new Date()): SiteNotification[] {
  return NOTIFICATIONS.filter((n) => isNotificationActive(n, now)).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}
