import { createFileRoute } from "@tanstack/react-router";
import {
  Ban,
  CalendarCheck,
  CalendarDays,
  Clock,
  CreditCard,
  Repeat,
  type LucideIcon,
} from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { ContatoDuvidas, IndicePagina, ParteNumerada } from "@/components/site/PaginaInformativa";
import { capas } from "@/data/capas";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   POLÍTICA DE CANCELAMENTO: /politica-de-cancelamento

   Todo o conteúdo da página atual do site (pousadabellavista.com.br/
   politica-de-cancelamento), sem cortes e sem travessões no texto.

   Página séria e compacta, sem animações além das do cabeçalho padrão:
     • cabeçalho padrão das páginas (PageHero) com um resumo das regras;
     • 01 Cancelamento e remarcação: uma linha do tempo até o check-in
       (antes e depois dos 7 dias) e as três regras;
     • 02 Crédito para uso futuro: os 180 dias em destaque e as três regras;
     • 03 Saída antecipada: os 50% em destaque;
     • no fim, contato pelo WhatsApp e link para o FAQ.
   No desktop, um índice fixo à esquerda leva a cada parte.
   ──────────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute("/politica-de-cancelamento")({
  head: () =>
    seo({
      titulo: "Política de cancelamento | Bella Vista Pousada Familiar",
      descricao: "Prazos de cancelamento, reembolso, remarcação de datas, crédito para uso futuro e saída antecipada na Bella Vista Pousada Familiar, no Vale dos Vinhedos.",
      caminho: "/politica-de-cancelamento",
      imagem: "/og/politica-de-cancelamento.jpg",
      imagemAlt: "Vista aérea da Bella Vista Pousada Familiar e do jardim",
      descricaoSocial: "As condições para cancelar ou alterar a sua reserva, de forma clara.",
    }),
  component: PoliticaDeCancelamentoPage,
});

interface Regra {
  icon: LucideIcon;
  titulo: string;
  texto: string;
}

const CANCELAMENTO: Regra[] = [
  {
    icon: CalendarCheck,
    titulo: "Mais de 7 dias de antecedência",
    texto:
      "Cancelamentos solicitados com mais de 7 dias de antecedência ao check-in garantem reembolso integral do valor pago.",
  },
  {
    icon: Clock,
    titulo: "7 dias ou menos antes do check-in",
    texto:
      "Cancelamentos realizados dentro desse período resultam na retenção de 100% do valor pago, não havendo reembolso.",
  },
  {
    icon: Repeat,
    titulo: "Remarcação de datas",
    texto:
      "Sempre que possível, priorizamos a remarcação da data da estadia antes da efetivação do cancelamento.",
  },
];

const CREDITO: Regra[] = [
  {
    icon: CreditCard,
    titulo: "Geração de crédito",
    texto:
      "Cancelamentos realizados com mais de 7 dias de antecedência poderão gerar crédito no valor pago, válido por até 180 dias, como alternativa ao reembolso.",
  },
  {
    icon: CalendarDays,
    titulo: "Utilização do crédito",
    texto:
      "O crédito será abatido do valor total da nova reserva, respeitando o tarifário vigente no momento da nova confirmação.",
  },
  {
    icon: Ban,
    titulo: "Remarcação já utilizada",
    texto:
      "Caso a reserva já tenha sido objeto de remarcação, um novo pedido de cancelamento não gerará novo crédito nem nova remarcação, sendo considerado definitivo.",
  },
];

const PARTES = [
  { id: "cancelamento", titulo: "Cancelamento e remarcação" },
  { id: "credito", titulo: "Crédito para uso futuro" },
  { id: "saida-antecipada", titulo: "Saída antecipada" },
];

const RESUMO = [
  { valor: "+7 dias", texto: "antes do check-in: reembolso integral" },
  { valor: "7 dias", texto: "ou menos: sem reembolso" },
  { valor: "180 dias", texto: "de validade para o crédito" },
];

function PoliticaDeCancelamentoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        image={capas.politicaDeCancelamento}
        imageAlt="Vista aérea da Bella Vista Pousada Familiar, com as casas, o deck e o jardim"
        trail={[{ label: "Política de cancelamento" }]}
        eyebrow="Políticas da pousada"
        title={
          <>
            Política de cancelamento <span className="text-white/60">e alterações.</span>
          </>
        }
        aside={
          // resumo das regras, para quem só quer o essencial
          <dl className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/15 bg-ink/55 backdrop-blur-md">
            {RESUMO.map((r, i) => (
              <div key={r.valor} className={`px-4 py-5 sm:px-5 ${i > 0 ? "border-l border-white/12" : ""}`}>
                <dt className="font-display text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
                  {r.valor}
                </dt>
                <dd className="mt-1.5 text-[0.78rem] leading-snug text-white/70">{r.texto}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <p className="mt-6 max-w-[48ch] text-[1.05rem] leading-relaxed text-white/80">
          Cancelamentos e alterações de reservas devem ser solicitados conforme as condições abaixo,
          considerando sempre a data prevista para o check-in.
        </p>
      </PageHero>

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:grid lg:grid-cols-12 lg:gap-12 lg:px-10">
        <IndicePagina partes={PARTES} />

        <div className="space-y-16 md:space-y-20 lg:col-span-9">
          {/* ── 01 Cancelamento e remarcação ─────────────────────────────── */}
          <ParteNumerada numero={1} id="cancelamento" titulo="Cancelamento e remarcação">
            {/* linha do tempo até o check-in */}
            <figure
              aria-label="Linha do tempo do cancelamento até o check-in"
              className="mt-8 rounded-2xl border border-foreground/10 bg-cream/60 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between text-[0.66rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                <span>Reserva</span>
                <span className="text-foreground">Check-in</span>
              </div>

              <div className="relative mt-3 flex h-2 overflow-visible rounded-full">
                <span className="flex-[3] rounded-l-full bg-wine/20" />
                <span className="flex-[2] rounded-r-full bg-wine" />
                {/* marco dos 7 dias */}
                <span
                  aria-hidden
                  className="absolute top-1/2 left-[60%] size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-cream bg-wine shadow-sm"
                />
                <span
                  aria-hidden
                  className="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
                />
              </div>
              <p className="relative mt-2 h-4 text-[0.7rem] font-semibold text-wine">
                <span className="absolute left-[60%] -translate-x-1/2 whitespace-nowrap">
                  7 dias antes
                </span>
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-5 sm:gap-8">
                <div className="sm:col-span-3">
                  <p className="text-[0.98rem] font-semibold">Mais de 7 dias de antecedência</p>
                  <p className="mt-1 text-[0.92rem] leading-relaxed text-muted-foreground">
                    Reembolso integral do valor pago, ou crédito para uso futuro.
                  </p>
                </div>
                <div className="border-t border-foreground/10 pt-6 sm:col-span-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
                  <p className="text-[0.98rem] font-semibold text-wine">7 dias ou menos</p>
                  <p className="mt-1 text-[0.92rem] leading-relaxed text-muted-foreground">
                    Retenção de 100% do valor pago, sem reembolso.
                  </p>
                </div>
              </div>
            </figure>

            <Regras regras={CANCELAMENTO} />
          </ParteNumerada>

          {/* ── 02 Crédito para uso futuro ──────────────────────────────── */}
          <ParteNumerada numero={2} id="credito" titulo="Crédito para uso futuro">
            <div className="mt-8 grid gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-4">
                <div className="rounded-2xl bg-wine p-7 text-white">
                  <p className="text-[0.66rem] font-semibold tracking-[0.22em] text-white/65 uppercase">
                    Validade do crédito
                  </p>
                  <p className="mt-3 font-display text-6xl leading-none font-bold tracking-[-0.04em]">
                    180
                  </p>
                  <p className="mt-2 text-[0.95rem] text-white/80">dias de validade, como alternativa ao reembolso</p>
                </div>
              </div>
              <div className="md:col-span-8">
                <Regras regras={CREDITO} semMargem />
              </div>
            </div>
          </ParteNumerada>

          {/* ── 03 Saída antecipada ─────────────────────────────────────── */}
          <ParteNumerada numero={3} id="saida-antecipada" titulo="Saída antecipada">
            <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-foreground/10 p-7 sm:flex-row sm:items-center sm:gap-10 sm:p-8">
              <p className="shrink-0 font-display text-6xl leading-none font-bold tracking-[-0.04em] text-wine">
                50%
              </p>
              <p className="max-w-[52ch] text-[1rem] leading-relaxed text-muted-foreground sm:border-l sm:border-foreground/10 sm:pl-10">
                Em caso de saída antecipada por decisão do hóspede, será cobrada taxa
                correspondente a{" "}
                <span className="font-semibold text-foreground">
                  50% das diárias não utilizadas
                </span>
                .
              </p>
            </div>
          </ParteNumerada>
        </div>
      </main>

      <ContatoDuvidas
        titulo="Ficou com alguma dúvida sobre a política de cancelamento?"
        texto="Em caso de dúvidas ou situações específicas, entre em contato com a nossa equipe."
      />

      <Footer />
      <WhatsappButton />
    </div>
  );
}

function Regras({ regras, semMargem = false }: { regras: Regra[]; semMargem?: boolean }) {
  return (
    <ul className={`${semMargem ? "" : "mt-4"} divide-y divide-foreground/10`}>
      {regras.map(({ icon: Icon, titulo, texto }) => (
        <li key={titulo} className="flex gap-5 py-6 first:pt-4 last:pb-0 sm:gap-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-wine/20 bg-wine/[0.04] text-wine">
            <Icon aria-hidden className="size-[1.1rem]" strokeWidth={1.6} />
          </span>
          <div className="pt-1">
            <h3 className="text-[1.02rem] font-semibold tracking-[-0.01em]">{titulo}</h3>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted-foreground">{texto}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
