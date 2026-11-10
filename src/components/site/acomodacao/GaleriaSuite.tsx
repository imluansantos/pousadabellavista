import { useEffect, useId, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { Ambiente, FotoAcomodacao } from "@/data/acomodacoes";

/* ─────────────────────────────────────────────────────────────────────────────
   TELA CHEIA DA GALERIA DE UMA SUÍTE

   Abre na foto escolhida (de um ambiente ou da galeria completa) e mostra:
     • no topo, o contador e atalhos para cada ambiente da suíte;
     • a foto grande, com setas (e as setas do teclado);
     • embaixo, o nome e a descrição curta do ambiente.
   Fecha no X, com Esc ou clicando fora da foto. No celular dá para passar
   arrastando para o lado. O foco do teclado fica preso dentro da janela e
   volta para o botão que a abriu ao fechar. As fotos vizinhas são
   pré-carregadas para a troca ser imediata.
   ──────────────────────────────────────────────────────────────────────── */

export interface ItemGaleria {
  foto: FotoAcomodacao;
  ambiente: Ambiente;
}

export function GaleriaSuite({
  nomeSuite,
  itens,
  indice,
  onIr,
  onFechar,
}: {
  nomeSuite: string;
  itens: ItemGaleria[];
  indice: number;
  onIr: (indice: number) => void;
  onFechar: () => void;
}) {
  const total = itens.length;
  const item = itens[indice];
  const janela = useRef<HTMLDivElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);
  const toqueX = useRef<number | null>(null);
  const tituloId = useId();

  const ir = (delta: number) => onIr((indice + delta + total) % total);

  // primeiro índice de cada ambiente (atalhos do topo)
  const ambientes = itens.reduce<{ ambiente: Ambiente; inicio: number }[]>((acc, it, i) => {
    if (!acc.some((a) => a.ambiente.id === it.ambiente.id)) acc.push({ ambiente: it.ambiente, inicio: i });
    return acc;
  }, []);

  // foco: entra no botão de fechar e volta para quem abriu
  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    fechar.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      anterior?.focus?.();
    };
  }, []);

  // teclado: Esc, setas e Tab preso dentro da janela
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onFechar();
      } else if (e.key === "ArrowRight") {
        onIr((indice + 1) % total);
      } else if (e.key === "ArrowLeft") {
        onIr((indice - 1 + total) % total);
      } else if (e.key === "Tab" && janela.current) {
        const focaveis = Array.from(
          janela.current.querySelectorAll<HTMLElement>("button:not([disabled]), [href]"),
        ).filter((el) => el.offsetParent !== null);
        if (focaveis.length === 0) return;
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [indice, total, onFechar, onIr]);

  // pré-carrega as vizinhas
  useEffect(() => {
    for (const d of [1, -1]) {
      const vizinha = itens[(indice + d + total) % total];
      if (vizinha) new Image().src = vizinha.foto.grande;
    }
  }, [indice, itens, total]);

  if (!item) return null;

  return (
    <div
      ref={janela}
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloId}
      className="animate-in fade-in fixed inset-0 z-[70] flex flex-col bg-ink/95 text-white duration-300"
      onClick={onFechar}
      onTouchStart={(e) => {
        toqueX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const inicio = toqueX.current;
        const fim = e.changedTouches[0]?.clientX;
        toqueX.current = null;
        if (inicio == null || fim == null) return;
        const dx = fim - inicio;
        if (Math.abs(dx) > 50) ir(dx < 0 ? 1 : -1);
      }}
    >
      {/* topo: contador, ambientes e fechar */}
      <div
        className="flex items-center gap-4 px-4 pt-4 sm:px-8 sm:pt-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p
          aria-live="polite"
          className="shrink-0 font-display text-sm tracking-[0.2em] text-white/70 tabular-nums"
        >
          <span className="sr-only">Foto </span>
          <span className="text-white">{String(indice + 1).padStart(2, "0")}</span>
          <span aria-hidden className="mx-2 text-white/30">
            /
          </span>
          <span className="sr-only"> de </span>
          {String(total).padStart(2, "0")}
        </p>

        {ambientes.length > 1 && (
          <nav aria-label={`Ambientes da suíte ${nomeSuite}`} className="min-w-0 flex-1">
            <ul className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
              {ambientes.map(({ ambiente, inicio }) => {
                const ativo = ambiente.id === item.ambiente.id;
                return (
                  <li key={ambiente.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => onIr(inicio)}
                      aria-current={ativo ? "true" : undefined}
                      className={`rounded-full px-3.5 py-1.5 text-[0.78rem] font-medium transition-colors ${
                        ativo
                          ? "bg-white text-ink"
                          : "border border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                      }`}
                    >
                      {ambiente.titulo}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <button
          ref={fechar}
          type="button"
          onClick={onFechar}
          aria-label="Fechar galeria"
          className="ml-auto grid size-11 shrink-0 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* foto */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-4 sm:px-24">
        <img
          key={item.foto.grande}
          src={item.foto.grande}
          alt={item.foto.alt}
          width={item.foto.w}
          height={item.foto.h}
          onClick={(e) => e.stopPropagation()}
          className="animate-in fade-in zoom-in-95 h-auto max-h-full w-auto max-w-full rounded-lg object-contain shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] duration-300"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                ir(-1);
              }}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-6 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10 sm:grid"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                ir(1);
              }}
              aria-label="Próxima foto"
              className="absolute top-1/2 right-6 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10 sm:grid"
            >
              <ArrowRight className="size-4" />
            </button>
          </>
        )}
      </div>

      {/* ambiente + setas do celular */}
      <div
        className="flex items-center justify-center gap-4 px-4 pb-6 sm:pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {total > 1 && (
          <button
            type="button"
            onClick={() => ir(-1)}
            aria-label="Foto anterior"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 sm:hidden"
          >
            <ArrowLeft className="size-4" />
          </button>
        )}
        <div className="max-w-[48ch] text-center">
          <h2 id={tituloId} className="text-[1rem] font-semibold tracking-normal sm:text-lg">
            {item.ambiente.titulo}
            <span className="sr-only">, suíte {nomeSuite}</span>
          </h2>
          <p className="mt-1 text-[0.85rem] leading-snug text-white/70 sm:text-[0.92rem]">
            {item.ambiente.descricao}
          </p>
        </div>
        {total > 1 && (
          <button
            type="button"
            onClick={() => ir(1)}
            aria-label="Próxima foto"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 sm:hidden"
          >
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
