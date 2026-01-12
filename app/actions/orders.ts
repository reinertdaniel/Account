'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const orderSchema = z.object({
    description: z.string().min(1, "Description is required"),
    customerName: z.string().optional(),
    status: z.enum(["OPEN", "COMPLETED", "CANCELLED"]).default("OPEN"),
    marketPlace: z.string().optional(),
    notes: z.string().optional(),
    isJobLot: z.boolean().default(false).optional(),
})

export async function getOrders(includeSuppressed = false) {
    const orders = await prisma.order.findMany({
        where: includeSuppressed ? undefined : { suppressed: false },
        orderBy: { createdAt: 'desc' },
        include: {
            transactions: true
        }
    })

    return orders.map((order: any) => ({
        ...order,
        transactions: order.transactions.map((t: any) => ({
            ...t,
            amount: Number(t.amount)
        }))
    }))
}

export async function getOrder(id: string) {
    const order = await prisma.order.findUnique({
        where: { id },
        include: { transactions: { include: { category: true } } }
    })

    if (!order) return null

    return {
        ...order,
        transactions: order.transactions.map((t: any) => ({
            ...t,
            amount: Number(t.amount)
        }))
    }
}

export async function createOrder(data: z.infer<typeof orderSchema>) {
    const result = orderSchema.safeParse(data)
    if (!result.success) {
        return { success: false, error: result.error.issues[0].message }
    }

    try {
        const order = await prisma.order.create({
            data: result.data
        })
        revalidatePath('/orders')
        return { success: true, data: order }
    } catch (error) {
        console.error("FAILED TO CREATE ORDER (Server Action):", error)
        // Return explicit error message if available
        const errorMessage = error instanceof Error ? error.message : "Unknown server error"
        return { success: false, error: `Failed to create order: ${errorMessage}` }
    }
}

export async function updateOrder(id: string, data: Partial<z.infer<typeof orderSchema> & { suppressed?: boolean, isJobLot?: boolean }>) {
    try {
        const order = await prisma.order.update({
            where: { id },
            data
        })
        revalidatePath(`/orders/${id}`)
        revalidatePath('/orders')
        revalidatePath('/')
        return { success: true, data: order }
    } catch (error) {
        return { success: false, error: 'Failed to update order' }
    }
}
