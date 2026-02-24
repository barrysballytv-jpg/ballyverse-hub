import { z } from 'zod';
import { 
  insertMerchSchema, 
  insertEventSchema, 
  insertGallerySchema, 
  insertSocialLinkSchema,
  insertTeamSchema,
  insertStreamSchema,
  insertSuggestionSchema,
  insertScoreSchema,
  insertPreorderSchema,
  merchandise,
  events,
  gallery,
  socialLinks,
  teams,
  streams,
  suggestions,
  scores,
  preorders
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
  },
  streams: {
    list: {
      method: 'GET' as const,
      path: '/api/streams',
      responses: {
        200: z.array(z.custom<typeof streams.$inferSelect>()),
      },
    },
  },
  suggestions: {
    create: {
      method: 'POST' as const,
      path: '/api/suggestions',
      input: insertSuggestionSchema,
      responses: {
        201: z.object({ message: z.string() }),
        400: errorSchemas.validation,
      },
    },
  },
  scores: {
    submit: {
      method: 'POST' as const,
      path: '/api/scores',
      input: insertScoreSchema,
      responses: {
        201: z.custom<typeof scores.$inferSelect>(),
        400: errorSchemas.validation,
        401: z.object({ message: z.string() }),
      },
    },
    leaderboard: {
      method: 'GET' as const,
      path: '/api/scores/leaderboard/:game',
      responses: {
        200: z.array(z.custom<typeof scores.$inferSelect>()),
      },
    },
    user: {
      method: 'GET' as const,
      path: '/api/scores/me',
      responses: {
        200: z.array(z.custom<typeof scores.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
  },
  preorders: {
    create: {
      method: 'POST' as const,
      path: '/api/preorders',
      input: insertPreorderSchema,
      responses: {
        201: z.custom<typeof preorders.$inferSelect>(),
        400: errorSchemas.validation,
        401: z.object({ message: z.string() }),
      },
    },
    user: {
      method: 'GET' as const,
      path: '/api/preorders/me',
      responses: {
        200: z.array(z.custom<typeof preorders.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
  },
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
