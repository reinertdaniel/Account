"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Mail, Lock, User, AtSign, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsPending(true)

        try {
            if (isSignUp) {
                await authClient.signUp.email({
                    email,
                    password,
                    name,
                    callbackURL: "/"
                }, {
                    onSuccess: () => {
                        toast.success("Account created successfully!")
                    },
                    onError: (ctx: any) => {
                        toast.error(ctx.error.message || "Failed to sign up")
                    }
                })
            } else {
                await authClient.signIn.email({
                    email,
                    password,
                    callbackURL: "/"
                }, {
                    onSuccess: () => {
                        toast.success("Signed in successfully!")
                    },
                    onError: (ctx: any) => {
                        toast.error(ctx.error.message || "Failed to sign in")
                    }
                })
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsPending(false)
        }
    }

    const handleGoogleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/"
        })
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
            {/* Google SSO First */}
            <Button
                variant="outline"
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full font-bold uppercase tracking-wider bg-background hover:bg-muted transition-colors"
                disabled={isPending}
            >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                Google
            </Button>

            {/* Separator with improved background logic */}
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-muted-foreground/20" />
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest whitespace-nowrap">
                    Or continue with
                </span>
                <div className="h-px flex-1 bg-muted-foreground/20" />
            </div>

            {/* Email/Password Form Second */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                    {isSignUp && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 overflow-hidden"
                        >
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10"
                                    required={isSignUp}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full font-bold uppercase tracking-wider group" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <>
                            {isSignUp ? "Create Account" : "Sign In"}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center text-sm">
                <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    )
}

