import { relations } from "drizzle-orm";
import { users, prospects, payments, emailLogs, chatMessages } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  chatMessages: many(chatMessages),
}));

export const prospectsRelations = relations(prospects, ({ many }) => ({
  payments: many(payments),
  emails: many(emailLogs),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  prospect: one(prospects, {
    fields: [payments.prospectId],
    references: [prospects.id],
  }),
}));

export const emailLogsRelations = relations(emailLogs, ({ one }) => ({
  prospect: one(prospects, {
    fields: [emailLogs.prospectId],
    references: [prospects.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));
