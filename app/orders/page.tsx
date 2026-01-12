import { getOrders } from "../actions/orders"
import { CreateOrderDialog } from "@/components/orders/create-order-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { format } from "date-fns"

import { ShowSuppressedToggle } from "@/components/common/show-suppressed-toggle"
import { Separator } from "@/components/ui/separator"

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ showSuppressed?: string }> }) {
    const params = await searchParams
    const showSuppressed = params.showSuppressed === 'true'
    const orders = await getOrders(showSuppressed)

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Orders</h2>
                <div className="flex items-center gap-2 bg-card/50 border border-sidebar-border rounded-xl p-1.5 shadow-sm">
                    <ShowSuppressedToggle />
                    <Separator orientation="vertical" className="h-6 bg-border/50" />
                    <CreateOrderDialog />
                </div>
            </div>
            <Card className="rounded-xl border shadow-none bg-card">
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order: any) => (
                                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                                    <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                                    <TableCell className="font-medium">{order.description}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>
                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {order.status}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/orders/${order.id}`} className="text-sm text-primary hover:underline">
                                            View
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No orders found.
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
