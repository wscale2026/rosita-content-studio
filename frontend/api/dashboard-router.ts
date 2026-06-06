import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { prospects, payments, emailLogs } from "@db/schema";
import { sql, eq, gte, and, desc } from "drizzle-orm";

export const dashboardRouter = createRouter({
  kpis: publicQuery.query(async () => {
    const db = getDb();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const newProspectsThisWeek = await db
      .select({ count: sql<number>`count(*)` })
      .from(prospects)
      .where(gte(prospects.createdAt, oneWeekAgo));

    const revenueThisMonth = await db
      .select({ total: sql<string>`COALESCE(sum(${payments.amount}), 0)` })
      .from(payments)
      .where(
        and(
          gte(payments.createdAt, oneMonthAgo),
          eq(payments.status, "confirmed")
        )
      );

    const emailsThisMonth = await db
      .select({ count: sql<number>`count(*)` })
      .from(emailLogs)
      .where(gte(emailLogs.sentAt, oneMonthAgo));

    const totalEmailsOpened = await db
      .select({ count: sql<number>`count(*)` })
      .from(emailLogs)
      .where(
        and(
          gte(emailLogs.sentAt, oneMonthAgo),
          eq(emailLogs.opened, true)
        )
      );

    const warmLeadsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(prospects)
      .where(eq(prospects.status, "chaud"));

    const totalClients = await db
      .select({ count: sql<number>`count(*)` })
      .from(prospects)
      .where(eq(prospects.status, "cliente"));

    const totalEmailsSent = emailsThisMonth[0]?.count ?? 0;
    const totalOpened = totalEmailsOpened[0]?.count ?? 0;
    const openRate = totalEmailsSent > 0 ? Math.round((totalOpened / totalEmailsSent) * 100) : 0;

    return {
      newProspectsThisWeek: newProspectsThisWeek[0]?.count ?? 0,
      revenueThisMonth: parseFloat(revenueThisMonth[0]?.total ?? "0"),
      emailsSentThisMonth: totalEmailsSent,
      emailsOpenRate: openRate,
      warmLeadsCount: warmLeadsCount[0]?.count ?? 0,
      totalClients: totalClients[0]?.count ?? 0,
    };
  }),

  recentActivity: publicQuery.query(async () => {
    const db = getDb();

    const recentProspects = await db
      .select({
        id: prospects.id,
        name: sql<string>`concat(${prospects.firstName}, ' ', ${prospects.lastName})`,
        date: prospects.createdAt,
        status: prospects.status,
      })
      .from(prospects)
      .orderBy(desc(prospects.createdAt))
      .limit(5);

    const recentPayments = await db
      .select({
        id: payments.id,
        amount: payments.amount,
        date: payments.createdAt,
        productName: payments.productName,
      })
      .from(payments)
      .orderBy(desc(payments.createdAt))
      .limit(5);

    const activity = [
      ...recentProspects.map((p) => ({
        type: "prospect" as const,
        description: `${p.name} s'est inscrit(e)`,
        date: p.date,
        value: p.status,
      })),
      ...recentPayments.map((p) => ({
        type: "payment" as const,
        description: `Paiement reçu : ${p.productName}`,
        date: p.date,
        value: `${p.amount} €`,
      })),
    ];

    activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return activity.slice(0, 10);
  }),

  statusBreakdown: publicQuery.query(async () => {
    const db = getDb();

    const results = await db
      .select({
        status: prospects.status,
        count: sql<number>`count(*)`,
      })
      .from(prospects)
      .groupBy(prospects.status);

    return {
      froid: results.find((r) => r.status === "froid")?.count ?? 0,
      chaud: results.find((r) => r.status === "chaud")?.count ?? 0,
      cliente: results.find((r) => r.status === "cliente")?.count ?? 0,
    };
  }),
});
