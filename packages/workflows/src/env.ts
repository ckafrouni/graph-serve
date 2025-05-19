import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {
		OPENAI_API_KEY: z.string().min(1),
		OPENAI_CHAT_MODEL: z.string().min(1).default('gpt-4.1'),
		TAVILY_API_KEY: z.string().min(1),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
