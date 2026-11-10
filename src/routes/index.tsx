import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Experience } from "@/components/site/Experience";
import { Accommodations } from "@/components/site/Accommodations";
import { Breakfast } from "@/components/site/Breakfast";
import { Gastronomia } from "@/components/site/Gastronomia";
import { Location } from "@/components/site/Location";
import { Experiences } from "@/components/site/Experiences";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { Packages } from "@/components/site/Packages";
import { InstagramFeed } from "@/components/site/InstagramFeed";
import { Faq } from "@/components/site/Faq";
import { PlanejeEstadia } from "@/components/site/PlanejeEstadia";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { EMAIL, INSTAGRAM_URL, TELEFONE } from "@/data/site";
import { NOME_SITE, SITE_URL, seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({
      titulo: "Bella Vista Pousada Familiar | Vale dos Vinhedos",
      descricao: "Pousada familiar no Vale dos Vinhedos. Acomodações confortáveis, café da manhã regional, estacionamento gratuito e pet friendly. Faça sua reserva aqui.",
      caminho: "/",
      imagem: "/og/home.jpg",
      imagemAlt: "Fachada iluminada da Bella Vista Pousada Familiar à noite, no Vale dos Vinhedos",
      descricaoSocial: "Conforto, tranquilidade e a essência do enoturismo no Vale dos Vinhedos. Reserve sua estadia.",
    }),
    // dados estruturados da pousada (nome, endereço, contato, mapa) para o Google
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          name: NOME_SITE,
          description: "Pousada familiar no Vale dos Vinhedos, em Bento Gonçalves/RS.",
          url: `${SITE_URL}/`,
          image: `${SITE_URL}/og/home.jpg`,
          telephone: `+55 ${TELEFONE}`,
          email: EMAIL,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Via Trento, 1118",
            addressLocality: "Bento Gonçalves",
            addressRegion: "RS",
            addressCountry: "BR",
          },
          geo: { "@type": "GeoCoordinates", latitude: -29.1765045, longitude: -51.5506722 },
          checkinTime: "14:00",
          checkoutTime: "12:00",
          petsAllowed: true,
          sameAs: [INSTAGRAM_URL],
        }),
      },
    ],
  }),
  component: Index,
});

// Cada seção da página mora em src/components/site/*.tsx (Hero, Accommodations,
// Gallery etc.) e o conteúdo/constantes compartilhados ficam em
// src/data/site.ts — este arquivo só compõe a ordem das seções na página.
function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Experience />
      <Accommodations />
      <Breakfast />
      <Gastronomia />
      <Location />
      <Experiences />
      <Gallery />
      <Testimonials />
      <Packages />
      <InstagramFeed />
      <Faq />
      <PlanejeEstadia />
      <Footer />
      <WhatsappButton />
    </div>
  );
}
