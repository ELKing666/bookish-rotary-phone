import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import "../styles.css";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Noor Academy — نور أكاديمي" },
      { name: "description", content: "Noor Academy — مؤسسة تعليمية رائدة في الجزائر تقدم دورات متميزة للأطفال والكبار." },
      { property: "og:title", content: "Noor Academy — نور أكاديمي" },
      { name: "twitter:title", content: "Noor Academy — نور أكاديمي" },
      { property: "og:description", content: "Noor Academy — مؤسسة تعليمية رائدة في الجزائر تقدم دورات متميزة للأطفال والكبار." },
      { name: "twitter:description", content: "Noor Academy — مؤسسة تعليمية رائدة في الجزائر تقدم دورات متميزة للأطفال والكبار." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a9d20228-a01d-4e5f-9953-b2339d943ae4/id-preview-b0edc931--a4321eb3-d48a-4274-b8c8-f2ecf25ded81.lovable.app-1778691016249.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a9d20228-a01d-4e5f-9953-b2339d943ae4/id-preview-b0edc931--a4321eb3-d48a-4274-b8c8-f2ecf25ded81.lovable.app-1778691016249.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }, { rel: "icon", href: "/images/favicon.svg" }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Outlet />
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
