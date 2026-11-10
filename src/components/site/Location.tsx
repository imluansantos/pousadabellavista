import { useState } from "react";
import { Navigation } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import brandIcon from "@/assets/logo-selo.webp";

/* ─────────────────────────────────────────────────────────────────────────────
   LOCALIZAÇÃO — "No coração do Vale dos Vinhedos" (seção 05 da home)

   O mapa é a peça dominante: no desktop ocupa ~60–65% de um container
   largo e centralizado, com o texto numa coluna enxuta à esquerda. No
   celular: etiqueta → título → texto → endereço → botão → mapa grande.

   Mapa: Google Maps incorporado (sem API key e sem biblioteca extra),
   posicionado pelas coordenadas exatas da pousada — tiradas do link do
   próprio lugar no Google Maps. Só pelo endereço o Google erra o ponto
   (coloca o pin num trecho da Via Trento mais perto do centro). Para não
   "sequestrar" a rolagem da página, o mapa só fica interativo depois de um
   clique e volta a ficar inerte quando o mouse sai dele.

   "Traçar rota" usa o link universal do Google Maps (maps/dir/?api=1): no
   desktop abre o Google Maps no navegador; no celular abre o app de mapas
   (ou o site, se o app não estiver instalado), já com o destino definido.
   ──────────────────────────────────────────────────────────────────────── */

/** Endereço oficial — o que aparece na página. */
const ENDERECO = "Via Trento, 1118, Vale dos Vinhedos, Bento Gonçalves, RS";

/**
 * Posição exata da pousada (lat, lng), do link do lugar no Google Maps
 * (parâmetros !3d / !4d). Usada no mapa e na rota.
 */
const COORDENADAS = "-29.1765045,-51.5506722";

const MAPA_EMBED_URL = `https://maps.google.com/maps?q=${COORDENADAS}&z=13&hl=pt-BR&output=embed`;
const ROTA_URL = `https://www.google.com/maps/dir/?api=1&destination=${COORDENADAS}`;

export function Location() {
  return (
    <section
      id="localizacao"
      aria-labelledby="localizacao-titulo"
      className="overflow-hidden secao-filetes bg-cream py-16 sm:py-24 lg:py-28"
    >
      {/* Composição centralizada num container largo: o texto ocupa uma
          coluna enxuta e o mapa fica com o restante (~60–65% no desktop). */}
      {/* No celular (< sm) a ordem muda para ficar mais enxuta: texto → mapa
          → endereço e rota. Do sm em diante, a composição original. */}
      <div className="mx-auto flex max-w-[1680px] flex-col px-6 sm:block lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-center lg:gap-14 lg:px-10 xl:gap-20 2xl:grid-cols-[420px_minmax(0,1fr)] 2xl:gap-20 2xl:px-14">
        {/* ── Texto ───────────────────────────────────────────────────── */}
        <div className="contents sm:block">
          <Reveal className="order-1">
            <p className="eyebrow">Localização</p>
            <h2
              id="localizacao-titulo"
              className="mt-4 font-display text-[2.1rem] leading-[1.06] sm:mt-5 sm:text-5xl lg:text-[2.6rem] xl:text-[2.9rem]"
            >
              <span className="block">No coração do</span>
              <span className="block text-wine">Vale dos Vinhedos.</span>
            </h2>
            <p className="mt-4 max-w-[42ch] text-[0.95rem] leading-relaxed text-muted-foreground sm:mt-7 sm:text-[1.05rem]">
              <span className="sm:hidden">
                Entre vinhedos e a tranquilidade da Serra Gaúcha, no ponto ideal para viver o Vale de
                perto.
              </span>
              <span className="hidden sm:inline">
                Entre vinhedos, paisagens e a tranquilidade da Serra Gaúcha, a Bella Vista está em uma
                localização privilegiada para quem quer viver o Vale dos Vinhedos de perto.
              </span>
            </p>
          </Reveal>

          <Reveal delay={140} className="order-3">
            <address className="mt-7 not-italic sm:mt-12 sm:border-t sm:border-foreground/10 sm:pt-8">
              <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                Pousada Bella Vista
              </p>
              <p className="mt-2 font-display text-[1.65rem] leading-tight font-bold tracking-[-0.02em] sm:mt-3 sm:text-[2.1rem]">
                Via Trento, 1118
              </p>
              <p className="mt-1 text-[0.88rem] text-muted-foreground sm:mt-1.5 sm:text-[0.95rem]">
                Vale dos Vinhedos
                <span aria-hidden className="mx-2 text-wine/70">
                  ·
                </span>
                Bento Gonçalves, RS
              </p>
            </address>

            <div className="mt-6 flex flex-row items-center gap-4 sm:mt-10 sm:gap-7">
              <a
                href={ROTA_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Traçar rota até a Pousada Bella Vista no Google Maps"
                className="btn-base btn-primary shrink-0 whitespace-nowrap"
              >
                Traçar rota
                <Navigation className="size-3.5" />
              </a>
              <p className="max-w-[26ch] text-[0.8rem] leading-snug text-muted-foreground sm:text-sm">
                Seu ponto de partida para explorar o Vale dos Vinhedos.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── Mapa ─────────────────────────────────────────────────────── */}
        <Reveal delay={120} className="order-2 mt-7 sm:mt-14 lg:mt-0">
          <MapaInterativo />
        </Reveal>
      </div>
    </section>
  );
}

