import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  CircleHelp,
  Clock,
  Grape,
  Images,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { capas } from "@/data/capas";
import { RESERVAR } from "@/data/site";

/* ─────────────────────────────────────────────────────────────────────────────
   PÁGINA 404 (endereço que não existe)

   Montada como `notFoundComponent` da rota raiz (routes/__root.tsx), então
   aparece para qualquer URL sem rota e também quando uma rota lança
   `notFound()` (ex.: /acomodacoes/uma-suite-que-nao-existe).
   O título da aba ("Página não encontrada | …") e o `noindex` ficam no
   `head` da rota raiz.

   De propósito mais simples que as outras páginas: um "404" grande no
   cabeçalho, uma frase, um botão e a lista das páginas mais visitadas.
   ──────────────────────────────────────────────────────────────────────── */

interface Sugestao {
  icon: LucideIcon;
  titulo: string;
  href: string;
}

const SUGESTOES: Sugestao[] = [
  { icon: CalendarCheck, titulo: "Fazer um pedido de reserva", href: RESERVAR },
  { icon: Images, titulo: "Galeria de fotos", href: "/galeria" },
  { icon: UtensilsCrossed, titulo: "Gastronomia e café da manhã", href: "/gastronomia" },
  { icon: Grape, titulo: "Vale dos Vinhedos", href: "/vale-dos-vinhedos" },
  { icon: Clock, titulo: "Horário de check-in e check-out", href: "/horarios" },
  { icon: CircleHelp, titulo: "Perguntas frequentes", href: "/perguntas-frequentes" },
];

export function PaginaNaoEncontrada() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        image={capas.valeDosVinhedos}
        imageAlt=""
        trail={[{ label: "Página não encontrada" }]}
        eyebrow="Página não encontrada"
        title={
          <span className="block text-[6.5rem] leading-[0.9] tracking-[-0.05em] sm:text-[9rem] lg:text-[11rem]">
            404
          </span>
        }
        compacto
        semTrilhaFlutuante
        veuForteNoCelular
      >
        <p className="mt-5 max-w-[44ch] text-[1.05rem] leading-relaxed text-white/85">
          O endereço que você acessou não existe ou foi alterado.
        </p>
        <Link to="/" className="btn-base btn-primary mt-7">
          Voltar ao início
          <ArrowRight className="size-3.5" />
        </Link>
      </PageHero>

      <main className="px-6 py-14 md:py-16 lg:px-10">
        <nav aria-labelledby="mais-visitadas" className="mx-auto max-w-6xl">
          <h2
            id="mais-visitadas"
            className="text-[0.72rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase"
          >
            Páginas mais visitadas
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUGESTOES.map(({ icon: Icon, titulo, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="group flex h-full items-center gap-4 rounded-2xl border border-foreground/10 p-4 transition-colors hover:border-wine/30 hover:bg-cream/60"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-wine/20 text-wine">
                    <Icon aria-hidden className="size-[1.05rem]" strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 text-[0.92rem] leading-snug font-semibold">{titulo}</span>
                  <ArrowRight className="size-4 shrink-0 text-foreground/40 transition-colors group-hover:text-wine" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  );
}
