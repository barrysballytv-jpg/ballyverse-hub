import type { Express } from "express";
import express from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { z } from "zod";
import path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  // Serve attached assets
  app.use("/attached_assets", express.static(path.resolve(import.meta.dirname, "../attached_assets")));

  app.get(api.merchandise.list.path, async (req, res) => {
    const items = await storage.getMerchandise();
    res.json(items);
  });

  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.gallery.list.path, async (req, res) => {
    const items = await storage.getGalleryItems();
    res.json(items);
  });

  app.get(api.socials.list.path, async (req, res) => {
    const items = await storage.getSocialLinks();
    res.json(items);
  });

  app.get(api.teams.list.path, async (req, res) => {
    const members = await storage.getTeamMembers();
    res.json(members);
  });

  app.get(api.streams.list.path, async (req, res) => {
    const streams = await storage.getStreams();
    res.json(streams);
  });

  app.post(api.suggestions.create.path, async (req, res) => {
    try {
      const input = api.suggestions.create.input.parse(req.body);
      await storage.createSuggestion(input);
      
      // Email placeholder: in a real production app we'd use a service like SendGrid
      // For now we log it as per the user's request not to show the email address
      console.log(`[EMAIL SENT TO balliedupgang@gmail.com] Type: ${input.type}, From: ${input.name}, Message: ${input.message}`);
      
      res.status(201).json({ message: "Thank you for your feedback! The gang has received it." });
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

  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const socials = await storage.getSocialLinks();
  if (socials.length === 0) {
    await storage.createSocialLink({ platform: "Instagram", url: "https://www.instagram.com/bally_upgang?igsh=Z2dobTk3aHVzcXox" });
    await storage.createSocialLink({ platform: "TikTok", url: "https://www.tiktok.com/@bally_up_gang?_r=1&_t=ZS-92yvkx2TrxV" });
  }

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

  const streams = await storage.getStreams();
  if (streams.length === 0) {
    await storage.createStream({ streamerName: "BallyUpOfficial", platform: "Twitch", url: "https://twitch.tv/ballyupgang", isLive: true });
    await storage.createStream({ streamerName: "BuG_Master", platform: "Kick", url: "https://kick.com/bugmaster", isLive: false });
  }
}
