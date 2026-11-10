import { createFileRoute, Link } from "@tanstack/react-router";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { ContatoDuvidas, IndicePagina, ParteNumerada } from "@/components/site/PaginaInformativa";
import { AtualizadoEm, ListaLegal, Paragrafos } from "@/components/site/TextoLegal";
import { capas } from "@/data/capas";
import { GA_ID, reverCookies } from "@/lib/analytics";
import { EMAIL } from "@/data/site";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   POLÍTICA DE COOKIES: /politica-de-cookies

   O site não cria cookies próprios: usa o armazenamento local do navegador
   (localStorage/sessionStorage), com as chaves listadas em ARMAZENAMENTO
   abaixo. Os cookies que podem aparecer vêm de terceiros: Google Analytics
   (só depois do "Aceitar" no aviso de cookies, ver src/lib/analytics.ts),
   mapa do Google Maps e Google Fonts.

   ⚠️ Ao criar uma chave nova de localStorage/sessionStorage no código, ou
   ao adicionar uma ferramenta de terceiros (Google Analytics, pixel da Meta,
   chat etc.), acrescente aqui. Ferramentas de análise ou publicidade
   exigem também um aviso de consentimento no site.
   ──────────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute("/politica-de-cookies")({
  head: () =>
    seo({
      titulo: "Política de cookies | Bella Vista Pousada Familiar",
      descricao: "Quais cookies e informações o site da Bella Vista Pousada Familiar guarda no seu navegador, para que servem e como gerenciar a sua escolha.",
      caminho: "/politica-de-cookies",
      imagem: "/og/horarios.jpg",
      imagemAlt: "Acomodação arrumada para a chegada, com toalhas sobre a cama",
      descricaoSocial: "Sem publicidade e com análise só se você aceitar: o que o site guarda e por quê.",
    }),
  component: PoliticaDeCookiesPage,
});

const ATUALIZADO_EM = "10 de novembro de 2026";

const PARTES = [
  { id: "o-que-sao", titulo: "O que são cookies" },
  { id: "o-que-usamos", titulo: "O que este site guarda" },
  { id: "terceiros", titulo: "Conteúdos de terceiros" },
  { id: "gerenciar", titulo: "Como gerenciar" },
];

interface ItemArmazenado {
  nome: string;
  finalidade: string;
  duracao: string;
}

// chaves usadas no código (procure pelo nome para achar onde)
const ARMAZENAMENTO: ItemArmazenado[] = [
  {
    nome: "bv-reserva-rascunho-v1",
    finalidade:
      "Guarda o seu pedido de reserva em andamento, para você continuar de onde parou.",
    duracao: "Até você enviar o pedido, começar um novo ou limpar o navegador",
  },
  {
    nome: "bv-reserva-retomar-dispensado",
    finalidade: "Lembra que você fechou o aviso \"Continuar pedido\", para ele não voltar.",
    duracao: "Até fechar a aba",
  },
  {
    nome: "bella-vista:notificacoes-lidas",
    finalidade: "Marca quais novidades da central de notificações você já leu.",
    duracao: "Até você limpar o navegador",
  },
  {
    nome: "pbv-instagram-feed",
    finalidade: "Guarda uma cópia das últimas postagens do Instagram, para a página abrir mais rápido.",
    duracao: "6 horas",
  },
  {
    nome: "bv-consentimento-cookies",
    finalidade: "Guarda a sua resposta ao aviso de cookies (aceitou ou recusou os cookies de análise).",
    duracao: "Até você rever a escolha ou limpar o navegador",
  },
  {
    nome: "pbv-ir-para-secao",
    finalidade: "Leva você à seção certa da página inicial ao clicar em um link do menu.",
    duracao: "Apagado logo após o uso",
  },
];

function PoliticaDeCookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        image={capas.horarios}
        imageAlt="Acomodação arrumada para a chegada, com toalhas enroladas sobre a cama, manta clara e janela com vista para as árvores"
        trail={[{ label: "Política de cookies" }]}
        eyebrow="Privacidade"
        title={
          <>
            Política de cookies <span className="text-white/60">e armazenamento.</span>
          </>
        }
        aside={
          <div className="rounded-2xl border border-white/15 bg-ink/55 px-6 py-5 backdrop-blur-md">
            <p className="font-display text-2xl leading-tight font-bold tracking-[-0.02em] text-white">
              Você escolhe.
            </p>
            <p className="mt-1.5 text-[0.9rem] leading-snug text-white/75">
              Sem cookies de publicidade. Os de análise só com o seu aceite.
            </p>
          </div>
        }
      >
        <p className="mt-6 max-w-[50ch] text-[1.05rem] leading-relaxed text-white/80">
          O site guarda no seu navegador só o necessário para funcionar bem, como o pedido de
          reserva que você está montando.
        </p>
      </PageHero>

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:grid lg:grid-cols-12 lg:gap-12 lg:px-10">
        <IndicePagina partes={PARTES} />

        <div className="space-y-16 md:space-y-20 lg:col-span-9">
          {/* ── 01 O que são cookies ──────────────────────────────────────── */}
          <ParteNumerada numero={1} id="o-que-sao" titulo="O que são cookies">
            <Paragrafos>
              <p>
                Cookies são pequenos arquivos que os sites salvam no seu navegador. Além deles, os
                navegadores oferecem o armazenamento local, que funciona de forma parecida: guarda
                informações no seu próprio aparelho, sem enviá-las para os nossos servidores.
              </p>
              <p>
                Esta página explica o que o nosso site guarda e por quê. Para saber como tratamos
                os seus dados de modo geral, veja a{" "}
                <Link to="/politica-de-privacidade">política de privacidade</Link>.
              </p>
            </Paragrafos>
          </ParteNumerada>

          {/* ── 02 O que este site guarda ─────────────────────────────────── */}
          <ParteNumerada numero={2} id="o-que-usamos" titulo="O que este site guarda">
            <Paragrafos>
              <p>
                O site da pousada não cria cookies próprios. Ele usa o armazenamento local do
                navegador para funções do próprio site:
              </p>
            </Paragrafos>

            <div className="mt-6 overflow-hidden rounded-2xl border border-foreground/10">
              {/* desktop: tabela; celular: cada item vira um bloco */}
              <table className="hidden w-full text-left text-[0.9rem] md:table">
                <thead className="bg-cream/70 text-[0.66rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Nome</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Para que serve</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  {ARMAZENAMENTO.map((item) => (
                    <tr key={item.nome} className="border-t border-foreground/10 align-top">
                      <td className="px-5 py-4 font-mono text-[0.8rem] whitespace-nowrap text-wine">
                        {item.nome}
                      </td>
                      <td className="px-5 py-4 leading-relaxed text-foreground/75">{item.finalidade}</td>
                      <td className="px-5 py-4 leading-relaxed text-muted-foreground">{item.duracao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <dl className="divide-y divide-foreground/10 md:hidden">
                {ARMAZENAMENTO.map((item) => (
                  <div key={item.nome} className="p-5">
                    <dt className="font-mono text-[0.8rem] break-all text-wine">{item.nome}</dt>
                    <dd className="mt-2 text-[0.92rem] leading-relaxed text-foreground/75">
                      {item.finalidade}
                    </dd>
                    <dd className="mt-1.5 text-[0.82rem] text-muted-foreground">
                      Duração: {item.duracao}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <Paragrafos>
              <p>
                Essas informações ficam só no seu aparelho. Não usamos ferramentas de publicidade
                (como pixels de redes sociais).
              </p>
              <p>
                Usamos o Google Analytics para entender, de forma agregada, quantas pessoas visitam
                o site e quais páginas são mais vistas. Ele só é ativado se você clicar em
                "Aceitar" no aviso de cookies. Se recusar, ele não é carregado.
              </p>
            </Paragrafos>
          </ParteNumerada>

          {/* ── 03 Conteúdos de terceiros ─────────────────────────────────── */}
          <ParteNumerada numero={3} id="terceiros" titulo="Conteúdos de terceiros">
            <Paragrafos>
              <p>
                Algumas partes do site são carregadas de outros serviços, que podem usar cookies
                ou registrar dados técnicos da sua visita conforme as políticas deles:
              </p>
            </Paragrafos>
            <ListaLegal
              itens={[
                {
                  titulo: "Google Analytics",
                  texto:
                    "estatísticas de visitas ao site, só com o seu aceite. Define cookies do Google (como _ga) que duram até 2 anos.",
                },
                {
                  titulo: "Google Maps",
                  texto: "o mapa da seção de localização. Pode definir cookies do Google.",
                },
                {
                  titulo: "Google Fonts",
                  texto: "a fonte usada nos textos do site, carregada dos servidores do Google.",
                },
                {
                  titulo: "Instagram",
                  texto: "as fotos do perfil da pousada, carregadas por meio do serviço Behold.",
                },
              ]}
            />
            <Paragrafos>
              <p>
                Ao clicar em links para outros sites, como WhatsApp, Instagram, Booking.com,
                Airbnb ou o site das vinícolas, passam a valer as políticas desses sites.
              </p>
            </Paragrafos>
          </ParteNumerada>

          {/* ── 04 Como gerenciar ─────────────────────────────────────────── */}
          <ParteNumerada numero={4} id="gerenciar" titulo="Como gerenciar">
            <Paragrafos>
              <p>
                Você pode apagar ou bloquear cookies e o armazenamento local nas configurações do
                seu navegador, geralmente em "Privacidade" ou "Dados de sites". Também pode usar
                uma janela anônima.
              </p>
              <p>
                O site continua funcionando normalmente. A única diferença é que o pedido de
                reserva em andamento e as notificações lidas não ficam salvos de uma visita para
                outra.
              </p>
              <p>
                Você também pode mudar a sua resposta ao aviso de cookies a qualquer momento.
              </p>
              <p>
                Dúvidas? Escreva para <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
              </p>
            </Paragrafos>
            {GA_ID && (
              <button type="button" onClick={reverCookies} className="btn-base btn-outline mt-6">
                Rever minha escolha de cookies
              </button>
            )}
            <div className="mt-8">
              <AtualizadoEm data={ATUALIZADO_EM} />
            </div>
          </ParteNumerada>
        </div>
      </main>

      <ContatoDuvidas
        titulo="Ficou com alguma dúvida?"
        texto="Fale com a nossa equipe pelo WhatsApp."
      />

      <Footer />
      <WhatsappButton />
    </div>
  );
}
