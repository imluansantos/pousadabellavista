import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { RolagemSemHash } from "@/components/site/RolagemSemHash";
import { RetomarReserva } from "@/components/site/reserva/RetomarReserva";
import { AvisoCookies } from "@/components/site/AvisoCookies";
import { PaginaNaoEncontrada } from "@/components/site/PaginaNaoEncontrada";
import { reportLovableError } from "../lib/lovable-error-reporting";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // página 404: nenhuma rota atende o endereço (o TanStack marca a rota
  // raiz com `_notFound`). Cada página define o próprio SEO com seo() (lib/seo.ts);
  // a descrição abaixo só vale para a 404.
  head: ({ match }) => {
    const naoEncontrada = Boolean(match._notFound) || match.status === "notFound";
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          title: naoEncontrada
            ? "Página não encontrada | Bella Vista Pousada Familiar"
            : "Bella Vista Pousada Familiar",
        },
        ...(naoEncontrada ? [{ name: "robots", content: "noindex" }] : []),
        {
          name: "description",
          content:
            "Pousada familiar no Vale dos Vinhedos, em Bento Gonçalves/RS, com acomodações confortáveis e café da manhã incluso.",
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap",
        },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      ],
    };
  },

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: PaginaNaoEncontrada,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      {/* links para seções sem "#" na URL (ver o componente) */}
      <RolagemSemHash />
      {/* "Você tem um pedido em andamento" fora de /reservar */}
      <RetomarReserva />
      {/* aviso de cookies + Google Analytics (só com VITE_GA_ID e após "Aceitar") */}
      <AvisoCookies />
    </QueryClientProvider>
  );
}
