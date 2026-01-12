import { getOrders } from "./actions/orders"
import { getTransactions } from "./actions/transactions"
import { DollarSign, CreditCard, ShoppingBag, Activity } from "lucide-react"
import Link from "next/link"
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function DashboardPage() {
  const orders = await getOrders()
  const transactions = await getTransactions()

  // 1. Total Profit
  // Filter transactions that are "completed" or just all of them? 
  // For now, let's sum all INCOMES - all EXPENSES
  let totalIncome = 0
  let totalExpense = 0

  // We need to type 't' as any because the inference from Prisma might be failing or returning 'unknown' in this context
  const safeTransactions = transactions || []

  safeTransactions.forEach((t: any) => {
    const val = Number(t.amount) || 0
    if (t.type === "INCOME") totalIncome += val
    else totalExpense += val
  })
  const totalProfit = totalIncome - totalExpense

  // 2. Monthly Profit (This Month)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  let monthlyIncome = 0
  let monthlyExpense = 0

  safeTransactions.forEach((t: any) => {
    const d = new Date(t.date)
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      const val = Number(t.amount) || 0
      if (t.type === "INCOME") monthlyIncome += val
      else monthlyExpense += val
    }
  })
  const monthlyProfit = monthlyIncome - monthlyExpense

  // 3. Active Orders
  const activeOrders = (orders || []).filter((o: any) => o.status === "OPEN").length

  // 4. Total Revenue (Just Income)
  // Already calculated totalIncome

  // Recent Orders (Take 5)
  const recentOrders = (orders || []).slice(0, 5)

  // Recent Transactions (Take 5)
  // Sort by date desc (assuming they come sorted or sort here)
  const recentTransactions = (transactions || [])
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border shadow-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit > 0 ? "text-emerald-500" : totalProfit < 0 ? "text-rose-500" : "text-amber-500"}`}>
              £{totalProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyProfit > 0 ? "text-emerald-500" : monthlyProfit < 0 ? "text-rose-500" : "text-amber-500"}`}>
              £{monthlyProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{format(now, "MMMM")}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">£{totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 rounded-xl border shadow-none bg-card">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order: any) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{format(new Date(order.createdAt), "MMM d")}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {order.description?.length > 30
                        ? order.description.slice(0, 30) + "..."
                        : order.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-normal">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/orders/${order.id}`} className="text-sm text-primary hover:underline">
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No recent orders.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3 rounded-xl border shadow-none bg-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date</TableHead>
                  <TableHead>Desc</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((t: any) => (
                  <TableRow key={t.id} className="hover:bg-muted/50">
                    <TableCell className="py-2">{format(new Date(t.date), "MMM d")}</TableCell>
                    <TableCell className="py-2 truncate max-w-[120px]">{t.description}</TableCell>
                    <TableCell className={`text-right py-2 ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      £{Number(t.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                {recentTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                      No recent transactions.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
