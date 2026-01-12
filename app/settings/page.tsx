import { getCategories } from "@/app/actions/categories"
import { CreateCategoryDialog } from "@/components/settings/create-category-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Database, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { MotionDiv, MotionCard, staggerContainer, fadeIn } from "@/components/ui/motion"

export default async function SettingsPage() {
    const categories = await getCategories()

    return (
        <MotionDiv
            className="flex-1 space-y-4 p-8 pt-6"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
        >
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
            </div>

            <div className="grid gap-4">
                <MotionCard variants={fadeIn} className="bg-card border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Data Management</CardTitle>
                            <CardDescription>Manage database backups and system data.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <Link href="/settings/backups">
                            <Button variant="outline" className="w-full sm:w-auto">
                                <Database className="mr-2 h-4 w-4" />
                                Manage Backups
                            </Button>
                        </Link>
                        <Link href="/settings/flags">
                            <Button variant="outline" className="w-full sm:w-auto">
                                <Flag className="mr-2 h-4 w-4" />
                                Feature Flags
                            </Button>
                        </Link>
                    </CardContent>
                </MotionCard>

                <MotionCard variants={fadeIn} className="bg-card border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Categories</CardTitle>
                            <CardDescription>Manage expense and income categories.</CardDescription>
                        </div>
                        <CreateCategoryDialog />
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Context</TableHead>
                                    {/* <TableHead className="text-right">Actions</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category: any) => (
                                    <TableRow key={category.id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={category.type === 'INCOME' ? 'default' : 'secondary'}>
                                                {category.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{category.context}</TableCell>
                                    </TableRow>
                                ))}
                                {categories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                            No categories found. Create one above.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </MotionCard>
            </div>
        </MotionDiv>
    )
}
