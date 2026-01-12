"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBackup, listBackups, restoreBackup, type BackupFile } from "@/app/actions/backup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { Loader2, RefreshCw, Save, RotateCcw, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function BackupsPage() {
    const [backups, setBackups] = useState<BackupFile[]>([])
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    // Load backups on mount
    useEffect(() => {
        loadBackups()
    }, [])

    function loadBackups() {
        setLoading(true)
        listBackups()
            .then(setBackups)
            .catch(() => toast.error("Failed to list backups"))
            .finally(() => setLoading(false))
    }

    function handleCreateBackup() {
        startTransition(async () => {
            try {
                await createBackup()
                toast.success("Backup created successfully")
                loadBackups()
            } catch (error) {
                toast.error("Failed to create backup")
            }
        })
    }

    function handleRestore(filename: string) {
        startTransition(async () => {
            try {
                await restoreBackup(filename)
                toast.success("Database restored successfully")
                router.refresh()
                loadBackups() // Reload to see the Safety backup
            } catch (error) {
                toast.error("Failed to restore backup")
            }
        })
    }

    function formatBytes(bytes: number, decimals = 2) {
        if (!+bytes) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Database Backups</h2>
                <Button onClick={handleCreateBackup} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Create New Backup
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Backups</CardTitle>
                    <CardDescription>
                        Manage your local database backups. Backups are stored in your home folder under KATREPAIR/BACKUPS.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : backups.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">
                            No backups found. Create one to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Filename</TableHead>
                                    <TableHead>Date Created</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {backups.map((backup) => (
                                    <TableRow key={backup.name}>
                                        <TableCell className="font-medium font-mono text-xs">{backup.name}</TableCell>
                                        <TableCell>{format(new Date(backup.date), "PPP p")}</TableCell>
                                        <TableCell>{formatBytes(backup.size)}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="text-amber-600 hover:text-amber-700 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/20">
                                                        <RotateCcw className="mr-2 h-3.5 w-3.5" />
                                                        Restore
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will overwrite your current database with the selected backup.
                                                            <br /><br />
                                                            <span className="font-bold text-emerald-500">Don't worry!</span> A safety backup of your CURRENT data will be automatically created before restoration begins.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleRestore(backup.name)} className="bg-amber-600 hover:bg-amber-700 text-white">
                                                            Yes, Restore Database
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
