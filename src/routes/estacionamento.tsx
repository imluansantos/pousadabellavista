import { createFileRoute } from "@tanstack/react-router";
import {
  Car,
  Clock,
  KeyRound,
  MapPin,
  ScrollText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { ConsulteTambem, ContatoDuvidas } from "@/components/site/PaginaInformativa";
import { TODAS_PERGUNTAS } from "@/data/faq";
import imgEstacionamento from "@/assets/paginas/estacionamento.webp";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   ESTACIONAMENTO: /estacionamento

   Todo o conteúdo da página atual do site (pousadabellavista.com.br/
   estacionamento), sem travessões no texto, mais as duas respostas do FAQ
   que tratam do mesmo assunto (acesso ao portão e segurança), puxadas de
   src/data/faq.ts para nunca ficarem diferentes do FAQ.

   Página curta e sóbria:
     • cabeçalho padrão das páginas (PageHero) com "1 vaga por acomodação";
     • a frase da vaga e os três diferenciais da página atual;
     • "Bom saber": portão e segurança (do FAQ);
     • "Consulte também" e o contato.
   ──────────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute("/estacionamento")({
  head: () =>
    seo({
      titulo: "Estacionamento | Bella Vista Pousada Familiar",
      descricao: "Estacionamento para hóspedes na Bella Vista Pousada Familiar: 1 vaga por acomodação, dentro do pátio da pousada, no Vale dos Vinhedos.",
      caminho: "/estacionamento",
      imagem: "/og/estacionamento.jpg",
      imagemAlt: "Pátio de estacionamento da pousada, com as vagas dos hóspedes",
      descricaoSocial: "Conforto e segurança desde a chegada: 1 vaga por acomodação, dentro do pátio.",
    }),
  component: EstacionamentoPage,
});

const DIFERENCIAIS: { icon: LucideIcon; titulo: string; texto: string }[] = [
  {
    icon: ShieldCheck,
    titulo: "Ambiente seguro",
    texto: "Área exclusiva para hóspedes, trazendo mais tranquilidade.",
  },
  {
    icon: MapPin,
    titulo: "Acesso facilitado",
    texto: "Localização prática para entrada e saída da pousada.",
  },
  {
    icon: Car,
    titulo: "Comodidade",
    texto: "Estacione com conforto e aproveite sua experiência sem preocupações.",
  },
];

// respostas do FAQ sobre o mesmo assunto (mesmo texto da página de FAQ)
const BOM_SABER = [
  { id: "portao-a-noite", icon: KeyRound },
  { id: "seguranca", icon: ShieldCheck },
].flatMap(({ id, icon }) => {
  const p = TODAS_PERGUNTAS.find((q) => q.id === id);
  return p ? [{ icon, pergunta: p.pergunta, resposta: p.resposta }] : [];
});

const CONSULTE = [
  { icon: Clock, titulo: "Horários de check-in e check-out", href: "/horarios" },
  { icon: ScrollText, titulo: "Políticas e regras", href: "/politicas-e-regras" },
  { icon: ShieldCheck, titulo: "Política de cancelamento", href: "/politica-de-cancelamento" },
];

function EstacionamentoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        image={imgEstacionamento}
        imageAlt="Pátio de estacionamento da pousada, com as vagas sinalizadas ao lado das casas"
        trail={[{ label: "Estacionamento" }]}
        eyebrow="Estacionamento"
        title={
          <>
            Conforto e segurança <span className="text-white/60">desde a chegada.</span>
          </>
        }
        aside={
          <div className="flex items-center gap-5 rounded-2xl border border-white/15 bg-ink/55 px-6 py-5 backdrop-blur-md">
            <p className="font-display text-6xl leading-none font-bold tracking-[-0.04em] text-white">
              1
            </p>
            <p className="border-l border-white/15 pl-5 text-[0.95rem] leading-snug text-white/80">
              <span className="block font-semibold text-white">vaga por acomodação</span>
              dentro do pátio da pousada
            </p>
          </div>
        }
      >
        <p className="mt-6 max-w-[50ch] text-[1.05rem] leading-relaxed text-white/80">
          Nosso estacionamento foi pensado para oferecer praticidade e tranquilidade aos hóspedes,
          garantindo uma experiência confortável desde o primeiro momento da sua estadia.
        </p>
      </PageHero>

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-10">
        {/* ── Vaga + diferenciais ──────────────────────────────────────────── */}
        <section aria-labelledby="estacionamento-titulo" className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-4">
              <span aria-hidden className="h-px w-8 bg-wine/60" />
              Para os hóspedes
            </p>
            <h2
              id="estacionamento-titulo"
              className="mt-4 font-display text-3xl leading-tight sm:text-[2.4rem]"
            >
              Oferecemos <span className="text-wine">1 vaga por acomodação</span>, dentro do pátio
              da pousada.
            </h2>
          </div>

          <div className="lg:col-span-7">
            <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
              {DIFERENCIAIS.map(({ icon: Icon, titulo, texto }) => (
                <li key={titulo} className="flex gap-5 py-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-wine/20 bg-wine/[0.04] text-wine">
                    <Icon aria-hidden className="size-[1.1rem]" strokeWidth={1.6} />
                  </span>
                  <div className="pt-1">
                    <h3 className="text-[1.02rem] font-semibold tracking-[-0.01em]">{titulo}</h3>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-muted-foreground">
                      {texto}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Bom saber (do FAQ) ──────────────────────────────────────────── */}
        {BOM_SABER.length > 0 && (
          <section aria-labelledby="bom-saber-titulo" className="mt-16 md:mt-20">
            <h2
              id="bom-saber-titulo"
              className="text-[0.66rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase"
            >
              Bom saber
            </h2>
            <dl className="mt-4 grid gap-4 md:grid-cols-2">
              {BOM_SABER.map(({ icon: Icon, pergunta, resposta }) => (
                <div
                  key={pergunta}
                  className="flex gap-5 rounded-2xl border border-foreground/10 bg-cream/60 p-6"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-wine text-white">
                    <Icon aria-hidden className="size-[1.05rem]" strokeWidth={1.75} />
                  </span>
                  <div>
                    <dt className="text-[1rem] font-semibold tracking-[-0.01em]">{pergunta}</dt>
                    <dd className="mt-1.5 text-[0.94rem] leading-relaxed text-muted-foreground">
                      {resposta}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>
        )}

        <ConsulteTambem itens={CONSULTE} className="mt-14 md:mt-16" />
      </main>

      <ContatoDuvidas
        titulo="Ficou com alguma dúvida sobre o estacionamento?"
        texto="Em caso de dúvidas ou situações específicas, entre em contato com a nossa equipe."
      />

      <Footer />
      <WhatsappButton />
    </div>
  );
}
