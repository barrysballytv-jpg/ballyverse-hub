import { db } from "./db";
import {
  merchandise, events, gallery, socialLinks, teams, streams, suggestions, scores, preorders,
  type Merchandise, type InsertMerchandise,
  type Event, type InsertEvent,
  type GalleryItem, type InsertGalleryItem,
  type SocialLink, type InsertSocialLink,
  type TeamMember, type InsertTeamMember,
  type Stream, type InsertStream,
  type Suggestion, type InsertSuggestion,
  type Score, type InsertScore,
  type Preorder, type InsertPreorder
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getMerchandise(): Promise<Merchandise[]>;
  createMerchandise(item: InsertMerchandise): Promise<Merchandise>;

  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;

  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;

  getSocialLinks(): Promise<SocialLink[]>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;

  getTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;

  getStreams(): Promise<Stream[]>;
  createStream(stream: InsertStream): Promise<Stream>;

  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;

  createScore(score: InsertScore): Promise<Score>;
  getTopScores(game: string, limit?: number): Promise<Score[]>;
  getUserScores(userId: string): Promise<Score[]>;

  createPreorder(preorder: InsertPreorder): Promise<Preorder>;
  getUserPreorders(userId: string): Promise<Preorder[]>;
}

export class DatabaseStorage implements IStorage {
  async getMerchandise(): Promise<Merchandise[]> {
    return await db.select().from(merchandise);
  }

  async createMerchandise(item: InsertMerchandise): Promise<Merchandise> {
    const [newItem] = await db.insert(merchandise).values(item).returning();
    return newItem;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async getGalleryItems(): Promise<GalleryItem[]> {
    return await db.select().from(gallery);
  }

  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const [newItem] = await db.insert(gallery).values(item).returning();
    return newItem;
  }

  async getSocialLinks(): Promise<SocialLink[]> {
    return await db.select().from(socialLinks);
  }

  async createSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    const [newLink] = await db.insert(socialLinks).values(link).returning();
    return newLink;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teams);
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db.insert(teams).values(member).returning();
    return newMember;
  }

  async getStreams(): Promise<Stream[]> {
    return await db.select().from(streams);
  }

  async createStream(stream: InsertStream): Promise<Stream> {
    const [newStream] = await db.insert(streams).values(stream).returning();
    return newStream;
  }

  async createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion> {
    const [newSuggestion] = await db.insert(suggestions).values(suggestion).returning();
    return newSuggestion;
  }

  async createScore(score: InsertScore): Promise<Score> {
    const [newScore] = await db.insert(scores).values(score).returning();
    return newScore;
  }

  async getTopScores(game: string, limit = 10): Promise<Score[]> {
    return await db.select().from(scores).where(eq(scores.game, game)).orderBy(desc(scores.score)).limit(limit);
  }

  async getUserScores(userId: string): Promise<Score[]> {
    return await db.select().from(scores).where(eq(scores.userId, userId)).orderBy(desc(scores.score));
  }

  async createPreorder(preorder: InsertPreorder): Promise<Preorder> {
    const [newPreorder] = await db.insert(preorders).values(preorder).returning();
    return newPreorder;
  }

  async getUserPreorders(userId: string): Promise<Preorder[]> {
    return await db.select().from(preorders).where(eq(preorders.userId, userId)).orderBy(desc(preorders.createdAt));
  }
}

export const storage = new DatabaseStorage();
