"use client"

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-[100] w-full h-full min-h-screen pointer-events-none">
            <div className="flex flex-col items-center justify-center gap-8 w-full max-w-sm">
                <div className="space-y-2 text-center">
                    <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic animate-pulse">
                        Synchronizing
                    </h2>
                </div>
            </div>
        </div>
    )
}
