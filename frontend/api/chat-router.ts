import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { chatMessages } from "@db/schema";
import { desc } from "drizzle-orm";
import { z } from "zod";

export const chatRouter = createRouter({
  history: publicQuery
    .input(
      z.object({
        limit: z.number().default(50),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit ?? 50;
      return db
        .select()
        .from(chatMessages)
        .orderBy(desc(chatMessages.createdAt))
        .limit(limit);
    }),

  send: publicQuery
    .input(
      z.object({
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      const userId = ctx.user?.id;

      await db.insert(chatMessages).values({
        userId: userId ?? null,
        role: "user",
        content: input.message,
      });

      const systemPrompt = `Tu es l'assistant IA de Rosita Content Studio, une plateforme de gestion de leads pour créateurs de contenu et coaches. Tu aides Rosita et son équipe avec:
- La gestion des prospects (statuts: froid, chaud, cliente)
- Les stratégies de contenu et growth
- Les conseils business pour coaches et créateurs
- L'analyse des performances (emails, conversions)

Sois concis, chaleureux et professionnel. Réponds en français sauf si on te parle en anglais.`;

      const recentMessages = await db
        .select()
        .from(chatMessages)
        .orderBy(desc(chatMessages.createdAt))
        .limit(10);

      const conversationHistory = recentMessages
        .reverse()
        .map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        }));

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...conversationHistory,
        { role: "user" as const, content: input.message },
      ];

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (!response.ok) {
          throw new Error("AI service unavailable");
        }

        const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
        const aiContent = data.choices?.[0]?.message?.content || "Je suis désolé, je n'ai pas pu générer de réponse.";

        await db.insert(chatMessages).values({
          userId: null,
          role: "assistant",
          content: aiContent,
        });

        return { response: aiContent };
      } catch {
        const fallbackResponse = "Je suis là pour t'aider avec la gestion de tes leads et ta stratégie de contenu ! Pose-moi tes questions sur tes prospects, tes emails ou tes objectifs business.";

        await db.insert(chatMessages).values({
          userId: null,
          role: "assistant",
          content: fallbackResponse,
        });

        return { response: fallbackResponse };
      }
    }),
});
