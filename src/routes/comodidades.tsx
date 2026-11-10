import { createFileRoute, redirect } from "@tanstack/react-router";

// A página antiga de Comodidades saiu do site (as fotos dela foram apagadas).
// Este arquivo só redireciona quem ainda acessar /comodidades para a Home.
// Pode ser apagado junto com os outros arquivos antigos de Comodidades.
export const Route = createFileRoute("/comodidades")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
