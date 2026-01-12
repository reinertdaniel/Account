"use client"

import { useState, useTransition } from "react"
import { Switch } from "@/components/ui/switch"
import { updateOrder } from "@/app/actions/orders"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { PackageOpen } from "lucide-react"

interface JoblotToggleProps {
    orderId: string
    isJobLot: boolean
}

export function JoblotToggle({ orderId, isJobLot }: JoblotToggleProps) {
    const [checked, setChecked] = useState(isJobLot)
    const [pending, startTransition] = useTransition()

    function handleCheckedChange(checked: boolean) {
        setChecked(checked)
        startTransition(async () => {
            const result = await updateOrder(orderId, { isJobLot: checked })
            if (result.success) {
                toast.success(checked ? "Marked as Joblot" : "Unmarked as Joblot")
            } else {
                setChecked(!checked) // Revert on failure
                toast.error("Failed to update status")
            }
        })
    }

    return (
        <div className="flex items-center space-x-2 border rounded-full px-3 py-1.5 bg-background shadow-sm hover:bg-muted/50 transition-colors">
            <PackageOpen className={`h-4 w-4 ${checked ? "text-primary" : "text-muted-foreground"}`} />
            <Label htmlFor="joblot-mode" className="text-xs font-medium cursor-pointer">Joblot</Label>
            <Switch
                id="joblot-mode"
                checked={checked}
                onCheckedChange={handleCheckedChange}
                disabled={pending}
                className="scale-75 origin-left"
            />
        </div>
    )
}
