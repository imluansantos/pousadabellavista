import type { ReactNode } from "react";
import { Minus, PawPrint, Plus } from "lucide-react";
import { ADICIONAIS, AVISOS, HORARIOS_CHEGADA } from "@/data/reservas";
import { capacidadeDa } from "@/lib/reservas/disponibilidade";
import { mascaraTelefone, type ErrosContato, type Pedido } from "@/lib/reservas/pedido";

/* Etapa 3: quem vem (adultos, crianças com idade, pet), adicionais e os
   dados de contato. A capacidade respeita o limite da suíte (ou o padrão,
   enquanto não confirmado). Os erros aparecem ao tentar continuar. */

export function EtapaHospedes({
  pedido: p,
  atualizar,
  erros,
}: {
  pedido: Pedido;
  atualizar: (parcial: Partial<Pedido>) => void;
  erros: ErrosContato;
}) {
  const cap = capacidadeDa(p.suite ?? "");
  const total = p.adultos + p.criancas.length;

  return (
    <div className="space-y-12">
      {/* quem vem */}
      <section aria-labelledby="hospedes-quem">
        <h3 id="hospedes-quem" className="text-[1.05rem] font-semibold tracking-normal">
          Quem vem
        </h3>
        <div className="mt-4 divide-y divide-foreground/10 border-y border-foreground/10">
          <Contador
            titulo="Adultos"
            ajuda="A partir de 18 anos"
            valor={p.adultos}
            min={1}
            max={cap.maximo - p.criancas.length}
            onChange={(n) => atualizar({ adultos: n })}
          />
          <Contador
            titulo="Crianças"
            ajuda="Até 17 anos"
            valor={p.criancas.length}
            min={0}
            max={cap.maximo - p.adultos}
            onChange={(n) =>
              atualizar({
                criancas:
                  n > p.criancas.length
                    ? [...p.criancas, null]
                    : p.criancas.slice(0, n),
              })
            }
          />
        </div>

        {p.criancas.length > 0 && (
          <div className="mt-5 rounded-xl bg-cream p-4 sm:p-5">
            <p className="text-[0.85rem] font-medium">Idade de cada criança</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {p.criancas.map((idade, i) => (
                <label key={i} className="block">
                  <span className="text-[0.75rem] text-muted-foreground">Criança {i + 1}</span>
                  <select
                    value={idade ?? ""}
                    onChange={(e) => {
                      const nova = [...p.criancas];
                      nova[i] = e.target.value === "" ? null : Number(e.target.value);
                      atualizar({ criancas: nova });
                    }}
                    aria-invalid={idade === null && Boolean(erros.criancas)}
                    className="campo mt-1"
                  >
                    <option value="">Selecione</option>
                    <option value={0}>Menos de 1 ano</option>
                    {Array.from({ length: 17 }, (_, k) => k + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "ano" : "anos"}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            {erros.criancas && <Erro>{erros.criancas}</Erro>}
            <p className="mt-3 text-[0.8rem] leading-relaxed text-muted-foreground">{AVISOS.criancas}</p>
          </div>
        )}

        <p className="mt-3 text-[0.78rem] text-muted-foreground">
          {total} de até {cap.maximo} hóspedes
          {cap.confirmada ? "" : ". A capacidade final é confirmada no atendimento."}
        </p>

        <label className="mt-6 flex cursor-pointer items-start gap-4 rounded-xl border border-border p-4 transition-colors has-[:checked]:border-wine has-[:checked]:bg-wine/[0.04] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-wine">
          <input
            type="checkbox"
            checked={p.pet}
            onChange={(e) => atualizar({ pet: e.target.checked })}
            className="mt-1 size-4 accent-[var(--wine)]"
          />
          <span>
            <span className="flex items-center gap-2 text-[0.95rem] font-medium">
              <PawPrint aria-hidden className="size-4 text-wine" strokeWidth={1.75} />
              Vou levar meu pet
            </span>
            <span className="mt-0.5 block text-[0.82rem] text-muted-foreground">{AVISOS.pet}</span>
          </span>
        </label>
      </section>

      {/* adicionais */}
      <section aria-labelledby="hospedes-adicionais">
        <h3 id="hospedes-adicionais" className="text-[1.05rem] font-semibold tracking-normal">
          Para deixar a estadia especial
        </h3>
        <p className="mt-1 text-[0.85rem] text-muted-foreground">
          Opcional. A equipe confirma os detalhes e valores no atendimento.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ADICIONAIS.map((a) => {
            const marcado = p.adicionais.includes(a.id);
            return (
              <label
                key={a.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors has-[:checked]:border-wine has-[:checked]:bg-wine/[0.04] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-wine"
              >
                <input
                  type="checkbox"
                  checked={marcado}
                  onChange={() =>
                    atualizar({
                      adicionais: marcado ? p.adicionais.filter((x) => x !== a.id) : [...p.adicionais, a.id],
                    })
                  }
                  className="mt-1 size-4 accent-[var(--wine)]"
                />
                <span>
                  <span className="block text-[0.95rem] font-medium">{a.titulo}</span>
                  <span className="mt-0.5 block text-[0.82rem] leading-snug text-muted-foreground">{a.texto}</span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* contato */}
      <section aria-labelledby="hospedes-contato">
        <h3 id="hospedes-contato" className="text-[1.05rem] font-semibold tracking-normal">
          Seus dados
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Nome completo" erro={erros.nome} className="sm:col-span-2">
            <input
              type="text"
              autoComplete="name"
              value={p.nome}
              onChange={(e) => atualizar({ nome: e.target.value })}
              aria-invalid={Boolean(erros.nome)}
              className="campo"
            />
          </Campo>
          <Campo rotulo="WhatsApp" erro={erros.telefone}>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(54) 99999-9999"
              value={p.telefone}
              onChange={(e) => atualizar({ telefone: mascaraTelefone(e.target.value) })}
              aria-invalid={Boolean(erros.telefone)}
              className="campo"
            />
          </Campo>
          <Campo rotulo="E-mail (opcional)" erro={erros.email}>
            <input
              type="email"
              autoComplete="email"
              value={p.email}
              onChange={(e) => atualizar({ email: e.target.value })}
              aria-invalid={Boolean(erros.email)}
              className="campo"
            />
          </Campo>
          <Campo rotulo="Chegada prevista (opcional)">
            <select value={p.chegada} onChange={(e) => atualizar({ chegada: e.target.value })} className="campo">
              <option value="">Selecione</option>
              {HORARIOS_CHEGADA.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Observações (opcional)" className="sm:col-span-2">
            <textarea
              rows={3}
              value={p.observacoes}
              onChange={(e) => atualizar({ observacoes: e.target.value })}
              placeholder="Ocasião especial, necessidade de acessibilidade, dúvidas…"
              className="campo resize-y"
            />
          </Campo>
        </div>
      </section>
    </div>
  );
}

function Contador({
  titulo,
  ajuda,
  valor,
  min,
  max,
  onChange,
}: {
  titulo: string;
  ajuda: string;
  valor: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-[0.95rem] font-medium">{titulo}</p>
        <p className="text-[0.8rem] text-muted-foreground">{ajuda}</p>
      </div>
      <div className="flex items-center gap-3" role="group" aria-label={titulo}>
        <button
          type="button"
          onClick={() => onChange(valor - 1)}
          disabled={valor <= min}
          aria-label={`Menos ${titulo.toLowerCase()}`}
          className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-foreground/40 disabled:pointer-events-none disabled:opacity-35"
        >
          <Minus className="size-4" />
        </button>
        <output aria-live="polite" className="w-6 text-center text-[1.05rem] font-semibold tabular-nums">
          {valor}
        </output>
        <button
          type="button"
          onClick={() => onChange(valor + 1)}
          disabled={valor >= max}
          aria-label={`Mais ${titulo.toLowerCase()}`}
          className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-foreground/40 disabled:pointer-events-none disabled:opacity-35"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

function Campo({
  rotulo,
  erro,
  className = "",
  children,
}: {
  rotulo: string;
  erro?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[0.82rem] font-medium">{rotulo}</span>
      <span className="mt-1.5 block">{children}</span>
      {erro && <Erro>{erro}</Erro>}
    </label>
  );
}

function Erro({ children }: { children: ReactNode }) {
  return (
    <span role="alert" className="mt-1.5 block text-[0.78rem] font-medium text-destructive">
      {children}
    </span>
  );
}
