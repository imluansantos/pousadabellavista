import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Copy, MessageCircle, RotateCcw } from "lucide-react";
import { getAcomodacao } from "@/data/acomodacoes";
import { ADICIONAIS, AVISOS, HORARIOS } from "@/data/reservas";
import { dataLonga, noitesEntre, plural } from "@/lib/reservas/datas";
import { linkWhatsapp, montarMensagem, textoHospedes, type Etapa, type Pedido } from "@/lib/reservas/pedido";

/* Etapa 4: revisão completa do pedido (cada bloco com "Alterar"), aviso do
   sinal, aceite das regras e a prévia exata da mensagem que vai para o
   WhatsApp. */

export function EtapaRevisao({
  pedido: p,
  atualizar,
  irPara,
  erroAceite,
}: {
  pedido: Pedido;
  atualizar: (parcial: Partial<Pedido>) => void;
  irPara: (etapa: Etapa) => void;
  erroAceite: boolean;
}) {
  const suite = p.suite ? getAcomodacao(p.suite) : undefined;
  const noites = p.entrada && p.saida ? noitesEntre(p.entrada, p.saida) : 0;
  const adicionais = ADICIONAIS.filter((a) => p.adicionais.includes(a.id));
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(montarMensagem(p));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* sem permissão de área de transferência */
    }
  }

  return (
    <div className="space-y-8">
      <div className="divide-y divide-foreground/10 border-y border-foreground/10">
        <Bloco titulo="Suíte" onAlterar={() => irPara("suite")}>
          {suite?.nome}
        </Bloco>
        <Bloco titulo="Datas" onAlterar={() => irPara("datas")}>
          {p.entrada && p.saida && (
            <>
              <span className="block">
                Entrada: <span className="font-medium">{dataLonga(p.entrada)}</span>, <span className="whitespace-nowrap">a partir das {HORARIOS.checkIn}</span>
              </span>
              <span className="block">
                Saída: <span className="font-medium">{dataLonga(p.saida)}</span>, <span className="whitespace-nowrap">até {HORARIOS.checkOut}</span>
              </span>
              <span className="mt-1 block text-muted-foreground">{plural(noites, "noite", "noites")}</span>
            </>
          )}
        </Bloco>
        <Bloco titulo="Hóspedes" onAlterar={() => irPara("hospedes")}>
          {textoHospedes(p)}
          {p.pet ? ", com pet" : ""}
          {adicionais.length > 0 && (
            <span className="mt-1 block text-muted-foreground">
              Interesse em: {adicionais.map((a) => a.titulo).join(", ")}
            </span>
          )}
        </Bloco>
        <Bloco titulo="Contato" onAlterar={() => irPara("hospedes")}>
          <span className="block">{p.nome}</span>
          <span className="block text-muted-foreground">
            {p.telefone}
            {p.email ? ` · ${p.email}` : ""}
          </span>
          {p.chegada && <span className="block text-muted-foreground">Chegada prevista: {p.chegada}</span>}
          {p.observacoes && <span className="mt-1 block text-muted-foreground">“{p.observacoes}”</span>}
        </Bloco>
      </div>

      {/* como funciona */}
      <div className="rounded-2xl bg-cream p-5 sm:p-6">
        <p className="text-[0.95rem] font-semibold">Como funciona a partir daqui</p>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[
            ["Você envia o pedido", "A mensagem já vai pronta para o nosso WhatsApp, com o código do pedido."],
            ["Confirmamos as datas", "A equipe verifica a disponibilidade e responde com os dados do sinal."],
            ["Reserva confirmada", AVISOS.sinal],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-wine text-[0.75rem] font-bold text-white">
                {i + 1}
              </span>
              <span>
                <span className="block text-[0.88rem] font-semibold">{t}</span>
                <span className="mt-0.5 block text-[0.8rem] leading-relaxed text-muted-foreground">{d}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* aceite */}
      <div>
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-wine ${
            erroAceite && !p.aceite ? "border-destructive" : "border-border"
          }`}
        >
          <input
            type="checkbox"
            checked={p.aceite}
            onChange={(e) => atualizar({ aceite: e.target.checked })}
            aria-invalid={erroAceite && !p.aceite}
            className="mt-1 size-4 accent-[var(--wine)]"
          />
          <span className="text-[0.88rem] leading-relaxed">
            Li e concordo com as{" "}
            <Link to="/politicas-e-regras" target="_blank" className="font-medium text-wine underline decoration-wine/30 underline-offset-4">
              regras da pousada
            </Link>{" "}
            e a{" "}
            <Link to="/politica-de-cancelamento" target="_blank" className="font-medium text-wine underline decoration-wine/30 underline-offset-4">
              política de cancelamento
            </Link>
            .
          </span>
        </label>
        {erroAceite && !p.aceite && (
          <p role="alert" className="mt-1.5 text-[0.78rem] font-medium text-destructive">
            Para enviar o pedido, confirme que leu as regras.
          </p>
        )}
      </div>

      {/* prévia da mensagem */}
      <details className="group rounded-xl border border-border">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-[0.88rem] font-medium [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <MessageCircle aria-hidden className="size-4 text-wine" />
            Ver a mensagem que será enviada
          </span>
          <span aria-hidden className="text-muted-foreground transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="border-t border-border p-4">
          <pre className="max-h-72 overflow-auto rounded-lg bg-[#efeae2] p-4 font-sans text-[0.82rem] leading-relaxed whitespace-pre-wrap text-ink">
            {montarMensagem(p)}
          </pre>
          <button
            type="button"
            onClick={copiar}
            className="mt-3 inline-flex items-center gap-2 text-[0.8rem] font-medium text-wine"
          >
            {copiado ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
            {copiado ? "Mensagem copiada" : "Copiar mensagem"}
          </button>
        </div>
      </details>
    </div>
  );
}

function Bloco({ titulo, onAlterar, children }: { titulo: string; onAlterar: () => void; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1.5 py-4 text-[0.9rem] sm:grid-cols-[7rem_1fr_auto]">
      <p className="pt-0.5 text-[0.72rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">{titulo}</p>
      <div className="col-span-2 min-w-0 leading-relaxed sm:col-span-1 sm:col-start-2 sm:row-start-1">{children}</div>
      <button
        type="button"
        onClick={onAlterar}
        className="col-start-2 row-start-1 justify-self-end text-[0.8rem] font-medium text-wine underline decoration-wine/30 underline-offset-4 hover:decoration-wine sm:col-start-3"
      >
        Alterar
      </button>
    </div>
  );
}

/* Tela final, depois de abrir o WhatsApp. */
export function PedidoEnviado({ pedido: p, onNovo }: { pedido: Pedido; onNovo: () => void }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-wine/10 text-wine">
        <Check className="size-8" strokeWidth={2} />
      </span>
      <p className="eyebrow mt-6">Pedido {p.codigo}</p>
      <h2 className="mt-3 font-display text-[2rem] leading-tight sm:text-[2.4rem]">Seu pedido está a caminho.</h2>
      <p className="mx-auto mt-4 max-w-[46ch] text-[1rem] leading-relaxed text-muted-foreground">
        Abrimos o WhatsApp com a mensagem pronta. Se ela não foi enviada, é só tocar no botão abaixo. Assim que
        confirmarmos as datas, respondemos com os dados do sinal.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a href={linkWhatsapp(p)} target="_blank" rel="noreferrer" className="btn-base btn-primary">
          Abrir o WhatsApp de novo
          <ArrowUpRight className="size-3.5" />
        </a>
        <button type="button" onClick={onNovo} className="btn-base btn-outline">
          <RotateCcw aria-hidden className="size-3.5" />
          Fazer outro pedido
        </button>
      </div>
      <p className="mt-8 text-[0.8rem] text-muted-foreground">
        Guarde o código <span className="font-semibold text-foreground">{p.codigo}</span> para falar sobre este pedido.
      </p>
    </div>
  );
}
