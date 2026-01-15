import { db } from "./db";
import {
  users, merchandise, events, gallery, socialLinks, teams, streams, suggestions,
  galleryComments, galleryReactions,
  type User, type InsertUser,
  type Merchandise, type InsertMerchandise,
  type Event, type InsertEvent,
  type GalleryItem, type InsertGalleryItem,
  type SocialLink, type InsertSocialLink,
  type TeamMember, type InsertTeamMember,
  type Stream, type InsertStream,
  type Suggestion, type InsertSuggestion,
  type GalleryComment, type InsertGalleryComment,
  type GalleryReaction, type InsertGalleryReaction
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // ... existing methods
  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  
  // Comments
  getCommentsByGalleryItem(itemId: number): Promise<(GalleryComment & { user: User })[]>;
  createComment(comment: InsertGalleryComment): Promise<GalleryComment>;
  
  // Reactions
  getReactionsByGalleryItem(itemId: number): Promise<GalleryReaction[]>;
  toggleReaction(reaction: InsertGalleryReaction): Promise<void>;
  
  // ... rest of interface

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
    const [newItem] = await db.insert(gallery).values(item).returning();
    return newItem;
  }

  async getCommentsByGalleryItem(itemId: number): Promise<(GalleryComment & { user: User })[]> {
    const results = await db
      .select({
        comment: galleryComments,
        user: users,
      })
      .from(galleryComments)
      .where(eq(galleryComments.galleryItemId, itemId))
      .leftJoin(users, eq(galleryComments.userId, users.id));

    return results.map(r => ({
      ...r.comment,
      user: r.user!,
    }));
  }

  async createComment(comment: InsertGalleryComment): Promise<GalleryComment> {
    const [newComment] = await db.insert(galleryComments).values(comment).returning();
    return newComment;
  }

  async getReactionsByGalleryItem(itemId: number): Promise<GalleryReaction[]> {
    return await db.select().from(galleryReactions).where(eq(galleryReactions.galleryItemId, itemId));
  }

  async toggleReaction(reaction: InsertGalleryReaction): Promise<void> {
    const existing = await db
      .select()
      .from(galleryReactions)
      .where(
        and(
          eq(galleryReactions.galleryItemId, reaction.galleryItemId),
          eq(galleryReactions.userId, reaction.userId),
          eq(galleryReactions.type, reaction.type)
        )
      );

    if (existing.length > 0) {
      await db
        .delete(galleryReactions)
        .where(
          and(
            eq(galleryReactions.galleryItemId, reaction.galleryItemId),
            eq(galleryReactions.userId, reaction.userId),
            eq(galleryReactions.type, reaction.type)
          )
        );
    } else {
      await db.insert(galleryReactions).values(reaction);
    }
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
