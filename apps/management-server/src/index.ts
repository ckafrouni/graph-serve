import 'dotenv/config';
import { trpcServer } from '@hono/trpc-server';
import { createContext } from './lib/context';
import { auth } from './lib/auth';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';

import { appRouter } from './routers/trpc';
import { env } from './env';

const app = new Hono();

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

app.get('/', (c) => {
	return c.text('OK');
});

serve(
	{
		fetch: app.fetch,
		port: env.PORT,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	}
);
