import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, X } from "lucide-react";
import { RESERVAR } from "@/data/site";
import { buscaDoPedido, lerRascunho, resumoCurto, temProgresso, type Pedido } from "@/lib/reservas/pedido";

/* ─────────────────────────────────────────────────────────────────────────────
   "VOCÊ TEM UM PEDIDO EM ANDAMENTO" (montado uma vez, em routes/__root.tsx)

   Nas páginas fora de /reservar, se o navegador tem um rascunho de pedido
   (guardado ao sair, ver AvisoSaida.tsx), mostra um cartão discreto no canto
   inferior esquerdo com "Continuar pedido". Dispensar esconde o cartão até o
   fim da visita (sessionStorage), sem apagar o rascunho.
   ──────────────────────────────────────────────────────────────────────── */

const CHAVE_DISPENSADO = "bv-reserva-retomar-dispensado";

function dispensado(codigo: string) {
  try {
    return window.sessionStorage.getItem(CHAVE_DISPENSADO) === codigo;
  } catch {
    return false;
  }
}

export function RetomarReserva() {
  const caminho = useLocation({ select: (l) => l.pathname });
  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    if (caminho === RESERVAR) return setPedido(null);
    const salvo = lerRascunho();
    setPedido(temProgresso(salvo) && !dispensado(salvo.codigo) ? salvo : null);
  }, [caminho]);

  if (!pedido) return null;

  function dispensar() {
    try {
      window.sessionStorage.setItem(CHAVE_DISPENSADO, pedido!.codigo);
    } catch {
      /* segue só escondendo */
    }
    setPedido(null);
  }

  return (
    <aside
      aria-label="Pedido de reserva em andamento"
      className="animate-in fade-in slide-in-from-bottom-3 fixed bottom-[5.25rem] left-4 z-40 w-[min(22rem,calc(100vw-6.5rem))] rounded-2xl border border-border bg-background/95 p-4 pr-10 shadow-xl backdrop-blur duration-500 sm:left-6"
    >
      <button
        type="button"
        onClick={dispensar}
        aria-label="Dispensar aviso do pedido"
        className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X aria-hidden className="size-4" />
      </button>
      <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-wine">
        <CalendarDays aria-hidden className="size-3.5" />
        Pedido em andamento
      </p>
      <p className="mt-1.5 text-[0.92rem] font-medium leading-snug text-foreground">{resumoCurto(pedido)}</p>
      <Link
        to="/reservar"
        search={buscaDoPedido(pedido)}
        className="mt-3 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-wine underline-offset-4 hover:underline"
      >
        Continuar pedido
        <ArrowRight aria-hidden className="size-3.5" />
      </Link>
    </aside>
  );
}
