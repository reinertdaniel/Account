import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "@/lib/prisma"

const authInstance = betterAuth({
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

const globalForAuth = globalThis as unknown as {
    auth: typeof authInstance | undefined
}

export const auth = globalForAuth.auth ?? authInstance

if (process.env.NODE_ENV !== "production") globalForAuth.auth = auth
