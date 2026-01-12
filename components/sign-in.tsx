"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Chrome, Loader2 } from "lucide-react"
import { useState } from "react"

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSignIn = async () => {
        setIsLoading(true)
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/"
            })
        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center w-full">
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
            >
                <Button
                    onClick={handleSignIn}
                    disabled={isLoading}
                    className="w-full h-12 text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all cursor-pointer group shadow-xl"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <Chrome className="mr-2 h-5 w-5" />
                            Continue with Google
                        </>
                    )}
                </Button>
            </motion.div>
        </div>
    )
}

