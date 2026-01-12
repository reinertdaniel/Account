import { getTransactions } from "@/app/actions/transactions"
import { getCategories } from "@/app/actions/categories"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Link from "next/link"

import { ShowSuppressedToggle } from "@/components/common/show-suppressed-toggle"
import { SuppressTransactionButton } from "@/components/transactions/suppress-transaction-button"
import { DeleteTransactionButton } from "@/components/transactions/delete-transaction-button"

export default async function FinancesPage({ searchParams }: { searchParams: Promise<{ showSuppressed?: string }> }) {
    const params = await searchParams
    const showSuppressed = params.showSuppressed === 'true'
    const transactions = await getTransactions(showSuppressed)
    const categories = await getCategories()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Finances</h2>
                <div className="flex items-center space-x-2">
                    <ShowSuppressedToggle />
                    <AddTransactionDialog categories={categories} />
                </div>
            </div>

            <Card className="rounded-xl border shadow-none bg-card">
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((t: any) => (
                                <TableRow key={t.id} className="hover:bg-muted/50">
                                    <TableCell>{format(new Date(t.date), "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        <Badge variant={t.type === 'INCOME' ? 'outline' : 'destructive'} className="capitalize font-normal">
                                            {t.type.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-secondary/50 font-normal text-muted-foreground border-transparent">{t.category?.name || 'Uncategorized'}</Badge>
                                    </TableCell>
                                    <TableCell>{t.description}</TableCell>
                                    <TableCell>
                                        {t.orderId ? (
                                            <Link href={`/orders/${t.orderId}`} className="text-primary hover:underline hover:text-primary/80 transition-colors">
                                                View Order
                                            </Link>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        <span className={Number(t.amount) > 0 ? "text-emerald-500" : Number(t.amount) < 0 ? "text-rose-500" : "text-amber-500"}>
                                            £{Number(t.amount).toFixed(2)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <SuppressTransactionButton transactionId={t.id} isSuppressed={t.suppressed} />
                                            <DeleteTransactionButton transactionId={t.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
