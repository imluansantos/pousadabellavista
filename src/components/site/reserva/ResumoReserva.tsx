import type { ReactNode } from "react";
import { ArrowRight, CalendarDays, PawPrint, Sparkles, Users } from "lucide-react";
import { getAcomodacao } from "@/data/acomodacoes";
import { ADICIONAIS, HORARIOS } from "@/data/reservas";
import { dataCurta, diaDaSemanaCurto, noitesEntre, plural } from "@/lib/reservas/datas";
import { textoHospedes, type Pedido } from "@/lib/reservas/pedido";

/* Resumo do pedido. No desktop fica fixo ao lado das etapas; no celular vira
   uma barra no rodapé da tela com o essencial e o botão de continuar. */

export function ResumoReserva({
  pedido: p,
  acao,
  rodape,
}: {
  pedido: Pedido;
  /** botão principal da etapa atual */
  acao: ReactNode;
  rodape?: ReactNode;
}) {
  const suite = p.suite ? getAcomodacao(p.suite) : undefined;
  const noites = p.entrada && p.saida ? noitesEntre(p.entrada, p.saida) : 0;
  const adicionais = ADICIONAIS.filter((a) => p.adicionais.includes(a.id));

  return (
    <aside aria-label="Resumo do pedido" className="overflow-hidden rounded-2xl border border-border bg-card">
      {suite ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img src={suite.capa.pequena} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-[0.66rem] font-semibold tracking-[0.24em] text-white/75 uppercase">Suíte</p>
            <p className="mt-1 text-2xl font-bold tracking-[-0.02em]">{suite.nome}</p>
          </div>
        </div>
      ) : (
        <div className="border-b border-border bg-cream p-5">
          <p className="text-[0.66rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">Seu pedido</p>
          <p className="mt-1 text-lg font-bold">Escolha uma suíte</p>
        </div>
      )}

      <dl className="divide-y divide-foreground/10 px-5">
        <Linha icone={<CalendarDays className="size-4" />} titulo="Datas">
          {p.entrada ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[0.7rem] text-muted-foreground">Entrada</p>
                <p className="font-semibold">
                  {diaDaSemanaCurto(p.entrada)}, {dataCurta(p.entrada)}
                </p>
                <p className="text-[0.72rem] text-muted-foreground">a partir das {HORARIOS.checkIn}</p>
              </div>
              <div>
                <p className="text-[0.7rem] text-muted-foreground">Saída</p>
                {p.saida ? (
                  <>
                    <p className="font-semibold">
                      {diaDaSemanaCurto(p.saida)}, {dataCurta(p.saida)}
                    </p>
                    <p className="text-[0.72rem] text-muted-foreground">até {HORARIOS.checkOut}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">a escolher</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">a escolher</p>
          )}
          {noites > 0 && (
            <p className="mt-2 inline-flex rounded-full bg-wine/10 px-2.5 py-0.5 text-[0.75rem] font-semibold text-wine">
              {plural(noites, "noite", "noites")}
            </p>
          )}
        </Linha>
        <Linha icone={<Users className="size-4" />} titulo="Hóspedes">
          <p>{textoHospedes(p)}</p>
          {p.pet && (
            <p className="mt-1 flex items-center gap-1.5 text-[0.82rem] text-muted-foreground">
              <PawPrint aria-hidden className="size-3.5" /> com pet
            </p>
          )}
        </Linha>
        {adicionais.length > 0 && (
          <Linha icone={<Sparkles className="size-4" />} titulo="Interesse em">
            <ul className="space-y-0.5">
              {adicionais.map((a) => (
                <li key={a.id}>{a.titulo}</li>
              ))}
            </ul>
          </Linha>
        )}
      </dl>

      <div className="border-t border-border p-5">
        {acao}
        {rodape && <div className="mt-3 text-center text-[0.75rem] leading-relaxed text-muted-foreground">{rodape}</div>}
      </div>
    </aside>
  );
}

function Linha({ icone, titulo, children }: { icone: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 py-4 text-[0.9rem]">
      <span aria-hidden className="mt-0.5 text-wine">
        {icone}
      </span>
      <div className="min-w-0 flex-1">
        <dt className="sr-only">{titulo}</dt>
        <dd>{children}</dd>
      </div>
    </div>
  );
}

/** Barra fixa do celular: resumo de uma linha + botão da etapa. */
export function BarraResumoCelular({
  pedido: p,
  rotulo,
  onAvancar,
  desativado,
}: {
  pedido: Pedido;
  rotulo: string;
  onAvancar: () => void;
  desativado?: boolean;
}) {
  const suite = p.suite ? getAcomodacao(p.suite) : undefined;
  const noites = p.entrada && p.saida ? noitesEntre(p.entrada, p.saida) : 0;
  const datas =
    p.entrada && p.saida
      ? `${dataCurta(p.entrada)} a ${dataCurta(p.saida)}`
      : p.entrada
        ? `a partir de ${dataCurta(p.entrada)}`
        : null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_-18px_rgba(20,14,12,0.35)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 sm:px-8">
        <p className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[0.88rem] font-semibold">{suite?.nome ?? "Monte seu pedido"}</span>
          {datas && (
            <span className="mt-0.5 block truncate text-[0.76rem] text-muted-foreground">
              {datas}
              {noites > 0 && <span className="max-sm:hidden"> · {plural(noites, "noite", "noites")}</span>}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={onAvancar}
          disabled={desativado}
          className="btn-base btn-primary shrink-0 whitespace-nowrap px-5! py-3! disabled:opacity-45 max-[359px]:px-4! max-[359px]:text-[0.72rem]!"
        >
          {rotulo}
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
