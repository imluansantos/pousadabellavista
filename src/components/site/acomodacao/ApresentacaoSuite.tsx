import { Images } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { todasAsFotos, type Acomodacao } from "@/data/acomodacoes";

/* ─────────────────────────────────────────────────────────────────────────────
   A SUÍTE (seção 2: apresentação e galeria)

   Continua o cabeçalho (que já traz o nome, a foto principal e o botão de
   reserva): texto curto e específico, a faixa da ficha (área, hóspedes,
   camas e banheiros; só os itens preenchidos em data/acomodacoes.ts), os
   diferenciais reais e um mosaico com três fotos. Cada
   foto do mosaico abre a galeria completa naquela posição.
   ──────────────────────────────────────────────────────────────────────── */

export function ApresentacaoSuite({
  acomodacao: a,
  onAbrirGaleria,
}: {
  acomodacao: Acomodacao;
  onAbrirGaleria: (indice: number) => void;
}) {
  const fotos = todasAsFotos(a);
  // uma foto de cada um dos três primeiros ambientes
  const mosaico = a.ambientes.slice(0, 3).map((amb) => {
    const indice = fotos.findIndex((f) => f.ambiente.id === amb.id);
    return { ...fotos[indice], indice };
  });

  const ficha = montarFicha(a);

  return (
    <section aria-labelledby="suite-titulo" className="py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-10">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">A suíte</p>
          <h2 id="suite-titulo" className="mt-4 font-display text-[2rem] leading-[1.1] sm:text-[2.6rem]">
            {a.chamada}
          </h2>
          <p className="mt-6 max-w-[52ch] text-[1.02rem] leading-relaxed text-muted-foreground">
            {a.texto}
          </p>

          {ficha.length > 0 && (
            <dl
              className="mt-8 grid gap-2 sm:gap-3"
              style={{ gridTemplateColumns: `repeat(${ficha.length}, minmax(0, 1fr))` }}
            >
              {ficha.map(({ valor, label }) => (
                <div
                  key={label}
                  className="flex flex-col-reverse items-center justify-center rounded-xl border border-foreground/10 bg-card px-1.5 py-4 text-center sm:px-2 sm:py-5"
                >
                  {/* dt antes do dd no HTML (leitores de tela leem "Área: 33 m²");
                      flex-col-reverse mostra o número em cima */}
                  <dt className="mt-2 text-[0.74rem] leading-tight text-muted-foreground sm:text-[0.8rem]">
                    {label}
                  </dt>
                  <dd
                    className="font-display text-[1.2rem] leading-none font-bold tracking-[-0.02em] sm:text-[1.45rem]"
                    style={{ color: "hsl(var(--theme-color))" }}
                  >
                    {valor}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="mt-8 space-y-0">
            {a.destaques.map((d) => (
              <li
                key={d}
                className="flex items-center gap-4 border-t border-foreground/10 py-3.5 text-[0.95rem] font-medium last:border-b"
              >
                <span
                  aria-hidden
                  className="h-px w-5 shrink-0"
                  style={{ backgroundColor: "hsl(var(--theme-color))" }}
                />
                {d}
              </li>
            ))}
          </ul>

        </Reveal>

        <Reveal delay={120} className="lg:col-span-7">
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {mosaico.map(({ foto, ambiente, indice }, i) => {
              const principal = i === 0;
              const ultimo = i === mosaico.length - 1;
              return (
                <button
                  key={ambiente.id}
                  type="button"
                  onClick={() => onAbrirGaleria(indice)}
                  aria-label={
                    ultimo
                      ? `Ver a galeria completa da suíte ${a.nome}, ${fotos.length} fotos`
                      : `Ampliar foto: ${foto.alt}`
                  }
                  className={`group zoom-media relative overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine ${
                    principal
                      ? "col-span-3 row-span-2"
                      : "col-span-2 aspect-[4/5] sm:aspect-[4/3.4]"
                  }`}
                >
                  <img
                    src={principal ? foto.grande : foto.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {ultimo && (
                    <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/75 via-ink/25 to-transparent p-3 sm:p-4">
                      <span className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[0.75rem] font-semibold text-ink shadow-sm sm:text-[0.8rem]">
                        <Images aria-hidden className="size-3.5" strokeWidth={1.75} />
                        {fotos.length} fotos
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** itens da faixa da ficha, na ordem: área, hóspedes, camas, banheiros */
function montarFicha(a: Acomodacao): { valor: string; label: string }[] {
  const f = a.ficha;
  if (!f) return [];
  const itens: { valor: string; label: string }[] = [];
  if (f.area) itens.push({ valor: `${f.area} m²`, label: "Área" });
  if (f.hospedes) itens.push({ valor: `Até ${f.hospedes}`, label: "Hóspedes" });
  if (f.camas) {
    const cama = f.camas === 1 ? "Cama" : "Camas";
    itens.push({ valor: String(f.camas), label: f.tipoCama ? `${cama} ${f.tipoCama}` : cama });
  }
  if (f.banheiros) {
    itens.push({ valor: String(f.banheiros), label: f.banheiros === 1 ? "Banheiro" : "Banheiros" });
  }
  return itens;
}
