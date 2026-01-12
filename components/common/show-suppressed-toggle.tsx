"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function ShowSuppressedToggle() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const showSuppressed = searchParams.get("showSuppressed") === "true"

    function toggle() {
        const params = new URLSearchParams(searchParams)
        if (!showSuppressed) {
            params.set("showSuppressed", "true")
        } else {
            params.delete("showSuppressed")
        }
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <button
            onClick={toggle}
            className={cn(
                "relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-100 outline-none select-none overflow-hidden group min-w-[130px]",
                showSuppressed
                    ? "text-primary bg-primary/10 border-primary/20 border"
                    : "text-muted-foreground hover:bg-muted border-transparent border hover:border-border"
            )}
        >
            <div className="relative w-4 h-4 flex items-center justify-center overflow-visible">
                <AnimatePresence mode="wait" initial={false}>
                    {showSuppressed ? (
                        <motion.div
                            key="eye"
                            initial={{ scale: 0, rotate: -45, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 45, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 800, damping: 35 }}
                        >
                            <Eye className="w-4 h-4 stroke-[2.5px]" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="eye-off"
                            initial={{ scale: 0, rotate: 45, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: -45, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 800, damping: 35 }}
                        >
                            <EyeOff className="w-4 h-4 stroke-[2.5px]" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <span className="relative z-10 transition-colors duration-100 text-left">
                {showSuppressed ? "Hide Suppressed" : "Show Suppressed"}
            </span>

            {showSuppressed && (
                <motion.div
                    layoutId="toggle-glow"
                    className="absolute inset-0 bg-primary/5 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}
        </button>
    )
}
