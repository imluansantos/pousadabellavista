<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Padrão de botões (obrigatório para qualquer botão novo)

Todo botão do site — atual ou novo — deve usar as classes `btn-base` + uma
variante (`btn-primary`, `btn-outline` ou `btn-ghost-light`), definidas em
`src/styles.css`. Essas classes já embutem a animação de hover padrão do
projeto (a mesma do botão "Reservar" do header em `Navbar.tsx`, que é a
referência visual e **não deve ser alterado**):

- um "sweep" diagonal passando por baixo do texto ao passar o mouse;
- leve elevação de sombra no hover;
- se o botão tiver um ícone (ex.: `<ArrowUpRight className="size-3.5" />`
  do `lucide-react`, logo depois do texto), ele desliza sutilmente no
  hover — isso é automático, não precisa de classes extras no ícone.

**Não** crie um botão com estilos "do zero" (bg/border/hover manuais) nem
reintroduza uma transição de `background-color` no hover das variantes —
isso quebra a animação padrão. Se precisar de uma variante de cor nova,
adicione uma nova `@utility btn-*` em `src/styles.css` seguindo o mesmo
padrão das existentes (defina só `background-color`/`border`/`color` e a
variável `--btn-sweep`; a mecânica de sweep/sombra/ícone já vem do
`btn-base` e não deve ser duplicada).

Exceção conhecida: o botão flutuante de WhatsApp (`WhatsappButton.tsx`) é
um ícone circular (FAB), não um CTA em pílula — não segue esse padrão.

Quando o usuário pedir para um sistema de agendamento (ou outra área
totalmente separada do site institucional) ter botões com um visual
diferente, esse padrão não se aplica automaticamente lá — pergunte antes
de reaproveitar `btn-base`.

## Padrão de cabeçalho das páginas internas (obrigatório para toda página nova)

Toda página do site que não seja a Home abre com o componente
`<PageHero />` (`src/components/site/PageHero.tsx`), logo depois do
`<Navbar />`. É o "padrão de imagem no cabeçalho" do site novo:

- foto de ponta a ponta, desde o topo da tela (o menu flutua por cima), com
  só os dois cantos de baixo arredondados, véu escuro em degradê e o zoom
  suave de entrada (`hero-zoom-in`);
- trilha (breadcrumb) em pílula de cor sólida — `Início › … › página atual` —
  no lugar de links do tipo "Voltar ao início". Quando a trilha sai da tela,
  uma cópia dela flutua no canto inferior esquerdo (oposto ao WhatsApp);
  no celular a cópia mostra só `Início › página atual`;
- eyebrow + título (`h1`) + texto opcional (`children`) e, se precisar, uma
  coluna à direita (`aside`), como a busca de `/perguntas-frequentes`.

Fotos de capa em alta resolução: a foto do `PageHero` (e da Hero da Home)
vem de `src/data/capas.ts`, em várias larguras (1280, 1920, 2560 e 3200px,
arquivos `src/assets/capas/<nome>-<largura>.webp`), passada como
`image={capas.<nome>}`. Gere sempre a partir da foto ORIGINAL, sem ampliar
além do tamanho dela. Uma URL simples (`image={foto}`) ainda funciona, mas
fica sem as versões para telas grandes/retina.

Não crie cabeçalhos de página "do zero" nem trilhas/botões de voltar avulsos.
Se uma página precisar de algo a mais no topo, estenda o `PageHero` (nova
prop) em vez de duplicar o markup. Páginas que já usam: `/perguntas-frequentes`
e `/acomodacoes/$slug`.

## Padrão de escrita: sem travessões (obrigatório para todo texto do site)

Nenhum texto visível do site pode ter travessão (`—`) nem meia-risca (`–`).
Vale para qualquer copy nova ou editada: títulos, parágrafos, dados em
`src/data/*`, botões, `alt` de imagens, `aria-label`, `title` de páginas e
iframes, metadados (SEO) e mensagens. O cliente acha que o travessão deixa o
texto com "cara de IA".

Como reescrever em vez de usar o travessão:

- quebre em duas frases: "…mais memorável. É um adicional que você contrata…";
- use vírgula: "a vista do Vale, nas palavras de quem já passou por aqui";
- use dois-pontos quando for uma explicação ou lista: "Notificações: 2 novas";
- em intervalos, escreva por extenso: "8 a 10 min", "8h às 10h";
- em endereços, use vírgula ou barra: "Via Trento, 1118, Vale dos Vinhedos,
  Bento Gonçalves/RS";
- em títulos de página, use "|" ou "no": "Perguntas frequentes | Pousada Bella
  Vista no Vale dos Vinhedos".

Exceções permitidas (aprovadas pelo cliente): travessões DECORATIVOS, que
não fazem parte de uma frase. Ex.: o separador entre horários em destaque
("08h — 10h" no Café da manhã) e os fios ao lado dos eyebrows/títulos das
seções. A regra vale para o travessão no meio do texto corrido.
O hífen comum (`-`) continua permitido onde a língua pede ("check-in",
"pet-friendly", "RS-444"). Comentários de código não entram nessa regra.

## Padrão do título das abas (`<title>`) — obrigatório em toda página

O nome da pousada no título da aba é sempre **"Bella Vista Pousada Familiar"**
(nunca "Pousada Bella Vista"):

- Home (`routes/index.tsx`): `Bella Vista Pousada Familiar | Vale dos Vinhedos`
- qualquer outra página: `<Nome da página> | Bella Vista Pousada Familiar`
  (ex.: `Perguntas frequentes | Bella Vista Pousada Familiar`,
  `Videiras | Bella Vista Pousada Familiar`)
- padrão de reserva (`routes/__root.tsx`): `Bella Vista Pousada Familiar`

## Sistema de reservas (`/reservar`)

Pedido de reserva em 4 etapas (suíte, datas, hóspedes, revisão), finalizado
pelo WhatsApp com a mensagem pronta. Ainda sem back-end.

- Regras de negócio (mínimo de noites, capacidade, bloqueios manuais,
  adicionais): `src/data/reservas.ts`.
- Disponibilidade: planilha do Google Sheets (`PLANILHA` em
  `src/data/reservas.ts`; leitura em `src/lib/reservas/planilha.ts`, por uma
  função de servidor com cache de 1 minuto, conferida de novo no envio).
  Uma linha por reserva: Suíte | Entrada | Saída | Origem | Observação.
  Somada aos bloqueios manuais em `src/lib/reservas/disponibilidade.ts`.
  `/reservar?demo=1` simula datas ocupadas para testes.
- Lógica de hotelaria: reserva-se a NOITE. `fim` de um bloqueio é o dia de
  saída (excluso), então a saída pode cair no dia em que outro hóspede entra.
- Links para a página: `RESERVAR` em `src/data/site.ts`; com suíte já escolhida,
  `<Link to="/reservar" search={{ suite: "videiras" }} />`.
- Campos de formulário usam a classe `campo` (`src/styles.css`).

- Pedido em andamento: salvo sozinho no navegador (localStorage). Ao sair de
  `/reservar` por link ou pelo voltar do site, `reserva/AvisoSaida.tsx` pergunta
  "Quer guardar seu pedido?"; nas outras páginas, `reserva/RetomarReserva.tsx`
  (montado no `__root.tsx`) mostra o cartão "Continuar pedido". Novos links
  não precisam de nada: qualquer `<a>` ou `<Link>` já passa pelo aviso.
