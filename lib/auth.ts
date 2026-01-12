import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "@/lib/prisma"

const globalForAuth = globalThis as unknown as {
    auth: typeof auth | undefined
}

export const auth = globalForAuth.auth ?? betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
})

if (process.env.NODE_ENV !== "production") globalForAuth.auth = auth
