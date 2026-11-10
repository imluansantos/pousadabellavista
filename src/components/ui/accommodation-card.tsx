import * as React from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";

// Card de acomodação — nome/descrição sobre a foto e uma cor de assinatura
// própria por acomodação, usada no glow, no overlay e nos dois selos:
//   • "Conhecer a acomodação" → página dedicada (/acomodacoes/<slug>). O
//     link é "esticado" (::after) e cobre o card inteiro, então clicar em
//     qualquer ponto da foto também leva à página;
//   • "Reservar" → sistema de reservas (externo), por cima do link esticado.
interface AccommodationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  description: string;
  /** slug da página dedicada: /acomodacoes/<slug> */
  slug: string;
  /** link de reserva */
  href: string;
  themeColor: string; // hsl "H S% L%", ex: "28 65% 52%"
}

const AccommodationCard = React.forwardRef<HTMLDivElement, AccommodationCardProps>(
  ({ className, imageUrl, name, description, slug, href, themeColor, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ "--theme-color": themeColor } as React.CSSProperties}
        className={cn("group h-full w-full", className)}
        {...props}
      >
        <article
          className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)]"
          style={{ boxShadow: "0 0 40px -15px hsl(var(--theme-color) / 0.5)" }}
        >
          {/* Foto */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Overlay com a cor da acomodação */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, hsl(var(--theme-color) / 0.9), hsl(var(--theme-color) / 0.6) 30%, transparent 60%)`,
            }}
          />

          {/* Conteúdo */}
          <div className="relative flex h-full flex-col justify-end p-6 text-white">
            <h3 className="text-3xl font-bold tracking-tight">{name}</h3>
            <p className="mt-1 text-sm font-medium text-white/80">{description}</p>

            {/* Os selos só animam o próprio texto/ícone no hover (grupos
                locais), sem mudar de tamanho. */}
            <div className="mt-8 grid gap-2.5">
              <Link
                to="/acomodacoes/$slug"
                params={{ slug }}
                aria-label={`Conhecer a acomodação ${name}`}
                className="group/conhecer flex items-center justify-between rounded-lg border border-white/25 px-4 py-3 transition-colors duration-300 after:absolute after:inset-0 after:content-[''] hover:border-white/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="text-sm font-semibold tracking-wide transition-[letter-spacing] duration-300 group-hover/conhecer:tracking-widest">
                  Conhecer a acomodação
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/conhecer:translate-x-1" />
              </Link>

              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Reservar a acomodação ${name}`}
                className="group/reservar relative z-10 flex items-center justify-between rounded-lg border px-4 py-3 backdrop-blur-md transition-all duration-300 hover:border-[hsl(var(--theme-color)/0.5)] hover:bg-[hsl(var(--theme-color)/0.4)]"
                style={{
                  backgroundColor: "hsl(var(--theme-color) / 0.2)",
                  borderColor: "hsl(var(--theme-color) / 0.3)",
                }}
              >
                <span className="text-sm font-semibold tracking-wide transition-[letter-spacing] duration-300 group-hover/reservar:tracking-widest">
                  Reservar
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/reservar:translate-x-0.5 group-hover/reservar:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </article>
      </div>
    );
  },
);
AccommodationCard.displayName = "AccommodationCard";

export { AccommodationCard };
export type { AccommodationCardProps };
