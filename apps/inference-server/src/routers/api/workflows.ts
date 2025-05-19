import { Hono } from 'hono';
import {
	streamMessages,
	type StreamableWorkflow,
	HumanMessage,
} from '@/lib/langgraph-hono-adaptors';
import { workflowSelector } from '@workspace/workflows';

const router = new Hono();

router.post('/messages', async (c) => {
	const { prompt, workflow: workflowName } = await c.req.json<{
		prompt: string;
		workflow?: string;
	}>();

	if (!workflowName || !workflowSelector(workflowName)) {
		return c.json({ error: 'Missing or invalid workflow' }, 400);
	}

	if (!prompt) {
		return c.json({ error: 'Missing prompt' }, 400);
	}

	const selectedWorkflow = workflowSelector(workflowName);

	return streamMessages(selectedWorkflow as StreamableWorkflow, c, {
		messages: [
			new HumanMessage({
				content: prompt,
			}),
		],
	});
});

export default router;
