import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .default("postgresql://postgres:postgres@localhost:5432/musicdistro"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET: z
      .string()
      .default("weplugmusic-secret-key-32chars-min-needed-for-auth"),
    NEXTAUTH_URL: z
      .preprocess(
        (str) => process.env.VERCEL_URL ?? str,
        process.env.VERCEL ? z.string() : z.string().url().default("http://localhost:3000"),
      )
      .default("http://localhost:3000"),
    GOOGLE_CLIENT_SECRET: z.string().default("dummy_google_client_secret"),
    GOOGLE_CLIENT_ID: z.string().default("dummy_google_client_id"),
    SEND_GRID_API_KEY: z.string().default("dummy_sendgrid_key"),
    PASSWORD_RESET_TEMPLATE_ID: z.string().default("dummy_password_reset"),
    VERIFY_EMAIL_TEMPLATE_ID: z.string().default("dummy_verify_email"),
    MUSIC_RELEASE_TEMPLATE_ID: z.string().default("dummy_music_release"),
    RELEASE_NOTIFICATION_TEMPLATE_ID: z
      .string()
      .default("dummy_release_notification"),
    BUCKET_ACCESS_KEY_ID: z.string().default("dummy_bucket_id"),
    BUCKET_SECRET_ACCESS_KEY: z.string().default("dummy_bucket_secret"),
    BUCKET_NAME: z.string().default("dummy_bucket_name"),
    SUPPORT_TICKET_TEMPLATE_ID: z.string().default("dummy_support_ticket"),
  },

  client: {
    NEXT_PUBLIC_EXCHANGE_RATE_API_KEY: z.string().default("dummy_rate"),
    NEXT_PUBLIC_HOME_URL: z.string().default("http://localhost:3000"),
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().default("dummy_paystack"),
    NEXT_PUBLIC_BACKEND_URL: z.string().default("http://localhost:3000"),
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().default("sb"),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_EXCHANGE_RATE_API_KEY:
      process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY,
    PASSWORD_RESET_TEMPLATE_ID: process.env.PASSWORD_RESET_TEMPLATE_ID,
    VERIFY_EMAIL_TEMPLATE_ID: process.env.VERIFY_EMAIL_TEMPLATE_ID,
    MUSIC_RELEASE_TEMPLATE_ID: process.env.MUSIC_RELEASE_TEMPLATE_ID,
    RELEASE_NOTIFICATION_TEMPLATE_ID:
      process.env.RELEASE_NOTIFICATION_TEMPLATE_ID,
    SUPPORT_TICKET_TEMPLATE_ID: process.env.SUPPORT_TICKET_TEMPLATE_ID,
    NEXT_PUBLIC_HOME_URL:
      process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000",
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "dummy_paystack",
    BUCKET_ACCESS_KEY_ID:
      process.env.BUCKET_ACCESS_KEY_ID || "dummy_bucket_id",
    BUCKET_SECRET_ACCESS_KEY:
      process.env.BUCKET_SECRET_ACCESS_KEY || "dummy_bucket_secret",
    BUCKET_NAME: process.env.BUCKET_NAME || "dummy_bucket_name",
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",
    NEXT_PUBLIC_PAYPAL_CLIENT_ID:
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
  },
  skipValidation: true,
  emptyStringAsUndefined: false,
});
