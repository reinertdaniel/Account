"use client"

import { useState, useEffect } from "react"
import { getSettings, updateSetting } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { MotionDiv, MotionCard, staggerContainer, fadeIn } from "@/components/ui/motion"

export default function FlagsPage() {
    const [settings, setSettings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSettings()
    }, [])

    async function loadSettings() {
        const result = await getSettings()
        if (result.success) {
            setSettings(result.data || [])
        }
        setLoading(false)
    }

    async function handleSave(key: string, value: string, description: string) {
        const result = await updateSetting(key, value, description)
        if (result.success) {
            toast.success("Setting saved", {
                description: "You may need to refresh for changes to take full effect."
            })
            // Optimistically update local state to avoid flicker/reload
            setSettings(prev => {
                const existing = prev.find(s => s.key === key)
                if (existing) {
                    return prev.map(s => s.key === key ? { ...s, value } : s)
                }
                return [...prev, { key, value, description }]
            })
        } else {
            toast.error("Failed to save setting")
        }
    }

    if (loading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>

    // Default known flags if not in DB
    const knownFlags = [
        {
            key: "THEME_TRANSITION_DURATION",
            defaultValue: "300ms",
            description: "Duration of theme switch animation (e.g. 300ms, 1s, 0s)"
        }
    ]

    const mergedSettings = knownFlags.map(flag => {
        const existing = settings.find(s => s.key === flag.key)
        return existing ? { ...flag, ...existing } : { ...flag, value: flag.defaultValue }
    })

    return (
        <MotionDiv
            className="flex-1 space-y-6 p-8 pt-6"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
        >
            <div className="flex items-center space-x-4">
                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Feature Flags
                    </h2>
                    <p className="text-muted-foreground">
                        Configure low-level application behavior and experimental features.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {mergedSettings.map((setting) => (
                    <MotionCard
                        key={setting.key}
                        variants={fadeIn}
                        className="bg-card border-border shadow-sm transition-all hover:shadow-md"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-mono bg-muted/50 px-2 py-1 rounded w-fit text-primary">
                                        {setting.key}
                                    </CardTitle>
                                    <CardDescription>{setting.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 items-center max-w-xl">
                                <Label className="sr-only" htmlFor={setting.key}>Value</Label>
                                <Input
                                    id={setting.key}
                                    defaultValue={setting.value}
                                    className="font-mono bg-background/50"
                                    placeholder="Enter value..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.currentTarget.blur()
                                        }
                                    }}
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        const input = document.getElementById(setting.key) as HTMLInputElement
                                        if (input) handleSave(setting.key, input.value, setting.description || "")
                                    }}
                                >
                                    <Save className="h-4 w-4" />
                                    <span className="sr-only">Save</span>
                                </Button>
                            </div>
                        </CardContent>
                    </MotionCard>
                ))}
            </div>
        </MotionDiv>
    )
}
