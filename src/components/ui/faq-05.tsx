import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Bloco "FAQ 5" do 21st.dev (Hirael — https://hirael.com/blocks/faqs/faq-05,
// MIT · Mohammad Shehadeh), integrado ao projeto.
// Ajustes para o site da pousada:
//   • a introdução e as perguntas vêm por prop (`intro`, `items`);
//   • a caixa ganha fundo próprio, fios no tom do site e as cruzes nos cantos
//     (as mesmas dos cards de depoimentos), para conversar com as outras seções;
//   • cada pergunta tem número (01, 02…), e a aberta ganha o tom vinho e um fio
//     que percorre a linha — no lugar do sublinhado do original;
//   • proporção 5/7 no desktop (o texto da esquerda é mais curto que a lista);
//   • no celular (< 640px) respiros e textos um pouco menores.
// A estrutura (intro à esquerda separada por um fio, acordeão à direita,
// uma pergunta aberta por vez) é a do bloco original.

export type FaqItem = { id: string; q: string; a: string };

function Cruz({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      className={cn(
        "pointer-events-none absolute z-1 size-3.5 stroke-1 text-foreground/35",
        className,
      )}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export function Faq05({
  intro,
  items,
  defaultValue,
  className,
}: {
  intro: ReactNode;
  items: FaqItem[];
  defaultValue?: string;
  className?: string;
}) {
  return (
    <div
      data-slot="faq"
      className={cn(
        "relative mx-auto grid w-full max-w-6xl grid-cols-1 border-y border-foreground/10 bg-background md:grid-cols-12 md:border-x",
        className,
      )}
    >
      <Cruz className="top-0 left-0 hidden -translate-x-1/2 -translate-y-1/2 md:block" />
      <Cruz className="top-0 right-0 hidden translate-x-1/2 -translate-y-1/2 md:block" />
      <Cruz className="bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 md:block" />
      <Cruz className="right-0 bottom-0 hidden translate-x-1/2 translate-y-1/2 md:block" />

      <div
        data-slot="faq-intro"
        className="flex flex-col border-b border-foreground/10 px-5 pt-7 pb-6 sm:px-6 sm:pt-10 sm:pb-8 md:col-span-5 md:border-e md:border-b-0 md:px-10 md:py-12 lg:px-12"
      >
        {intro}
      </div>

      <div
        data-slot="faq-list"
        className="flex flex-col justify-center px-5 py-1 sm:px-6 sm:py-3 md:col-span-7 md:px-8 md:py-6 lg:px-10"
      >
        <Accordion
          type="single"
          collapsible
          {...(defaultValue ? { defaultValue } : {})}
          className="w-full"
        >
          {items.map((item, i) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="group/faq relative border-foreground/10 last:border-b-0"
            >
              {/* fio vinho que percorre a linha da pergunta aberta */}
              <span
                aria-hidden
                className="absolute -bottom-px left-0 z-1 h-px w-0 bg-wine/60 transition-[width] duration-700 ease-out group-data-[state=open]/faq:w-full"
              />
              <AccordionTrigger className="gap-4 py-3.5 text-left text-[0.92rem] sm:gap-5 sm:py-[1.15rem] sm:text-[0.97rem] font-semibold tracking-[-0.01em] hover:no-underline hover:text-wine data-[state=open]:text-wine [&>svg]:size-4 [&>svg]:text-foreground/40 [&[data-state=open]>svg]:text-wine">
                <span className="flex items-baseline gap-3 sm:gap-4">
                  <span className="w-5 shrink-0 font-display text-[0.7rem] font-semibold tracking-[0.12em] text-foreground/35 tabular-nums transition-colors group-data-[state=open]/faq:text-wine">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item.q}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pr-6 pb-4 pl-8 text-[0.88rem] sm:pr-9 sm:pb-5 sm:pl-9 sm:text-[0.95rem] leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default Faq05;
