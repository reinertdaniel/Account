import { SignIn } from "@/components/sign-in"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getRandomWallpaper } from "@/app/actions/wallpapers"

export default async function LoginPage() {
    const wallpaper = await getRandomWallpaper()

    return (
        <div className="relative flex h-screen items-center justify-center p-4 login-page-hide overflow-hidden">
            {/* Dynamic Wallpaper Layer */}
            {wallpaper ? (
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url('${wallpaper}')`,
                    }}
                >
                    {/* Dark Overlay for Readability */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>
            ) : (
                <div className="absolute inset-0 z-0 bg-background/50 backdrop-blur-sm" />
            )}

            <Card className="w-full max-w-md shadow-2xl border-border bg-card/95 backdrop-blur-md relative z-10">
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

