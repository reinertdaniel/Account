"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const settingSchema = z.object({
    key: z.string(),
    value: z.string(),
    description: z.string().optional(),
})

export async function getSettings() {
    try {
        const settings = await prisma.setting.findMany()
        return { success: true, data: settings }
    } catch (error) {
        console.error("Failed to get settings:", error)
        return { success: false, error: "Failed to get settings" }
    }
}

export async function getSettingByKey(key: string) {
    try {
        const setting = await prisma.setting.findUnique({
            where: { key }
        })
        return { success: true, data: setting }
    } catch (error) {
        console.error(`Failed to get setting ${key}:`, error)
        return { success: false, error: `Failed to get setting ${key}` }
    }
}

export async function updateSetting(key: string, value: string, description?: string) {
    try {
        const setting = await prisma.setting.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description },
        })
        revalidatePath("/settings")
        revalidatePath("/settings/flags")
        console.log(`Updated setting ${key}: ${value}`)
        return { success: true, data: setting }
    } catch (error) {
        console.error(`Failed to update setting ${key}:`, error)
        return { success: false, error: `Failed to update setting ${key}: ${error}` }
    }
}
