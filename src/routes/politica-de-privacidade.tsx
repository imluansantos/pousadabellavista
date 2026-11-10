import { createFileRoute, Link } from "@tanstack/react-router";

import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { ContatoDuvidas, IndicePagina, ParteNumerada } from "@/components/site/PaginaInformativa";
import { AtualizadoEm, ListaLegal, Paragrafos } from "@/components/site/TextoLegal";
import { capas } from "@/data/capas";
import { CNPJ, EMAIL, ENDERECO_COMPLETO, RAZAO_SOCIAL, TELEFONE } from "@/data/site";
import { seo } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   POLÍTICA DE PRIVACIDADE: /politica-de-privacidade

   Escrita a partir do que o site REALMENTE faz hoje (conferido no código):
     • o pedido de reserva (/reservar) fica só no navegador do visitante e é
       enviado por ele mesmo pelo WhatsApp; nada de nome, telefone ou e-mail
       vai para um servidor nosso. O servidor só lê a planilha de
       disponibilidade (Google Sheets), sem dados do visitante;
     • não há publicidade nem pixels; há Google Analytics, carregado só
       depois do "Aceitar" no aviso de cookies (src/lib/analytics.ts);
     • conteúdos de terceiros: mapa do Google Maps, fonte do Google Fonts e
       fotos do Instagram (feed do Behold).
   Se algo disso mudar (formulário com back-end, Google Analytics, pagamento
   online etc.), esta página e a de cookies precisam ser atualizadas.

   ⚠️ Texto-base, não substitui a revisão de um advogado. Razão social e
   CNPJ (parte 01 Quem somos) vêm de src/data/site.ts.
   ──────────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () =>
    seo({
      titulo: "Política de privacidade | Bella Vista Pousada Familiar",
      descricao: "Como a Bella Vista Pousada Familiar trata os seus dados pessoais nos pedidos de reserva, no atendimento e no site, de acordo com a LGPD.",
      caminho: "/politica-de-privacidade",
      imagem: "/og/politicas-e-regras.jpg",
      imagemAlt: "Entrada de uma das suítes da pousada, com jardim vertical e um cachorrinho",
      descricaoSocial: "Quais dados usamos, para quê e como exercer os seus direitos.",
    }),
  component: PoliticaDePrivacidadePage,
});

const ATUALIZADO_EM = "10 de novembro de 2026";

const PARTES = [
  { id: "quem-somos", titulo: "Quem somos" },
  { id: "dados", titulo: "Quais dados usamos" },
  { id: "finalidades", titulo: "Para que usamos" },
  { id: "compartilhamento", titulo: "Com quem compartilhamos" },
  { id: "prazos", titulo: "Por quanto tempo guardamos" },
  { id: "direitos", titulo: "Seus direitos" },
  { id: "seguranca", titulo: "Segurança e alterações" },
];

