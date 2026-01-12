"use client"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Flag } from "lucide-react"
import Link from "next/link"
import { MotionDiv, MotionCard, staggerContainer, fadeIn } from "@/components/ui/motion"

export default function FlagsPage() {
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

            <MotionCard
                variants={fadeIn}
                className="bg-card border-border shadow-sm"
            >
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Flag className="h-5 w-5 text-muted-foreground" />
                        No Feature Flags
                    </CardTitle>
                    <CardDescription>
                        There are no feature flags configured at this time.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Feature flags will appear here when new experimental features are available.
                    </p>
                </CardContent>
            </MotionCard>
        </MotionDiv>
    )
}

