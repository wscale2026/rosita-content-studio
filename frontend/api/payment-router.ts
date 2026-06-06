import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { payments, prospects } from "@db/schema";
import { eq, desc, sql, gte, and } from "drizzle-orm";
import { z } from "zod";

export const paymentRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        status: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.status) {
        conditions.push(eq(payments.status, input.status as "confirmed" | "pending" | "refunded"));
      }

      const items = await db
        .select({
          id: payments.id,
          amount: payments.amount,
          currency: payments.currency,
          status: payments.status,
          productName: payments.productName,
          geniusPayId: payments.geniusPayId,
          createdAt: payments.createdAt,
          prospectName: sql<string>`concat(${prospects.firstName}, ' ', ${prospects.lastName})`,
        })
        .from(payments)
        .leftJoin(prospects, eq(payments.prospectId, prospects.id))
        .where(conditions.length > 0 ? conditions[0] : undefined)
        .orderBy(desc(payments.createdAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(payments)
        .where(conditions.length > 0 ? conditions[0] : undefined);

      return {
        items,
        total: totalResult[0]?.count ?? 0,
        page,
        totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
      };
    }),

  summary: publicQuery.query(async () => {
    const db = getDb();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const totalRevenue = await db
      .select({ total: sql<string>`COALESCE(sum(${payments.amount}), 0)` })
      .from(payments)
      .where(eq(payments.status, "confirmed"));

    const confirmedCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(payments)
      .where(eq(payments.status, "confirmed"));

    const pendingCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(payments)
      .where(eq(payments.status, "pending"));

    const monthlyRevenue = await db
      .select({
        total: sql<string>`COALESCE(sum(${payments.amount}), 0)`,
      })
      .from(payments)
      .where(
        and(
          eq(payments.status, "confirmed"),
          gte(payments.createdAt, oneMonthAgo)
        )
      );

    return {
      totalRevenue: parseFloat(totalRevenue[0]?.total ?? "0"),
      monthlyRevenue: parseFloat(monthlyRevenue[0]?.total ?? "0"),
      confirmedCount: confirmedCount[0]?.count ?? 0,
      pendingCount: pendingCount[0]?.count ?? 0,
    };
  }),
});
