"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

export function ShowSuppressedToggle() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const showSuppressed = searchParams.get("showSuppressed") === "true"

    function handleCheckedChange(checked: boolean) {
        const params = new URLSearchParams(searchParams)
        if (checked) {
            params.set("showSuppressed", "true")
        } else {
            params.delete("showSuppressed")
        }
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                id="show-suppressed"
                checked={showSuppressed}
                onCheckedChange={handleCheckedChange}
            />
            <Label htmlFor="show-suppressed">Show Suppressed</Label>
        </div>
    )
}
