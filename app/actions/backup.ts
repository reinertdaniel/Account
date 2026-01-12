"use server"

import fs from "fs/promises"
import path from "path"
import os from "os"
import { revalidatePath } from "next/cache"

const DB_URL = process.env.DATABASE_URL
// Assume strictly "file:./dev.db" or similar relative path for now, based on typical Prisma setup
// We need to resolve this to an absolute path for fs operations

function getDbPath() {
    if (!DB_URL?.startsWith("file:")) {
        throw new Error("Database URL must start with 'file:' for this backup system to work.")
    }
    // Remove 'file:' prefix
    const relativePath = DB_URL.replace("file:", "")
    // Resolve relative to project root (process.cwd())
    return path.resolve(process.cwd(), "prisma", relativePath.replace("./", ""))
    // Note: Prisma schema usually says `url = "file:./dev.db"`. 
    // If it's relative, it's relative to the schema file (prisma/schema.prisma).
    // So "file:./dev.db" usually means "prisma/dev.db". 
    // Let's safe-guard this.
}

// Hardcoded for safety/simplicity as requested: [UserHome]/KATREPAIR/BACKUPS
function getBackupDir() {
    return path.join(os.homedir(), "KATREPAIR", "BACKUPS")
}

export interface BackupFile {
    name: string
    date: Date
    size: number
}

export async function listBackups(): Promise<BackupFile[]> {
    const backupDir = getBackupDir()
    try {
        await fs.access(backupDir)
    } catch {
        return [] // Dir doesn't exist yet
    }

    const files = await fs.readdir(backupDir)
    const backups: BackupFile[] = []

    for (const file of files) {
        if (!file.endsWith(".db")) continue

        const filePath = path.join(backupDir, file)
        try {
            const stats = await fs.stat(filePath)
            backups.push({
                name: file,
                date: stats.mtime,
                size: stats.size
            })
        } catch (e) {
            console.error(`Error reading backup stat for ${file}`, e)
        }
    }

    // Sort newest first
    return backups.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export async function createBackup(customName?: string) {
    const dbPath = process.cwd() + "/prisma/dev.db" // Hardcoding active DB path to ensure we hit the right one used by Prisma in this specific project structure
    // Ideally we parse env, but for speed/reliability in this specific context:
    // C:\Users\danie\Dev\Antigravity\Account\prisma\dev.db seems to be the target based on previous context.

    // Let's try to be smart but fail-safe
    let resolvedDbPath = dbPath
    if (!require("fs").existsSync(resolvedDbPath)) {
        // Fallback to checking typical location
        resolvedDbPath = path.join(process.cwd(), "dev.db")
        if (!require("fs").existsSync(resolvedDbPath)) {
            throw new Error(`Database file not found at ${dbPath} or ${resolvedDbPath}`)
        }
    }

    const backupDir = getBackupDir()
    await fs.mkdir(backupDir, { recursive: true })

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupName = customName
        ? `${customName}-${timestamp}.db`
        : `backup-${timestamp}.db`

    const backupPath = path.join(backupDir, backupName)

    await fs.copyFile(resolvedDbPath, backupPath)
    revalidatePath("/settings/backups")
    return { success: true, path: backupPath, name: backupName }
}

export async function restoreBackup(backupName: string) {
    const dbPath = process.cwd() + "/prisma/dev.db"
    const backupDir = getBackupDir()
    const sourcePath = path.join(backupDir, backupName)

    if (!require("fs").existsSync(sourcePath)) {
        throw new Error("Backup file not found")
    }

    // 1. Create a "safety" backup of current state
    await createBackup(`SAFETY-PRE-RESTORE`)

    // 2. Overwrite DB
    // Note: In production with active connections this is risky (WAL mode usually handles it but active writes might fail).
    // For a local single-user app, it is generally acceptable.
    await fs.copyFile(sourcePath, dbPath)

    revalidatePath("/") // Revalidate everything
    return { success: true }
}
