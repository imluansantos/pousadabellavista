import { Award, Star } from "lucide-react";
import { Hero10 } from "@/components/ui/hero-10";
import { avaliacoes, RESERVAR, WHATSAPP } from "@/data/site";
import imgAcomodacao from "@/assets/cta/acomodacao.webp";
import imgVale from "@/assets/cta/vale.webp";
import imgQuarto from "@/assets/cta/quarto.webp";

/* ─────────────────────────────────────────────────────────────────────────────
   PLANEJE SUA ESTADIA — última seção da Home (logo após o FAQ)

   Bloco "Hero 10" do 21st.dev (src/components/ui/hero-10.tsx), em fundo
   branco: convite acolhedor, dois botões e as notas das avaliações; embaixo,
   três fotos em leque (a acomodação, o Vale e a cama de um quarto) que se abrem
   quando a seção aparece e são cortadas pela borda, encostando no rodapé.

   Fotos recortadas em 4:5 e otimizadas em src/assets/cta/. As notas vêm de
   `avaliacoes` em src/data/site.ts (as mesmas do rodapé).
   ──────────────────────────────────────────────────────────────────────── */

const nota = (fonte: string) => avaliacoes.find((a) => a.fonte.startsWith(fonte))?.nota;

export function PlanejeEstadia() {
  const google = nota("Google");
  const booking = nota("Booking");
  const travelers = avaliacoes.find((a) => a.fonte.startsWith("Travelers"));

  const selos = [
    google && { valor: google, texto: "no Google" },
    booking && { valor: booking, texto: "no Booking.com" },
    travelers && { valor: travelers.fonte.replace("Travelers'", "Travelers’"), texto: "" },
  ].filter((s): s is { valor: string; texto: string } => Boolean(s));

  return (
    <div id="planeje-sua-estadia">
      <Hero10
        eyebrow="Planeje sua estadia"
        title="Venha viver o Vale dos Vinhedos"
        titleHighlight="com a gente."
        description={
          <>
            <span className="sm:hidden">
              Escolha sua acomodação, confira as datas e venha com calma: a vista e o café da manhã
              estão esperando por você.
            </span>
            <span className="hidden sm:inline">
              Escolha sua acomodação, confira as datas e venha com calma: a vista, o café da manhã e
              o carinho de uma pousada familiar estão esperando por você.
            </span>
          </>
        }
        animation="subtle"
        primaryCTA={{ text: <Rotulo curto="Ver datas" longo="Ver datas disponíveis" />, href: RESERVAR }}
        secondaryCTA={{ text: <Rotulo curto="Fale conosco" longo="Falar com a gente" />, href: WHATSAPP, external: true }}
        socialProof={
          selos.length > 0 && (
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.82rem] text-muted-foreground sm:gap-x-5">
              {selos.map((s, i) => (
                <li key={s.valor} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <span aria-hidden className="mr-3.5 hidden size-1 rounded-full bg-foreground/20 sm:block" />
                  )}
                  {s.texto ? (
                    <>
                      <Star aria-hidden className="size-3.5 fill-wine text-wine" />
                      <span className="font-semibold text-foreground">{s.valor}</span>
                      {s.texto}
                    </>
                  ) : (
                    <>
                      <Award aria-hidden className="size-3.5 text-wine" strokeWidth={1.75} />
                      <span className="font-medium text-foreground/80">{s.valor}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )
        }
        images={[imgAcomodacao, imgVale, imgQuarto]}
        imageAlts={[
          "Acomodação da pousada com poltronas azuis, mesinhas de madeira e a cama ao fundo",
          "Vinhedos do Vale dos Vinhedos, com as montanhas ao fundo",
          "Cama de casal arrumada com manta coral, travesseiros e toalhas, numa acomodação da pousada",
        ]}
      />
    </div>
  );
}

/** rótulo curto no celular (botões lado a lado) e o completo do sm em diante */
function Rotulo({ curto, longo }: { curto: string; longo: string }) {
  return (
    <>
      <span className="sm:hidden">{curto}</span>
      <span className="hidden sm:inline">{longo}</span>
    </>
  );
}
