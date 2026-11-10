import { useEffect, useState } from "react";
import { ArrowUpRight, Bell } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { getActiveNotifications, type SiteNotification } from "@/data/notifications";

// Central de Notificações do header — sem backend: as novidades vêm de
// src/data/notifications.ts e o que cada visitante já leu fica salvo no
// localStorage do navegador dele (lista de ids). Abrir o painel NÃO marca
// nada como lido; só clicar em uma notificação marca aquela como lida.

const STORAGE_KEY = "bella-vista:notificacoes-lidas";

function readStoredIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    // localStorage bloqueado (modo privado, cookies desativados etc.) — tudo
    // aparece como não lido, sem quebrar o site.
    return [];
  }
}

function writeStoredIds(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // sem persistência disponível: a leitura vale só até recarregar a página
  }
}

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// "2026-09-25" → "25 set 2026" (formatação fixa, sem depender do locale)
function formatDate(value: string): string {
  const [y, m, d] = value.split("-");
  const month = MONTHS[Number(m) - 1];
  return month && d && y ? `${d} ${month} ${y}` : value;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  // Começa vazio no servidor e no primeiro render do navegador (evita
  // diferença de hidratação); a lista real e o localStorage entram no efeito.
  const [items, setItems] = useState<SiteNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setItems(getActiveNotifications());
    setReadIds(new Set(readStoredIds()));

    // mantém outras abas do site sincronizadas
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setReadIds(new Set(readStoredIds()));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const unreadCount = items.filter((n) => !readIds.has(n.id)).length;

  const handleOpenChange = (next: boolean) => {
    // reavalia publishedAt/expiresAt a cada abertura (aba aberta por dias)
    if (next) setItems(getActiveNotifications());
    setOpen(next);
  };

  const markAsRead = (id: string) => {
    if (readIds.has(id)) return;
    const next = new Set([...readStoredIds(), ...readIds, id]);
    writeStoredIds([...next]);
    setReadIds(next);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={
            unreadCount > 0
              ? `Notificações: ${unreadCount} ${unreadCount === 1 ? "nova" : "novas"}`
              : "Notificações"
          }
          className={`group relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            unreadCount > 0
              ? // com novidade: círculo creme cheio + ponto vinho
                "border-cream bg-cream text-ink shadow-[0_6px_24px_-8px] shadow-black/40 hover:shadow-black/60"
              : // tudo lido: só o contorno, fundo transparente (mostra o header)
                "border-white/35 bg-transparent text-white hover:border-white/60 hover:bg-white/10"
          }`}
        >
          <Bell
            className="size-[18px] transition-transform duration-300 group-hover:-translate-y-0.5"
            strokeWidth={2.2}
            aria-hidden
          />
          {unreadCount > 0 && (
            <span
              aria-hidden
              className="absolute top-[9px] right-[10px] size-2 rounded-full bg-wine ring-2 ring-cream"
            />
          )}
        </button>
      </PopoverTrigger>

      {/* Painel creme — mesmo creme dos botões do header (sino e
          "Reservar"), texto em ink e detalhes em vinho. Usa o primitivo do
          Radix direto (em vez do PopoverContent de components/ui) para ter
          controle da animação de entrada sem mexer no componente
          compartilhado. */}
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={14}
          collisionPadding={12}
          className="z-50 w-[min(22rem,calc(100vw-1.5rem))] origin-(--radix-popover-content-transform-origin) rounded-[18px] bg-cream text-ink shadow-[0_24px_60px_-20px] shadow-black/70 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-98 data-[state=closed]:slide-out-to-top-[4px] data-[state=closed]:duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-98 data-[state=open]:slide-in-from-top-[6px] data-[state=open]:duration-200 data-[state=open]:ease-out"
        >
          <div className="flex items-baseline justify-between gap-4 px-[22px] pt-[18px] pb-2.5 text-[10.5px] font-semibold tracking-[0.22em] uppercase">
            <p className="text-wine">Novidades</p>
            {unreadCount > 0 && (
              <p className="text-ink/40 tabular-nums">
                {String(unreadCount).padStart(2, "0")}
                <span className="sr-only"> {unreadCount === 1 ? "nova" : "novas"}</span>
              </p>
            )}
          </div>

          {items.length === 0 ? (
            <div className="px-[22px] pt-2 pb-6">
              <p className="text-[15px] font-semibold">Tudo em dia.</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink/60">
                Sem novas informações no momento.
              </p>
            </div>
          ) : (
            <ul className="flex max-h-[min(26rem,60svh)] flex-col gap-1 overflow-y-auto px-2.5 pb-2.5">
              {items.map((n) => {
                const unread = !readIds.has(n.id);
                const external = n.href !== undefined && /^https?:\/\//.test(n.href);
                const itemClass = `group flex w-full items-start gap-3 rounded-xl px-3 py-3.5 text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-wine/30 focus-visible:outline-none ${
                  unread ? "bg-accent hover:bg-accent/70" : "hover:bg-accent/60"
                }`;

                const content = (
                  <>
                    {/* ponto vinho de não lida — some ao ler (o espaço
                        fica, pra nada "pular" no clique) */}
                    <span
                      aria-hidden
                      className={`mt-[6px] size-[7px] shrink-0 rounded-full bg-wine transition-opacity duration-300 ${
                        unread ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      {unread && <span className="sr-only">Não lida: </span>}
                      <span
                        className={`block text-[15px] leading-snug transition-colors duration-300 ${
                          unread ? "font-semibold text-ink" : "font-medium text-ink/70"
                        }`}
                      >
                        {n.title}
                      </span>
                      <span
                        className={`mt-1 block text-[13px] leading-relaxed transition-colors duration-300 ${
                          unread ? "text-ink/65" : "text-ink/50"
                        }`}
                      >
                        {n.message}
                      </span>
                      <span className="mt-2.5 block text-[10px] tracking-[0.18em] text-ink/40 uppercase">
                        {formatDate(n.publishedAt)}
                      </span>
                    </span>
                    {n.href !== undefined && (
                      <ArrowUpRight
                        aria-hidden
                        className="mt-1 size-3.5 shrink-0 text-ink/35 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-wine"
                      />
                    )}
                  </>
                );

                return (
                  <li key={n.id}>
                    {n.href !== undefined ? (
                      <a
                        href={n.href}
                        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                        onClick={() => {
                          markAsRead(n.id);
                          if (!external) setOpen(false);
                        }}
                        className={itemClass}
                      >
                        {content}
                      </a>
                    ) : (
                      <button type="button" onClick={() => markAsRead(n.id)} className={itemClass}>
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </Popover>
  );
}
