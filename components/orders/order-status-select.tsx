"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateOrder } from "@/app/actions/orders"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface OrderStatusSelectProps {
    orderId: string
    currentStatus: "OPEN" | "COMPLETED" | "CANCELLED"
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
    const [status, setStatus] = useState<string>(currentStatus)

    async function handleStatusChange(value: string) {
        // Optimistic update
        const oldStatus = status
        setStatus(value)

        const result = await updateOrder(orderId, { status: value as any })

        if (result.success) {
            toast.success("Order status updated")
        } else {
            toast.error("Failed to update status")
            setStatus(oldStatus) // Revert on failure
        }
    }

    return (
        <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px] h-8">
                <div className="flex items-center gap-2">
                    <Badge variant={status === 'OPEN' ? 'default' : status === 'COMPLETED' ? 'secondary' : 'outline'} className="pointer-events-none px-1 py-0 h-5 text-[10px]">
                        {status}
                    </Badge>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
        </Select>
    )
}
