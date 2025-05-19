import Loader from '@/components/loader';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@workspace/ui/components/ui/sonner';
import type { trpc } from '@/utils/trpc';
import type { QueryClient } from '@tanstack/react-query';
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router';
import '@workspace/ui/styles/globals.css';
import { NotFound } from '@/components/not-found';

export interface RouterAppContext {
  trpc: typeof trpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  notFoundComponent: () => <NotFound link={{ label: 'Check Status', to: '/status' }} />,
  head: () => ({
    meta: [{ title: 'GraphServe Studio' }],
    links: [{ rel: 'icon', href: '/favicon.ico' }],
  }),
});

function RootComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });

  return (
    <>
      <HeadContent />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="grid h-svh grid-rows-[auto_1fr]">
          {isFetching ? <Loader /> : <Outlet />}
        </div>
        <Toaster richColors />
      </ThemeProvider>
    </>
  );
}
