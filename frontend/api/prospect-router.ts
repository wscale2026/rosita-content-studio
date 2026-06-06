import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { prospects, emailLogs, payments } from "@db/schema";
import { eq, like, or, desc, sql } from "drizzle-orm";
import { z } from "zod";

export const prospectRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        status: z.enum(["froid", "chaud", "cliente"]).optional(),
        search: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(10),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const offset = (page - 1) * limit;

      let query = db.select().from(prospects);
      let countQuery = db.select({ count: sql<number>`count(*)` }).from(prospects);

      const conditions = [];

      if (input?.status) {
        conditions.push(eq(prospects.status, input.status));
      }

      if (input?.search) {
        const searchTerm = `%${input.search}%`;
        conditions.push(
          or(
            like(prospects.firstName, searchTerm),
            like(prospects.lastName, searchTerm),
            like(prospects.email, searchTerm)
          )
        );
      }

      if (conditions.length > 0) {
        const whereClause = conditions.length === 1 ? conditions[0] : sql`${conditions[0]} AND ${conditions[1]}`;
        query = query.where(whereClause) as typeof query;
        countQuery = countQuery.where(whereClause) as typeof countQuery;
      }

      const items = await query
        .orderBy(desc(prospects.createdAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await countQuery;
      const total = totalResult[0]?.count ?? 0;

      return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();

      const prospect = await db
        .select()
        .from(prospects)
        .where(eq(prospects.id, input.id))
        .limit(1);

      if (!prospect[0]) return null;

      const prospectEmails = await db
        .select()
        .from(emailLogs)
        .where(eq(emailLogs.prospectId, input.id))
        .orderBy(desc(emailLogs.sentAt));

      const prospectPayments = await db
        .select()
        .from(payments)
        .where(eq(payments.prospectId, input.id))
        .orderBy(desc(payments.createdAt));

      return {
        ...prospect[0],
        emails: prospectEmails,
        payments: prospectPayments,
      };
    }),

  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["froid", "chaud", "cliente"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(prospects)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(prospects.id, input.id));
      return { success: true };
    }),

  sendEmail: publicQuery
    .input(
      z.object({
        prospectId: z.number(),
        subject: z.string().min(1),
        body: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(emailLogs).values({
        prospectId: input.prospectId,
        subject: input.subject,
        body: input.body,
        type: "manual",
      });
      return { success: true };
    }),
});
