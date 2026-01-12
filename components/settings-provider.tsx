"use client"

import { useEffect } from "react"
import { getSettings } from "@/app/actions/settings"

export function SettingsProvider() {
    useEffect(() => {
        async function applySettings() {
            const result = await getSettings()
            if (result.success && result.data) {
                result.data.forEach(setting => {
                    // Convert key like THEME_TRANSITION_DURATION to --theme-transition-duration
                    const cssVar = "--" + setting.key.toLowerCase().replace(/_/g, '-')
                    document.documentElement.style.setProperty(cssVar, setting.value)
                })
            }
        }
        applySettings()
    }, [])

    return null
}
