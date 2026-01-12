'use server'

import prisma from '@/lib/prisma'

export async function getFinancialStats() {
    const now = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(now.getDate() - 30)

    // Fetch all NON-SUPPRESSED transactions
    // Note: We need to handle the cascading suppression logic here too
    const transactions = await prisma.transaction.findMany({
        where: {
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
        select: {
            amount: true,
            type: true,
            date: true
        }
    })

    let lifetimeIncome = 0
    let lifetimeExpense = 0
    let last30DaysIncome = 0
    let last30DaysExpense = 0

    transactions.forEach(t => {
        const val = Number(t.amount)
        const isIncome = t.type === 'INCOME'
        const date = new Date(t.date)

        // Lifetime
        if (isIncome) lifetimeIncome += val
        else lifetimeExpense += val

        // Last 30 Days
        if (date >= thirtyDaysAgo && date <= now) {
            if (isIncome) last30DaysIncome += val
            else last30DaysExpense += val
        }
    })

    return {
        lifetime: {
            income: lifetimeIncome,
            expense: lifetimeExpense,
            profit: lifetimeIncome - lifetimeExpense
        },
        last30Days: {
            income: last30DaysIncome,
            expense: last30DaysExpense,
            profit: last30DaysIncome - last30DaysExpense
        }
    }
}