function MapaInterativo() {
  // O mapa nasce inerte (pointer-events desligado no iframe) para a rolagem
  // da página passar por cima dele; um clique ativa a interação.
  const [ativo, setAtivo] = useState(false);

  return (
    <div
      className="group relative h-[50svh] max-h-[400px] min-h-[300px] overflow-hidden rounded-xl sm:h-[68svh] sm:max-h-[620px] sm:min-h-[420px] bg-secondary lg:h-[min(78svh,760px)] lg:max-h-none lg:min-h-[560px] lg:rounded-2xl"
      onMouseLeave={() => setAtivo(false)}
    >
      <iframe
        title={`Mapa com a localização da Pousada Bella Vista: ${ENDERECO}`}
        src={MAPA_EMBED_URL}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className={`absolute inset-0 h-full w-full border-0 ${ativo ? "" : "pointer-events-none"}`}
        style={{ filter: "saturate(0.82) contrast(1.02)" }}
      />

      {/* fio interno sutil — dá acabamento à borda do mapa */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-foreground/10 ring-inset"
      />

      {/* selo da pousada — canto superior direito (o Google ocupa os outros
          cantos com o cartão do endereço, o logo e os controles). Usa o
          próprio símbolo da marca, como uma etiqueta impressa. */}
      <div className="pointer-events-none absolute top-5 right-5 hidden items-center gap-3 rounded-lg border border-foreground/10 bg-background py-2 pr-4 pl-2 shadow-[0_6px_20px_-14px_oklch(0.18_0.01_40/0.6)] sm:flex">
        <img src={brandIcon} alt="" aria-hidden className="size-10 shrink-0" />
        <span className="flex flex-col leading-tight">
          <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Pousada
          </span>
          <span className="font-display text-[0.95rem] font-bold tracking-[-0.01em]">
            Bella Vista
          </span>
        </span>
      </div>

      {/* camada que ativa o mapa */}
      {!ativo && (
        <button
          type="button"
          onClick={() => setAtivo(true)}
          aria-label="Ativar o mapa interativo"
          className="absolute inset-0 flex cursor-pointer items-end justify-center pb-14 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-wine"
        >
          <span className="rounded-full bg-ink/80 px-4 py-2 text-xs font-medium tracking-wide text-white opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
            <span className="[@media(hover:none)]:hidden">Clique para explorar o mapa</span>
            <span className="hidden [@media(hover:none)]:inline">Toque para explorar o mapa</span>
          </span>
        </button>
      )}
    </div>
  );
}
