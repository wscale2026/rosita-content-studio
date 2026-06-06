import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { resources } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";

export const resourceRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(resources)
      .orderBy(desc(resources.updatedAt));
  }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        filename: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(resources)
        .set({
          ...(input.filename && { filename: input.filename }),
          ...(input.description && { description: input.description }),
          updatedAt: new Date(),
        })
        .where(eq(resources.id, input.id));
      return { success: true };
    }),

  trackDownload: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(resources)
        .set({
          downloadCount: sql`${resources.downloadCount} + 1`,
        })
        .where(eq(resources.id, input.id));
      return { success: true };
    }),
});
