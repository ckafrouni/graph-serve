import { protectedProcedure, publicProcedure, router } from '../../lib/trpc';

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return 'OK';
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: 'This is private',
      user: ctx.session.user,
    };
  }),
  pythonTest: publicProcedure.query(async () => {
    const response = await fetch('http://localhost:8001/');
    return response.json();
  }),
});
export type AppRouter = typeof appRouter;
