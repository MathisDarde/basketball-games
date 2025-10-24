import { betterAuth } from "better-auth";
import type { BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { Resend } from "resend";
import { nextCookies } from "better-auth/next-js";
import ResetPasswordEmail from "@/components/emails/forgot-password";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "onboarding@resend.dev", // remplacer par mon adresse mail avec mon domaine perso sinon marche pas
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({ user, resetUrl: url }),
      });
    },
  },

  user: {
    additionalFields: {
      favorite_team: {
        type: "string",
        required: true,
        defaultValue: "",
      },
      admin: {
        type: "boolean",
        required: true,
        defaultValue: "false",
      },
      image: {
        type: "string",
        required: false,
        defaultValue: null,
      },
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  plugins: [nextCookies() as unknown as BetterAuthPlugin],
});
