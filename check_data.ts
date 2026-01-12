
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const orderCount = await prisma.order.count()
        const transactionCount = await prisma.transaction.count()
        console.log(`[CHECK] Orders: ${orderCount}`)
        console.log(`[CHECK] Transactions: ${transactionCount}`)
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
