import { z } from 'zod';
import { 
  insertUserSchema, 
  insertMerchSchema, 
  insertEventSchema, 
  insertGallerySchema, 
  insertSocialLinkSchema,
  insertTeamSchema,
  users,
  merchandise,
  events,
  gallery,
  socialLinks,
  teams
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  merchandise: {
    list: {
      method: 'GET' as const,
      path: '/api/merchandise',
      responses: {
        200: z.array(z.custom<typeof merchandise.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/merchandise',
      input: insertMerchSchema,
      responses: {
        201: z.custom<typeof merchandise.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events',
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/events',
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  gallery: {
    list: {
      method: 'GET' as const,
      path: '/api/gallery',
      responses: {
        200: z.array(z.custom<typeof gallery.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/gallery',
      input: insertGallerySchema,
      responses: {
        201: z.custom<typeof gallery.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  socials: {
    list: {
      method: 'GET' as const,
      path: '/api/socials',
      responses: {
        200: z.array(z.custom<typeof socialLinks.$inferSelect>()),
      },
    },
  },
  teams: {
    list: {
      method: 'GET' as const,
      path: '/api/teams',
      responses: {
        200: z.array(z.custom<typeof teams.$inferSelect>()),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
