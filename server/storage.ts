import { db } from "./db";
import {
  users, merchandise, events, gallery, socialLinks, teams, streams, suggestions,
  type User, type InsertUser,
  type Merchandise, type InsertMerchandise,
  type Event, type InsertEvent,
  type GalleryItem, type InsertGalleryItem,
  type SocialLink, type InsertSocialLink,
  type TeamMember, type InsertTeamMember,
  type Stream, type InsertStream,
  type Suggestion, type InsertSuggestion
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Merchandise
  getMerchandise(): Promise<Merchandise[]>;
  createMerchandise(item: InsertMerchandise): Promise<Merchandise>;

  // Events
  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Gallery
  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;

  // Socials
  getSocialLinks(): Promise<SocialLink[]>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;

  // Teams
  getTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;

  // Streams
  getStreams(): Promise<Stream[]>;
  createStream(stream: InsertStream): Promise<Stream>;

  // Suggestions
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

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
    const [newItem] = await db.insert(gallery).from(gallery).values(item).returning();
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
}

export const storage = new DatabaseStorage();
