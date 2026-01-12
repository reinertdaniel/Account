'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["INCOME", "EXPENSE"]),
    context: z.string().optional(),
})

export async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })
}

export async function createCategory(data: z.infer<typeof categorySchema>) {
    const result = categorySchema.safeParse(data)
    if (!result.success) {
        return { success: false, error: result.error.issues[0].message }
    }

    try {
        const category = await prisma.category.create({
            data: result.data
        })
        revalidatePath('/settings') // Revalidate settings page where categories are managed
        return { success: true, data: category }
    } catch (error) {
        return { success: false, error: 'Failed to create category' }
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id }
        })
        revalidatePath('/settings')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete category' }
    }
}
