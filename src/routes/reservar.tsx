import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, FlaskConical, Info } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { CalendarioReserva } from "@/components/site/reserva/CalendarioReserva";
import { EtapaSuite } from "@/components/site/reserva/EtapaSuite";
import { EtapaHospedes } from "@/components/site/reserva/EtapaHospedes";
import { EtapaRevisao, PedidoEnviado } from "@/components/site/reserva/EtapaRevisao";
import { Etapas } from "@/components/site/reserva/Etapas";
import { AvisoSaida } from "@/components/site/reserva/AvisoSaida";
import { BarraResumoCelular, ResumoReserva } from "@/components/site/reserva/ResumoReserva";
import { getAcomodacao } from "@/data/acomodacoes";
import { capas } from "@/data/capas";
import { useAgenda, type EstadoAgenda } from "@/lib/reservas/planilha";
import { dataCurta, deISO, ehISOValido, plural, somarDias, type DiaISO } from "@/lib/reservas/datas";
import {
  noitesOcupadas,
  obterBloqueios,
  primeiroDiaReservavel,
  validarPeriodo,
  type ErroPeriodo,
} from "@/lib/reservas/disponibilidade";
import {
  ETAPAS,
  apagarRascunho,
  lerRascunho,
  linkWhatsapp,
  novoCodigo,
  pedidoVazio,
  salvarRascunho,
  validarContato,
  type Etapa,
  type Pedido,
} from "@/lib/reservas/pedido";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   RESERVAR: /reservar

   Pedido de reserva em 4 etapas (suíte, datas, hóspedes, revisão), finalizado
   pelo WhatsApp com a mensagem pronta. Sem banco de dados:
     • disponibilidade: planilha do Google Sheets (src/lib/reservas/planilha.ts),
       lida a cada minuto e conferida de novo na hora de enviar; somada aos
       bloqueios de src/data/reservas.ts (?demo=1 simula datas ocupadas);
     • regras (mínimo de noites, capacidade, horários): src/data/reservas.ts;
     • o rascunho fica salvo no navegador, e suíte e datas vão na URL
       (/reservar?suite=videiras&entrada=2026-11-12&saida=2026-11-14), então
       dá para compartilhar ou vir já com a suíte escolhida.
   ──────────────────────────────────────────────────────────────────────── */

interface BuscaReserva {
  suite?: string;
  entrada?: DiaISO;
  saida?: DiaISO;
  demo?: boolean;
}

export const Route = createFileRoute("/reservar")({
  validateSearch: (s: Record<string, unknown>): BuscaReserva => ({
    suite: typeof s.suite === "string" && getAcomodacao(s.suite) ? s.suite : undefined,
    entrada: ehISOValido(s.entrada) ? s.entrada : undefined,
    saida: ehISOValido(s.saida) ? s.saida : undefined,
    demo: s.demo === true || s.demo === 1 || s.demo === "1" ? true : undefined,
  }),
  head: () =>
    seo({
      titulo: "Reservar | Bella Vista Pousada Familiar",
      descricao: "Escolha a suíte e as datas e envie seu pedido de reserva para a Bella Vista Pousada Familiar, no Vale dos Vinhedos. A confirmação é feita pelo WhatsApp.",
      caminho: "/reservar",
      imagem: "/og/reservar.jpg",
      imagemAlt: "Cama arrumada com toalhas enroladas na suíte Videiras",
      descricaoSocial: "Escolha a suíte e as datas e finalize o pedido com a nossa equipe pelo WhatsApp.",
    }),
  component: ReservarPage,
});

const TITULOS: Record<Exclude<Etapa, "enviado">, { titulo: string; texto: string }> = {
  suite: { titulo: "Qual suíte combina com você?", texto: "As três têm banheiro privativo, cozinha equipada e café da manhã incluso." },
  datas: { titulo: "Quando você vem?", texto: "Escolha a data de entrada e, em seguida, a de saída." },
  hospedes: { titulo: "Quem vem e como falamos com você", texto: "Usamos esses dados só para responder ao seu pedido." },
  revisao: { titulo: "Confira seu pedido", texto: "Está tudo certo? Envie e finalize com a nossa equipe pelo WhatsApp." },
};

function mensagemErro(e: ErroPeriodo): string {
  switch (e.tipo) {
    case "ocupado":
      return `A noite de ${dataCurta(e.noite)} já está ocupada nesta suíte. Escolha outro período ou outra suíte.`;
    case "minimo":
      return `Para essa data o mínimo é de ${plural(e.minimo, "noite", "noites")}${e.motivo ? ` (${e.motivo})` : ""}.`;
    case "maximo":
      return `O pedido pode ter até ${e.maximo} noites. Para estadias mais longas, fale com a gente.`;
    case "passado":
      return "A data de entrada já passou. Escolha uma nova data.";
    case "fora-da-janela":
      return "Ainda não abrimos reservas para essas datas.";
  }
}

