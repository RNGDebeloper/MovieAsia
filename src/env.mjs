import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    ADMIN_USERNAME: z.string().optional(),
    ADMIN_PASSWORD: z.string().optional(),
    ADMIN_SESSION_SECRET: z.string().optional(),
    MAINTENANCE_MODE: z.enum(['true', 'false']).optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_TMDB_TOKEN: z.string().default(''),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
    NEXT_PUBLIC_SITE_NAME: z.string().default('Ottfree'),
    NEXT_PUBLIC_DEFAULT_VIDEO_SERVER: z.string().optional(),
    NEXT_PUBLIC_DISABLED_VIDEO_SERVERS: z.string().optional(),
    NEXT_PUBLIC_MAINTENANCE_MESSAGE: z.string().optional(),
    NEXT_PUBLIC_ANNOUNCEMENT_TITLE: z.string().optional(),
    NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE: z.string().optional(),
    NEXT_PUBLIC_ANNOUNCEMENT_LINK: z.string().url().optional(),
    NEXT_PUBLIC_TWITTER: z.string().url().optional(),
    NEXT_PUBLIC_FACEBOOK: z.string().url().optional(),
    NEXT_PUBLIC_INSTAGRAM: z.string().url().optional(),
    NEXT_PUBLIC_YOUTUBE: z.string().url().optional(),
    NEXT_PUBLIC_ADS_HEAD_CODE: z.string().optional(),
    NEXT_PUBLIC_AD_TOP_BANNER_CODE: z.string().optional(),
    NEXT_PUBLIC_AD_NATIVE_DISCOVERY_CODE: z.string().optional(),
    NEXT_PUBLIC_AD_WATCH_TOP_CODE: z.string().optional(),
    NEXT_PUBLIC_AD_WATCH_VAST_CODE: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
    NEXT_PUBLIC_TMDB_TOKEN: process.env.NEXT_PUBLIC_TMDB_TOKEN ?? '',
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID:
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Ottfree',
    NEXT_PUBLIC_DEFAULT_VIDEO_SERVER:
      process.env.NEXT_PUBLIC_DEFAULT_VIDEO_SERVER,
    NEXT_PUBLIC_DISABLED_VIDEO_SERVERS:
      process.env.NEXT_PUBLIC_DISABLED_VIDEO_SERVERS,
    NEXT_PUBLIC_MAINTENANCE_MESSAGE:
      process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE,
    NEXT_PUBLIC_ANNOUNCEMENT_TITLE: process.env.NEXT_PUBLIC_ANNOUNCEMENT_TITLE,
    NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE:
      process.env.NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE,
    NEXT_PUBLIC_ANNOUNCEMENT_LINK: process.env.NEXT_PUBLIC_ANNOUNCEMENT_LINK,
    NEXT_PUBLIC_TWITTER: process.env.NEXT_PUBLIC_TWITTER ?? 'https://x.com',
    NEXT_PUBLIC_FACEBOOK:
      process.env.NEXT_PUBLIC_FACEBOOK ?? 'https://facebook.com',
    NEXT_PUBLIC_INSTAGRAM:
      process.env.NEXT_PUBLIC_INSTAGRAM ?? 'https://instagram.com',
    NEXT_PUBLIC_YOUTUBE:
      process.env.NEXT_PUBLIC_YOUTUBE ?? 'https://youtube.com',
    NEXT_PUBLIC_ADS_HEAD_CODE: process.env.NEXT_PUBLIC_ADS_HEAD_CODE,
    NEXT_PUBLIC_AD_TOP_BANNER_CODE: process.env.NEXT_PUBLIC_AD_TOP_BANNER_CODE,
    NEXT_PUBLIC_AD_NATIVE_DISCOVERY_CODE:
      process.env.NEXT_PUBLIC_AD_NATIVE_DISCOVERY_CODE,
    NEXT_PUBLIC_AD_WATCH_TOP_CODE: process.env.NEXT_PUBLIC_AD_WATCH_TOP_CODE,
    NEXT_PUBLIC_AD_WATCH_VAST_CODE: process.env.NEXT_PUBLIC_AD_WATCH_VAST_CODE,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
