'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const transactionSchema = z.object({
    amount: z.number().min(0.01, "Amount must be positive"),
    type: z.enum(["INCOME", "EXPENSE"]),
    description: z.string().optional(),
    categoryId: z.string().uuid("Category is required"),
    orderId: z.string().uuid().optional().nullable(),
    date: z.string().or(z.date()), // Accept string from form, convert to date
    tags: z.string().optional(),
})

export async function createTransaction(data: z.infer<typeof transactionSchema>) {
    const result = transactionSchema.safeParse(data)
    if (!result.success) {
        return { success: false, error: result.error.issues[0].message }
    }

    try {
        const transaction = await prisma.transaction.create({
            data: {
                ...result.data,
                date: new Date(result.data.date), // Ensure Date object
            }
        })
        revalidatePath('/finances')
        revalidatePath('/orders/' + (result.data.orderId || ''))
        revalidatePath('/')
        revalidatePath('/', 'layout') // Update sidebar stats
        return {
            success: true,
            data: {
                ...transaction,
                amount: Number(transaction.amount) // Ensure serializable return
            }
        }
    } catch (error) {
        console.error(error)
        return { success: false, error: 'Failed to create transaction' }
    }
}

export async function getTransactions(includeSuppressed = false) {
    const transactions = await prisma.transaction.findMany({
        where: includeSuppressed ? undefined : {
            AND: [
                { suppressed: false },
                {
                    OR: [
                        { orderId: null },
                        { order: { suppressed: false } }
                    ]
                }
            ]
        },
        orderBy: { date: 'desc' },
        include: { category: true, order: true }
    })

    return transactions.map((t: any) => ({
        ...t,
        amount: Number(t.amount)
    }))
}

export async function updateTransaction(id: string, data: { suppressed?: boolean }) {
    try {
        const transaction = await prisma.transaction.update({
            where: { id },
            data
        })
        revalidatePath('/finances')
        revalidatePath('/')
        if (transaction.orderId) revalidatePath(`/orders/${transaction.orderId}`)
        revalidatePath('/', 'layout') // Update sidebar stats
        return { success: true, data: transaction }
    } catch (error) {
        return { success: false, error: 'Failed to update transaction' }
    }
}

export async function deleteTransaction(id: string) {
    try {
        const transaction = await prisma.transaction.findUnique({ where: { id } })
        await prisma.transaction.delete({ where: { id } })

        revalidatePath('/finances')
        revalidatePath('/')
        if (transaction?.orderId) {
            revalidatePath(`/orders/${transaction.orderId}`)
        }
        revalidatePath('/', 'layout') // Update sidebar stats

        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete transaction' }
    }
}
