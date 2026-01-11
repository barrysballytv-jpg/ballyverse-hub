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

  // Events
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  // Gallery
  app.get(api.gallery.list.path, async (req, res) => {
    const items = await storage.getGalleryItems();
    res.json(items);
  });

  // Socials
  app.get(api.socials.list.path, async (req, res) => {
    const items = await storage.getSocialLinks();
    res.json(items);
  });

  // Teams
  app.get(api.teams.list.path, async (req, res) => {
    const members = await storage.getTeamMembers();
    res.json(members);
  });

  // Seed data
  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  // Seed Socials
  const socials = await storage.getSocialLinks();
  if (socials.length === 0) {
    await storage.createSocialLink({ platform: "Instagram", url: "https://www.instagram.com/bally_upgang?igsh=Z2dobTk3aHVzcXox" });
    await storage.createSocialLink({ platform: "TikTok", url: "https://www.tiktok.com/@bally_up_gang?_r=1&_t=ZS-92yvkx2TrxV" });
  }

  // Seed Teams
  const members = await storage.getTeamMembers();
  if (members.length === 0) {
    await storage.createTeamMember({ name: "Founder Name", role: "Founder", bio: "Leading the BALLY UP GANG.", isVip: false });
    await storage.createTeamMember({ name: "VIP Supporter", role: "Elite Supporter", bio: "Legendary BuG member.", isVip: true });
  }

  const merch = await storage.getMerchandise();
  if (merch.length === 0) {
    await storage.createMerchandise({
      name: "BuG Gold Edition Hoodie",
      description: "Premium black hoodie with gold embroidery.",
      price: 5999,
      imageUrl: "https://placehold.co/600x400/000000/D4AF37?text=Gold+BuG+Hoodie",
      buyLink: "#"
    });
  }
}
