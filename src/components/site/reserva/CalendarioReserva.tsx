import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import {
  DIAS_DA_SEMANA,
  DIAS_DA_SEMANA_NOMES,
  dataCurta,
  dataLonga,
  deISO,
  hoje,
  noitesEntre,
  nomeDoMes,
  paraISO,
  plural,
  primeiroDoMes,
  semanasDoMes,
  somarDias,
  somarMeses,
  type DiaISO,
} from "@/lib/reservas/datas";
import {
  minimoNoites,
  primeiroDiaReservavel,
  proximaNoiteOcupada,
  ultimoDiaReservavel,
} from "@/lib/reservas/disponibilidade";
import { REGRAS } from "@/data/reservas";

/* ─────────────────────────────────────────────────────────────────────────────
   CALENDÁRIO DE PERÍODO (entrada e saída)

   Feito do zero para seguir a lógica de hotelaria: o que se reserva são as
   NOITES. Por isso um dia cuja noite está ocupada não pode ser entrada, mas
   pode ser a SAÍDA de quem chega antes (sai de manhã, outro hóspede entra à
   tarde).

   • 1º clique: entrada. 2º clique: saída. Clicar antes da entrada troca a
     entrada; clicar de novo depois de completo recomeça.
   • Enquanto escolhe a saída, o período aparece em prévia ao passar o mouse
     (ou o foco), e ficam desativados os dias abaixo do mínimo de noites e os
     que atravessariam uma noite ocupada.
   • Teclado: setas movem o dia, Home/End vão ao início/fim da semana,
     PageUp/PageDown trocam de mês, Enter/Espaço escolhem.
   • Desktop mostra dois meses; celular, um, com deslizar para os lados.
   ──────────────────────────────────────────────────────────────────────── */

type Estado =
  | "fora" // antes de hoje/antecedência ou além da janela
  | "ocupado" // noite ocupada (não pode ser entrada)
  | "bloqueado" // não serve como saída para a entrada escolhida
  | "livre";

