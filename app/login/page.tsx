import { SignIn } from "@/components/sign-in"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-background/50 p-4 relative login-page-hide">
            {/* Logo for signed out view within the "modal-like" card context */}
            <Card className="w-full max-w-md shadow-lg border-border bg-card">
                <CardHeader className="text-center">
                    <div className="mb-4 text-4xl font-black font-mono tracking-tighter text-foreground">
                        KATREPAIR
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <SignIn />
                </CardContent>
            </Card>
        </div>
    )
}
