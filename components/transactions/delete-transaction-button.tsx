"use client"

import { Button } from "@/components/ui/button"
import { deleteTransaction } from "@/app/actions/transactions"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeleteTransactionButtonProps {
    transactionId: string
}

export function DeleteTransactionButton({ transactionId }: DeleteTransactionButtonProps) {
    const router = useRouter()

    async function handleDelete() {
        const result = await deleteTransaction(transactionId)

        if (result.success) {
            toast.success("Transaction deleted")
            router.refresh()
        } else {
            toast.error("Failed to delete transaction")
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the transaction and recalculate all totals.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
