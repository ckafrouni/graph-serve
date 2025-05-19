import { Hono } from 'hono';
import type { HonoEnv } from '@/hono.types';
import {
  streamMessages,
  type StreamableWorkflow,
  HumanMessage,
} from '@workspace/workflows/hono-adaptors/langgraph/stream';
import { workflowSelector } from '@workspace/workflows';

const router = new Hono<HonoEnv>();

router.post('/messages', async (c) => {
  const { prompt, workflow: workflowName } = await c.req.json<{
    prompt: string;
    workflow?: string;
  }>();

  if (!workflowName || !workflowSelector(workflowName)) {
    return c.json({ error: 'Missing or invalid workflow' }, 400);
  }

  const user = c.get('user');
  if (!user?.id) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  if (!prompt) {
    return c.json({ error: 'Missing prompt' }, 400);
  }

  const selectedWorkflow = workflowSelector(workflowName);

  return streamMessages(selectedWorkflow as StreamableWorkflow, c, {
    userId: user.id,
    messages: [
      new HumanMessage({
        content: prompt,
      }),
    ],
  });
});

export default router;
