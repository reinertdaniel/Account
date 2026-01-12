"use client"

import { Button } from "@/components/ui/button"
import { updateOrder } from "@/app/actions/orders"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface SuppressOrderButtonProps {
    orderId: string
    isSuppressed: boolean
}

export function SuppressOrderButton({ orderId, isSuppressed }: SuppressOrderButtonProps) {
    const router = useRouter()

    async function toggleSuppression() {
        const newState = !isSuppressed
        const result = await updateOrder(orderId, { suppressed: newState })

        if (result.success) {
            toast.success(newState ? "Order suppressed" : "Order unsuppressed")
            router.refresh()
        } else {
            toast.error("Failed to update suppression state")
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleSuppression}
            title={isSuppressed ? "Unsuppress Order" : "Suppress Order"}
        >
            {isSuppressed ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
            )}
        </Button>
    )
}
