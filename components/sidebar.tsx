"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, DollarSign, Settings, Menu } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { authClient } from "@/lib/auth-client"
import { LogOut, User as UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Orders",
        icon: Package,
        href: "/orders",
        color: "text-violet-500",
    },
    {
        label: "Finances",
        icon: DollarSign,
        href: "/finances",
        color: "text-pink-700",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
]

interface SidebarProps {
    stats?: {
        lifetime: { income: number; expense: number; profit: number };
        last60Days: { income: number; expense: number; profit: number };
        last30Days: { income: number; expense: number; profit: number };
    }
}

export function Sidebar({ stats }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()

    const onSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    // Hard redirect to clear all internal state gracefully
                    window.location.href = "/login"
                },
            },
        })
    }

    return (
        <div className="space-y-4 pt-2 pb-3 flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
            <div className="flex-1 flex flex-col min-h-0">
                <div className="h-10 px-2 border-b border-sidebar-border flex items-center justify-center">
                    <Link href="/" className="flex items-center w-full">
                        <h1 className="text-3xl font-black font-mono tracking-tighter text-sidebar-foreground w-full text-center leading-none">
                            KATREPAIR
                        </h1>
                    </Link>
                </div>

                {session?.user && (
                    <>
                        <div className="px-4 py-4 space-y-1">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn(
                                        "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-md transition-colors relative",
                                        pathname === route.href
                                            ? "text-sidebar-primary-foreground"
                                            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                                    )}
                                >
                                    {pathname === route.href && (
                                        <motion.div
                                            layoutId="sidebar-nav-active"
                                            className="absolute inset-0 bg-sidebar-primary rounded-md"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <div className="flex items-center flex-1 relative z-10">
                                        <route.icon className={cn("h-5 w-5 mr-3 opacity-70 group-hover:opacity-100 transition-opacity")} />
                                        {route.label}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {stats && (
                            <div className="px-2 py-4 border-t border-sidebar-border">
                                <h3 className="mb-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Quick View
                                </h3>
                                <div className="space-y-4">
                                    {/* Lifetime */}
                                    <div className="rounded-lg bg-card/50 p-3 border border-sidebar-border transition-colors hover:bg-card/80">
                                        <div className="flex items-stretch gap-3">
                                            {/* Left: Profit */}
                                            <div className="flex flex-col justify-center flex-1">
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Lifetime Profit</p>
                                                <div className={cn("text-xl font-bold tracking-tight", stats.lifetime.profit > 0 ? "text-emerald-500" : stats.lifetime.profit < 0 ? "text-rose-500" : "text-amber-500")}>
                                                    £{stats.lifetime.profit.toFixed(2)}
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="w-px bg-sidebar-border/50 my-1" />

                                            {/* Right: Rev/Exp */}
                                            <div className="flex flex-col justify-between flex-1 py-0.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">REV</span>
                                                    <span className="text-sm font-bold text-amber-500">£{stats.lifetime.income.toFixed(0)}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">EXP</span>
                                                    <span className="text-sm font-bold text-rose-500">£{stats.lifetime.expense.toFixed(0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Last 60 Days */}
                                    <div className="rounded-lg bg-card/50 p-3 border border-sidebar-border transition-colors hover:bg-card/80">
                                        <div className="flex items-stretch gap-3">
                                            {/* Left: Profit */}
                                            <div className="flex flex-col justify-center flex-1">
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Last 60 Days</p>
                                                <div className={cn("text-xl font-bold tracking-tight", stats.last60Days.profit > 0 ? "text-emerald-500" : stats.last60Days.profit < 0 ? "text-rose-500" : "text-amber-500")}>
                                                    £{stats.last60Days.profit.toFixed(2)}
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="w-px bg-sidebar-border/50 my-1" />

                                            {/* Right: Rev/Exp */}
                                            <div className="flex flex-col justify-between flex-1 py-0.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">REV</span>
                                                    <span className="text-sm font-bold text-amber-500">£{stats.last60Days.income.toFixed(0)}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">EXP</span>
                                                    <span className="text-sm font-bold text-rose-500">£{stats.last60Days.expense.toFixed(0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Last 30 Days */}
                                    <div className="rounded-lg bg-card/50 p-3 border border-sidebar-border transition-colors hover:bg-card/80">
                                        <div className="flex items-stretch gap-3">
                                            {/* Left: Profit */}
                                            <div className="flex flex-col justify-center flex-1">
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Last 30 Days</p>
                                                <div className={cn("text-xl font-bold tracking-tight", stats.last30Days.profit > 0 ? "text-emerald-500" : stats.last30Days.profit < 0 ? "text-rose-500" : "text-amber-500")}>
                                                    £{stats.last30Days.profit.toFixed(2)}
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="w-px bg-sidebar-border/50 my-1" />

                                            {/* Right: Rev/Exp */}
                                            <div className="flex flex-col justify-between flex-1 py-0.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">REV</span>
                                                    <span className="text-sm font-bold text-amber-500">£{stats.last30Days.income.toFixed(0)}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">EXP</span>
                                                    <span className="text-sm font-bold text-rose-500">£{stats.last30Days.expense.toFixed(0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div className="flex-1" /> {/* Spacer */}
            </div>

            <div className="px-2 pt-2 pb-0 border-t border-sidebar-border space-y-2">
                {session?.user ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-card/50 p-2 border border-sidebar-border group/user text-sidebar-foreground"
                    >
                        <div className="flex items-center gap-3 px-1 mb-2">
                            <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground overflow-hidden border border-sidebar-border shadow-inner">
                                {session.user.image ? (
                                    <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <UserIcon className="h-4 w-4" />
                                )}
                            </div>
                            <div className="flex flex-col min-w-0 relative z-10">
                                <p className="text-xs font-bold text-foreground truncate">{session.user.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-[10px] h-7 px-2 hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer font-bold uppercase tracking-wider"
                            onClick={onSignOut}
                        >
                            <LogOut className="h-3 w-3 mr-2 group-hover/user:translate-x-1 transition-transform" />
                            Sign Out
                        </Button>
                    </motion.div>
                ) : (
                    <Link href="/login" className="block cursor-pointer">
                        <div className="rounded-lg bg-card/50 p-2 border border-sidebar-border transition-colors cursor-pointer group/signin text-sidebar-foreground">
                            <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8 px-2 cursor-pointer font-bold active:scale-95 transition-colors">
                                <UserIcon className="h-3.5 w-3.5 mr-2 group-hover/signin:scale-110 transition-transform" />
                                Sign In
                            </Button>
                        </div>
                    </Link>
                )}

                <div className="rounded-lg bg-card/50 p-2 border border-sidebar-border text-sidebar-foreground">
                    <div className="mb-2 px-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider relative z-10">Appearance</div>
                    <ModeToggle />
                </div>
            </div>
        </div>
    )
}

export function MobileSidebar({ stats }: SidebarProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-sidebar border-r border-sidebar-border">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Sidebar stats={stats} />
            </SheetContent>
        </Sheet>
    )
}
