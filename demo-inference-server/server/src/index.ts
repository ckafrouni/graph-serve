import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';

import { apiRouter } from './routers/api';
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

app.route('/api', apiRouter);

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
