// Fotos de capa do site (Home e cabeçalho das páginas internas) em várias
// resoluções, para o navegador escolher a ideal para cada tela: um celular
// comum baixa a de 1280px; um monitor grande ou retina, a de 2560 ou 3200px.
//
// Os arquivos ficam em src/assets/capas/<nome>-<largura>.webp, gerados a
// partir das fotos ORIGINAIS (nunca de uma versão já reduzida) e sem ampliar
// além do tamanho do original. Larguras usadas: 1280, 1920, 2560 e 3200px
// (ou a largura do original, se for menor que 3200).
//
// Para trocar ou criar uma capa: exporte o original nessas larguras com o
// mesmo nome (ex.: horarios-1280.webp … horarios-3200.webp), coloque na
// pasta e use `capa("horarios")` abaixo.

// "suite-nascer-do-sol-*" e "suite-por-do-sol-*": capas antigas das suítes
// (substituídas por "acomodacao-*"), ignoradas até serem apagadas da pasta.
// "suite-videiras-*" continua: é a capa fixa da página /reservar.
const arquivos = import.meta.glob<string>(
  ["../assets/capas/*.webp", "!**/suite-nascer-do-sol-*", "!**/suite-por-do-sol-*"],
  {
    eager: true,
    import: "default",
  },
);

export interface ImagemCapa {
  /** versão padrão (1920px ou a maior disponível abaixo disso) */
  src: string;
  /** todas as larguras, no formato do atributo srcset */
  srcSet: string;
}

function capa(nome: string): ImagemCapa {
  const versoes = Object.entries(arquivos)
    .map(([caminho, url]) => {
      const m = caminho.match(/\/([^/]+)-(\d+)\.webp$/);
      return m && m[1] === nome ? { largura: Number(m[2]), url } : null;
    })
    .filter((v): v is { largura: number; url: string } => v !== null)
    .sort((a, b) => a.largura - b.largura);

  if (versoes.length === 0) throw new Error(`Capa não encontrada: src/assets/capas/${nome}-*.webp`);

  const padrao = [...versoes].reverse().find((v) => v.largura <= 1920) ?? versoes[0];
  return {
    src: padrao.url,
    srcSet: versoes.map((v) => `${v.url} ${v.largura}w`).join(", "),
  };
}

export const capas = {
  home: capa("home"),
  horarios: capa("horarios"),
  galeria: capa("galeria"),
  politicasERegras: capa("politicas-e-regras"),
  politicaDeCancelamento: capa("politica-de-cancelamento"),
  // original: src/assets/vale.webp (1522px), cortado acima das marcas de
  // busca que havia na base; por isso só 1280 e 1522px
  valeDosVinhedos: capa("vale-dos-vinhedos"),
  // foto fixa do cabeçalho de /reservar (quarto da Videiras)
  reservar: capa("suite-videiras"),
  suites: {
    "nascer-do-sol": capa("acomodacao-nascer-do-sol"),
    videiras: capa("acomodacao-videiras"),
    "por-do-sol": capa("acomodacao-por-do-sol"),
  },
};
