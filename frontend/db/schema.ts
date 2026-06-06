import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["admin", "editor", "viewer"]).default("editor").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const prospects = mysqlTable("prospects", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  status: mysqlEnum("status", ["froid", "chaud", "cliente"]).default("froid").notNull(),
  source: varchar("source", { length: 100 }),
  guidesDownloaded: int("guidesDownloaded").default(0),
  emailsOpened: int("emailsOpened").default(0),
  callBooked: boolean("callBooked").default(false),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Prospect = typeof prospects.$inferSelect;
export type InsertProspect = typeof prospects.$inferInsert;

export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  prospectId: bigint("prospectId", { mode: "number", unsigned: true }).references(() => prospects.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR"),
  status: mysqlEnum("status", ["confirmed", "pending", "refunded"]).default("pending"),
  productName: varchar("productName", { length: 255 }),
  geniusPayId: varchar("geniusPayId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export const emailLogs = mysqlTable("emailLogs", {
  id: serial("id").primaryKey(),
  prospectId: bigint("prospectId", { mode: "number", unsigned: true }).references(() => prospects.id),
  subject: varchar("subject", { length: 500 }).notNull(),
  body: text("body"),
  type: mysqlEnum("type", ["automated", "manual"]).default("automated"),
  opened: boolean("opened").default(false),
  openCount: int("openCount").default(0),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

export const resources = mysqlTable("resources", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("originalName", { length: 255 }),
  mimeType: varchar("mimeType", { length: 100 }),
  size: int("size"),
  description: varchar("description", { length: 500 }),
  downloadCount: int("downloadCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

export const chatMessages = mysqlTable("chatMessages", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => users.id),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
