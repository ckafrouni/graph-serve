import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {
		CORS_ORIGIN: z.string().min(1),
		PORT: z.number().default(8080),

		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.string().url(),
		GITHUB_CLIENT_ID: z.string().min(1).optional(),
		GITHUB_CLIENT_SECRET: z.string().min(1).optional(),

		DATABASE_URL: z.string().url(),
	},
	runtimeEnv: process.env,
});
