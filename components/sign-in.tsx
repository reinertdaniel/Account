"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function SignIn() {
    return (
        <div className="flex flex-col items-center gap-4">
            <Button
                onClick={async () => {
                    await authClient.signIn.social({
                        provider: "google",
                        callbackURL: "/"
                    })
                }}
                className="w-full max-w-sm"
            >
                Sign In with Google
            </Button>
        </div>
    )
}
