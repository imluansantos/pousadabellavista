import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { FotoGaleria } from "@/data/galeriaPagina";

/* ─────────────────────────────────────────────────────────────────────────────
   TELA CHEIA DA GALERIA

   Abre a foto clicada na versão grande, com setas (e as setas do teclado),
   contador, legenda e fechar (X, Esc ou clique fora da foto). No celular dá
   para passar arrastando para o lado. As fotos vizinhas já são pré-carregadas
   para a troca ser imediata.
   ──────────────────────────────────────────────────────────────────────── */

export function LightboxGaleria({
  fotos,
  indice,
  onFechar,
  onIr,
}: {
  fotos: FotoGaleria[];
  indice: number;
  onFechar: () => void;
  onIr: (indice: number) => void;
}) {
  const total = fotos.length;
  const foto = fotos[indice];
  const ir = (delta: number) => onIr((indice + delta + total) % total);
  const toqueX = useRef<number | null>(null);

  // teclado + trava a rolagem da página por trás
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
      if (e.key === "ArrowRight") onIr((indice + 1) % total);
      if (e.key === "ArrowLeft") onIr((indice - 1 + total) % total);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [indice, total, onFechar, onIr]);

  // pré-carrega as vizinhas
  useEffect(() => {
    for (const d of [1, -1]) {
      const f = fotos[(indice + d + total) % total];
      if (f) new Image().src = f.grande ?? f.src;
    }
  }, [indice, fotos, total]);

  if (!foto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Foto ampliada da galeria"
      className="animate-in fade-in fixed inset-0 z-[70] flex flex-col bg-ink/95 duration-300"
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
      {/* topo: contador e fechar */}
      <div className="flex items-center justify-between px-5 pt-5 text-white sm:px-8 sm:pt-6">
        <p className="font-display text-sm tracking-[0.2em] tabular-nums text-white/70">
          <span className="text-white">{String(indice + 1).padStart(2, "0")}</span>
          <span className="mx-2 text-white/30">/</span>
          {String(total).padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* foto */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-4 sm:px-24">
        <img
          key={foto.id}
          src={foto.grande ?? foto.src}
          alt={foto.alt}
          onClick={(e) => e.stopPropagation()}
          className="animate-in fade-in zoom-in-95 max-h-full max-w-full rounded-lg object-contain shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] duration-300"
        />

        {/* setas (no celular ficam embaixo) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            ir(-1);
          }}
          aria-label="Foto anterior"
          className="absolute top-1/2 left-6 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 sm:grid"
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
          className="absolute top-1/2 right-6 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 sm:grid"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>

      {/* legenda + setas do celular */}
      <div
        className="flex items-center justify-center gap-4 px-5 pb-6 sm:pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => ir(-1)}
          aria-label="Foto anterior"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 text-white sm:hidden"
        >
          <ArrowLeft className="size-4" />
        </button>
        <p className="max-w-[46ch] text-center text-[0.85rem] leading-snug text-white/75 sm:text-[0.95rem]">
          {foto.alt}
        </p>
        <button
          type="button"
          onClick={() => ir(1)}
          aria-label="Próxima foto"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 text-white sm:hidden"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
