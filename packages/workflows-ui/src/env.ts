import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const runtimeEnv =
	typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'
		? import.meta.env
		: process.env;

export const env = createEnv({
	client: {
		VITE_GRAPH_SERVER_URL: z.string().min(1),
	},
	clientPrefix: 'VITE_',
	runtimeEnv,
});
