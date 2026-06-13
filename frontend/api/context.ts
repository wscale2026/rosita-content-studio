import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  try {
    const sessionUser = await authenticateRequest(opts.req.headers);
    // Dev shortcut: if the session belongs to the mock dev user, skip DB lookup
    if (sessionUser && (sessionUser as any).unionId === "dev-mock-id") {
      ctx.user = {
        id: 1,
        unionId: "dev-mock-id",
        name: "Admin Dev",
        email: "admin@rosita.local",
        avatar: "",
        role: "admin",
        lastSignInAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } else {
      ctx.user = sessionUser;
    }
  } catch {
    // Authentication is optional here
  }

  // Bypass login completely in development
  /*
  if (process.env.NODE_ENV !== "production" && !ctx.user) {
    ctx.user = {
      id: 1,
      unionId: "dev-mock-id",
      name: "Admin Dev",
      email: "admin@dev.local",
      avatar: "",
      role: "admin",
      lastSignInAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  */

  return ctx;
}
