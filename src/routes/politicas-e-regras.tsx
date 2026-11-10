import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Car, Clock, ShieldCheck } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import {
  ContatoDuvidas,
  IndicePagina,
  ParteNumerada,
} from "@/components/site/PaginaInformativa";
import { capas } from "@/data/capas";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   POLÍTICAS E REGRAS DA POUSADA: /politicas-e-regras

   Todo o conteúdo da página atual do site (pousadabellavista.com.br/
   politicas-e-regras), sem cortes e sem travessões no texto.

   Página séria e compacta, sem animações além das do cabeçalho padrão:
     • cabeçalho padrão das páginas (PageHero) com quatro pontos-chave;
     • "Consulte também": os três temas que têm página própria (horários,
       cancelamento e estacionamento), como no site atual;
     • as 15 políticas organizadas em 4 grupos, em duas colunas;
     • a declaração final em destaque e o contato.
   No desktop, um índice fixo à esquerda leva a cada grupo.

   ──────────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute("/politicas-e-regras")({
  head: () =>
    seo({
      titulo: "Políticas e regras | Bella Vista Pousada Familiar",
      descricao: "Pagamento, capacidade, crianças, pets, café da manhã, acesso, convivência e demais regras da Bella Vista Pousada Familiar, no Vale dos Vinhedos.",
      caminho: "/politicas-e-regras",
      imagem: "/og/politicas-e-regras.jpg",
      imagemAlt: "Entrada de uma das suítes da pousada, com jardim vertical e um cachorrinho",
      descricaoSocial: "Tudo o que você precisa saber para uma estadia tranquila, segura e agradável.",
    }),
  component: PoliticasERegrasPage,
});

interface Politica {
  titulo: string;
  texto: ReactNode;
}

interface Grupo {
  id: string;
  titulo: string;
  politicas: Politica[];
}

/** destaque discreto dentro do texto (valores, horários, prazos) */
const D = ({ children }: { children: ReactNode }) => (
  <span className="font-semibold text-foreground">{children}</span>
);

