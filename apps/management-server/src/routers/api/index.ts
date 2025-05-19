import { Hono } from 'hono';
import workflowsRouter from './workflows';

export const apiRouter = new Hono();

apiRouter.get('/', (c) => {
	return c.json({ message: 'Hello, world!' });
});

apiRouter.route('/workflows', workflowsRouter);
