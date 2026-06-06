import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { emailLogs, prospects } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";

export const emailRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        type: z.enum(["automated", "manual"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.type) {
        conditions.push(eq(emailLogs.type, input.type));
      }

      const items = await db
        .select({
          id: emailLogs.id,
          subject: emailLogs.subject,
          body: emailLogs.body,
          type: emailLogs.type,
          opened: emailLogs.opened,
          openCount: emailLogs.openCount,
          sentAt: emailLogs.sentAt,
          prospectName: sql<string>`concat(${prospects.firstName}, ' ', ${prospects.lastName})`,
        })
        .from(emailLogs)
        .leftJoin(prospects, eq(emailLogs.prospectId, prospects.id))
        .where(conditions.length > 0 ? conditions[0] : undefined)
        .orderBy(desc(emailLogs.sentAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(emailLogs)
        .where(conditions.length > 0 ? conditions[0] : undefined);

      return {
        items,
        total: totalResult[0]?.count ?? 0,
        page,
        totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
      };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();

    const totalSent = await db
      .select({ count: sql<number>`count(*)` })
      .from(emailLogs);

    const totalOpened = await db
      .select({ count: sql<number>`count(*)` })
      .from(emailLogs)
      .where(eq(emailLogs.opened, true));

    const sent = totalSent[0]?.count ?? 0;
    const opened = totalOpened[0]?.count ?? 0;

    return {
      totalSent: sent,
      totalOpened: opened,
      averageOpenRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
    };
  }),
});
