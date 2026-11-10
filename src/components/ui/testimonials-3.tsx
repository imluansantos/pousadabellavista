import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Componente "Testimonials 3" do 21st.dev, integrado ao projeto.
// Ajustes para o site da pousada:
//   • os depoimentos vêm por prop (`testimonials`) em vez de fixos no arquivo;
//   • sem foto: o avatar mostra a inicial do nome (AvatarFallback);
//   • abaixo do nome aparece só o papel ("Hóspede"), sem empresa;
//   • cores do avatar no tom vinho do site;
//   • 3 colunas só a partir de 1024px (no tablet os cards ficavam estreitos
//     demais); abaixo disso, uma coluna centralizada;
//   • degraus da cascata de 2rem (eram 3rem), para a seção ficar mais compacta;
//   • no celular (< 640px) o card tem respiro interno e texto um pouco menores.
// Estrutura do card (linhas de "corte", cruz decorativa, aspas e degraus em
// cascata no desktop) é a do componente original.

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

function DecorIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-0 left-0 z-1 size-3.5 shrink-0 -translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%+0.5px)] stroke-1 stroke-muted-foreground",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function QuoteIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

export function TestimonialsSection({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-xl gap-8 lg:max-w-5xl lg:grid-cols-3 lg:gap-6",
        className,
      )}
    >
      {testimonials.map((testimonial, index) => (
        <TestimonialCard index={index} key={testimonial.name} testimonial={testimonial} />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
  className,
  ...props
}: React.ComponentProps<"figure"> & {
  testimonial: Testimonial;
  index: number;
}) {
  const { quote, name, role } = testimonial;

  return (
    <figure
      className={cn(
        "group relative flex flex-col justify-between gap-5 px-6 pt-6 pb-5 shadow-xs sm:gap-6 sm:px-8 sm:pt-8 sm:pb-6 lg:translate-y-[calc(2rem*var(--t-card-index))]",
        className,
      )}
      style={
        {
          "--t-card-index": index,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="absolute -inset-y-4 -left-px w-px bg-border" />
      <div className="absolute -inset-y-4 -right-px w-px bg-border" />
      <div className="absolute -inset-x-4 -top-px h-px bg-border" />
      <div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
      <DecorIcon />

      <blockquote className="flex gap-4">
        <QuoteIcon aria-hidden="true" className="size-6 shrink-0 stroke-1 text-wine/60" />

        <p className="flex-1 text-[0.95rem] leading-relaxed font-normal text-muted-foreground sm:text-base">
          {quote}
        </p>
      </blockquote>

      <figcaption className="flex items-center gap-3">
        <Avatar className="size-10 rounded-full ring-2 ring-border ring-offset-2 ring-offset-background transition-shadow group-hover:ring-wine/30">
          <AvatarFallback className="bg-wine/10 font-display text-sm font-bold text-wine">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <cite className="text-sm font-medium text-foreground not-italic">{name}</cite>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export default TestimonialsSection;
