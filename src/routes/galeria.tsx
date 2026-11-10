import { useCallback, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { MasonryGaleria } from "@/components/site/MasonryGaleria";
import { LightboxGaleria } from "@/components/site/LightboxGaleria";
import {
  CATEGORIAS_GALERIA,
  fotosGaleriaPagina,
  type CategoriaGaleria,
} from "@/data/galeriaPagina";
import { INSTAGRAM_URL, RESERVAR } from "@/data/site";
import { capas } from "@/data/capas";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   GALERIA: /galeria

   Cabeçalho padrão (PageHero), filtros por tema e o mosaico de fotos
   (MasonryGaleria, inspirado no Masonry do React Bits). Clicar numa foto
   abre a tela cheia (LightboxGaleria). Fotos e legendas em
   src/data/galeriaPagina.ts; arquivos em src/assets/galeriapage/.
   ──────────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute("/galeria")({
  head: () =>
    seo({
      titulo: "Galeria | Bella Vista Pousada Familiar",
      descricao: "Fotos da Bella Vista Pousada Familiar: acomodações, café da manhã e os cantos preferidos dos hóspedes no Vale dos Vinhedos.",
      caminho: "/galeria",
      imagem: "/og/galeria.jpg",
      imagemAlt: "Suíte Pôr do Sol com manta vermelha sobre a cama e parede em relevo iluminada",
      descricaoSocial: "Acomodações, café da manhã e os cantos preferidos dos hóspedes no Vale dos Vinhedos.",
    }),
  component: GaleriaPage,
});

function GaleriaPage() {
  const [categoria, setCategoria] = useState<CategoriaGaleria | "todas">("todas");
  const fotos = useMemo(
    () =>
      categoria === "todas"
        ? fotosGaleriaPagina
        : fotosGaleriaPagina.filter((f) => f.categoria === categoria),
    [categoria],
  );
  // índice (dentro do filtro atual) da foto aberta em tela cheia
  const [aberta, setAberta] = useState<number | null>(null);
  const abrir = useCallback(
    (id: string) => setAberta(fotos.findIndex((f) => f.id === id)),
    [fotos],
  );
  const fechar = useCallback(() => setAberta(null), []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        image={capas.galeria}
        imageAlt="Acomodação da pousada com cama de casal arrumada, manta coral e parede com textura"
        trail={[{ label: "Galeria" }]}
        eyebrow="Galeria"
        title={
          <>
            A pousada, <span className="text-white/60">em cada detalhe.</span>
          </>
        }
      >
        <p className="mt-6 max-w-[46ch] text-[1.05rem] leading-relaxed text-white/80">
          Quartos, café da manhã e os cantos preferidos dos nossos hóspedes.
        </p>
      </PageHero>

      <main className="mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 md:pb-24 lg:px-10">
        {/* filtros */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-[0.95rem] text-muted-foreground">
            <span className="font-semibold text-foreground tabular-nums">{fotos.length}</span>{" "}
            {fotos.length === 1 ? "foto" : "fotos"}
            {categoria !== "todas" && " neste tema"}
          </p>
          <div
            role="group"
            aria-label="Filtrar fotos por tema"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {CATEGORIAS_GALERIA.map((c) => {
              const ativo = categoria === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoria(c.id)}
                  aria-pressed={ativo}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[0.82rem] font-medium whitespace-nowrap transition-colors duration-300 ${
                    ativo
                      ? "border-wine bg-wine text-white"
                      : "border-foreground/12 text-foreground/75 hover:border-wine/40 hover:text-wine"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* mosaico */}
        <div className="mt-8 sm:mt-10">
          <MasonryGaleria fotos={fotos} onAbrir={abrir} />
        </div>

        {/* fechamento */}
        <div className="mt-16 flex flex-col items-center gap-5 text-center md:mt-20">
          <p className="max-w-[40ch] font-display text-[1.5rem] leading-tight font-bold tracking-[-0.02em] sm:text-[1.8rem]">
            Gostou do que viu? <span className="text-wine">Venha ver de perto.</span>
          </p>
          <div className="flex flex-row items-center gap-3 sm:gap-4">
            <a
              href={RESERVAR}
              className="btn-base btn-primary whitespace-nowrap max-sm:px-5!"
            >
              Reservar
              <ArrowUpRight className="size-3.5" />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-base btn-outline whitespace-nowrap max-sm:px-5!"
            >
              <span className="sm:hidden">Instagram</span>
              <span className="hidden sm:inline">Mais fotos no Instagram</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </main>

      {aberta !== null && (
        <LightboxGaleria
          fotos={fotos}
          indice={aberta}
          onFechar={fechar}
          onIr={setAberta}
        />
      )}

      <Footer />
      <WhatsappButton />
    </div>
  );
}
