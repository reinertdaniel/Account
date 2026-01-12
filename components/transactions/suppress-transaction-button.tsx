"use client"

import { Button } from "@/components/ui/button"
import { updateTransaction } from "@/app/actions/transactions"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface SuppressTransactionButtonProps {
    transactionId: string
    isSuppressed: boolean
}

export function SuppressTransactionButton({ transactionId, isSuppressed }: SuppressTransactionButtonProps) {
    const router = useRouter()

    async function toggleSuppression() {
        const newState = !isSuppressed
        const result = await updateTransaction(transactionId, { suppressed: newState })

        if (result.success) {
            toast.success(newState ? "Transaction suppressed" : "Transaction unsuppressed")
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
            title={isSuppressed ? "Unsuppress Transaction" : "Suppress Transaction"}
            className="h-8 w-8"
        >
            {isSuppressed ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
            )}
        </Button>
    )
}