function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        image={capas.politicasERegras}
        imageAlt="Entrada da acomodação Nascer do Sol, com porta branca, vasos de plantas e calçamento de pedra"
        trail={[{ label: "Política de privacidade" }]}
        eyebrow="Privacidade"
        title={
          <>
            Política de privacidade <span className="text-white/60">e dados pessoais.</span>
          </>
        }
      >
        <p className="mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-white/80">
          Usamos os seus dados apenas para responder ao seu contato e cuidar da sua estadia. Aqui
          explicamos, de forma simples, o que é feito com eles, de acordo com a Lei Geral de
          Proteção de Dados (Lei nº 13.709/2018).
        </p>
      </PageHero>

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:grid lg:grid-cols-12 lg:gap-12 lg:px-10">
        <IndicePagina partes={PARTES} />

        <div className="space-y-16 md:space-y-20 lg:col-span-9">
          {/* ── 01 Quem somos ─────────────────────────────────────────────── */}
          <ParteNumerada numero={1} id="quem-somos" titulo="Quem somos">
            <Paragrafos>
              <p>
                A Bella Vista Pousada Familiar ({RAZAO_SOCIAL}, CNPJ {CNPJ}), localizada na{" "}
                {ENDERECO_COMPLETO}, é a responsável
                (controladora) pelos dados pessoais tratados neste site e no atendimento aos
                hóspedes.
              </p>
              <p>
                Para qualquer assunto sobre os seus dados, fale com a gente pelo e-mail{" "}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ou pelo WhatsApp {TELEFONE}.
              </p>
            </Paragrafos>
          </ParteNumerada>

          {/* ── 02 Quais dados usamos ─────────────────────────────────────── */}
          <ParteNumerada numero={2} id="dados" titulo="Quais dados usamos">
            <Paragrafos>
              <p>Usamos somente os dados que você mesmo nos informa, ou que o navegador precisa para o site funcionar:</p>
            </Paragrafos>
            <ListaLegal
              itens={[
                {
                  titulo: "Pedido de reserva",
                  texto:
                    "nome, WhatsApp, e-mail (opcional), suíte, datas, número de hóspedes, idade das crianças, pet, adicionais, horário previsto de chegada e observações. O pedido é montado no seu navegador e enviado por você pelo WhatsApp; esses dados não são gravados em nenhum servidor do site.",
                },
                {
                  titulo: "Atendimento",
                  texto:
                    "o que você nos envia por WhatsApp, e-mail, telefone ou redes sociais para tirar dúvidas, confirmar ou alterar uma reserva.",
                },
                {
                  titulo: "Hospedagem",
                  texto:
                    "os dados exigidos por lei para o registro de hóspedes, solicitados na confirmação da reserva ou no check-in.",
                },
                {
                  titulo: "Navegação",
                  texto: (
                    <>
                      informações técnicas como endereço IP e tipo de navegador, registradas
                      automaticamente pelo serviço que hospeda o site; estatísticas de uso do
                      Google Analytics, só se você aceitar os cookies de análise; e as
                      preferências guardadas no seu próprio navegador, explicadas na{" "}
                      <Link to="/politica-de-cookies" className="font-medium text-wine underline decoration-wine/30 underline-offset-4">
                        política de cookies
                      </Link>
                      .
                    </>
                  ),
                },
              ]}
            />
            <Paragrafos>
              <p>
                Não usamos ferramentas de publicidade e não pedimos dados sensíveis. Se precisar informar alguma necessidade especial (acessibilidade,
                alimentação), use o campo de observações só com o necessário.
              </p>
            </Paragrafos>
          </ParteNumerada>

          {/* ── 03 Para que usamos ────────────────────────────────────────── */}
          <ParteNumerada numero={3} id="finalidades" titulo="Para que usamos">
            <ListaLegal
              itens={[
                {
                  titulo: "Responder ao seu pedido",
                  texto:
                    "conferir a disponibilidade, enviar valores e condições e confirmar a reserva. Base legal: procedimentos preliminares e execução do contrato de hospedagem (art. 7º, V, da LGPD).",
                },
                {
                  titulo: "Cuidar da sua estadia",
                  texto:
                    "combinar a chegada, preparar a acomodação e atender os seus pedidos durante a hospedagem. Mesma base legal.",
                },
                {
                  titulo: "Cumprir obrigações legais",
                  texto:
                    "registro de hóspedes, emissão de documentos fiscais e atendimento a autoridades, quando exigido (art. 7º, II).",
                },
                {
                  titulo: "Manter o site funcionando",
                  texto:
                    "guardar o seu pedido em andamento e as suas preferências, e proteger o site contra abusos. Base legal: legítimo interesse (art. 7º, IX), sempre de forma limitada ao necessário.",
                },
              ]}
            />
            <Paragrafos>
              <p>
                Não vendemos os seus dados e não os usamos para enviar propaganda sem a sua
                autorização.
              </p>
            </Paragrafos>
          </ParteNumerada>

          {/* ── 04 Com quem compartilhamos ────────────────────────────────── */}
          <ParteNumerada numero={4} id="compartilhamento" titulo="Com quem compartilhamos">
            <Paragrafos>
              <p>
                Os seus dados só passam por serviços necessários para o atendimento e para o site,
                cada um com a sua própria política de privacidade:
              </p>
            </Paragrafos>
            <ListaLegal
              itens={[
                {
                  titulo: "WhatsApp (Meta) e e-mail",
                  texto: "por onde o pedido é enviado e a conversa acontece.",
                },
                {
                  titulo: "Booking.com e Airbnb",
                  texto:
                    "quando a reserva é feita por essas plataformas, os dados são tratados também por elas, conforme as políticas delas.",
                },
                {
                  titulo: "Google",
                  texto:
                    "o mapa da localização (Google Maps) e a fonte do site (Google Fonts) são carregados dos servidores do Google, que recebem dados técnicos da sua visita, como o endereço IP. Se você aceitar os cookies de análise, o Google Analytics também recebe dados de navegação, como as páginas visitadas.",
                },
                {
                  titulo: "Instagram",
                  texto:
                    "as fotos da seção do Instagram são carregadas a partir do perfil público da pousada, por meio do serviço Behold.",
                },
                {
                  titulo: "Hospedagem do site",
                  texto: "o provedor que mantém o site no ar e registra os dados técnicos de acesso.",
                },
                {
                  titulo: "Autoridades",
                  texto: "quando houver obrigação legal ou ordem judicial.",
                },
              ]}
            />
            <Paragrafos>
              <p>
                Alguns desses serviços podem armazenar dados fora do Brasil, sempre dentro das
                hipóteses permitidas pela LGPD.
              </p>
            </Paragrafos>
          </ParteNumerada>

          {/* ── 05 Por quanto tempo guardamos ─────────────────────────────── */}
          <ParteNumerada numero={5} id="prazos" titulo="Por quanto tempo guardamos">
            <ListaLegal
              itens={[
                {
                  titulo: "Pedido em andamento no site",
                  texto:
                    "fica só no seu navegador e é apagado quando você envia o pedido, começa um novo ou limpa os dados do navegador.",
                },
                {
                  titulo: "Conversas e reservas",
                  texto:
                    "pelo tempo necessário ao atendimento e à estadia e, depois, pelos prazos exigidos por lei (por exemplo, fiscais) ou para a defesa de direitos.",
                },
              ]}
            />
            <Paragrafos>
              <p>Passados esses prazos, os dados são apagados ou anonimizados.</p>
            </Paragrafos>
          </ParteNumerada>

          {/* ── 06 Seus direitos ──────────────────────────────────────────── */}
          <ParteNumerada numero={6} id="direitos" titulo="Seus direitos">
            <Paragrafos>
              <p>Pela LGPD (art. 18), você pode, a qualquer momento:</p>
            </Paragrafos>
            <ListaLegal
              itens={[
                { texto: "confirmar se tratamos os seus dados e ter acesso a eles;" },
                { texto: "corrigir dados incompletos, inexatos ou desatualizados;" },
                {
                  texto:
                    "pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desacordo com a lei;",
                },
                { texto: "pedir a portabilidade dos seus dados;" },
                { texto: "saber com quem os seus dados foram compartilhados;" },
                {
                  texto:
                    "revogar um consentimento dado e se opor a um tratamento que considere irregular.",
                },
              ]}
            />
            <Paragrafos>
              <p>
                Para exercer qualquer um desses direitos, escreva para{" "}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Responderemos o quanto antes, dentro dos
                prazos da lei. Você também pode apresentar uma reclamação à Autoridade Nacional de
                Proteção de Dados (ANPD).
              </p>
            </Paragrafos>
          </ParteNumerada>

          {/* ── 07 Segurança e alterações ─────────────────────────────────── */}
          <ParteNumerada numero={7} id="seguranca" titulo="Segurança e alterações">
            <Paragrafos>
              <p>
                Adotamos cuidados técnicos e administrativos para proteger os seus dados, e o
                acesso a eles fica restrito a quem precisa para atender você.
              </p>
              <p>
                Esta política pode ser atualizada quando o site ou a forma de atendimento mudar. A
                versão em vigor é sempre a publicada nesta página.
              </p>
            </Paragrafos>
            <div className="mt-8">
              <AtualizadoEm data={ATUALIZADO_EM} />
            </div>
          </ParteNumerada>
        </div>
      </main>

      <ContatoDuvidas
        titulo="Dúvidas sobre os seus dados?"
        texto={`Fale com a nossa equipe pelo WhatsApp ou pelo e-mail ${EMAIL}.`}
      />

      <Footer />
      <WhatsappButton />
    </div>
  );
}
