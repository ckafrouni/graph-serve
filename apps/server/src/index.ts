import 'dotenv/config';
import { trpcServer } from '@hono/trpc-server';
import { createContext } from './lib/context';
import { auth } from './lib/auth';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';

import { appRouter } from './routers/trpc';
import { apiRouter } from './routers/api';
import type { HonoEnv } from './hono.types';

const app = new Hono<HonoEnv>();

app.use(logger());
app.use(
  '/*',
  cors({
    origin: process.env.CORS_ORIGIN || '',
    allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw));

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  })
);

app.use('/api/*', async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set('session', null);
    c.set('user', null);
    return next();
  }

  c.set('session', session.session);
  c.set('user', session.user);
  await next();
});

app.route('/api', apiRouter);

app.get('/', (c) => {
  return c.text('OK');
});

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
