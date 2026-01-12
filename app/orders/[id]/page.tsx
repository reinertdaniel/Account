import { getOrder } from "@/app/actions/orders"
import { getCategories } from "@/app/actions/categories"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { OrderStatusSelect } from "@/components/orders/order-status-select"
import { JoblotToggle } from "@/components/orders/joblot-toggle"
import { SuppressOrderButton } from "@/components/orders/suppress-order-button"
import { SuppressTransactionButton } from "@/components/transactions/suppress-transaction-button"
import { DeleteTransactionButton } from "@/components/transactions/delete-transaction-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { notFound } from "next/navigation"

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const order = await getOrder(id)
    const categories = await getCategories()

    if (!order) {
        notFound()
    }

    // Calculate totals
    let income = 0
    let expense = 0
    // Explicitly cast to any to avoid inference issues during build if Prisma types aren't perfect
    order.transactions.forEach((t: any) => {
        const val = Number(t.amount)
        if (t.type === 'INCOME') income += val
        else expense += val
    })
    const profit = income - expense

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{order.description}</h2>
                    <p className="text-muted-foreground">Customer: {order.customerName || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <SuppressOrderButton orderId={(order as any).id} isSuppressed={(order as any).suppressed} />
                    <OrderStatusSelect orderId={(order as any).id} currentStatus={(order as any).status} />
                    <JoblotToggle orderId={order.id} isJobLot={(order as any).isJobLot || false} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-xl border shadow-none bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${profit > 0 ? 'text-emerald-500' : profit < 0 ? 'text-rose-500' : 'text-amber-500'}`}>
                            £{profit.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border shadow-none bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">
                            £{income.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border shadow-none bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-500">
                            £{expense.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
                <Card className="rounded-xl border shadow-none bg-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Transactions</CardTitle>
                            <CardDescription>Income and expenses for this order.</CardDescription>
                        </div>
                        <AddTransactionDialog orderId={order.id} categories={categories} />
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.transactions.map((t: any) => (
                                    <TableRow key={t.id} className="hover:bg-muted/50">
                                        <TableCell>{format(new Date(t.date), "MMM d, yyyy")}</TableCell>
                                        <TableCell>
                                            <Badge variant={t.type === 'INCOME' ? 'outline' : 'destructive'} className="capitalize font-normal">
                                                {t.type.toLowerCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-secondary/50 font-normal text-muted-foreground border-transparent">
                                                {t.category?.name || 'Uncategorized'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{t.description}</TableCell>
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
                                {order.transactions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No transactions recorded.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {order.notes && (
                <Card className="rounded-xl border shadow-none bg-card">
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{order.notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
