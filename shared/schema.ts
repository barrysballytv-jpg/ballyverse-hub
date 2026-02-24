import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  isVip: boolean("is_vip").default(false),
});

export const merchandise = pgTable("merchandise", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  buyLink: text("buy_link"), 
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(),
  location: text("location"), 
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  category: text("category").notNull().default("Best Moments"),
  url: text("url").notNull(),
});

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), 
  url: text("url").notNull(),
});

export const streams = pgTable("streams", {
  id: serial("id").primaryKey(),
  streamerName: text("streamer_name").notNull(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  isLive: boolean("is_live").default(false),
});

export const suggestions = pgTable("suggestions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  game: text("game").notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const preorders = pgTable("preorders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  merchandiseId: integer("merchandise_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({ id: true });
export const insertMerchSchema = createInsertSchema(merchandise).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertGallerySchema = createInsertSchema(gallery).omit({ id: true });
export const insertSocialLinkSchema = createInsertSchema(socialLinks).omit({ id: true });
export const insertStreamSchema = createInsertSchema(streams).omit({ id: true });
export const insertSuggestionSchema = createInsertSchema(suggestions).omit({ id: true, createdAt: true });
export const insertScoreSchema = createInsertSchema(scores).omit({ id: true, createdAt: true });
export const insertPreorderSchema = createInsertSchema(preorders).omit({ id: true, createdAt: true, status: true });

export type TeamMember = typeof teams.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamSchema>;

export type Merchandise = typeof merchandise.$inferSelect;
export type InsertMerchandise = z.infer<typeof insertMerchSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type GalleryItem = typeof gallery.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGallerySchema>;

export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;

export type Stream = typeof streams.$inferSelect;
export type InsertStream = z.infer<typeof insertStreamSchema>;

export type Suggestion = typeof suggestions.$inferSelect;
export type InsertSuggestion = z.infer<typeof insertSuggestionSchema>;

export type Score = typeof scores.$inferSelect;
export type InsertScore = z.infer<typeof insertScoreSchema>;

export type Preorder = typeof preorders.$inferSelect;
export type InsertPreorder = z.infer<typeof insertPreorderSchema>;
