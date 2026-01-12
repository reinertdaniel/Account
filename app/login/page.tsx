"use client"

import { SignIn } from "@/components/sign-in"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LoginPage() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden login-page-hide select-none">
            {/* Ambient Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
                style={{ backgroundImage: 'url("/assets/auth-bg.png")' }}
            >
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sidebar-primary to-transparent opacity-50" />

                    <CardHeader className="text-center pt-8 pb-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mb-6 text-5xl font-black font-mono tracking-tighter text-foreground drop-shadow-sm"
                        >
                            KATREPAIR
                        </motion.div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Access Dashboard</CardTitle>
                        <CardDescription className="text-muted-foreground/80">
                            Enterprise financial management for repair techs.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-8">
                        <SignIn />
                        <p className="mt-8 text-center text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] font-medium font-mono">
                            Authenticated via Secure SSO
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

