import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Car,
  DoorOpen,
  LogOut,
  MessageCircle,
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
import { WHATSAPP } from "@/data/site";
import { capas } from "@/data/capas";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   HORÁRIOS DE CHECK-IN E CHECK-OUT: /horarios

   Todo o conteúdo da página atual do site (pousadabellavista.com.br/
   horarios), sem travessões no texto. As 4 perguntas frequentes da página
   vêm de src/data/faq.ts (mesmo texto da página de FAQ).

   Página curta e sóbria:
     • cabeçalho padrão das páginas (PageHero);
     • os cartões de check-in (a partir das 14h) e check-out (até 12h), com
       uma régua do dia mostrando a janela entre os dois;
     • o aviso sobre ajustes de horário, as perguntas frequentes sobre os
       horários, "Consulte também" e o contato.
   ──────────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute("/horarios")({
  head: () =>
    seo({
      titulo: "Horários de check-in e check-out | Bella Vista Pousada Familiar",
      descricao: "Check-in a partir das 14h e check-out até 12h na Bella Vista Pousada Familiar. Veja as orientações para uma chegada e saída tranquilas.",
      caminho: "/horarios",
      imagem: "/og/horarios.jpg",
      imagemAlt: "Acomodação arrumada para a chegada, com toalhas sobre a cama",
      descricaoSocial: "Check-in a partir das 14h e check-out até 12h.",
    }),
  component: HorariosPage,
});

interface Horario {
  icon: LucideIcon;
  rotulo: string;
  prefixo: string;
  hora: string;
  textos: string[];
}

const HORARIOS: Horario[] = [
  {
    icon: DoorOpen,
    rotulo: "Check-in",
    prefixo: "A partir das",
    hora: "14h",
    textos: [
      "A recepção estará disponível para recebê-lo dentro do horário informado.",
      "Caso chegue antes, consulte a disponibilidade para entrada antecipada.",
    ],
  },
  {
    icon: LogOut,
    rotulo: "Check-out",
    prefixo: "Até",
    hora: "12h",
    textos: [
      "Pedimos a gentileza de respeitar o horário para garantir a preparação adequada da acomodação para os próximos hóspedes.",
    ],
  },
];

// perguntas da página atual, com o texto do FAQ
const PERGUNTAS = ["check-in-antecipado", "check-out-tardio", "bagagem", "portao-a-noite"].flatMap(
  (id) => TODAS_PERGUNTAS.filter((q) => q.id === id),
);

const CONSULTE = [
  { icon: ShieldCheck, titulo: "Política de cancelamento", href: "/politica-de-cancelamento" },
  { icon: ScrollText, titulo: "Políticas e regras", href: "/politicas-e-regras" },
  { icon: Car, titulo: "Estacionamento", href: "/estacionamento" },
];

/** posição (em %) de um horário na régua, que vai das 8h às 20h */
const pos = (h: number) => `${((h - 8) / 12) * 100}%`;

function HorariosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        image={capas.horarios}
        imageAlt="Acomodação arrumada para a chegada, com toalhas enroladas sobre a cama, manta clara e janela com vista para as árvores"
        trail={[{ label: "Horários de check-in e check-out" }]}
        eyebrow="Informações importantes"
        title={
          <>
            <span className="whitespace-nowrap">Check-in</span>{" "}
            <span className="text-white/60">e</span>{" "}
            <span className="whitespace-nowrap">
              check-out<span className="text-white/60">.</span>
            </span>
          </>
        }
      >
        <p className="mt-6 max-w-[46ch] text-[1.05rem] leading-relaxed text-white/80">
          Confira os horários e orientações para uma chegada e saída tranquilas.
        </p>
      </PageHero>

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-10">
        {/* ── Os dois horários ─────────────────────────────────────────────── */}
        <section aria-label="Horários" className="grid gap-5 md:grid-cols-2">
          {HORARIOS.map(({ icon: Icon, rotulo, prefixo, hora, textos }, i) => (
            <article
              key={rotulo}
              className={`flex flex-col rounded-2xl p-7 sm:p-9 ${
                i === 0 ? "bg-wine text-white" : "border border-foreground/10 bg-cream/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2
                  className={`text-[0.7rem] font-semibold tracking-[0.24em] uppercase ${
                    i === 0 ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  {rotulo}
                </h2>
                <span
                  className={`grid size-11 place-items-center rounded-full ${
                    i === 0 ? "border border-white/25" : "border border-wine/20 text-wine"
                  }`}
                >
                  <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                </span>
              </div>
              <p className={`mt-8 text-[0.95rem] ${i === 0 ? "text-white/75" : "text-muted-foreground"}`}>
                {prefixo}
              </p>
              <p
                className={`font-display text-7xl leading-none font-bold tracking-[-0.05em] sm:text-8xl ${
                  i === 0 ? "text-white" : "text-wine"
                }`}
              >
                {hora}
              </p>
              <div
                className={`mt-8 space-y-2 border-t pt-6 text-[0.98rem] leading-relaxed ${
                  i === 0 ? "border-white/15 text-white/85" : "border-foreground/10 text-muted-foreground"
                }`}
              >
                {textos.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </article>
          ))}
        </section>

        {/* ── Régua do dia ─────────────────────────────────────────────────── */}
        <figure
          aria-label="Régua do dia: check-out até 12h e check-in a partir das 14h"
          className="mt-5 rounded-2xl border border-foreground/10 px-6 pt-6 pb-5 sm:px-9"
        >
          <div className="relative h-14">
            {/* trilho */}
            <span className="absolute inset-x-0 top-7 h-px bg-foreground/15" />
            {/* manhã até o check-out */}
            <span
              className="absolute top-[27px] left-0 h-[3px] rounded-full bg-foreground/35"
              style={{ width: pos(12) }}
            />
            {/* a partir do check-in */}
            <span
              className="absolute top-[27px] right-0 h-[3px] rounded-full bg-wine"
              style={{ left: pos(14) }}
            />
            {/* marcos */}
            {/* os rótulos abrem para fora (check-out à esquerda, check-in à
                direita) para não se encostarem no celular */}
            {[
              {
                h: 12,
                label: "Check-out",
                cor: "bg-foreground",
                lado: "-translate-x-[calc(100%-6px)] items-end",
              },
              { h: 14, label: "Check-in", cor: "bg-wine", lado: "-translate-x-[6px] items-start" },
            ].map((m) => (
              <span
                key={m.h}
                className={`absolute top-0 flex flex-col ${m.lado}`}
                style={{ left: pos(m.h) }}
              >
                <span className="text-[0.66rem] font-semibold tracking-[0.18em] whitespace-nowrap text-foreground uppercase">
                  {m.label}
                </span>
                <span className={`mt-2.5 size-3 rounded-full ring-4 ring-background ${m.cor}`} />
              </span>
            ))}
          </div>
          <div className="relative mt-1 h-4 text-[0.72rem] text-muted-foreground tabular-nums">
            {[8, 10, 12, 14, 16, 18, 20].map((h) => (
              <span
                key={h}
                className={`absolute -translate-x-1/2 ${h === 12 || h === 14 ? "font-semibold text-foreground" : ""}`}
                style={{ left: pos(h) }}
              >
                {h}h
              </span>
            ))}
          </div>
        </figure>

        {/* ── Ajustes de horário ───────────────────────────────────────────── */}
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-foreground/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-9">
          <p className="flex items-start gap-4 text-[0.98rem] leading-relaxed">
            <MessageCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-wine" strokeWidth={1.6} />
            Para necessidades especiais ou ajustes de horário, fale conosco com antecedência.
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 pl-9 text-[0.9rem] font-semibold text-wine hover:opacity-75 sm:pl-0"
          >
            Entrar em contato
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        {/* ── Perguntas sobre os horários ──────────────────────────────────── */}
        {PERGUNTAS.length > 0 && (
          <section aria-labelledby="horarios-faq-titulo" className="mt-16 md:mt-20">
            <div className="flex flex-col gap-3 border-b border-foreground/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="horarios-faq-titulo"
                  className="font-display text-2xl leading-tight font-bold tracking-[-0.02em] md:text-[1.75rem]"
                >
                  Perguntas frequentes
                </h2>
                <p className="mt-1 text-[0.95rem] text-muted-foreground">
                  Confira abaixo as perguntas frequentes sobre os horários.
                </p>
              </div>
              <Link
                to="/perguntas-frequentes"
                className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-wine hover:opacity-75"
              >
                Ver todas as perguntas
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <dl className="grid gap-x-12 md:grid-cols-2">
              {PERGUNTAS.map((p) => (
                <div key={p.id} className="border-b border-foreground/10 py-6">
                  <dt className="flex items-start gap-3 text-[1.02rem] leading-snug font-semibold tracking-[-0.01em]">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-wine" />
                    {p.pergunta}
                  </dt>
                  <dd className="mt-2 pl-[1.125rem] text-[0.95rem] leading-relaxed text-muted-foreground">
                    {p.resposta}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <ConsulteTambem itens={CONSULTE} className="mt-14 md:mt-16" />
      </main>

      <ContatoDuvidas
        titulo="Ainda tem dúvidas sobre os horários?"
        texto="Entre em contato conosco. Para ajustes de horário, fale com a gente com antecedência."
      />

      <Footer />
      <WhatsappButton />
    </div>
  );
}
