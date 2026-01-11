import { db } from "./db";
import {
  users, merchandise, events, gallery, socialLinks, teams,
  type User, type InsertUser,
  type Merchandise, type InsertMerchandise,
  type Event, type InsertEvent,
  type GalleryItem, type InsertGalleryItem,
  type SocialLink, type InsertSocialLink,
  type TeamMember, type InsertTeamMember
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
}

export class DatabaseStorage implements IStorage {
  // User methods
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

  // Merchandise methods
  async getMerchandise(): Promise<Merchandise[]> {
    return await db.select().from(merchandise);
  }

  async createMerchandise(item: InsertMerchandise): Promise<Merchandise> {
    const [newItem] = await db.insert(merchandise).values(item).returning();
    return newItem;
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  // Gallery methods
  async getGalleryItems(): Promise<GalleryItem[]> {
    return await db.select().from(gallery);
  }

  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const [newItem] = await db.insert(gallery).values(item).returning();
    return newItem;
  }

  // Socials methods
  async getSocialLinks(): Promise<SocialLink[]> {
    return await db.select().from(socialLinks);
  }

  async createSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    const [newLink] = await db.insert(socialLinks).values(link).returning();
    return newLink;
  }

  // Team methods
  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teams);
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db.insert(teams).values(member).returning();
    return newMember;
  }
}

export const storage = new DatabaseStorage();