export function CalendarioReserva({
  ocupadas,
  entrada,
  saida,
  onChange,
}: {
  ocupadas: Set<DiaISO>;
  entrada: DiaISO | null;
  saida: DiaISO | null;
  onChange: (entrada: DiaISO | null, saida: DiaISO | null) => void;
}) {
  const primeiro = primeiroDiaReservavel();
  const ultimo = ultimoDiaReservavel();
  const mesMinimo = primeiroDoMes(primeiro);
  const mesMaximo = primeiroDoMes(ultimo);

  const [mes, setMes] = useState<DiaISO>(() => primeiroDoMes(entrada ?? primeiro));
  const [foco, setFoco] = useState<DiaISO>(() => entrada ?? primeiro);
  const [previa, setPrevia] = useState<DiaISO | null>(null);
  const grade = useRef<HTMLDivElement>(null);
  const moverFoco = useRef(false);
  const toqueX = useRef<number | null>(null);

  // quantos meses aparecem lado a lado (2 no desktop, 1 no celular)
  const [doisMeses, setDoisMeses] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const atualizar = () => setDoisMeses(mq.matches);
    atualizar();
    mq.addEventListener("change", atualizar);
    return () => mq.removeEventListener("change", atualizar);
  }, []);
  const ultimoMesVisivel = doisMeses ? somarMeses(mes, 1) : mes;

  const escolhendoSaida = Boolean(entrada && !saida);
  const limiteSaida = useMemo(
    () => (entrada && escolhendoSaida ? proximaNoiteOcupada(entrada, ocupadas) : null),
    [entrada, escolhendoSaida, ocupadas],
  );
  const minimo = entrada ? minimoNoites(entrada) : null;

  function podeEntrar(d: DiaISO) {
    return d >= primeiro && d < ultimo && !ocupadas.has(d);
  }

  function podeSair(d: DiaISO) {
    if (!entrada || d <= entrada || d > ultimo) return false;
    if (limiteSaida && d > limiteSaida) return false;
    const n = noitesEntre(entrada, d);
    return n >= (minimo?.noites ?? 1) && n <= REGRAS.maximoNoites;
  }

  function estado(d: DiaISO): Estado {
    if (d < primeiro || d > ultimo || (d === ultimo && !escolhendoSaida)) return "fora";
    if (escolhendoSaida && entrada && d > entrada) {
      if (podeSair(d)) return "livre";
      return ocupadas.has(d) ? "ocupado" : "bloqueado";
    }
    return ocupadas.has(d) ? "ocupado" : "livre";
  }

  function escolher(d: DiaISO) {
    if (escolhendoSaida && entrada && d > entrada) {
      if (podeSair(d)) {
        onChange(entrada, d);
        setPrevia(null);
        return;
      }
      if (podeEntrar(d)) onChange(d, null);
      return;
    }
    if (podeEntrar(d)) onChange(d, null);
  }

  // mantém o mês visível acompanhando o foco do teclado
  function focar(d: DiaISO) {
    const alvo = d < primeiro ? primeiro : d > ultimo ? ultimo : d;
    setFoco(alvo);
    const m = primeiroDoMes(alvo);
    if (m < mes) setMes(m);
    else if (m > ultimoMesVisivel) setMes(doisMeses ? somarMeses(m, -1) : m);
    moverFoco.current = true;
  }

  useEffect(() => {
    if (!moverFoco.current) return;
    moverFoco.current = false;
    grade.current?.querySelector<HTMLButtonElement>(`[data-dia="${foco}"]`)?.focus();
  }, [foco, mes]);

  function teclado(e: KeyboardEvent<HTMLDivElement>) {
    const passos: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in passos) {
      e.preventDefault();
      focar(somarDias(foco, passos[e.key]!));
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const dow = deISO(foco).getDay();
      focar(somarDias(foco, e.key === "Home" ? -dow : 6 - dow));
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const d = deISO(foco);
      d.setMonth(d.getMonth() + (e.key === "PageUp" ? -1 : 1));
      focar(paraISO(d));
    }
  }

  const podeVoltar = mes > mesMinimo;
  const podeAvancar = ultimoMesVisivel < mesMaximo;
  // dia que recebe o Tab dentro da grade (só um, como pede o padrão de grade)
  const diaTabulavel = foco >= mes && primeiroDoMes(foco) <= ultimoMesVisivel ? foco : mes;
  const fimPrevia = saida ?? (escolhendoSaida && previa && podeSair(previa) ? previa : null);

  const meses = [mes, somarMeses(mes, 1)];
  const hojeISO = hoje();

  const instrucao = !entrada
    ? "Escolha a data de entrada"
    : !saida
      ? `Agora a data de saída${minimo && minimo.noites > 1 ? ` (mínimo de ${minimo.noites} noites${minimo.motivo ? `, ${minimo.motivo}` : ""})` : ""}`
      : `${dataCurta(entrada)} a ${dataCurta(saida)}, ${plural(noitesEntre(entrada, saida), "noite", "noites")}`;

  return (
    <div>
      {/* cabeçalho: instrução + navegação */}
      <div className="flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-[0.95rem] font-semibold">
          {instrucao}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {(entrada || saida) && (
            <button
              type="button"
              onClick={() => onChange(null, null)}
              className="mr-1 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.78rem] font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <RotateCcw aria-hidden className="size-3.5" />
              Limpar
            </button>
          )}
          <button
            type="button"
            onClick={() => setMes(somarMeses(mes, -1))}
            disabled={!podeVoltar}
            aria-label="Mês anterior"
            className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-foreground/5 disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setMes(somarMeses(mes, 1))}
            disabled={!podeAvancar}
            aria-label="Próximo mês"
            className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-foreground/5 disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      {/* meses */}
      <div
        ref={grade}
        onKeyDown={teclado}
        onMouseLeave={() => setPrevia(null)}
        onTouchStart={(e) => {
          toqueX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const ini = toqueX.current;
          const fim = e.changedTouches[0]?.clientX;
          toqueX.current = null;
          if (ini == null || fim == null || Math.abs(fim - ini) < 60) return;
          if (fim < ini && podeAvancar) setMes(somarMeses(mes, 1));
          if (fim > ini && podeVoltar) setMes(somarMeses(mes, -1));
        }}
        className="mt-6 grid gap-10 lg:grid-cols-2"
      >
        {meses.map((m, i) => (
          <div key={m} className={i === 1 ? "hidden lg:block" : ""}>
            <h3 className="text-center text-[0.95rem] font-semibold tracking-normal">
              {nomeDoMes(m)}
            </h3>
            <table role="grid" aria-label={nomeDoMes(m)} className="mt-4 w-full border-separate border-spacing-x-0 border-spacing-y-1">
              <thead>
                <tr>
                  {DIAS_DA_SEMANA.map((d, k) => (
                    <th
                      key={k}
                      scope="col"
                      abbr={DIAS_DA_SEMANA_NOMES[k]}
                      className="pb-2 text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground"
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {semanasDoMes(m).map((semana, s) => (
                  <tr key={s}>
                    {semana.map((dia, k) => {
                      if (!dia) return <td key={k} />;
                      const est = estado(dia);
                      const ehEntrada = dia === entrada;
                      const ehSaida = dia === fimPrevia;
                      const noMeio = Boolean(entrada && fimPrevia && dia > entrada && dia < fimPrevia);
                      const prevendo = !saida && (noMeio || ehSaida);
                      const desativado = est !== "livre";
                      const focavel = dia === diaTabulavel;

                      const rotulo = [
                        dataLonga(dia),
                        ehEntrada ? "entrada escolhida" : null,
                        dia === saida ? "saída escolhida" : null,
                        est === "ocupado" ? "indisponível" : null,
                        est === "bloqueado" && minimo && entrada && noitesEntre(entrada, dia) < minimo.noites
                          ? `abaixo do mínimo de ${minimo.noites} noites`
                          : est === "bloqueado"
                            ? "indisponível para este período"
                            : null,
                        est === "fora" ? "fora do período de reservas" : null,
                      ]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <td
                          key={k}
                          className={`relative p-0 ${
                            noMeio || (ehEntrada && fimPrevia) || (ehSaida && entrada)
                              ? prevendo
                                ? "bg-wine/[0.06]"
                                : "bg-wine/10"
                              : ""
                          } ${ehEntrada && fimPrevia ? "rounded-l-full" : ""} ${ehSaida && entrada ? "rounded-r-full" : ""}`}
                        >
                          <button
                            type="button"
                            data-dia={dia}
                            tabIndex={focavel ? 0 : -1}
                            aria-label={rotulo}
                            aria-pressed={ehEntrada || dia === saida}
                            aria-disabled={desativado || undefined}
                            onClick={() => !desativado && escolher(dia)}
                            onMouseEnter={() => escolhendoSaida && setPrevia(dia)}
                            onFocus={() => {
                              setFoco(dia);
                              if (escolhendoSaida) setPrevia(dia);
                            }}
                            className={`relative mx-auto grid aspect-square w-full max-w-12 place-items-center rounded-full text-[0.9rem] tabular-nums transition-colors outline-none focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2 ${
                              ehEntrada || dia === saida
                                ? "bg-wine font-semibold text-primary-foreground"
                                : ehSaida
                                  ? "border border-wine font-semibold text-wine"
                                  : est === "livre"
                                    ? "font-medium hover:bg-foreground/[0.06]"
                                    : est === "ocupado"
                                      ? "cursor-not-allowed text-muted-foreground/50 line-through decoration-muted-foreground/40"
                                      : "cursor-not-allowed text-muted-foreground/40"
                            }`}
                          >
                            {deISO(dia).getDate()}
                            {dia === hojeISO && !ehEntrada && dia !== saida && (
                              <span aria-hidden className="absolute bottom-1.5 size-1 rounded-full bg-wine" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* legenda */}
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.78rem] text-muted-foreground">
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-3 rounded-full bg-wine" />
          Selecionado
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-6 rounded-full bg-wine/10" />
          Seu período
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="text-[0.8rem] text-muted-foreground/60 line-through">
            12
          </span>
          Indisponível
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-1 rounded-full bg-wine" />
          Hoje
        </li>
      </ul>
    </div>
  );
}
