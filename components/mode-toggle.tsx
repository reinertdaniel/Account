"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null // or a skeleton to prevent hydration mismatch
    }

    return (
        <div className="flex flex-col p-1 bg-background/50 rounded-lg border border-sidebar-border hover:bg-background/80 transition-colors gap-1">
            {['light', 'system', 'dark'].map((t) => (
                <button
                    key={t}
                    onClick={() => {
                        document.documentElement.classList.add('transitioning')
                        setTheme(t)

                        // Parse duration from CSS variable or default to 300
                        const durationStr = getComputedStyle(document.documentElement)
                            .getPropertyValue('--theme-transition-duration') || '300ms'
                        const duration = parseInt(durationStr) || 300

                        setTimeout(() => {
                            document.documentElement.classList.remove('transitioning')
                        }, duration)
                    }}
                    className={cn(
                        "relative w-full h-8 px-2 flex items-center justify-start text-xs transition-all rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        theme === t ? "text-foreground font-medium" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                >
                    {theme === t && (
                        <motion.div
                            layoutId="theme-active"
                            className="absolute inset-0 bg-background shadow-sm rounded-md border border-border/50"
                            initial={false}
                            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center">
                        {t === 'light' && <Sun className="h-3.5 w-3.5 mr-2" />}
                        {t === 'system' && <span className="mr-2 text-xs font-bold w-3.5 text-center">A</span>}
                        {t === 'dark' && <Moon className="h-3.5 w-3.5 mr-2" />}
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                </button>
            ))}
        </div>
    )
}