const GRUPOS: Grupo[] = [
  {
    id: "reserva-e-hospedes",
    titulo: "Reserva e hóspedes",
    politicas: [
      {
        titulo: "Política de pagamento",
        texto: (
          <>
            A reserva é confirmada com o pagamento de <D>40% do valor total</D>. A confirmação
            ocorre após a identificação do pagamento, sendo informada por WhatsApp ou e-mail. O
            saldo restante é pago presencialmente na pousada. Aceitamos PIX, dinheiro, cartões de
            débito e crédito; parcelamentos devem ser consultados previamente.
          </>
        ),
      },
      {
        titulo: "Capacidade máxima das acomodações",
        texto: (
          <>
            Cada acomodação possui limite máximo de hóspedes, informado no momento da reserva e na
            página{" "}
            <Link
              to="/"
              data-secao="acomodacoes"
              className="font-medium text-wine underline decoration-wine/30 underline-offset-4 hover:decoration-wine"
            >
              Sobre as Acomodações
            </Link>
            . A hospedagem é exclusiva para hóspedes registrados. Visitas são permitidas mediante
            aviso prévio, não sendo autorizada a pernoite de pessoas não registradas.
          </>
        ),
      },
      {
        titulo: "Política para crianças",
        texto: (
          <>
            Crianças de todas as idades são bem-vindas. Cama extra ou berço devem ser solicitados
            previamente, conforme disponibilidade e capacidade da acomodação, com custo adicional
            de <D>R$ 100,00 por criança, por diária</D>.
          </>
        ),
      },
      {
        titulo: "Animais de estimação",
        texto: (
          <>
            Somos uma pousada pet friendly. A hospedagem de pets é permitida mediante aviso prévio
            na reserva, <D>sem cobrança de taxa adicional</D>. Eventuais danos poderão ser cobrados
            do responsável, de forma justa e transparente.
          </>
        ),
      },
    ],
  },
  {
    id: "durante-a-estadia",
    titulo: "Durante a estadia",
    politicas: [
      {
        titulo: "Café da manhã",
        texto: (
          <>
            O café da manhã está incluso na diária, podendo ser servido na acomodação ou no deck
            externo. O horário padrão é <D>das 8h às 10h</D>, com possibilidade de ajuste mediante
            combinação prévia. Restrições alimentares devem ser informadas no momento da reserva.
          </>
        ),
      },
      {
        titulo: "Acesso à pousada",
        texto: (
          <>
            No check-in, cada hóspede recebe a chave da acomodação e o controle do portão
            principal, com acesso livre e sem restrições de horário durante a estadia.
          </>
        ),
      },
      {
        titulo: "Acesso às áreas comuns",
        texto: (
          <>
            As áreas comuns, como jardim e deck externo, são de uso compartilhado entre os
            hóspedes. O consumo de cigarros é permitido apenas nesses espaços, sendo proibido nas
            áreas internas.
          </>
        ),
      },
      {
        titulo: "Limpeza e arrumação",
        texto: (
          <>
            A limpeza e arrumação das acomodações são realizadas <D>diariamente</D>. Caso o
            hóspede não deseje o serviço em algum dia, deve informar previamente à pousada.
          </>
        ),
      },
      {
        titulo: "Uso de equipamentos",
        texto: (
          <>
            Os itens e equipamentos da acomodação estão disponíveis para uso durante a estadia e
            devem ser utilizados com cuidado. Caso necessite de algum item adicional, o hóspede
            pode solicitar à pousada, conforme disponibilidade.
          </>
        ),
      },
    ],
  },
  {
    id: "convivencia-e-seguranca",
    titulo: "Convivência e segurança",
    politicas: [
      {
        titulo: "Regras de convivência",
        texto: (
          <>
            Prezamos pelo conforto e bem-estar de todos os hóspedes. Solicitamos o respeito aos
            horários de silêncio, <D>das 23h às 6h</D>, bem como às áreas comuns, contribuindo
            para um ambiente harmonioso e tranquilo.
          </>
        ),
      },
      {
        titulo: "Fumo nas dependências",
        texto: (
          <>
            Não é permitido fumar nas áreas internas da pousada, conforme Lei Municipal nº 4.627,
            de 29 de julho de 2009. O descumprimento desta norma poderá gerar cobrança de taxas
            adicionais.
          </>
        ),
      },
      {
        titulo: "Segurança",
        texto: (
          <>
            Para sua segurança, solicitamos que os hóspedes respeitem as sinalizações existentes e
            sigam as orientações da equipe, sempre que necessário.
          </>
        ),
      },
      {
        titulo: "Responsabilidades do hóspede",
        texto: (
          <>
            O hóspede é responsável pela conservação da acomodação e de seus itens. Em caso de dano
            ou extravio, o valor correspondente poderá ser cobrado do responsável pela reserva, de
            forma justa e transparente.
          </>
        ),
      },
    ],
  },
  {
    id: "objetos-e-descumprimento",
    titulo: "Objetos pessoais e descumprimento",
    politicas: [
      {
        titulo: "Objetos pessoais e valores",
        texto: (
          <>
            Os hóspedes são responsáveis por seus objetos pessoais e valores. A pousada não se
            responsabiliza por itens deixados nos quartos ou nas áreas comuns.
          </>
        ),
      },
      {
        titulo: "Itens esquecidos",
        texto: (
          <>
            Objetos esquecidos serão guardados por <D>até 60 dias</D>, e o hóspede será contatado
            quando possível. Sem retorno nesse prazo, os itens serão doados a instituições locais.
            Em caso de envio, os custos ficam por conta do hóspede.
          </>
        ),
      },
      {
        titulo: "Descumprimento das regras",
        texto: (
          <>
            O não cumprimento das políticas da pousada poderá resultar na adoção de medidas
            necessárias, incluindo orientações, eventuais cobranças adicionais ou, em situações
            excepcionais, o encerramento da hospedagem.
          </>
        ),
      },
    ],
  },
];

/** temas com página própria (no site atual, os cards "Ver sobre") */
const CONSULTE = [
  { icon: Clock, titulo: "Horários de check-in e check-out", href: "/horarios" },
  { icon: ShieldCheck, titulo: "Política de cancelamento", href: "/politica-de-cancelamento" },
  { icon: Car, titulo: "Estacionamento", href: "/estacionamento" },
];

const DESTAQUES = [
  { valor: "40%", texto: "do valor confirma a reserva" },
  { valor: "8h às 10h", texto: "café da manhã incluso" },
  { valor: "23h às 6h", texto: "horário de silêncio" },
  { valor: "Pet friendly", texto: "sem taxa adicional" },
];

