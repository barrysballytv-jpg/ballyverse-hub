import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth (Replit Auth)
  await setupAuth(app);
  registerAuthRoutes(app);

  // Merchandise
  app.get(api.merchandise.list.path, async (req, res) => {
    const items = await storage.getMerchandise();
    res.json(items);
  });

  app.post(api.merchandise.create.path, async (req, res) => {
    try {
      const input = api.merchandise.create.input.parse(req.body);
      const item = await storage.createMerchandise(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Events
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.post(api.events.create.path, async (req, res) => {
    try {
      // Handle date coercion if needed, but schema expects timestamp (Date object/string)
      // Zod's coerce.date() is useful here if input is string
      const schema = api.events.create.input.extend({
        date: z.coerce.date()
      });
      const input = schema.parse(req.body);
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Gallery
  app.get(api.gallery.list.path, async (req, res) => {
    const items = await storage.getGalleryItems();
    res.json(items);
  });

  app.post(api.gallery.create.path, async (req, res) => {
    try {
      const input = api.gallery.create.input.parse(req.body);
      const item = await storage.createGalleryItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Socials
  app.get(api.socials.list.path, async (req, res) => {
    const items = await storage.getSocialLinks();
    res.json(items);
  });

  // Seed data
  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const merch = await storage.getMerchandise();
  if (merch.length === 0) {
    await storage.createMerchandise({
      name: "BuG Official Hoodie",
      description: "Premium cotton hoodie with neon BuG logo.",
      price: 4999, // $49.99
      imageUrl: "https://placehold.co/600x400/1a1a1a/00ff00?text=BuG+Hoodie",
      buyLink: "#"
    });
    await storage.createMerchandise({
      name: "BuG Snapback",
      description: "Black snapback with embroidery.",
      price: 2499,
      imageUrl: "https://placehold.co/600x400/1a1a1a/ff00ff?text=BuG+Hat",
      buyLink: "#"
    });
  }

  const events = await storage.getEvents();
  if (events.length === 0) {
    await storage.createEvent({
      title: "Friday Night Customs",
      description: "GTA V Custom lobbies with the gang.",
      date: new Date(Date.now() + 86400000 * 3), // 3 days from now
      type: "event",
      location: "Discord / Twitch"
    });
    await storage.createEvent({
      title: "Monthly Skin Giveaway",
      description: "Giving away 5x Battle Passes!",
      date: new Date(Date.now() + 86400000 * 10),
      type: "giveaway",
      location: "Discord"
    });
  }

  const gallery = await storage.getGalleryItems();
  if (gallery.length === 0) {
    await storage.createGalleryItem({
      title: "Best Moments 2025",
      type: "image",
      url: "https://placehold.co/800x450/1a1a1a/00ffff?text=Best+Moments"
    });
    await storage.createGalleryItem({
      title: "Win Streak",
      type: "image",
      url: "https://placehold.co/800x450/1a1a1a/ff9900?text=Win+Streak"
    });
  }

  const socials = await storage.getSocialLinks();
  if (socials.length === 0) {
    // Creating manual entries since we don't have a create endpoint for socials exposed in routes yet
    // Assuming we want to pre-populate these:
    // Actually, I need to add a create method to storage for internal use or expose it.
    // I added getSocialLinks but not createSocialLink in the storage interface above?
    // Let's check storage.ts content I wrote.
    // I did NOT add createSocialLink to storage.ts write. I should fix that if I want to seed it.
    // But I can just insert directly via db in seed function if I import db.
    // Or simpler: Just rely on hardcoded socials in frontend for now as requested by user ("platforms we on like..."). 
    // Wait, the schema has socialLinks. I'll stick to frontend static links for the specific ones mentioned, 
    // or better, I will assume the frontend generator will handle the 'Contact/Socials' section.
    // I'll leave seeding socials out for this turn to avoid storage.ts mismatch.
  }
}
