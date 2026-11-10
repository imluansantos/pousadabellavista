import type { ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Peças de texto das páginas legais (/politica-de-privacidade e
   /politica-de-cookies). Usadas dentro de <ParteNumerada> (PaginaInformativa).
     • <Paragrafos>  parágrafos no tamanho e cor de leitura das políticas;
     • <ListaLegal>  lista com um fio vinho no lugar do marcador; cada item
                     pode ter um título curto em negrito;
     • <AtualizadoEm> data da última atualização, no fim da página.
   ──────────────────────────────────────────────────────────────────────── */

export function Paragrafos({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 space-y-4 text-[0.98rem] leading-relaxed text-foreground/75 [&_a]:font-medium [&_a]:text-wine [&_a]:underline [&_a]:decoration-wine/30 [&_a]:underline-offset-4">
      {children}
    </div>
  );
}

export interface ItemLegal {
  titulo?: string;
  texto: ReactNode;
}

export function ListaLegal({ itens }: { itens: ItemLegal[] }) {
  return (
    <ul className="mt-6 border-b border-foreground/10">
      {itens.map((item, i) => (
        <li
          key={item.titulo ?? i}
          className="flex gap-4 border-t border-foreground/10 py-4 text-[0.96rem] leading-relaxed"
        >
          <span aria-hidden className="mt-[0.7rem] h-px w-4 shrink-0 bg-wine/70" />
          <p className="text-foreground/75">
            {item.titulo && (
              <strong className="font-semibold text-foreground">{item.titulo}: </strong>
            )}
            {item.texto}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function AtualizadoEm({ data }: { data: string }) {
  return (
    <p className="border-t border-foreground/10 pt-6 text-[0.82rem] text-muted-foreground">
      Última atualização: {data}.
    </p>
  );
}
