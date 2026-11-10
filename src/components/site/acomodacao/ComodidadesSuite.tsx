import { useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AirVent,
  Armchair,
  Bath,
  BedDouble,
  BrushCleaning,
  ChevronDown,
  Coffee,
  CookingPot,
  Croissant,
  CupSoda,
  Flame,
  KeyRound,
  Layers,
  Microwave,
  PawPrint,
  Refrigerator,
  Shirt,
  SoapDispenserDroplet,
  Sparkle,
  SquareParking,
  TowelRack,
  Tv,
  Utensils,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { INFO_ESTADIA, type Acomodacao, type IconeComodidade } from "@/data/acomodacoes";

/* ─────────────────────────────────────────────────────────────────────────────
   COMODIDADES (seção 4)

   Mostra primeiro só as comodidades principais da suíte (`destaque: true` em
   data/acomodacoes.ts) e, no botão "Ver todas", a lista completa agrupada por
   categoria. Fecha com as informações práticas da estadia (horários
   confirmados) e os links para as páginas de horários e regras.
   ──────────────────────────────────────────────────────────────────────── */

const ICONES: Record<IconeComodidade, LucideIcon> = {
  ar: AirVent,
  poltrona: Armchair,
  cama: BedDouble,
  enxoval: Layers,
  arara: Shirt,
  ferro: Sparkle,
  banheiro: Bath,
  toalha: TowelRack,
  secador: Wind,
  sabonete: SoapDispenserDroplet,
  cozinha: CookingPot,
  geladeira: Refrigerator,
  cooktop: Flame,
  "micro-ondas": Microwave,
  cafeteira: Coffee,
  chaleira: CupSoda,
  mesa: Utensils,
  wifi: Wifi,
  tv: Tv,
  "cafe-da-manha": Croissant,
  limpeza: BrushCleaning,
  estacionamento: SquareParking,
  pet: PawPrint,
  chave: KeyRound,
};

const LINKS = [
  { label: "Horários de check-in e check-out", to: "/horarios" },
  { label: "Regras da pousada", to: "/politicas-e-regras" },
  { label: "Política de cancelamento", to: "/politica-de-cancelamento" },
] as const;

export function ComodidadesSuite({ acomodacao: a }: { acomodacao: Acomodacao }) {
  const [aberta, setAberta] = useState(false);
  const listaId = useId();
  const destaques = a.comodidades.flatMap((g) => g.itens.filter((i) => i.destaque));
  const total = a.comodidades.reduce((n, g) => n + g.itens.length, 0);

  return (
    <section aria-labelledby="comodidades-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Na suíte {a.nome}</p>
            <h2 id="comodidades-titulo" className="mt-4 font-display text-[2rem] leading-[1.1] sm:text-[2.6rem]">
              Comodidades
            </h2>
          </div>
        </Reveal>

        {/* principais */}
        <ul className="mt-10 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {destaques.map(({ icone, texto }) => {
            const Icon = ICONES[icone];
            return (
              <li
                key={texto}
                className="flex items-center gap-3.5 border-t border-foreground/10 py-4 text-[0.95rem] font-medium"
              >
                <Icon aria-hidden className="size-5 shrink-0 text-wine" strokeWidth={1.5} />
                {texto}
              </li>
            );
          })}
        </ul>

        {/* lista completa */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setAberta((v) => !v)}
            aria-expanded={aberta}
            aria-controls={listaId}
            className="btn-base btn-outline"
          >
            {aberta ? "Mostrar menos" : `Ver todas as comodidades (${total})`}
            <ChevronDown
              aria-hidden
              className={`size-3.5 transition-transform duration-300 ${aberta ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div
          id={listaId}
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
            aberta ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          {...(aberta ? {} : { inert: true, "aria-hidden": true })}
        >
          <div className="overflow-hidden">
            <div className="grid gap-x-10 gap-y-10 pt-12 sm:grid-cols-2 lg:grid-cols-3">
              {a.comodidades.map((grupo) => (
                <div key={grupo.titulo}>
                  <h3 className="text-[0.72rem] font-semibold tracking-[0.2em] text-foreground uppercase">
                    {grupo.titulo}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {grupo.itens.map(({ icone, texto }) => {
                      const Icon = ICONES[icone];
                      return (
                        <li
                          key={texto}
                          className="flex items-center gap-3 text-[0.92rem] text-muted-foreground"
                        >
                          <Icon aria-hidden className="size-4 shrink-0 text-wine/80" strokeWidth={1.5} />
                          {texto}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* informações práticas */}
        <Reveal className="mt-16 rounded-2xl bg-cream p-6 sm:p-8 lg:mt-20 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <h3 className="font-display text-xl leading-tight lg:col-span-3">
              Bom saber antes de chegar
            </h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:col-span-9">
              {INFO_ESTADIA.map((info) => (
                <div key={info.rotulo}>
                  <dt className="text-[0.7rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    {info.rotulo}
                  </dt>
                  <dd className="mt-1.5 text-[1.02rem] font-semibold">{info.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-foreground/10 pt-6 text-[0.85rem]">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="font-medium text-wine underline decoration-wine/30 underline-offset-4 transition-colors hover:decoration-wine"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
