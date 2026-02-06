
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./auth-schema"; 
import { Resend } from "resend";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            ...schema
        }
    }),
    emailAndPassword: {  
        enabled: true,
        async sendResetPassword({ url, user }) {
            if (!user || !user.email) return;
            const resendApiKey = process.env.RESEND_API_KEY;
            if (!resendApiKey) {
                throw new Error("RESEND_API_KEY is not set");
            }
            const resend = new Resend(resendApiKey);
            await resend.emails.send({
                from: "onboarding@resend.dev", // Should be verified domain in prod
                to: user.email,
                subject: "Reset your password",
                html: `Click <a href="${url}">here</a> to reset your password`,
            });
        },
        // We will enable email verification as requested implicitly by "sending emails for password incorrect"? 
        // User said "sending emails for password incorrect use resend free tier". 
        // This is slightly ambiguous, might mean reset password or typical auth flows. 
        // I'll cover reset password. "password incorrect" usually just shows an error, not sends an email. 
        // Assuming they mean "Forgot Password".
    },
    socialProviders: { 
       google: { 
           clientId: process.env.GOOGLE_CLIENT_ID as string, 
           clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
       }, 
    },
});
