import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertMerchandise, type InsertEvent, type InsertGalleryItem } from "@shared/routes";

// ================= MERCHANDISE =================
export function useMerchandise() {
  return useQuery({
    queryKey: [api.merchandise.list.path],
    queryFn: async () => {
      const res = await fetch(api.merchandise.list.path);
      if (!res.ok) throw new Error("Failed to fetch merchandise");
      return api.merchandise.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMerchandise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMerchandise) => {
      const res = await fetch(api.merchandise.create.path, {
        method: api.merchandise.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create merchandise");
      return api.merchandise.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.merchandise.list.path] }),
  });
}

// ================= EVENTS =================
export function useEvents() {
  return useQuery({
    queryKey: [api.events.list.path],
    queryFn: async () => {
      const res = await fetch(api.events.list.path);
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.events.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEvent) => {
      // Ensure date is properly formatted if needed, or Zod will handle coercing if set up correctly
      // But based on schema, it expects Date object, JSON will stringify it.
      // Ideally schema handles string -> Date coercion. Assuming it does or is handled by backend.
      const res = await fetch(api.events.create.path, {
        method: api.events.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return api.events.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.events.list.path] }),
  });
}

// ================= GALLERY =================
export function useGallery() {
  return useQuery({
    queryKey: [api.gallery.list.path],
    queryFn: async () => {
      const res = await fetch(api.gallery.list.path);
      if (!res.ok) throw new Error("Failed to fetch gallery");
      return api.gallery.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertGalleryItem) => {
      const res = await fetch(api.gallery.create.path, {
        method: api.gallery.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create gallery item");
      return api.gallery.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.gallery.list.path] }),
  });
}

// ================= SOCIALS =================
export function useSocials() {
  return useQuery({
    queryKey: [api.socials.list.path],
    queryFn: async () => {
      const res = await fetch(api.socials.list.path);
      if (!res.ok) throw new Error("Failed to fetch socials");
      return api.socials.list.responses[200].parse(await res.json());
    },
  });
}

// ================= TEAM MEMBERS =================
export function useTeamMembers() {
  return useQuery({
    queryKey: [api.teams.list.path],
    queryFn: async () => {
      const res = await fetch(api.teams.list.path);
      if (!res.ok) throw new Error("Failed to fetch team members");
      return api.teams.list.responses[200].parse(await res.json());
    },
  });
}