function PoliticasERegrasPage() {
  // numeração contínua das políticas (01 a 15) ao longo dos grupos
  let n = 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        image={capas.politicasERegras}
        imageAlt="Entrada da acomodação Nascer do Sol, com porta branca, vasos de plantas e calçamento de pedra"
        trail={[{ label: "Políticas e regras" }]}
        eyebrow="Informações importantes"
        title={
          <>
            Políticas e regras <span className="text-white/60">da pousada.</span>
          </>
        }
        aside={
          <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/15 bg-ink/55 backdrop-blur-md">
            {DESTAQUES.map((d, i) => (
              <div
                key={d.valor}
                className={`px-5 py-4 ${i % 2 === 1 ? "border-l border-white/12" : ""} ${i > 1 ? "border-t border-white/12" : ""}`}
              >
                <dt className="font-display text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
                  {d.valor}
                </dt>
                <dd className="mt-1 text-[0.78rem] leading-snug text-white/70">{d.texto}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <p className="mt-6 max-w-[48ch] text-[1.05rem] leading-relaxed text-white/80">
          Para garantir uma experiência tranquila, segura e agradável para todos os hóspedes,
          estabelecemos algumas políticas e regras internas. Leia com atenção.
        </p>
      </PageHero>

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:grid lg:grid-cols-12 lg:gap-12 lg:px-10">
        <IndicePagina partes={GRUPOS.map(({ id, titulo }) => ({ id, titulo }))} />

        <div className="lg:col-span-9">
          {/* ── Consulte também ─────────────────────────────────────────── */}
          <nav aria-label="Consulte também">
            <p className="text-[0.66rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              Consulte também
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {CONSULTE.map(({ icon: Icon, titulo, href }) => {
                const externo = href.startsWith("http");
                return (
                  <li key={titulo}>
                    <a
                      href={href}
                      {...(externo ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group flex h-full items-center gap-4 rounded-2xl border border-foreground/10 bg-cream/60 p-4 transition-colors hover:border-wine/30 hover:bg-cream"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-wine text-white">
                        <Icon aria-hidden className="size-[1.05rem]" strokeWidth={1.75} />
                      </span>
                      <span className="flex-1 text-[0.92rem] leading-snug font-semibold">{titulo}</span>
                      {externo ? (
                        <ArrowUpRight className="size-4 shrink-0 text-foreground/40 transition-colors group-hover:text-wine" />
                      ) : (
                        <ArrowRight className="size-4 shrink-0 text-foreground/40 transition-colors group-hover:text-wine" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── As políticas, em grupos ─────────────────────────────────── */}
          <div className="mt-16 space-y-16 md:mt-20 md:space-y-20">
            {GRUPOS.map((g, gi) => (
              <ParteNumerada key={g.id} numero={gi + 1} id={g.id} titulo={g.titulo}>
                <dl className="grid gap-x-12 md:grid-cols-2">
                  {g.politicas.map((p) => {
                    n += 1;
                    return (
                      <div key={p.titulo} className="border-b border-foreground/10 py-6">
                        <dt className="flex items-baseline gap-3 text-[1.02rem] leading-snug font-semibold tracking-[-0.01em]">
                          <span className="w-6 shrink-0 text-[0.7rem] font-semibold tracking-[0.1em] text-wine/60 tabular-nums">
                            {String(n).padStart(2, "0")}
                          </span>
                          {p.titulo}
                        </dt>
                        <dd className="mt-2 pl-9 text-[0.95rem] leading-relaxed text-muted-foreground">
                          {p.texto}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </ParteNumerada>
            ))}

            {/* declaração final */}
            <div className="flex flex-col gap-5 rounded-2xl bg-wine px-7 py-8 text-white sm:flex-row sm:items-center sm:gap-8 sm:px-9">
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/25">
                <ShieldCheck aria-hidden className="size-5" strokeWidth={1.6} />
              </span>
              <p className="text-[1.02rem] leading-relaxed text-white/90">
                Ao efetuar a reserva e se hospedar na pousada, o hóspede declara estar de acordo com
                todas as políticas e regras aqui descritas.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ContatoDuvidas
        titulo="Ficou com alguma dúvida sobre as políticas da pousada?"
        texto="Em caso de dúvidas ou situações específicas, entre em contato com a nossa equipe."
      />

      <Footer />
      <WhatsappButton />
    </div>
  );
}
