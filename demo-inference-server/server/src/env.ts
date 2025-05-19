import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {
		CORS_ORIGIN: z.string().min(1),

		PORT: z.number().default(1234),

		OPENAI_API_KEY: z.string().min(1),
		TAVILY_API_KEY: z.string().min(1),
	},
	runtimeEnv: process.env,
});
