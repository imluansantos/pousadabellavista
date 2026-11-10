import { useEffect, useId, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import DriftWall from "@/components/ui/drift-wall";
import { fotosGaleria } from "@/data/galeria";

/* ─────────────────────────────────────────────────────────────────────────────
   GALERIA — logo após "Experiências"

   Mural de fotos em 5 colunas inclinadas em perspectiva (DriftWall —
   src/components/ui/drift-wall.tsx, baseado no React Bits). As fotos formam
   UMA fita contínua que serpenteia pelas colunas, como um filme dobrado em
   sanfona: sobe na 1ª, desce na 2ª, sobe na 3ª… — a foto que sai de uma
   coluna aparece na coluna da direita; as dobras ficam fora da tela. Ao
   passar o mouse, a fita para e a foto sob o cursor "sobe" com cor plena.
   Com "reduzir movimento", o mural fica parado.

   Título e subtítulo são propositalmente discretos, para o mural ser o
   protagonista. Fotos e textos alternativos: src/data/galeria.ts.
   ──────────────────────────────────────────────────────────────────────── */

/** véu das fotos: a cor --cream do site, translúcida — o DriftWall aplica o
 *  véu com 42% de opacidade, então com o fundo claro ele precisa ser mais
 *  leve que o padrão para as fotos não ficarem lavadas */
const CREAM = "rgba(254, 244, 240, 0.45)";

/** tamanho das fotos: menor no celular para caberem mais colunas na tela */
function useTamanhoFoto() {
  const [pequeno, setPequeno] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const atualizar = () => setPequeno(mq.matches);
    atualizar();
    mq.addEventListener("change", atualizar);
    return () => mq.removeEventListener("change", atualizar);
  }, []);
  return pequeno
    ? { tileWidth: 150, tileHeight: 100, gap: 12 }
    : { tileWidth: 240, tileHeight: 160, gap: 18 };
}

export function Gallery() {
  const tamanho = useTamanhoFoto();

  return (
    <section
      id="galeria"
      aria-labelledby="galeria-titulo"
      className="relative overflow-hidden secao-filetes bg-cream text-foreground"
    >
      {/* ── Título — discreto ─────────────────────────────────────────── */}
      <Reveal className="relative z-10 mx-auto max-w-2xl px-6 pt-16 text-center sm:pt-24 md:pt-28">
        <p className="eyebrow flex items-center justify-center gap-4">
          <span aria-hidden className="h-px w-8 bg-wine/60" />
          Galeria
          <span aria-hidden className="h-px w-8 bg-wine/60" />
        </p>
        <h2
          id="galeria-titulo"
          className="mt-3 font-display text-[1.75rem] leading-tight sm:mt-5 sm:text-[2.4rem]"
        >
          A pousada, em cada detalhe.
        </h2>
        <p className="mx-auto mt-2 max-w-[46ch] text-[0.88rem] leading-relaxed text-muted-foreground sm:mt-4 sm:text-[0.95rem]">
          Quartos, café da manhã e os cantos preferidos dos nossos hóspedes.
        </p>
      </Reveal>

      {/* ── Mural ─────────────────────────────────────────────────────── */}
      <div className="relative -mt-4 h-[66svh] max-h-[760px] min-h-[440px] md:h-[78svh]">
        <DriftWall
          items={fotosGaleria}
          columns={5}
          tileWidth={tamanho.tileWidth}
          tileHeight={tamanho.tileHeight}
          gap={tamanho.gap}
          radius={12}
          overlayColor={CREAM}
          dim={0.9}
          turn={0}
        />
        {/* esmaece a base do mural para o fundo da seção (o próprio DriftWall
            já esmaece o topo e as laterais). Desce 4px além do mural e começa
            com uns pixels de creme sólido: em alguns navegadores a borda de
            baixo do mural (que tem máscara) arredonda para um pixel a mais e
            deixava aparecer um fio fino das fotos acima dos botões. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-1 h-[calc(8rem+4px)] bg-gradient-to-t from-cream from-[6%] to-transparent"
        />
      </div>

      {/* ── Botões (padrão do site: btn-base + variante). No celular ficam
          lado a lado: "Galeria completa" e, no lugar do texto do
          Instagram, a logo colorida. ──────────────────────────────── */}
      <div className="relative z-10 flex flex-row items-center justify-center gap-3 px-6 pb-16 sm:gap-4 sm:pb-24 md:pb-28">
        <a
          href="/galeria"
          className="btn-base btn-primary whitespace-nowrap max-sm:px-5!"
        >
          <span className="sm:hidden">Galeria completa</span>
          <span className="hidden sm:inline">Ver galeria completa</span>
          <ArrowUpRight className="size-3.5" />
        </a>
        <a
          href="https://www.instagram.com/apousadabellavista"
          target="_blank"
          rel="noreferrer"
          aria-label="Visitar nosso Instagram"
          className="btn-base btn-outline whitespace-nowrap max-sm:px-5!"
        >
          <LogoInstagram className="size-5 sm:hidden" />
          <span className="hidden sm:inline">Visitar nosso Instagram</span>
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </section>
  );
}

/** Logo do Instagram em contorno, com o degradê oficial da marca. */
function LogoInstagram({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={`url(#${id})`}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <defs>
        <linearGradient id={id} x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#feda75" />
          <stop offset="0.25" stopColor="#fa7e1e" />
          <stop offset="0.5" stopColor="#d62976" />
          <stop offset="0.75" stopColor="#962fbf" />
          <stop offset="1" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.6" cy="6.4" r="0.9" fill={`url(#${id})`} stroke="none" />
    </svg>
  );
}
