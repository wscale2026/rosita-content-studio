import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { dashboardRouter } from "./dashboard-router";
import { prospectRouter } from "./prospect-router";
import { paymentRouter } from "./payment-router";
import { emailRouter } from "./email-router";
import { resourceRouter } from "./resource-router";
import { chatRouter } from "./chat-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  dashboard: dashboardRouter,
  prospect: prospectRouter,
  payment: paymentRouter,
  email: emailRouter,
  resource: resourceRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