function ReservarPage() {
  const busca = Route.useSearch();
  const navigate = useNavigate();
  const topo = useRef<HTMLDivElement>(null);

  const [p, setP] = useState<Pedido>(() => ({
    ...pedidoVazio(),
    codigo: "",
    suite: busca.suite ?? null,
    entrada: busca.entrada ?? null,
    saida: busca.saida ?? null,
  }));
  const [etapa, setEtapa] = useState<Etapa>(busca.suite ? "datas" : "suite");
  const [carregado, setCarregado] = useState(false);
  const [mostrarErros, setMostrarErros] = useState(false);
  const [avisoConflito, setAvisoConflito] = useState(false);

  const atualizar = (parcial: Partial<Pedido>) => setP((atual) => ({ ...atual, ...parcial }));

  // agenda da planilha (atualizada a cada minuto) + disponibilidade da suíte
  const agenda = useAgenda();
  const [conferindo, setConferindo] = useState(false);
  const ocupadasDe = (slug: string | null, bloqueios = agenda.agenda?.bloqueios) =>
    slug ? noitesOcupadas(obterBloqueios(slug, { demo: busca.demo, extras: bloqueios?.[slug] })) : new Set<DiaISO>();
  const ocupadas = useMemo(
    () => ocupadasDe(p.suite),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.suite, busca.demo, agenda.agenda],
  );
  const erroDatas = p.entrada && p.saida ? validarPeriodo(p.entrada, p.saida, ocupadas) : null;
  const errosContato = validarContato(p);

  const concluidas = new Set<Etapa>();
  if (p.suite) concluidas.add("suite");
  if (p.suite && p.entrada && p.saida && !erroDatas) concluidas.add("datas");
  if (concluidas.has("datas") && Object.keys(errosContato).length === 0) concluidas.add("hospedes");

  // 1ª carga no navegador: rascunho salvo + o que veio na URL
  useEffect(() => {
    const salvo = lerRascunho();
    const base = salvo ?? p;
    const vindoDaUrl = busca.suite && busca.suite !== salvo?.suite;
    const inicial: Pedido = {
      ...base,
      codigo: base.codigo || novoCodigo(),
      suite: busca.suite ?? base.suite,
      entrada: busca.entrada ?? (vindoDaUrl ? null : base.entrada),
      saida: busca.saida ?? (vindoDaUrl ? null : base.saida),
    };
    setP(inicial);
    // "Reservar" do menu, rodapé e botões gerais (sem suíte na URL) sempre
    // começa pela escolha da suíte; o rascunho continua preenchido. Links com
    // suíte (página da suíte, "Continuar pedido") abrem direto nas datas.
    setEtapa(
      !busca.suite || !inicial.suite
        ? "suite"
        : !(inicial.entrada && inicial.saida)
          ? "datas"
          : "hospedes",
    );
    setCarregado(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // salva o rascunho e mantém suíte/datas na URL
  useEffect(() => {
    if (!carregado || etapa === "enviado") return;
    salvarRascunho(p);
    const proxima: BuscaReserva = {
      suite: p.suite ?? undefined,
      entrada: p.entrada ?? undefined,
      saida: p.saida ?? undefined,
      demo: busca.demo,
    };
    if (proxima.suite !== busca.suite || proxima.entrada !== busca.entrada || proxima.saida !== busca.saida) {
      void navigate({ to: "/reservar", search: proxima, replace: true, resetScroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, carregado, etapa]);

  function irPara(nova: Etapa) {
    setMostrarErros(false);
    setEtapa(nova);
    requestAnimationFrame(() => topo.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const podeAvancar =
    etapa === "suite"
      ? Boolean(p.suite)
      : etapa === "datas"
        ? concluidas.has("datas")
        : true;

  function avancar() {
    if (etapa === "suite" && p.suite) return irPara("datas");
    if (etapa === "datas" && concluidas.has("datas")) return irPara("hospedes");
    if (etapa === "hospedes") {
      if (Object.keys(errosContato).length) return setMostrarErros(true);
      return irPara("revisao");
    }
    if (etapa === "revisao") {
      if (!p.aceite) return setMostrarErros(true);
      void enviar();
    }
  }

  // confere a agenda de novo antes de enviar (alguém pode ter reservado
  // enquanto a pessoa preenchia). A aba do WhatsApp é aberta já no clique,
  // para o navegador não bloquear como pop-up, e só recebe o endereço depois
  // da conferência.
  async function enviar() {
    const janela = window.open("", "_blank");
    setConferindo(true);
    const nova = await agenda.atualizar(true);
    setConferindo(false);
    const conflito =
      p.entrada && p.saida ? validarPeriodo(p.entrada, p.saida, ocupadasDe(p.suite, nova?.bloqueios)) : null;
    if (conflito) {
      janela?.close();
      setAvisoConflito(true);
      return irPara("datas");
    }
    const link = linkWhatsapp(p);
    if (janela) janela.location.href = link;
    else window.location.href = link;
    apagarRascunho();
    irPara("enviado");
  }

  function voltar() {
    const i = ETAPAS.findIndex((e) => e.id === etapa);
    if (i > 0) irPara(ETAPAS[i - 1]!.id);
  }

  function novoPedido() {
    apagarRascunho();
    setP({ ...pedidoVazio(), suite: p.suite });
    irPara("datas");
  }

  const rotuloAcao =
    etapa === "revisao" ? "Enviar pelo WhatsApp" : etapa === "hospedes" ? "Revisar pedido" : "Continuar";

  const acao = (
    <button
      type="button"
      onClick={avancar}
      disabled={!podeAvancar || conferindo}
      className="btn-base btn-primary w-full whitespace-nowrap disabled:pointer-events-none disabled:opacity-45"
    >
      {conferindo ? "Conferindo datas…" : rotuloAcao}
      <ArrowRight className="size-3.5" />
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        // foto fixa: trocar pela capa da suíte escolhida fazia o cabeçalho piscar
        image={capas.reservar}
        imageAlt=""
        trail={[{ label: "Reservar" }]}
        eyebrow="Reservas"
        title="Reserve sua estadia"
        compacto
        veuForteNoCelular
        semTrilhaFlutuante
      >
        <p className="mt-5 max-w-[48ch] text-[1.02rem] leading-relaxed text-white/85">
          Escolha a suíte e as datas, e finalize o pedido com a nossa equipe pelo WhatsApp.
        </p>
      </PageHero>

      <main className="pb-28 lg:pb-0">
        <div ref={topo} className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-10 sm:px-8 lg:px-10 lg:pt-14">
          {busca.demo && (
            <p className="mb-8 flex items-start gap-3 rounded-xl border border-dashed border-wine/40 bg-wine/[0.04] p-4 text-[0.85rem] text-wine">
              <FlaskConical aria-hidden className="mt-0.5 size-4 shrink-0" />
              Modo de demonstração: as datas indisponíveis do calendário são fictícias.
            </p>
          )}

          {etapa === "enviado" ? (
            <section className="py-12 lg:py-20">
              <PedidoEnviado pedido={p} onNovo={novoPedido} />
            </section>
          ) : (
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <section aria-labelledby="etapa-titulo" className="lg:col-span-8">
                <Etapas atual={etapa} concluidas={concluidas} onIr={irPara} />

                <div className="mt-8">
                  <h2 id="etapa-titulo" className="font-display text-[1.9rem] leading-tight sm:text-[2.3rem]">
                    {TITULOS[etapa].titulo}
                  </h2>
                  <p className="mt-2 text-[0.98rem] text-muted-foreground">{TITULOS[etapa].texto}</p>
                </div>

                <div key={etapa} className="fade-up mt-8">
                  {etapa === "suite" && (
                    <EtapaSuite
                      suite={p.suite}
                      onEscolher={(slug) => atualizar({ suite: slug })}
                    />
                  )}

                  {etapa === "datas" && (
                    <EtapaDatas
                      pedido={p}
                      ocupadas={ocupadas}
                      erro={erroDatas}
                      demo={Boolean(busca.demo)}
                      agenda={agenda}
                      conflito={avisoConflito && Boolean(erroDatas)}
                      onChange={(entrada, saida) => {
                        setAvisoConflito(false);
                        atualizar({ entrada, saida });
                      }}
                    />
                  )}

                  {etapa === "hospedes" && (
                    <EtapaHospedes pedido={p} atualizar={atualizar} erros={mostrarErros ? errosContato : {}} />
                  )}

                  {etapa === "revisao" && (
                    <EtapaRevisao pedido={p} atualizar={atualizar} irPara={irPara} erroAceite={mostrarErros} />
                  )}
                </div>

                {etapa !== "suite" && (
                  <button
                    type="button"
                    onClick={voltar}
                    className="mt-10 inline-flex items-center gap-2 text-[0.85rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft aria-hidden className="size-4" />
                    Voltar
                  </button>
                )}
              </section>

              <div className="hidden lg:col-span-4 lg:block">
                <div className="sticky top-28">
                  <ResumoReserva
                    pedido={p}
                    acao={acao}
                    rodape={
                      etapa === "revisao"
                        ? "O pedido só vira reserva depois da confirmação da equipe."
                        : "Sem pagamento agora. A confirmação é feita pelo WhatsApp."
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {etapa !== "enviado" && (
          <BarraResumoCelular
            pedido={p}
            rotulo={conferindo ? "Conferindo…" : rotuloAcao}
            onAvancar={avancar}
            desativado={!podeAvancar || conferindo}
          />
        )}
      </main>

      <div className="mt-12 lg:mt-24">
        <Footer />
      </div>

      {/* "Quer guardar seu pedido?" ao sair da página */}
      <AvisoSaida pedido={p} ativo={carregado && etapa !== "enviado"} />
    </div>
  );
}

/* Etapa 2: calendário + atalhos de fim de semana + avisos. */
function EtapaDatas({
  pedido: p,
  ocupadas,
  erro,
  demo,
  agenda,
  conflito,
  onChange,
}: {
  pedido: Pedido;
  ocupadas: Set<DiaISO>;
  erro: ErroPeriodo | null;
  demo: boolean;
  agenda: EstadoAgenda;
  /** as datas escolhidas foram reservadas enquanto a pessoa preenchia */
  conflito: boolean;
  onChange: (entrada: DiaISO | null, saida: DiaISO | null) => void;
}) {
  // próximos dois fins de semana (sexta a domingo) que estejam livres
  const atalhos = useMemo(() => {
    const lista: { rotulo: string; entrada: DiaISO; saida: DiaISO }[] = [];
    let sexta = primeiroDiaReservavel();
    while (deISO(sexta).getDay() !== 5) sexta = somarDias(sexta, 1);
    for (let i = 0; i < 8 && lista.length < 2; i++) {
      const entrada = somarDias(sexta, i * 7);
      const saida = somarDias(entrada, 2);
      if (!validarPeriodo(entrada, saida, ocupadas)) {
        lista.push({ rotulo: `${dataCurta(entrada)} a ${dataCurta(saida)}`, entrada, saida });
      }
    }
    return lista;
  }, [ocupadas]);

  return (
    <div>
      {atalhos.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[0.8rem] text-muted-foreground">Fins de semana livres:</span>
          {atalhos.map((a) => {
            const ativo = p.entrada === a.entrada && p.saida === a.saida;
            return (
              <button
                key={a.entrada}
                type="button"
                onClick={() => onChange(a.entrada, a.saida)}
                aria-pressed={ativo}
                className={`rounded-full border px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors ${
                  ativo ? "border-wine bg-wine text-white" : "border-border hover:border-foreground/40"
                }`}
              >
                {a.rotulo}
              </button>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
        <CalendarioReserva ocupadas={ocupadas} entrada={p.entrada} saida={p.saida} onChange={onChange} />
      </div>

      {erro && (
        <Aviso tom="erro">
          {conflito ? "Essas datas acabaram de ser reservadas por outra pessoa. " : ""}
          {mensagemErro(erro)}
        </Aviso>
      )}
      {!demo && <StatusAgenda agenda={agenda} />}
    </div>
  );
}

/* Situação da agenda: atualizada (com horário), carregando ou fora do ar. */
function StatusAgenda({ agenda }: { agenda: EstadoAgenda }) {
  if (agenda.status === "carregando")
    return <Aviso>Consultando a agenda das suítes…</Aviso>;
  if (agenda.status === "erro")
    return (
      <Aviso>
        Não conseguimos consultar a agenda agora. Você pode enviar o pedido normalmente: a nossa equipe confirma a
        disponibilidade no WhatsApp.
      </Aviso>
    );
  const hora = agenda.agenda.lidaEm
    ? new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(agenda.agenda.lidaEm))
    : null;
  return (
    <Aviso tom="ok">
      Agenda atualizada{hora ? ` às ${hora}` : ""}. A reserva é confirmada pela nossa equipe no WhatsApp.
    </Aviso>
  );
}

function Aviso({ children, tom = "info" }: { children: ReactNode; tom?: "info" | "erro" | "ok" }) {
  return (
    <p
      role={tom === "erro" ? "alert" : undefined}
      className={`mt-4 flex items-start gap-3 rounded-xl p-4 text-[0.85rem] leading-relaxed ${
        tom === "erro" ? "bg-destructive/10 text-destructive" : "bg-cream text-muted-foreground"
      }`}
    >
      {tom === "ok" ? (
        <span aria-hidden className="relative mt-1.5 flex size-2 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full bg-whats/60" />
          <span className="relative size-2 rounded-full bg-whats" />
        </span>
      ) : (
        <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      )}
      <span>{children}</span>
    </p>
  );
}
